# 🎬 Angular Movie App

Uma aplicação web moderna e responsiva para exploração de catálogo de filmes, construída com Angular. O sistema consome a API do TMDB (The Movie Database) e utiliza o Firebase Firestore para gerenciar o catálogo pessoal de favoritos do usuário em tempo real.

## ✨ Funcionalidades

* **Catálogo e Busca Inteligente:** Listagem de filmes populares e busca reativa por título, utilizando *debounce time* para otimização das chamadas à API.
* **Infinite Scroll:** Paginação contínua e fluida integrada diretamente na rolagem da página inicial.
* **Detalhes e Trailers:** Visualização imersiva dos dados do filme, com reprodução de trailers via modal. Conta com um algoritmo inteligente de fallback de idioma (busca trailers em `pt-BR` e, se indisponível, faz o fallback automático para `en-US`).
* **Favoritos em Tempo Real:** Sistema de favoritar filmes atrelado à sessão do usuário. Sincronização em tempo real utilizando Firebase Firestore.
* **Rotas Protegidas:** Controle de acesso via `AuthGuard`. Usuários não autenticados são redirecionados automaticamente ao tentar acessar a área de favoritos.
* **UX/UI Avançada:** Interface estilizada com Tailwind CSS, incluindo *Skeleton Loaders* para feedback imediato durante o processamento (imitando plataformas de streaming reais).

## 🚀 Tecnologias e Arquitetura

O projeto foi construído empregando as mais recentes diretrizes e ferramentas do ecossistema Angular:

* **Angular (v17+)**: 
  * Reatividade moderna baseada em **Signals**.
  * Arquitetura 100% **Standalone Components** (sem ngModules).
  * Nova sintaxe de **Control Flow** (`@if`, `@for`, `@empty`).
  * **Lazy Loading de Rotas** (`loadComponent`) para otimização do *bundle* inicial e performance.
  * **HttpInterceptor (Functional)** para injeção centralizada e segura de Tokens de API.
* **RxJS:** Tratamento de assincronismo e prevenção de *callback hell* utilizando operadores avançados (`switchMap`, `debounceTime`, `distinctUntilChanged`, `forkJoin`).
* **Firebase (AngularFire):** Banco de dados NoSQL estruturado em documentos com persistência reativa (Data Streams).
* **Tailwind CSS:** Estilização utilitária para design responsivo e efeitos visuais (Backdrop blur, gradientes, pulse animations).
* **ngx-bootstrap:** Gerenciamento seguro de Modais (Player de Vídeo).

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
* [Angular CLI](https://angular.io/cli)

## 🔧 Configuração e Instalação

**1. Clone o repositório**
```bash
git clone [https://github.com/SEU-USUARIO/nome-do-repositorio.git](https://github.com/SEU-USUARIO/nome-do-repositorio.git)
cd nome-do-repositorio
**2. Instale as dependências**

Bash
npm install
3. Configure as Variáveis de Ambiente
Abra o arquivo src/environments/environment.ts (ou crie-o) e adicione suas chaves de API do TMDB e as credenciais do seu projeto Firebase:

TypeScript
export const environment = {
  production: false,
  tmdbBaseUrl: '[https://api.themoviedb.org/3](https://api.themoviedb.org/3)',
  tokenApi: 'SEU_BEARER_TOKEN_DO_TMDB_AQUI',
  firebaseConfig: {
    apiKey: "SUA_API_KEY_FIREBASE",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
  }

4. Execute o servidor de desenvolvimento

Bash
ng serve
Acesse http://localhost:4200/ no seu navegador. O aplicativo será recarregado automaticamente se você alterar qualquer um dos arquivos fonte.

👨‍💻 Autor
Paulo Henrique da Silva Pereira

LinkedIn

GitHub