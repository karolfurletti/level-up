import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import type { MarvelHero } from '../services/marvelApi';
import type { CustomHero } from '../services/localStorage';

interface HeroFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (heroData: HeroFormData) => void;
  hero?: MarvelHero | CustomHero | null;
  isEditing?: boolean;
}

export interface HeroFormData {
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
  series: {
    available: number;
  };
  stories: {
    available: number;
  };
}

const HeroForm: React.FC<HeroFormProps> = ({ 
  show, 
  onHide, 
  onSave, 
  hero, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<HeroFormData>({
    name: '',
    description: '',
    thumbnail: {
      path: '',
      extension: 'jpg'
    },
    comics: { available: 0 },
    series: { available: 0 },
    stories: { available: 0 }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hero && show) {
      setFormData({
        name: hero.name,
        description: hero.description,
        thumbnail: {
          path: hero.thumbnail.path,
          extension: hero.thumbnail.extension
        },
        comics: { available: hero.comics.available },
        series: { available: hero.series.available },
        stories: { available: hero.stories.available }
      });
    } else if (!show) {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        thumbnail: {
          path: '',
          extension: 'jpg'
        },
        comics: { available: 0 },
        series: { available: 0 },
        stories: { available: 0 }
      });
      setErrors({});
    }
  }, [hero, show]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.thumbnail.path.trim()) {
      newErrors.thumbnail = 'URL da imagem é obrigatória';
    } else if (!isValidUrl(formData.thumbnail.path)) {
      newErrors.thumbnail = 'URL da imagem deve ser válida';
    }

    if (formData.comics.available < 0) {
      newErrors.comics = 'Número de comics deve ser positivo';
    }

    if (formData.series.available < 0) {
      newErrors.series = 'Número de séries deve ser positivo';
    }

    if (formData.stories.available < 0) {
      newErrors.stories = 'Número de histórias deve ser positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onHide();
    } catch (error) {
      console.error('Erro ao salvar herói:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof HeroFormData] as any,
            [keys[1]]: value
          }
        };
      }
      return prev;
    });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Editar Herói' : 'Criar Novo Herói'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              isInvalid={!!errors.name}
              placeholder="Digite o nome do herói"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              isInvalid={!!errors.description}
              placeholder="Digite a descrição do herói"
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>URL da Imagem *</Form.Label>
            <Form.Control
              type="url"
              value={formData.thumbnail.path}
              onChange={(e) => handleInputChange('thumbnail.path', e.target.value)}
              isInvalid={!!errors.thumbnail}
              placeholder="https://exemplo.com/imagem"
            />
            <Form.Control.Feedback type="invalid">
              {errors.thumbnail}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Cole uma URL válida de imagem
            </Form.Text>
          </Form.Group>

          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Comics</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.comics.available}
                  onChange={(e) => handleInputChange('comics.available', parseInt(e.target.value) || 0)}
                  isInvalid={!!errors.comics}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.comics}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Séries</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.series.available}
                  onChange={(e) => handleInputChange('series.available', parseInt(e.target.value) || 0)}
                  isInvalid={!!errors.series}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.series}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Histórias</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.stories.available}
                  onChange={(e) => handleInputChange('stories.available', parseInt(e.target.value) || 0)}
                  isInvalid={!!errors.stories}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stories}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="danger">
              Por favor, corrija os erros acima antes de continuar.
            </Alert>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default HeroForm; 