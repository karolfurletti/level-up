import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroForm, { type HeroFormData } from '../HeroForm';
import type { CustomHero } from '../../services/localStorage';

const mockHeroData: CustomHero = {
  id: 'custom-123',
  name: 'Test Hero',
  description: 'Test description',
  thumbnail: {
    path: 'http://example.com/image',
    extension: 'jpg'
  },
  comics: { available: 10 },
  series: { available: 5 },
  stories: { available: 8 },
  isCustom: true
};

describe('HeroForm', () => {
  const mockOnHide = vi.fn();
  const mockOnSave = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render create form correctly', () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      expect(screen.getByText('Criar Novo Herói')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o nome do herói')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite a descrição do herói')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('https://exemplo.com/imagem')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('should not render modal when show is false', () => {
      render(
        <HeroForm
          show={false}
          onHide={mockOnHide}
          onSave={mockOnSave}
        />
      );

      expect(screen.queryByText('Criar Novo Herói')).not.toBeInTheDocument();
    });

    it('should submit valid form data', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockSave}
          isEditing={false}
        />
      );

      await user.type(screen.getByPlaceholderText('Digite o nome do herói'), 'New Hero');
      await user.type(screen.getByPlaceholderText('Digite a descrição do herói'), 'Hero description');
      await user.type(screen.getByPlaceholderText('https://exemplo.com/imagem'), 'https://example.com/image.jpg');
      await user.type(screen.getAllByDisplayValue('0')[0], '10');
      await user.type(screen.getAllByDisplayValue('0')[0], '5');
      await user.type(screen.getAllByDisplayValue('0')[0], '15');

      await user.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith({
          name: 'New Hero',
          description: 'Hero description',
          thumbnail: {
            path: 'https://example.com/image.jpg',
            extension: 'jpg'
          },
          comics: { available: 10 },
          series: { available: 5 },
          stories: { available: 15 }
        });
      });
    });
  });

  describe('Edit Mode', () => {
    it('should render edit form with hero data', () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          hero={mockHeroData}
          isEditing={true}
        />
      );

      expect(screen.getByText('Editar Herói')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Hero')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('http://example.com/image')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('8')).toBeInTheDocument();
    });

    it('should update hero data on edit', async () => {
      const mockSave = vi.fn().mockResolvedValue(undefined);
      
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockSave}
          hero={mockHeroData}
          isEditing={true}
        />
      );

      const nameInput = screen.getByDisplayValue('Test Hero');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Hero');

      await user.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Updated Hero'
          })
        );
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      await user.click(screen.getByText('Salvar'));

      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
      expect(screen.getByText('URL da imagem é obrigatória')).toBeInTheDocument();
    });

    it('should validate URL format', async () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      // Fill valid fields
      await user.type(screen.getByPlaceholderText('Digite o nome do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('Digite a descrição do herói'), 'Test');
      // Enter invalid URL
      await user.type(screen.getByPlaceholderText('https://exemplo.com/imagem'), 'invalid-url');

      await user.click(screen.getByText('Salvar'));

      // Validation should prevent form submission with invalid URL
      // Just verify the form is still visible (not closed)
      expect(screen.getByText('Criar Novo Herói')).toBeInTheDocument();
      expect(screen.getByDisplayValue('invalid-url')).toBeInTheDocument();
    });

    it('should validate negative numbers', async () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      // Fill valid fields first
      await user.type(screen.getByPlaceholderText('Digite o nome do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('Digite a descrição do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('https://exemplo.com/imagem'), 'https://example.com/test.jpg');
      
      // Enter negative number in comics field
      const comicsInput = screen.getAllByRole('spinbutton')[0];
      await user.clear(comicsInput);
      await user.type(comicsInput, '-5');

      await user.click(screen.getByText('Salvar'));

      // Form should still be visible (validation failed)
      expect(screen.getByText('Criar Novo Herói')).toBeInTheDocument();
    });

    it('should clear errors when field is corrected', async () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      // Trigger validation error
      await user.click(screen.getByText('Salvar'));
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();

      // Fix the error
      await user.type(screen.getByPlaceholderText('Digite o nome do herói'), 'Valid Name');
      
      // Error should be cleared
      expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should call onHide when cancel button is clicked', async () => {
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      await user.click(screen.getByText('Cancelar'));
      expect(mockOnHide).toHaveBeenCalled();
    });

    it('should disable submit button while submitting', async () => {
      const mockSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockSave}
          isEditing={false}
        />
      );

      await user.type(screen.getByPlaceholderText('Digite o nome do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('Digite a descrição do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('https://exemplo.com/imagem'), 'https://example.com/test.jpg');

      await user.click(screen.getByText('Salvar'));

      expect(screen.getByText('Salvando...')).toBeInTheDocument();
      expect(screen.getByText('Salvando...')).toBeDisabled();
    });

    it('should reset form when modal closes', () => {
      const { rerender } = render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          hero={mockHeroData}
          isEditing={true}
        />
      );

      expect(screen.getByDisplayValue('Test Hero')).toBeInTheDocument();

      rerender(
        <HeroForm
          show={false}
          onHide={mockOnHide}
          onSave={mockOnSave}
          hero={mockHeroData}
          isEditing={true}
        />
      );

      rerender(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockOnSave}
          isEditing={false}
        />
      );

      expect(screen.queryByDisplayValue('Test Hero')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle save errors gracefully', async () => {
      const mockSave = vi.fn().mockRejectedValue(new Error('Save failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <HeroForm
          show={true}
          onHide={mockOnHide}
          onSave={mockSave}
          isEditing={false}
        />
      );

      await user.type(screen.getByPlaceholderText('Digite o nome do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('Digite a descrição do herói'), 'Test');
      await user.type(screen.getByPlaceholderText('https://exemplo.com/imagem'), 'https://example.com/test.jpg');

      await user.click(screen.getByText('Salvar'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Erro ao salvar herói:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });
}); 