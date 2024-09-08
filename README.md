# Gerenciamento de Tarefas

Este projeto é uma aplicação de gerenciamento de tarefas, onde os usuários podem criar, editar e visualizar tarefas, além de gerenciar seus perfis pessoais. A aplicação possui um front-end construído com React e um back-end desenvolvido em Node.js com Express, Prisma e SQLite para persistência de dados.

## Funcionalidades

- **Autenticação de Usuário**: Login e registro com JWT.
- **Gerenciamento de Tarefas**: Criação, visualização, edição e exclusão de tarefas.
- **Proteção de Rotas**: Rotas protegidas com middleware de autenticação JWT.
- **Perfil de Usuário**: Visualização e atualização de perfil.
- **Geração de PDF**: Geração de um arquivo PDF contendo todas as tarefas do usuário.
- **Paginação**: Tarefas são listadas com suporte a paginação.

## Tecnologias Utilizadas

### Front-end:

- **React** com **TypeScript**
- **Axios** para requisições HTTP
- **React Router DOM** para navegação
- **Tailwind CSS** para estilização

### Back-end:

- **Node.js** e **Express.js**
- **Prisma** como ORM
- **SQLite** para o banco de dados
- **JWT** para autenticação

## Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js** para o back end
- **npm** para gerenciar pacotes

## Instalação

### Clonar o repositório:

```bash
git clone https://github.com/Gabrieel-Santos/gerenciamento_tarefas
cd gerenciamento_tarefas
```

### Instalar dependências:

No diretório raiz, rode o seguinte comando para instalar todas as dependências do front-end e back-end:

```bash
npm install
```

### Rodar o Back-end:

No diretório raiz, execute o seguinte comando para iniciar o servidor do back-end:

```bash
node server.js
```

### Rodar o Front-end:

No diretório raiz, execute o seguinte comando para iniciar o servidor de desenvolvimento do front-end:

```bash
npm run dev
```

**Importante:** Execute o front-end e o back-end em terminais separados.

## Arquivo `.env`

Para facilitar a configuração do projeto, o arquivo `.env` com as variáveis necessárias foi incluído no repositório. **Lembre-se:** Em projetos reais, não é recomendável incluir o `.env` no repositório público, pois ele contém informações sensíveis, como a chave JWT e os detalhes do banco de dados.

## Endpoints da API

### Autenticação de Usuário:

- **POST /register**: Registro de um novo usuário.
- **POST /login**: Autenticação de usuário e geração de token JWT.
- **GET /profile**: Obtém o perfil do usuário autenticado.
- **PATCH /profile**: Atualiza o perfil do usuário autenticado.

### Gerenciamento de Tarefas:

- **POST /tasks**: Criação de uma nova tarefa (autenticado).
- **GET /tasks**: Listagem de tarefas com paginação (autenticado).
- **GET /tasks/all**: Listagem de todas as tarefas para exportação em PDF (autenticado).
- **GET /tasks/:id**: Busca uma tarefa específica pelo ID (autenticado).
- **PATCH /tasks/:id**: Atualiza uma tarefa específica (autenticado).
- **DELETE /tasks/:id**: Exclui uma tarefa específica (autenticado).

## Decisões de Desenvolvimento

### Front-end:

- **TypeScript** foi utilizado para garantir maior segurança no código e facilitar a manutenção.
- **Axios** foi escolhido para lidar com requisições HTTP devido à simplicidade e eficiência.
- **React Router** foi utilizado para navegação entre páginas e controle de rotas protegidas.
- **JWT** foi utilizado para autenticação e autorização, armazenando o token no `localStorage` e utilizando-o para proteger as rotas no front-end.

### Back-end:

- **Prisma ORM** foi escolhido para gerenciar o banco de dados devido à sua integração simples com SQLite e facilidade de uso.
- **JWT** foi escolhido para autenticação segura, com geração de tokens no login e proteção de rotas no back-end.

## Melhorias Futuras

- **Validação de Formulários**: Implementar bibliotecas como Yup ou Zod para melhorar a validação de dados no front-end, garantindo que os inputs dos usuários sejam validados antes do envio para o back-end.
- **Testes Unitários e de Integração**: Adicionar testes tanto no front-end quanto no back-end para garantir a qualidade e o bom funcionamento da aplicação.
- **Melhorar Experiência de Usuário (UX)**: Adicionar feedback visual mais detalhado, como carregamentos, notificações de sucesso ou erro, e animações suaves para melhorar a experiência de uso.
- **Armazenamento Seguro do Token**: Implementar uma abordagem mais segura para o armazenamento de tokens JWT, como o uso de cookies HTTP-only em vez de `localStorage`.
