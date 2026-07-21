# AGENTS.md

# AMS - Asset Management System

## Project Overview

AMS (Asset Management System) é uma API REST privada responsável pelo armazenamento e gerenciamento de assets utilizados em projetos pessoais e de portfólio.

O sistema centraliza o armazenamento de imagens e vídeos, mantendo apenas seus metadados no banco de dados enquanto os arquivos físicos permanecem armazenados no Cloudflare R2.

Nenhuma aplicação cliente conhece diretamente o provedor de armazenamento.

Toda comunicação acontece através da API.

---

# Objetivos

- Centralizar assets de projetos pessoais.
- Desacoplar aplicações do provedor de armazenamento.
- Gerar URLs temporárias para upload e download.
- Armazenar apenas metadados no PostgreSQL.
- Seguir princípios SOLID e Clean Code.
- Possuir arquitetura em camadas.

---

# Stack

## Backend

- Node.js
- Express
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Cloudflare R2
- AWS SDK v3 (S3 Compatible)
- JWT
- Zod
- Bcrypt

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui

---

# Architecture

O projeto utiliza Layered Architecture.

```
Controllers
        ↓
Services
        ↓
Repositories
        ↓
Database

                ↓

        Storage Service
                ↓

        Cloudflare R2
```

Responsabilidades:

## Controllers

Responsáveis apenas por HTTP.

Nunca colocar regras de negócio.

Responsáveis por:

- Request
- Response
- Status Code
- Chamada dos Services

---

## Services

Contêm toda regra de negócio.

Responsáveis por:

- validações
- autorização
- integração entre serviços
- geração de slug
- geração de object key
- geração de presigned urls
- validação de arquivos
- manipulação de projetos

Nunca acessar req/res.

---

## Repository

Responsável apenas pela persistência.

Não contém regras de negócio.

Apenas:

- create
- update
- delete
- find
- exists

---

## Storage Service

Único responsável pela comunicação com o Cloudflare R2.

Funções:

- generateUploadUrl()
- generateDownloadUrl()
- deleteObject()
- copyObject()
- moveObject()

Nunca acessar banco de dados.

---

# Domain

Entidades principais

- User
- RefreshToken
- Project
- Folder
- File

---

# Banco de Dados

O PostgreSQL armazena apenas metadados.

Nunca salvar arquivos binários.

Exemplos:

- nome
- slug
- object_key
- mime_type
- extensão
- tamanho
- checksum
- timestamps

---

# Cloudflare R2

O R2 armazena exclusivamente os arquivos.

Nunca salvar informações de negócio.

Os arquivos são acessados exclusivamente através de Presigned URLs.

Nunca expor URLs permanentes.

---

# Upload Flow

1. Usuário envia metadados.
2. API valida usuário.
3. API valida projeto.
4. API valida arquivo.
5. Storage Service gera Upload URL.
6. Cliente envia arquivo diretamente para o R2.
7. API salva metadados.
8. API retorna sucesso.

O arquivo nunca passa pela API.

---

# Download Flow

1. Cliente solicita arquivo.
2. API valida usuário.
3. Busca metadados.
4. Storage Service gera Download URL.
5. API retorna URL temporária.
6. Cliente consome diretamente do R2.

---

# Regras de Arquivos

Sempre validar:

- MIME Type
- extensão
- tamanho
- checksum

Nunca confiar apenas na extensão.

Sempre validar MIME Type.

---

# Nome dos Arquivos

Nunca utilizar o nome original como identificador.

Utilizar:

UUID + extensão

Exemplo

```
6b4a70f2-a3d8.webp
```

O nome original é apenas informativo.

---

# Organização dos Arquivos

Estrutura padrão

```
projects/

    meu-projeto/

        imagens/

        videos/

        assets/
```

A object key deve sempre seguir essa estrutura.

---

# Convenções

## Services

Sempre terminar com:

```
ProjectService
FileService
FolderService
StorageService
```

---

## Repository

Sempre terminar com:

```
ProjectRepository
FileRepository
FolderRepository
```

---

## Controllers

Sempre terminar com:

```
ProjectController
FileController
AuthController
```

---

# Rotas

Prefixo obrigatório

```
/api/v1
```

Separar recursos por domínio.

Exemplo

```
/auth
/projects
/files
/folders
/users
```

---

# Validação

Toda entrada externa deve utilizar Zod.

Nunca confiar em dados vindos do cliente.

---

# Autenticação

JWT

Cookies HttpOnly

Access Token

Refresh Token

Nunca armazenar Access Token em banco.

Refresh Tokens devem ser persistidos.

---

# Cloudflare R2

Sempre utilizar Presigned URLs.

Nunca enviar arquivos através da API.

---

# Clean Code

Sempre:

- funções pequenas
- responsabilidade única
- nomes descritivos
- tipagem explícita
- tratamento de erros
- retornos previsíveis

---

# O que NÃO fazer

❌ Colocar regra de negócio nos Controllers

❌ Acessar banco diretamente pelos Controllers

❌ Gerar SQL dentro dos Services

❌ Salvar arquivos no PostgreSQL

❌ Expor URLs permanentes do R2

❌ Utilizar any

❌ Ignorar validações do Zod

❌ Duplicar lógica entre Services

---

# O que sempre fazer

✅ Criar funções reutilizáveis

✅ Manter Services desacoplados

✅ Utilizar Repository Pattern

✅ Utilizar Dependency Injection quando possível

✅ Validar toda entrada

✅ Escrever código tipado

✅ Seguir a arquitetura existente

---

# Padrão esperado

Sempre que uma IA gerar código para este projeto ela deve:

1. Respeitar a arquitetura em camadas.

2. Não quebrar a separação de responsabilidades.

3. Utilizar TypeScript estritamente tipado.

4. Seguir os padrões já existentes.

5. Priorizar legibilidade em vez de reduzir linhas de código.

6. Não introduzir dependências sem necessidade.

7. Explicar decisões arquiteturais quando criar código novo.