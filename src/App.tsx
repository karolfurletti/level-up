import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Alert, Spinner, Card } from 'react-bootstrap';
import { useHeroes, type CombinedHero } from './hooks/useHeroes';
import type { HeroFormData } from './components/HeroForm';
import HeroCard from './components/HeroCard';
import HeroForm from './components/HeroForm';
import HeroDetail from './components/HeroDetail';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ToastContainer from './components/ToastContainer';
import { useToast } from './contexts/ToastContext';
import type { MarvelHero } from './services/marvelApi';

function App() {
  const {
    allHeroes,
    loading,
    error,
    searchQuery,
    hasMorePages,
    setSearchQuery,
    loadMoreHeroes,
    createCustomHero,
    updateCustomHero,
    deleteCustomHero,
    createHeroCopy,
    refreshData
  } = useHeroes();

  const { showToast } = useToast();

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedHero, setSelectedHero] = useState<CombinedHero | null>(null);
  const [editingHero, setEditingHero] = useState<CombinedHero | null>(null);
  const [heroToDelete, setHeroToDelete] = useState<{ id: string | number; name: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Search state
  const [searchInput, setSearchInput] = useState('');

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  // Handle hero actions
  const handleViewHero = (hero: CombinedHero) => {
    setSelectedHero(hero);
    setShowDetail(true);
  };

  const handleEditHero = (hero: CombinedHero) => {
    const isCustom = 'isCustom' in hero && hero.isCustom;
    
    if (isCustom) {
      setEditingHero(hero);
      setIsEditing(true);
      setShowForm(true);
    } else {
      // For Marvel heroes, create a copy
      handleCreateCopy(hero as MarvelHero);
    }
  };

  const handleCreateCopy = async (hero: MarvelHero) => {
    try {
      await createHeroCopy(hero);
      showToast(`Cópia do herói "${hero.name}" criada com sucesso!`, 'success');
    } catch (error) {
      console.error('Erro ao criar cópia:', error);
      showToast('Erro ao criar cópia do herói. Tente novamente.', 'error');
    }
  };

  const handleDeleteHero = (id: string | number) => {
    if (typeof id === 'string' && id.startsWith('custom-')) {
      // Find the hero to get its name
      const hero = allHeroes.find(h => h.id === id);
      if (hero) {
        setHeroToDelete({ id, name: hero.name });
        setShowDeleteConfirm(true);
      }
    }
  };

  const confirmDeleteHero = async () => {
    if (heroToDelete) {
      try {
        await deleteCustomHero(heroToDelete.id as string);
        showToast(`Herói "${heroToDelete.name}" excluído com sucesso!`, 'success');
        setShowDeleteConfirm(false);
        setHeroToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir herói:', error);
        showToast('Erro ao excluir herói. Tente novamente.', 'error');
      }
    }
  };

  const cancelDeleteHero = () => {
    setShowDeleteConfirm(false);
    setHeroToDelete(null);
  };

  const handleCreateNew = () => {
    setEditingHero(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSaveHero = async (heroData: HeroFormData) => {
    try {
      if (isEditing && editingHero && 'isCustom' in editingHero) {
        await updateCustomHero(editingHero.id, heroData);
        showToast(`Herói "${heroData.name}" atualizado com sucesso!`, 'success');
      } else {
        await createCustomHero(heroData);
        showToast(`Herói "${heroData.name}" criado com sucesso!`, 'success');
      }
      setShowForm(false);
      setEditingHero(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar herói:', error);
      const action = isEditing ? 'atualizar' : 'criar';
      showToast(`Erro ao ${action} herói. Tente novamente.`, 'error');
      throw error;
    }
  };

  const handleLoadMore = async () => {
    try {
      await loadMoreHeroes();
    } catch (error) {
      console.error('Erro ao carregar mais heróis:', error);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-4 mb-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="mb-0">🦸‍♂️ Level Up Marvel</h1>
              <p className="mb-0 opacity-75">Gerencie seus heróis favoritos da Marvel</p>
            </Col>
            <Col xs="auto">
              <Button 
                variant="light" 
                onClick={handleCreateNew}
                className="fw-bold"
              >
                + Criar Herói
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Search Bar */}
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Buscar heróis da Marvel..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? <Spinner size="sm" /> : 'Buscar'}
                    </Button>
                    {searchQuery && (
                      <Button variant="outline-secondary" onClick={clearSearch}>
                        Limpar
                      </Button>
                    )}
                  </InputGroup>
                </Form>
                {searchQuery && (
                  <small className="text-muted mt-2 d-block">
                    Buscando por: "{searchQuery}"
                  </small>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" dismissible onClose={() => refreshData()}>
                <Alert.Heading>Ops! Algo deu errado</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={refreshData}>
                  Tentar Novamente
                </Button>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Heroes Grid */}
        {allHeroes.length > 0 ? (
          <>
            <Row>
              {allHeroes.map((hero) => (
                <Col key={`${hero.id}`} lg={3} md={4} sm={6} className="mb-4">
                  <HeroCard
                    hero={hero}
                    onView={handleViewHero}
                    onEdit={handleEditHero}
                    onDelete={handleDeleteHero}
                  />
                </Col>
              ))}
            </Row>

            {/* Load More Button */}
            {hasMorePages && (
              <Row className="mt-4 mb-5">
                <Col className="text-center">
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Carregando...
                      </>
                    ) : (
                      'Carregar Mais Heróis'
                    )}
                  </Button>
                </Col>
              </Row>
            )}
          </>
        ) : !loading && !error ? (
          <Row>
            <Col className="text-center py-5">
              <div className="text-muted">
                <h3>Nenhum herói encontrado</h3>
                <p>Tente uma busca diferente ou crie seu próprio herói!</p>
                <Button variant="primary" onClick={handleCreateNew}>
                  Criar Primeiro Herói
                </Button>
              </div>
            </Col>
          </Row>
        ) : null}

        {/* Initial Loading */}
        {loading && allHeroes.length === 0 && (
          <Row>
            <Col className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Carregando heróis...</p>
            </Col>
          </Row>
        )}
      </Container>

      {/* Modals */}
      <HeroForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingHero(null);
          setIsEditing(false);
        }}
        onSave={handleSaveHero}
        hero={editingHero}
        isEditing={isEditing}
      />

      <HeroDetail
        show={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedHero(null);
        }}
        hero={selectedHero}
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        onHide={cancelDeleteHero}
        onConfirm={confirmDeleteHero}
        heroName={heroToDelete?.name || ''}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
