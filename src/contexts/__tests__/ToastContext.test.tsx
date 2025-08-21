import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from '../ToastContext';

// Helper component to test the context
const TestComponent: React.FC = () => {
  const { showToast, toasts } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Test message', 'success')}>
        Show Success Toast
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error Toast
      </button>
      <button onClick={() => showToast('Warning message', 'warning')}>
        Show Warning Toast
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info Toast
      </button>
      <button onClick={() => showToast('Auto remove', 'info', 100)}>
        Show Auto Remove Toast
      </button>
      <div data-testid="toasts-count">{toasts.length}</div>
      {toasts.map(toast => (
        <div key={toast.id} data-testid={`toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

describe('ToastContext', () => {
  it('should show success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success Toast'));
    
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByTestId('toasts-count')).toHaveTextContent('1');
  });

  it('should show error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error Toast'));
    
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Warning Toast'));
    
    expect(screen.getByTestId('toast-warning')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should show info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info Toast'));
    
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should auto remove toast after duration', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Auto Remove Toast'));
    
    expect(screen.getByTestId('toasts-count')).toHaveTextContent('1');
    expect(screen.getByText('Auto remove')).toBeInTheDocument();

    // Wait for auto removal
    await waitFor(() => {
      expect(screen.getByTestId('toasts-count')).toHaveTextContent('0');
    }, { timeout: 200 });

    expect(screen.queryByText('Auto remove')).not.toBeInTheDocument();
  });

  it('should handle multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success Toast'));
    fireEvent.click(screen.getByText('Show Error Toast'));
    fireEvent.click(screen.getByText('Show Warning Toast'));
    
    expect(screen.getByTestId('toasts-count')).toHaveTextContent('3');
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
    expect(screen.getByTestId('toast-warning')).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    console.error = originalError;
  });
});

