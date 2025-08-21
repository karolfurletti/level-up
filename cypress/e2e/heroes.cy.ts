describe('Marvel Heroes App', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Landing Page', () => {
    it('should display the header correctly', () => {
      cy.contains('Level Up Marvel').should('be.visible');
      cy.contains('Gerencie seus heróis favoritos da Marvel').should('be.visible');
      cy.contains('+ Criar Herói').should('be.visible');
    });

    it('should display search bar', () => {
      cy.get('input[placeholder*="Buscar heróis"]').should('be.visible');
      cy.contains('button', 'Buscar').should('be.visible');
    });

    it('should load heroes from Marvel API', () => {
      cy.wait(3000); // Aguardar carregamento da API
      cy.get('[data-testid="hero-card"]').should('have.length.at.least', 1);
    });
  });

  describe('Search Functionality', () => {
    it('should search for heroes by name', () => {
      cy.get('input[placeholder*="Buscar heróis"]').type('Spider');
      cy.contains('button', 'Buscar').click();
      
      cy.wait(2000); // Aguardar resultado da busca
      cy.contains('Buscando por: "Spider"').should('be.visible');

      cy.get('[data-testid="hero-card"]').should('exist');
    });

    it('should clear search results', () => {
      cy.get('input[placeholder*="Buscar heróis"]').type('Spider');
      cy.contains('button', 'Buscar').click();
      cy.wait(1000);
      
      cy.contains('button', 'Limpar').click();
      cy.get('input[placeholder*="Buscar heróis"]').should('have.value', '');
    });
  });

  describe('Hero Management (CRUD)', () => {
    it('should create a new custom hero', () => {
      cy.contains('+ Criar Herói').click();
      

      cy.contains('Criar Novo Herói').should('be.visible');
      
      cy.get('input[placeholder*="Digite o nome do herói"]').type('Teste Hero');
      cy.get('textarea[placeholder*="Digite a descrição"]').type('Um herói criado para teste');
      cy.get('input[placeholder*="https://exemplo.com/imagem"]').type('https://via.placeholder.com/300x450');
      cy.get('input[type="number"]').first().type('10'); // Comics
      cy.get('input[type="number"]').eq(1).type('5'); // Series
      cy.get('input[type="number"]').eq(2).type('15'); // Stories
      
      // Salvar
      cy.contains('button', 'Salvar').click();
      
      // Verificar toast de sucesso
      cy.contains('Herói "Teste Hero" criado com sucesso!').should('be.visible');
      
      // Verificar se o herói foi criado
      cy.contains('Teste Hero').should('be.visible');
      cy.contains('Custom').should('be.visible');
    });

    it('should edit a custom hero', () => {
      // Primeiro criar um herói
      cy.contains('+ Criar Herói').click();
      cy.get('input[placeholder*="Digite o nome do herói"]').type('Herói para Editar');
      cy.get('textarea[placeholder*="Digite a descrição"]').type('Descrição original');
      cy.get('input[placeholder*="https://exemplo.com/imagem"]').type('https://via.placeholder.com/300x450');
      cy.contains('button', 'Salvar').click();
      
      // Editar o herói
      cy.contains('Herói para Editar').parent().parent().within(() => {
        cy.contains('button', 'Editar').click();
      });
      
      cy.contains('Editar Herói').should('be.visible');
      cy.get('input[value="Herói para Editar"]').clear().type('Herói Editado');
      cy.get('textarea').clear().type('Descrição editada');
      cy.contains('button', 'Salvar').click();
      
      // Verificar se foi editado
      cy.contains('Herói Editado').should('be.visible');
      cy.contains('Descrição editada').should('be.visible');
    });

    it('should delete a custom hero', () => {
      // Primeiro criar um herói
      cy.contains('+ Criar Herói').click();
      cy.get('input[placeholder*="Digite o nome do herói"]').type('Herói para Deletar');
      cy.get('textarea[placeholder*="Digite a descrição"]').type('Será deletado');
      cy.get('input[placeholder*="https://exemplo.com/imagem"]').type('https://via.placeholder.com/300x450');
      cy.contains('button', 'Salvar').click();
      
      // Verificar toast de criação
      cy.contains('Herói "Herói para Deletar" criado com sucesso!').should('be.visible');
      
      // Deletar o herói
      cy.contains('Herói para Deletar').parent().parent().within(() => {
        cy.contains('button', 'Excluir').click();
      });
      
      // Confirmar deleção no modal
      cy.get('[data-testid="delete-confirm-modal"]').should('be.visible');
      cy.get('[data-testid="confirm-delete"]').click();
      
      // Verificar toast de sucesso
      cy.contains('Herói "Herói para Deletar" excluído com sucesso!').should('be.visible');
      
      // Verificar se foi deletado
      cy.contains('Herói para Deletar').should('not.exist');
    });

    it('should create a copy of a Marvel hero', () => {
      cy.wait(3000); // Aguardar carregamento da API
      
      // Clicar em "Criar Cópia" do primeiro herói Marvel
      cy.get('[data-testid="hero-card"]').first().within(() => {
        cy.contains('button', 'Criar Cópia').click();
      });
      
      // Verificar toast de sucesso da cópia
      cy.contains('Cópia do herói').should('be.visible');
      cy.contains('criada com sucesso!').should('be.visible');
      
      // Aguardar um pouco e verificar se apareceu um herói com "(Cópia)"
      cy.wait(1000);
      cy.contains('(Cópia)').should('be.visible');
    });
  });

  describe('Hero Details', () => {
    it('should show hero details when clicking "Ver Detalhes"', () => {
      cy.wait(3000); // Aguardar carregamento da API
      
      cy.get('[data-testid="hero-card"]').first().within(() => {
        cy.contains('button', 'Ver Detalhes').click();
      });
      
      // Verificar se o modal de detalhes abriu
      cy.get('.modal').should('be.visible');
      cy.get('.modal-body').should('contain', 'Descrição');
      cy.get('.modal-body').should('contain', 'Estatísticas');
      cy.get('.modal-body').should('contain', 'Comics');
      cy.get('.modal-body').should('contain', 'Séries');
      cy.get('.modal-body').should('contain', 'Histórias');
    });

    it('should close hero details modal', () => {
      cy.wait(3000); // Aguardar carregamento da API
      
      cy.get('[data-testid="hero-card"]').first().within(() => {
        cy.contains('button', 'Ver Detalhes').click();
      });
      
      // Fechar modal
      cy.get('.modal .btn-close').click();
      cy.get('.modal').should('not.exist');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty form', () => {
      cy.contains('+ Criar Herói').click();
      cy.contains('button', 'Salvar').click();
      
      cy.contains('Nome é obrigatório').should('be.visible');
      cy.contains('Descrição é obrigatória').should('be.visible');
      cy.contains('URL da imagem é obrigatória').should('be.visible');
    });

    // it('should validate URL format', () => {
    //   cy.contains('+ Criar Herói').click();
    //
    //   cy.get('input[placeholder*="Digite o nome do herói"]').type('Test');
    //   cy.get('textarea[placeholder*="Digite a descrição"]').type('Test');
    //   cy.get('input[placeholder*="https://exemplo.com/imagem"]').type('invalid-url');
    //
    //   cy.contains('button', 'Salvar').click();
    //   cy.contains('URL da imagem deve ser válida').should('be.visible');
    // });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      cy.wait(3000);
      cy.get('[data-testid="hero-card"]').should('be.visible');
      cy.contains('+ Criar Herói').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2');
      
      cy.wait(3000);
      cy.get('[data-testid="hero-card"]').should('be.visible');
      cy.contains('+ Criar Herói').should('be.visible');
    });
  });

  describe('Load More Functionality', () => {
    it('should load more heroes when clicking "Carregar Mais"', () => {
      cy.wait(3000); // Aguardar carregamento inicial
      
      const initialCount = Cypress.$('[data-testid="hero-card"]').length;
      
      cy.contains('button', 'Carregar Mais Heróis').should('be.visible').click();
      cy.wait(2000);
      
      cy.get('[data-testid="hero-card"]').should('have.length.greaterThan', initialCount);
    });
  });
}); 