import React from 'react';
import { Modal, Badge, Row, Col } from 'react-bootstrap';
import type { MarvelHero } from '../services/marvelApi';
import type { CustomHero } from '../services/localStorage';
import { getImageUrl as getMarvelImageUrl } from '../services/marvelApi';

interface HeroDetailProps {
  show: boolean;
  onHide: () => void;
  hero: MarvelHero | CustomHero | null;
}

const HeroDetail: React.FC<HeroDetailProps> = ({ show, onHide, hero }) => {
  if (!hero) return null;

  const isCustom = 'isCustom' in hero && hero.isCustom;
  
  const getImageUrl = () => {
    if (isCustom) {
      return hero.thumbnail.path.startsWith('http') 
        ? `${hero.thumbnail.path}.${hero.thumbnail.extension}`
        : '/placeholder-hero.svg';
    }
    return getMarvelImageUrl(hero.thumbnail, 'portrait_incredible');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-hero.svg';
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          {hero.name}
          {isCustom && <Badge bg="success">Custom</Badge>}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row>
          <Col md={4} className="text-center mb-3">
            <img
              src={getImageUrl()}
              alt={hero.name}
              onError={handleImageError}
              className="img-fluid rounded shadow"
              style={{ 
                maxHeight: '400px',
                objectFit: 'cover',
                width: '100%'
              }}
            />
          </Col>
          
          <Col md={8}>
            <div className="mb-4">
              <h5>Descrição</h5>
              <p className="text-muted">
                {hero.description || 'Nenhuma descrição disponível para este herói.'}
              </p>
            </div>
            
            <div className="mb-4">
              <h5>Estatísticas</h5>
              <Row>
                <Col sm={4} className="mb-2">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h4 mb-1 text-primary">{hero.comics.available}</div>
                    <small className="text-muted">Comics</small>
                  </div>
                </Col>
                <Col sm={4} className="mb-2">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h4 mb-1 text-success">{hero.series.available}</div>
                    <small className="text-muted">Séries</small>
                  </div>
                </Col>
                <Col sm={4} className="mb-2">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h4 mb-1 text-warning">{hero.stories.available}</div>
                    <small className="text-muted">Histórias</small>
                  </div>
                </Col>
              </Row>
            </div>
            
            <div className="mb-3">
              <h5>Informações Técnicas</h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> {hero.id}</li>
                <li><strong>Tipo:</strong> {isCustom ? 'Herói Customizado' : 'Herói Marvel'}</li>
                {!isCustom && (
                  <li><strong>Fonte:</strong> Marvel Comics API</li>
                )}
              </ul>
            </div>
            
            {isCustom && (
              <div className="alert alert-info">
                <strong>Herói Customizado</strong><br />
                Este herói foi criado por você e está salvo localmente no seu navegador.
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default HeroDetail; 