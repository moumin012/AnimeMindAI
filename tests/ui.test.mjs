/**
 * UI smoke test: boots the real React app (through Vite, so the actual JSX and
 * the real component tree) inside jsdom and drives it like a user would.
 *
 * `fetch` is intentionally absent, which also proves the offline fallback path
 * of src/lib/api.js works.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

const { window } = dom;
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};

// `navigator` is a getter-only global in Node 22, so define it explicitly.
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

for (const key of [
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLTextAreaElement',
  'HTMLSelectElement',
  'Element',
  'Node',
  'Event',
  'CustomEvent',
  'MouseEvent',
  'KeyboardEvent',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'matchMedia',
]) {
  Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

const text = (container) => container.textContent.replace(/\s+/g, ' ');

const byText = (container, needle) =>
  [...container.querySelectorAll('button, a')].find((el) =>
    el.textContent.replace(/\s+/g, ' ').includes(needle),
  );

const click = async (el) => {
  assert.ok(el, 'element to click was not found');
  await act(async () => {
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  });
};

const go = async (hash) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new window.Event('hashchange'));
  });
};

test('the app boots, renders the hero and every page without crashing', async (t) => {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  const container = window.document.getElementById('root');
  let root;

  await act(async () => {
    root = createRoot(container);
    root.render(React.createElement(App));
  });
  t.after(() => act(async () => root.unmount()));

  // Hero (spec §3)
  assert.match(text(container), /لا تعرف ماذا تقول/);
  assert.match(text(container), /اكتب مشاعرك بطريقتك/);
  assert.ok(byText(container, 'اكتب رسالتي'), 'primary CTA missing');
  assert.ok(byText(container, 'ماذا أقول؟'), 'secondary CTA missing');
  assert.match(text(container), /إلى سارة/, 'hero letter preview missing');

  // Navigation (spec §26)
  for (const label of ['الرئيسية', 'اكتب رسالة', 'ماذا أقول؟', 'رسائلي', 'أفكار', 'الإعدادات']) {
    assert.ok(text(container).includes(label), `nav item missing: ${label}`);
  }

  // Compose page + full form (spec §4–§14)
  await go('#/compose');
  assert.match(text(container), /اكتب رسالتك/);
  assert.match(text(container), /ما اسم الشخص الذي تريد أن تكتب له/);
  assert.ok(byText(container, 'لا تذكر الاسم') || container.querySelector('#mentionName'), 'mention toggle missing');
  for (const label of ['عيد ميلاد', 'الاشتياق', 'شاعري', 'العربية الجزائرية']) {
    assert.ok(text(container).includes(label), `form option missing: ${label}`);
  }
  assert.ok(container.querySelector('#intensity'), 'intensity slider missing');
  assert.ok(container.querySelector('#details'), 'details textarea missing');

  /*
   * Driving the inputs: jsdom's dispatched DOM events do not reach React's
   * delegated listeners in this harness (verified: the event bubbles, React
   * still ignores it), so controlled inputs are driven through the onChange
   * prop React itself attached. Clicks keep using real DOM events.
   */
  const reactProps = (el) => el[Object.keys(el).find((k) => k.startsWith('__reactProps$'))];

  const setValue = async (el, value) => {
    assert.ok(el, 'input not found');
    await act(async () => {
      reactProps(el).onChange({ target: { value, checked: value === true } });
    });
  };

  const setSelect = async (id, value) => {
    const el = container.querySelector(`#${id}`);
    assert.ok(el, `select #${id} not found`);
    const values = [...el.querySelectorAll('option')].map((o) => o.value);
    assert.ok(values.includes(value), `#${id} has no option "${value}" (got ${values.join(',')})`);
    await act(async () => {
      reactProps(el).onChange({ target: { value } });
    });
  };

  // Fill the form exactly like the spec's example (§25) and generate
  await setValue(container.querySelector('#name'), 'سارة');
  await setValue(container.querySelector('#details'), 'وجودها يجعل أيامي أجمل.');
  await setSelect('occasion', 'birthday');

  await click(byText(container, 'اكتب لي الرسالة'));
  // the request goes through the (absent) network and falls back to the engine
  await act(async () => {
    await new Promise((r) => setTimeout(r, 120));
  });

  const body = text(container);
  assert.match(body, /رسالتك جاهزة/, 'result card did not appear');
  assert.match(body, /أيامي أجمل/, 'the user detail was lost in the generated letter');
  assert.match(body, /سارة/, 'the name was not used');
  assert.ok(byText(container, 'نسخ الرسالة'), 'copy button missing');
  assert.ok(byText(container, 'حفظ الرسالة'), 'save button missing');
  assert.ok(byText(container, 'خصص الرسالة أكثر'), 'customize button missing');
  assert.match(body, /هل تريد تحسينها/, 'improvement chips missing');

  // A refine action must rewrite THIS letter, not start from scratch
  const before = container.querySelector('.paper__body').textContent;
  await click(byText(container, 'أطول'));
  await act(async () => {
    await new Promise((r) => setTimeout(r, 120));
  });
  const after = container.querySelector('.paper__body').textContent;
  assert.notEqual(before, after, 'refine did not change the letter');
  assert.match(after, /أيامي أجمل/, 'refine lost the user detail');

  // Saving must put the letter in "My letters" (§19)
  await click(byText(container, 'حفظ الرسالة'));
  await go('#/my-letters');
  assert.match(text(container), /رسائلي/, 'saved page did not load');
  assert.match(text(container), /سارة/, 'saved letter is not listed');

  // "What should I say?" returns the four blocks (§17)
  await go('#/what-to-say');
  await setValue(container.querySelector('#situation'), 'هي غاضبة مني ولا أعرف ماذا أقول');
  await click(byText(container, 'ساعدني'));
  await act(async () => {
    await new Promise((r) => setTimeout(r, 120));
  });
  const wts = text(container);
  assert.match(wts, /رسالة مقترحة/);
  assert.match(wts, /كيف أبدأ الحديث/);
  assert.match(wts, /ماذا أتجنب/);
  assert.match(wts, /خيار آخر/);

  // Ideas page (§20)
  await go('#/ideas');
  assert.match(text(container), /أفكار للرسائل/);
  assert.match(text(container), /الاشتياق/);

  // Privacy + About (§23)
  await go('#/privacy');
  assert.match(text(container), /الخصوصية والأمان/);
  assert.match(text(container), /لا حسابات ولا كلمات مرور/);
  await go('#/about');
  assert.match(text(container), /حول التطبيق/);

  // Settings: switching to French re-renders the whole UI in French (§2, §27)
  await go('#/settings');
  assert.match(text(container), /الإعدادات/);
  await click(byText(container, 'Français'));
  assert.match(text(container), /Confidentialité/, 'UI did not switch to French');
  assert.equal(window.document.documentElement.lang, 'fr');
  assert.equal(window.document.documentElement.dir, 'ltr');

  await click(byText(container, 'العربية'));
  assert.equal(window.document.documentElement.dir, 'rtl');
});

test('the app can be mounted a second time with a clean DOM', async () => {
  // guards against module-level state leaking between mounts
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  const host = window.document.createElement('div');
  window.document.body.appendChild(host);
  let root;
  await act(async () => {
    root = createRoot(host);
    root.render(React.createElement(App));
  });
  assert.ok(host.textContent.length > 100);
  await act(async () => root.unmount());
  host.remove();
});

test('vite server closes', async () => {
  await vite.close();
});
