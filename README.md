# AMS - Asset Management System

> Sistema privado de gerenciamento de assets (imagens e vídeos) para projetos pessoais e de portfólio.

O **AMS (Asset Management System)** é uma API REST desenvolvida para centralizar o armazenamento e gerenciamento de arquivos utilizados em projetos pessoais. Seu principal objetivo é servir como uma camada intermediária entre aplicações clientes e o provedor de armazenamento, permitindo que os assets sejam consumidos de forma segura por meio de URLs temporárias (Presigned URLs), sem expor diretamente a infraestrutura de armazenamento.

Inicialmente o sistema será utilizado para armazenar capturas de tela, imagens e vídeos de projetos concluídos, enquanto aplicações como meu portfólio consumirão a API para exibir esses conteúdos.

---

# Funcionalidades

- Autenticação com JWT
- Access Token + Refresh Token
- Gerenciamento de projetos
- Gerenciamento de pastas
- Upload de imagens e vídeos
- Download via Presigned URL
- Exclusão de arquivos
- Organização de assets por projeto
- Validação de MIME Type
- Validação de extensão
- Validação de tamanho do arquivo
- Armazenamento de metadados no PostgreSQL
- Armazenamento de arquivos no Cloudflare R2

---

# Arquitetura

O projeto utiliza **Layered Architecture**, separando responsabilidades entre camadas.

```
Client

    │

    ▼

Controllers

    │

    ▼

Services

    │

    ├────────────► Storage Service
    │                    │
    │                    ▼
    │             Cloudflare R2
    │
    ▼

Repositories

    │

    ▼

PostgreSQL
```

### Responsabilidades

**Controllers**

- Recebem requisições HTTP
- Chamam os Services
- Retornam respostas HTTP

**Services**

- Contêm toda regra de negócio
- Validações
- Geração de Slugs
- Geração de Presigned URLs
- Integração entre serviços

**Repositories**

- Comunicação com PostgreSQL

**Storage Service**

- Comunicação com Cloudflare R2

---

# 🛠 Tecnologias

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Cloudflare R2
- AWS SDK v3 (S3 Compatible)
- JWT
- Zod
- Bcrypt

## Frontend

- React
- TailwindCSS
- shadcn/ui
- TypeScript

---

# 📂 Estrutura do Projeto

```
asset-management/

├── backend/
│
├── frontend/
│
├── .github/
│
├── docs/
│
├── AGENTS.md
│
└── README.md
```

---

# Executando o projeto

## Clone o repositório

```bash
git clone https://github.com/seu-usuario/asset-management.git

cd asset-management
```

---

# Backend

Entre na pasta

```bash
cd backend
```

Instale as dependências

```bash
yarn install
```

Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Gere o Prisma Client

```bash
yarn prisma generate
```

Execute as migrations

```bash
yarn prisma migrate dev
```

Inicie o servidor

```bash
yarn dev
```

Servidor

```
http://localhost:3000
```

---

# Frontend

Entre na pasta

```bash
cd frontend
```

Instale as dependências

```bash
yarn install
```

Configure o ambiente

```bash
cp .env.example .env.local
```

Execute

```bash
yarn dev
```

Aplicação

```
http://localhost:5172
```

---

# Scripts

## Backend

```bash
yarn dev
```

Inicia o servidor em desenvolvimento

```bash
yarn build
```

Build da aplicação

```bash
yarn start
```

Executa a aplicação compilada

```bash
yarn prisma generate
```

Gera o Prisma Client

```bash
yarn prisma migrate dev
```

Executa migrations

```bash
yarn typecheck
```

Validação do TypeScript

---

## Frontend

```bash
yarn dev
```

Desenvolvimento

```bash
yarn build
```

Build

```bash
yarn start
```

Produção

---

# Fluxo de Upload

```
Dashboard

↓

API

↓

Validação

↓

Presigned URL

↓

Cloudflare R2

↓

Persistência dos Metadados

↓

PostgreSQL
```

O arquivo **nunca passa pela API**.

A API apenas gera uma URL temporária e salva os metadados.

---

# Fluxo de Download

```
Frontend

↓

API

↓

Busca dos Metadados

↓

Storage Service

↓

Presigned URL

↓

Cloudflare R2
```

Os arquivos são acessados apenas através de **Presigned URLs**.

---

# Infraestrutura

| Serviço | Responsabilidade |
|----------|------------------|
| PostgreSQL (Neon) | Metadados |
| Cloudflare R2 | Arquivos |
| Render | Deploy Backend |
| Netlify | Deploy Frontend |
| GitHub Actions | CI/CD |

---

# Documentação

A documentação completa do projeto está disponível em:

- [Documentação Completa AMS](docs/AMS%20(Asset%20Managment%20System).md)

---

# 🤝 Contribuição

Este é um projeto pessoal desenvolvido com foco em aprendizado de arquitetura de software, armazenamento de objetos, APIs REST e boas práticas de engenharia de software.

Sugestões e melhorias são sempre bem-vindas.

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT.