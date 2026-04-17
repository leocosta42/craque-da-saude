'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { Trophy, AlertTriangle, XCircle, CheckCircle, X, Trash2 } from 'lucide-react';

const ToastContext = createContext();

const ICONS = {
  success: { icon: Trophy, color: 'var(--gold-trophy)' },
  error: { icon: XCircle, color: '#e74c3c' },
  warning: { icon: AlertTriangle, color: '#f39c12' },
  info: { icon: CheckCircle, color: 'var(--water-blue)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirmModal({ message, onConfirm });
  }, []);

  const handleConfirm = () => {
    if (confirmModal?.onConfirm) confirmModal.onConfirm();
    setConfirmModal(null);
  };

  const handleCancel = () => {
    setConfirmModal(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Stack */}
      <div className="toast-container">
        {toasts.map((t) => {
          const config = ICONS[t.type] || ICONS.success;
          const IconComp = config.icon;
          return (
            <div key={t.id} className={`toast toast-${t.type}`}>
              <IconComp size={20} color={config.color} />
              <span>{t.message}</span>
              <button
                className="toast-close"
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="confirm-overlay" onClick={handleCancel}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <Trash2 size={32} color="#e74c3c" />
            </div>
            <p className="confirm-message">{confirmModal.message}</p>
            <div className="confirm-actions">
              <button className="confirm-btn confirm-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="confirm-btn confirm-delete" onClick={handleConfirm}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
