import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Hash router — no dependency, and it works no matter which base path the app
 * is served from (which matters for the preview proxy).
 */
const RouterContext = createContext({ path: '/', navigate: () => {} });

const readHash = () => {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
};

export function RouterProvider({ children }) {
  const [path, setPath] = useState(readHash);

  useEffect(() => {
    const onHashChange = () => {
      setPath(readHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) window.history.replaceState(null, '', '#/');
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to) => {
    if (readHash() === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = to;
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

export function Link({ to, children, ...rest }) {
  const { navigate, path } = useRouter();
  return (
    <a
      href={`#${to}`}
      aria-current={path === to ? 'page' : undefined}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
