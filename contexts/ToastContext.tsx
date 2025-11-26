import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, WarningCircle, Info } from "phosphor-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-slide-up
              ${toast.type === "success" ? "bg-white dark:bg-slate-900 border-green-500/20 shadow-green-500/10" : ""}
              ${toast.type === "error" ? "bg-white dark:bg-slate-900 border-red-500/20 shadow-red-500/10" : ""}
              ${toast.type === "info" ? "bg-white dark:bg-slate-900 border-blue-500/20 shadow-blue-500/10" : ""}
            `}
          >
            {toast.type === "success" && (
              <CheckCircle
                size={20}
                weight="regular"
                className="text-green-500"
              />
            )}
            {toast.type === "error" && (
              <WarningCircle
                size={20}
                weight="regular"
                className="text-red-500"
              />
            )}
            {toast.type === "info" && (
              <Info size={20} weight="regular" className="text-blue-500" />
            )}
            <span className="font-medium text-sm text-slate-900 dark:text-white">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} weight="regular" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
