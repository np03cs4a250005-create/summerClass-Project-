import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };

    const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    const getIcon = (type) => {
        if (type === 'success') return 'fa-check-circle';
        if (type === 'error') return 'fa-exclamation-circle';
        if (type === 'warning') return 'fa-exclamation-triangle';
        return 'fa-info-circle';
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div id="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type} visible`}>
                        <i className={`fas ${getIcon(toast.type)}`}></i>
                        <span>{toast.message}</span>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
