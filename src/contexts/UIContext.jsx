import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** @type {React.Context<null | object>} */
const UIContext = createContext(null);

let toastId = 0;

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      sidebarCollapsed,
      toggleSidebar,
      activeModal,
      setActiveModal,
    }),
    [toasts, showToast, dismissToast, sidebarCollapsed, toggleSidebar, activeModal],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIProvider');
  }
  return context;
}
