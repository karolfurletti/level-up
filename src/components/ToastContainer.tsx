import React from 'react';
import { ToastContainer as BootstrapToastContainer, Toast } from 'react-bootstrap';
import { useToast } from '../contexts/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getToastTitle = (type: string) => {
    switch (type) {
      case 'success':
        return 'Sucesso';
      case 'error':
        return 'Erro';
      case 'warning':
        return 'Atenção';
      case 'info':
      default:
        return 'Informação';
    }
  };

  return (
    <BootstrapToastContainer 
      position="top-end" 
      className="p-3"
      style={{ 
        position: 'fixed', 
        zIndex: 9999,
        top: '20px',
        right: '20px'
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => removeToast(toast.id)}
          show={true}
          delay={toast.duration}
          autohide={toast.duration !== undefined && toast.duration > 0}
          bg={getToastVariant(toast.type)}
          className="text-white"
        >
          <Toast.Header className="text-dark">
            <span className="me-2">{getToastIcon(toast.type)}</span>
            <strong className="me-auto">{getToastTitle(toast.type)}</strong>
            <small>agora</small>
          </Toast.Header>
          <Toast.Body>
            {toast.message}
          </Toast.Body>
        </Toast>
      ))}
    </BootstrapToastContainer>
  );
};

export default ToastContainer;

