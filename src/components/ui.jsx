import { useId, useState } from 'react';
import { IconChevron } from './Icons.jsx';

/* --------------------------------------------------------------- primitives */

export function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`card ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

export function Button({ variant = 'primary', size = 'md', icon, children, loading, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      disabled={rest.disabled || loading}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : icon ? <span className="btn__icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

export function Field({ label, hint, htmlFor, children, optionalLabel }) {
  return (
    <div className="field">
      <div className="field__head">
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
        {optionalLabel ? <span className="field__optional">{optionalLabel}</span> : null}
      </div>
      {children}
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ id, ...rest }) {
  return <input id={id} className="input" {...rest} />;
}

export function TextArea({ id, rows = 4, ...rest }) {
  return <textarea id={id} className="input input--area" rows={rows} {...rest} />;
}

export function Select({ id, value, onChange, options, ariaLabel }) {
  return (
    <div className="select">
      <select id={id} className="input select__input" value={value} onChange={onChange} aria-label={ariaLabel}>
        {options.map((o) => {
          // accepts both { value, label } and the catalog shape { id, label }
          const v = o.value ?? o.id;
          return (
            <option key={v} value={v}>
              {o.label}
            </option>
          );
        })}
      </select>
      <IconChevron className="select__chevron" width={18} height={18} />
    </div>
  );
}

export function Checkbox({ id, checked, onChange, label, hint }) {
  return (
    <label className="checkbox" htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="checkbox__box" aria-hidden="true" />
      <span className="checkbox__body">
        <span className="checkbox__label">{label}</span>
        {hint ? <span className="checkbox__hint">{hint}</span> : null}
      </span>
    </label>
  );
}

/** Single or multi select rendered as pills — much faster to use than a dropdown. */
export function ChipGroup({ options, value, onChange, multiple = false, columns = 'auto' }) {
  const isActive = (v) => (multiple ? value.includes(v) : value === v);
  const toggle = (v) => {
    if (!multiple) return onChange(v);
    if (value.includes(v)) {
      if (value.length > 1) onChange(value.filter((x) => x !== v));
      return;
    }
    onChange([...value, v]);
  };
  return (
    <div className="chips" style={{ '--chip-columns': columns }}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`chip ${isActive(o.id) ? 'chip--on' : ''}`}
          aria-pressed={isActive(o.id)}
          onClick={() => toggle(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`segmented__item ${value === o.id ? 'segmented__item--on' : ''}`}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Slider({ id, min, max, value, onChange, labels, ariaLabel }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div className={`slider ${dragging ? 'slider--dragging' : ''}`}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-label={ariaLabel}
        aria-valuetext={labels?.[value - min]}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onBlur={() => setDragging(false)}
      />
      <div className="slider__scale">
        {labels.map((l, i) => (
          <button
            key={l}
            type="button"
            className={`slider__tick ${value === min + i ? 'slider__tick--on' : ''}`}
            onClick={() => onChange(min + i)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Collapsible panel used for the optional "more about this person" fields. */
export function Disclosure({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={`disclosure ${open ? 'disclosure--open' : ''}`}>
      <button
        type="button"
        className="disclosure__head"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          <span className="disclosure__title">{title}</span>
          {subtitle ? <span className="disclosure__subtitle">{subtitle}</span> : null}
        </span>
        <IconChevron className="disclosure__chevron" width={18} height={18} />
      </button>
      <div id={id} className="disclosure__body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
