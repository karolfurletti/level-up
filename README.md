# 🦸‍♂️ Level Up Marvel

Um aplicativo web moderno para gerenciar e explorar heróis da Marvel, construído com React, TypeScript e Vite.

![Marvel Heroes App](public/vite.svg)

## 📋 Sobre o Projeto

O **Level Up Marvel** é uma aplicação que permite aos usuários:

- 🔍 **Pesquisar heróis** da Marvel usando a API oficial
- 📋 **Visualizar informações detalhadas** de cada herói
- ✏️ **Criar heróis customizados** com informações personalizadas
- 📝 **Editar e excluir** heróis criados pelo usuário
- 🎨 **Interface moderna** e responsiva com Bootstrap

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca para construção da interface
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **React Bootstrap** - Componentes de UI baseados no Bootstrap
- **Bootstrap 5** - Framework CSS para design responsivo
- **Axios** - Cliente HTTP para requisições à API
- **Crypto-JS** - Biblioteca para criptografia (autenticação Marvel API)

### API Externa
- **Marvel Comics API** - API oficial da Marvel para dados dos heróis
- **localStorage** - Armazenamento local para heróis customizados

### Testes
- **Vitest** - Framework de testes unitários
- **@testing-library/react** - Utilitários para testes de componentes React
- **@testing-library/jest-dom** - Matchers customizados para DOM
- **Cypress** - Framework para testes end-to-end (E2E)

### Qualidade de Código
- **ESLint** - Linter para identificar problemas no código
- **TypeScript ESLint** - Regras específicas para TypeScript

## 🛠️ Funcionalidades

### ✅ Implementadas

- [x] **Listagem de heróis** da Marvel com paginação
- [x] **Busca por nome** de heróis
- [x] **Visualização de detalhes** em modal
- [x] **Criação de heróis customizados**
- [x] **Edição de heróis customizados**
- [x] **Exclusão de heróis customizados** com modal de confirmação
- [x] **Criação de cópias** de heróis da Marvel
- [x] **Interface responsiva** para mobile e desktop
- [x] **Tratamento de erros** e estados de loading
- [x] **Imagens com fallback** para heróis sem foto

### 🧪 Cobertura de Testes

- [x] **Testes unitários** para todos os componentes principais
- [x] **Testes de integração** para hooks customizados
- [x] **Testes de serviços** (localStorage e Marvel API)
- [x] **Testes E2E** para fluxos principais do usuário

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chave de API da Marvel (gratuita)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/level-up-marvel.git
cd level-up-marvel
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure a API da Marvel

1. Crie uma conta em [Marvel Developer Portal](https://developer.marvel.com/)
2. Obtenha suas chaves pública e privada
3. Atualize o arquivo `src/services/marvelApi.ts` com suas chaves:

```typescript
const PUBLIC_KEY = 'sua_chave_publica_aqui';
const PRIVATE_KEY = 'sua_chave_privada_aqui';
```

### 4. Execute o projeto

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173`

## 🧪 Executando os Testes

### Testes Unitários

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Testes E2E (Cypress)

```bash
# Abrir interface do Cypress
npm run cypress:open

# Executar testes em modo headless
npm run cypress:run
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── __tests__/       # Testes dos componentes
│   ├── HeroCard.tsx     # Card de exibição de herói
│   ├── HeroDetail.tsx   # Modal de detalhes do herói
│   ├── HeroForm.tsx     # Formulário de criação/edição
│   └── DeleteConfirmModal.tsx # Modal de confirmação de exclusão
├── hooks/               # Hooks customizados
│   └── useHeroes.ts     # Hook para gerenciar estado dos heróis
├── services/            # Serviços e APIs
│   ├── __tests__/       # Testes dos serviços
│   ├── marvelApi.ts     # Integração com Marvel API
│   └── localStorage.ts  # Gerenciamento do localStorage
├── App.tsx             # Componente principal
├── main.tsx            # Entrada da aplicação
└── setupTests.ts       # Configuração dos testes
```

## 🎨 Componentes Principais

### HeroCard
- Exibe informações básicas do herói
- Suporte a heróis da Marvel e customizados
- Actions: ver detalhes, editar/copiar, excluir

### HeroDetail
- Modal com informações completas do herói
- Exibe imagem, descrição e estatísticas
- Responsivo para diferentes tamanhos de tela

### HeroForm
- Formulário para criar/editar heróis customizados
- Validação de campos obrigatórios
- Preview de imagem

### DeleteConfirmModal
- Modal de confirmação para exclusão
- Substitui o alert nativo do browser
- Design consistente com o tema da aplicação

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa linter
- `npm run test` - Executa testes unitários
- `npm run test:ui` - Interface gráfica dos testes
- `npm run test:coverage` - Relatório de cobertura
- `npm run cypress:open` - Abre interface do Cypress
- `npm run cypress:run` - Executa testes E2E

## 🐛 Tratamento de Erros

- **Erro de rede**: Exibição de mensagem amigável com botão de retry
- **Herói não encontrado**: Placeholder com sugestões
- **Limite de API**: Informações sobre rate limiting
- **Imagens quebradas**: Fallback para placeholder padrão

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid responsivo**: Adapta quantidade de cards por linha
- **Modais responsivos**: Ajuste automático para diferentes telas
- **Touch friendly**: Botões e controles otimizados para touch

## 🎯 Próximos Passos

- [ ] Implementar sistema de favoritos
- [ ] Adicionar filtros por categoria (comics, series, events)
- [ ] Implementar ordenação personalizada
- [ ] Adicionar modo escuro
- [ ] Implementar PWA (Progressive Web App)
- [ ] Adicionar compartilhamento de heróis

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - seu.email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/level-up-marvel](https://github.com/seu-usuario/level-up-marvel)

---

**Data provided by Marvel. © 2024 Marvel**