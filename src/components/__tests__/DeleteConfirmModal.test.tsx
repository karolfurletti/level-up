import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmModal from '../DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  const mockOnHide = vi.fn();
  const mockOnConfirm = vi.fn();
  const heroName = 'Test Hero';

  beforeEach(() => {
    mockOnHide.mockClear();
    mockOnConfirm.mockClear();
  });

  it('should render modal when show is true', () => {
    render(
      <DeleteConfirmModal
        show={true}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
        heroName={heroName}
      />
    );

    expect(screen.getByTestId('delete-confirm-modal')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja excluir o herói/)).toBeInTheDocument();
    expect(screen.getByText(heroName)).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
  });

  it('should not render modal when show is false', () => {
    render(
      <DeleteConfirmModal
        show={false}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
        heroName={heroName}
      />
    );

    expect(screen.queryByTestId('delete-confirm-modal')).not.toBeInTheDocument();
  });

  it('should call onHide when cancel button is clicked', () => {
    render(
      <DeleteConfirmModal
        show={true}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
        heroName={heroName}
      />
    );

    const cancelButton = screen.getByTestId('cancel-delete');
    fireEvent.click(cancelButton);

    expect(mockOnHide).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(
      <DeleteConfirmModal
        show={true}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
        heroName={heroName}
      />
    );

    const confirmButton = screen.getByTestId('confirm-delete');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnHide).not.toHaveBeenCalled();
  });

  it('should have correct button variants', () => {
    render(
      <DeleteConfirmModal
        show={true}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
        heroName={heroName}
      />
    );

    const cancelButton = screen.getByTestId('cancel-delete');
    const confirmButton = screen.getByTestId('confirm-delete');

    expect(cancelButton).toHaveClass('btn-secondary');
    expect(confirmButton).toHaveClass('btn-danger');
  });

  it('should display hero name in the message', () => {
    const customHeroName = 'Spider-Man';
    render(
      <DeleteConfirmModal
        show={true}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
        heroName={customHeroName}
      />
    );

    expect(screen.getByText(customHeroName)).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja excluir o herói/)).toBeInTheDocument();
  });
});


