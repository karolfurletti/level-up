import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastContainer from '../ToastContainer';
import { ToastProvider, useToast } from '../../contexts/ToastContext';

// Helper component to trigger toasts
const ToastTrigger: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Warning message', 'warning')}>
        Show Warning
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  );
};

const TestWrapper: React.FC = () => (
  <ToastProvider>
    <ToastTrigger />
    <ToastContainer />
  </ToastProvider>
);

describe('ToastContainer', () => {
  it('should render toast container', () => {
    render(<TestWrapper />);
    
    // Container should be in the DOM but empty initially
    expect(document.querySelector('.toast-container')).toBeInTheDocument();
  });

  it('should display success toast with correct styling', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Show Success'));
    
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
    
    // Check for success variant class
    const toast = document.querySelector('.toast');
    expect(toast).toHaveClass('bg-success');
  });

  it('should display error toast with correct styling', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Show Error'));
    
    expect(screen.getByText('Erro')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
    
    // Check for danger variant class
    const toast = document.querySelector('.toast');
    expect(toast).toHaveClass('bg-danger');
  });

  it('should display warning toast with correct styling', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Show Warning'));
    
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    
    // Check for warning variant class
    const toast = document.querySelector('.toast');
    expect(toast).toHaveClass('bg-warning');
  });

  it('should display info toast with correct styling', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Show Info'));
    
    expect(screen.getByText('Informação')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
    
    // Check for info variant class
    const toast = document.querySelector('.toast');
    expect(toast).toHaveClass('bg-info');
  });

  it('should allow manual toast dismissal', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Show Success'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Click the close button
    const closeButton = document.querySelector('.btn-close');
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton!);
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should display multiple toasts simultaneously', () => {
    render(<TestWrapper />);
    
    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));
    fireEvent.click(screen.getByText('Show Warning'));
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    
    // Should have 3 toasts
    const toasts = document.querySelectorAll('.toast');
    expect(toasts).toHaveLength(3);
  });

  it('should position toasts in top-end corner', () => {
    render(<TestWrapper />);
    
    const container = document.querySelector('.toast-container');
    expect(container).toHaveClass('top-0');
    expect(container).toHaveClass('end-0');
    expect(container).toHaveStyle({
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '9999'
    });
  });
});

