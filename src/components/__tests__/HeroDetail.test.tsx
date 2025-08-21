import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroDetail from '../HeroDetail';
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
  description: 'A custom hero created by user',
  thumbnail: {
    path: 'http://example.com/custom',
    extension: 'png'
  },
  comics: { available: 5 },
  series: { available: 2 },
  stories: { available: 8 },
  isCustom: true
};

const mockHeroWithoutDescription: MarvelHero = {
  ...mockMarvelHero,
  description: ''
};

describe('HeroDetail', () => {
  const mockOnHide = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    it('should render modal when show is true and hero exists', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      expect(screen.getByText('Spider-Man')).toBeInTheDocument();
      expect(screen.getByText('Your friendly neighborhood Spider-Man')).toBeInTheDocument();
    });

    it('should not render modal when show is false', () => {
      render(
        <HeroDetail
          show={false}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      expect(screen.queryByText('Spider-Man')).not.toBeInTheDocument();
    });

    it('should not render when hero is null', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={null}
        />
      );

      expect(screen.queryByText('Spider-Man')).not.toBeInTheDocument();
    });
  });

  describe('Marvel Hero Display', () => {
    it('should display Marvel hero information correctly', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      expect(screen.getByText('Spider-Man')).toBeInTheDocument();
      expect(screen.getByText('Your friendly neighborhood Spider-Man')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument(); // Comics
      expect(screen.getByText('10')).toBeInTheDocument(); // Series
      expect(screen.getByText('75')).toBeInTheDocument(); // Stories
      expect(screen.getByText('1')).toBeInTheDocument(); // ID
      expect(screen.getByText('Herói Marvel')).toBeInTheDocument();
      expect(screen.getByText('Marvel Comics API')).toBeInTheDocument();
      expect(screen.queryByText('Custom')).not.toBeInTheDocument();
    });

    it('should show default description when hero has no description', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockHeroWithoutDescription}
        />
      );

      expect(screen.getByText('Nenhuma descrição disponível para este herói.')).toBeInTheDocument();
    });
  });

  describe('Custom Hero Display', () => {
    it('should display custom hero with badge', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockCustomHero}
        />
      );

      expect(screen.getByText('Custom Hero')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
      expect(screen.getAllByText('Herói Customizado')).toHaveLength(2);
      expect(screen.getByText('Este herói foi criado por você e está salvo localmente no seu navegador.')).toBeInTheDocument();
      expect(screen.queryByText('Marvel Comics API')).not.toBeInTheDocument();
    });

    it('should show custom hero alert', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockCustomHero}
        />
      );

      const alerts = screen.getAllByText('Herói Customizado');
      expect(alerts).toHaveLength(2);
      // Check if one of them is in the alert
      const alertElement = alerts.find(el => el.closest('.alert-info'));
      expect(alertElement).toBeTruthy();
    });
  });

  describe('Statistics Display', () => {
    it('should display statistics in correct format', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      expect(screen.getByText('Estatísticas')).toBeInTheDocument();
      expect(screen.getByText('Comics')).toBeInTheDocument();
      expect(screen.getByText('Séries')).toBeInTheDocument();
      expect(screen.getByText('Histórias')).toBeInTheDocument();
    });
  });

  describe('Technical Information', () => {
    it('should display technical information for Marvel hero', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      expect(screen.getByText('Informações Técnicas')).toBeInTheDocument();
      expect(screen.getByText('ID:')).toBeInTheDocument();
      expect(screen.getByText('Tipo:')).toBeInTheDocument();
      expect(screen.getByText('Fonte:')).toBeInTheDocument();
    });

    it('should display technical information for custom hero', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockCustomHero}
        />
      );

      expect(screen.getByText('custom-123')).toBeInTheDocument();
      expect(screen.getAllByText('Herói Customizado')).toHaveLength(2);
      expect(screen.queryByText('Marvel Comics API')).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should handle image error for Marvel hero', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      const image = screen.getByRole('img') as HTMLImageElement;
      fireEvent.error(image);
      
      expect(image.src).toContain('placeholder-hero.svg');
    });

    it('should handle custom hero image with full URL', () => {
      const customHeroWithFullUrl: CustomHero = {
        ...mockCustomHero,
        thumbnail: {
          path: 'https://example.com/image',
          extension: 'jpg'
        }
      };

      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={customHeroWithFullUrl}
        />
      );

      const image = screen.getByRole('img') as HTMLImageElement;
      expect(image.src).toContain('https://example.com/image.jpg');
    });

    it('should use placeholder for custom hero with invalid path', () => {
      const customHeroWithInvalidPath: CustomHero = {
        ...mockCustomHero,
        thumbnail: {
          path: 'invalid-path',
          extension: 'jpg'
        }
      };

      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={customHeroWithInvalidPath}
        />
      );

      const image = screen.getByRole('img') as HTMLImageElement;
      expect(image.src).toContain('placeholder-hero.svg');
    });
  });

  describe('Modal Interactions', () => {
    it('should call onHide when close button is clicked', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnHide).toHaveBeenCalled();
    });
  });

  describe('Content Structure', () => {
    it('should have proper heading structure', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      expect(screen.getByRole('heading', { level: 5, name: 'Descrição' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 5, name: 'Estatísticas' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 5, name: 'Informações Técnicas' })).toBeInTheDocument();
    });

    it('should display image with proper attributes', () => {
      render(
        <HeroDetail
          show={true}
          onHide={mockOnHide}
          hero={mockMarvelHero}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Spider-Man');
      expect(image).toHaveClass('img-fluid', 'rounded', 'shadow');
    });
  });
}); 