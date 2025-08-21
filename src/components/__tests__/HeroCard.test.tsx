import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroCard from '../HeroCard';
import type { MarvelHero } from '../../services/marvelApi';
import type { CustomHero } from '../../services/localStorage';

const mockMarvelHero: MarvelHero = {
  id: 1,
  name: 'Spider-Man',
  description: 'Your friendly neighborhood Spider-Man',
  thumbnail: {
    path: 'http://example.com/spiderman',
    extension: 'jpg'
  },
  comics: { available: 50 },
  series: { available: 10 },
  stories: { available: 75 }
};

const mockCustomHero: CustomHero = {
  id: 'custom-123',
  name: 'Custom Hero',
  description: 'A hero created by the user',
  thumbnail: {
    path: 'http://example.com/custom',
    extension: 'png'
  },
  comics: { available: 5 },
  series: { available: 2 },
  stories: { available: 8 },
  isCustom: true
};

describe('HeroCard', () => {
  const mockOnView = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Marvel Hero', () => {
    it('should render Marvel hero correctly', () => {
      render(
        <HeroCard
          hero={mockMarvelHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Spider-Man')).toBeInTheDocument();
      expect(screen.getByText('Your friendly neighborhood Spider-Man')).toBeInTheDocument();
      expect(screen.getByText(/Comics: 50/)).toBeInTheDocument();
      expect(screen.getByText(/Series: 10/)).toBeInTheDocument();
      expect(screen.getByText(/Stories: 75/)).toBeInTheDocument();
      expect(screen.queryByText('Custom')).not.toBeInTheDocument();
    });

    it('should show "Criar Cópia" button for Marvel heroes', () => {
      render(
        <HeroCard
          hero={mockMarvelHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Criar Cópia')).toBeInTheDocument();
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
      expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    });
  });

  describe('Custom Hero', () => {
    it('should render custom hero correctly', () => {
      render(
        <HeroCard
          hero={mockCustomHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Custom Hero')).toBeInTheDocument();
      expect(screen.getByText('A hero created by the user')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should show edit and delete buttons for custom heroes', () => {
      render(
        <HeroCard
          hero={mockCustomHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Editar')).toBeInTheDocument();
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onView when clicking "Ver Detalhes"', () => {
      render(
        <HeroCard
          hero={mockMarvelHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByText('Ver Detalhes'));
      expect(mockOnView).toHaveBeenCalledWith(mockMarvelHero);
    });

    it('should call onView when clicking hero image', () => {
      render(
        <HeroCard
          hero={mockMarvelHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const image = screen.getByRole('img');
      fireEvent.click(image);
      expect(mockOnView).toHaveBeenCalledWith(mockMarvelHero);
    });

    it('should call onEdit when clicking edit button', () => {
      render(
        <HeroCard
          hero={mockCustomHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByText('Editar'));
      expect(mockOnEdit).toHaveBeenCalledWith(mockCustomHero);
    });

    it('should call onDelete when clicking delete button', () => {
      render(
        <HeroCard
          hero={mockCustomHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      fireEvent.click(screen.getByText('Excluir'));
      expect(mockOnDelete).toHaveBeenCalledWith(mockCustomHero.id);
    });
  });

  describe('Image handling', () => {
    it('should use placeholder when image fails to load', () => {
      render(
        <HeroCard
          hero={mockMarvelHero}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const image = screen.getByRole('img') as HTMLImageElement;
      fireEvent.error(image);
      
      expect(image.src).toContain('placeholder-hero.svg');
    });
  });

  describe('Default description', () => {
    it('should show default message when description is empty', () => {
      const heroWithoutDescription = {
        ...mockMarvelHero,
        description: ''
      };

      render(
        <HeroCard
          hero={heroWithoutDescription}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Nenhuma descrição disponível.')).toBeInTheDocument();
    });
  });
}); 