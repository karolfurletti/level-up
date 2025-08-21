import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import type { MarvelHero } from '../services/marvelApi';
import type { CustomHero } from '../services/localStorage';
import { getImageUrl as getMarvelImageUrl } from '../services/marvelApi';

interface HeroCardProps {
  hero: MarvelHero | CustomHero;
  onEdit: (hero: MarvelHero | CustomHero) => void;
  onDelete: (id: string | number) => void;
  onView: (hero: MarvelHero | CustomHero) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onEdit, onDelete, onView }) => {
  const isCustom = 'isCustom' in hero && hero.isCustom;
  
  const getImageUrl = () => {
    if (isCustom) {
      return hero.thumbnail.path.startsWith('http') 
        ? `${hero.thumbnail.path}.${hero.thumbnail.extension}`
        : '/placeholder-hero.svg';
    }
    // Use portrait_uncanny (300x450px) for better quality in cards
    return getMarvelImageUrl(hero.thumbnail, 'portrait_uncanny');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-hero.svg';
  };

  return (
    <Card className="h-100 shadow-sm" data-testid="hero-card">
      <Card.Img
        variant="top"
        src={getImageUrl()}
        onError={handleImageError}
        style={{ 
          height: '300px', 
          objectFit: 'cover',
          cursor: 'pointer'
        }}
        onClick={() => onView(hero)}
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0 flex-grow-1">{hero.name}</Card.Title>
          {isCustom && (
            <Badge bg="success" className="ms-2">Custom</Badge>
          )}
        </div>
        
        <Card.Text className="flex-grow-1">
          {hero.description || 'Nenhuma descrição disponível.'}
        </Card.Text>
        
        <div className="mb-3">
          <small className="text-muted">
            Comics: {hero.comics.available} | 
            Series: {hero.series.available} | 
            Stories: {hero.stories.available}
          </small>
        </div>
        
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView(hero)}
            className="flex-fill"
          >
            Ver Detalhes
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onEdit(hero)}
          >
            {isCustom ? 'Editar' : 'Criar Cópia'}
          </Button>
          {isCustom && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(hero.id)}
            >
              Excluir
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default HeroCard; 