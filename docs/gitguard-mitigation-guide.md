# Guia de mitigação do relatório GitGuard

## Resumo executivo

Este documento explica os 18 achados do relatório GitGuard gerado em
24 de agosto de 2026 e propõe ações para reduzir o risco. O relatório original
analisa o commit `cec1af800248`; portanto, resultados podem não representar o
estado atual da branch.

Os achados se concentram em três áreas:

- dependências transitivas vulneráveis;
- proteção da cadeia de suprimentos no GitHub Actions e Yarn;
- headers HTTP avaliados por análise estática.

Não há segredo exposto listado no relatório. Os dois itens de maior severidade
são `fast-uri` e `react-router`, mas o alcance de `react-router` é baixo no
frontend atual porque a aplicação usa `BrowserRouter` e não usa APIs RSC.

Prioridade recomendada:

1. Atualizar as árvores de dependências e regenerar os lockfiles.
2. Fixar GitHub Actions por SHA completo e limitar permissões do workflow.
3. Ativar o age gate do Yarn nos dois projetos.
4. Verificar os headers em execução antes de alterar o Helmet.
5. Reexecutar GitGuard, auditoria de dependências, typecheck, lint e build.

## Escopo e limitações

O relatório FREE não informa caminhos para todos os achados. Esta análise
correlaciona os resultados com o estado atual do repositório.

As versões observadas atualmente são:

| Pacote | Backend | Frontend | Origem |
|---|---:|---:|---|
| `fast-uri` | `3.1.3` | `3.1.4` | transitiva de `ajv` |
| `react-router` | não instalado | `7.18.2` | `react-router-dom` |
| `tar` | `7.5.20` | `7.5.20` | transitiva de `node-gyp` |
| `valibot` | `1.2.0` | não encontrado | transitiva de `@prisma/dev` |
| `@hono/node-server` | `1.19.11` | `2.0.12` | Prisma/MCP SDK |

Versões transitivas não devem ser atualizadas cegamente por `resolutions`.
Atualize primeiro o pacote pai. Use `resolutions` somente após confirmar
compatibilidade e registrar por que o override é seguro.

## Achados de dependências

### GG-01 — `fast-uri`

**Severidade do scanner:** alta.

**Evidência:** `backend/yarn.lock:1676` resolve `fast-uri@3.1.3` por meio de
`ajv@8.20.0`. `frontend/yarn.lock:2434` já resolve `3.1.4`, mas essa versão
também precisa ser comparada com o intervalo corrigido do advisory atual.

**Explicação:** falhas de normalização de URI podem produzir confusão entre
host, autoridade e caminho. O impacto depende de uma aplicação usar o parser
para tomar decisões de segurança sobre URLs não confiáveis. Neste projeto o
pacote é transitivo, então o alcance direto não foi demonstrado.

**Mitigação:**

1. Atualize `ajv` e os pacotes que o carregam.
2. Regenere cada `yarn.lock` com Yarn 4.
3. Execute `yarn why fast-uri` em backend e frontend.
4. Confirme que nenhuma versão instalada permanece no intervalo vulnerável.
5. Evite usar parsers transitivos para allowlists de URLs; use `URL` da
   plataforma e valide protocolo e hostname explicitamente.

**Validação:** execute `yarn npm audit --all --recursive` nos dois projetos e
reexecute o scanner.

### GG-02 — `react-router`

**Severidade do scanner:** alta.

**Evidência:** `frontend/package.json:27` declara `react-router-dom@^7.18.2` e
`frontend/yarn.lock:4042` resolve `react-router@7.18.2`.
`frontend/src/App.tsx:2` e `frontend/src/App.tsx:8` mostram uso de
`BrowserRouter`. Não foram encontrados imports de RSC, `ServerRouter` ou
server actions.

**Explicação:** advisory citado trata de bypass de CSRF em caminhos RSC
instáveis. O frontend atual é uma SPA Vite com roteamento no navegador. A
versão aparece no intervalo do scanner, mas o caminho vulnerável não está
visível no código atual. Isso reduz a explorabilidade, não elimina necessidade
de atualização.

**Mitigação:**

1. Confirme o intervalo corrigido no advisory oficial antes do upgrade; houve
   divergência entre metadados publicados para a linha 7.x.
2. Atualize `react-router-dom` e `react-router` juntos quando houver versão
   compatível e corrigida.
3. Não habilite APIs RSC instáveis enquanto a versão permanecer sinalizada.
4. Mantenha proteção CSRF independente no backend, pois autenticação usa
   cookies e o risco de CSRF da API não depende deste pacote.
5. Registre aceitação temporária de risco com data para nova revisão caso o
   upgrade ainda exija mudança principal.

**Validação:** execute build, lint e testes de navegação após o upgrade. Rode
novamente a auditoria do frontend.

### GG-03 — `tar`

**Severidade do scanner:** média.

**Evidência:** ambos os lockfiles resolvem `tar@7.5.20` por meio de
`node-gyp@13.0.1`.

**Explicação:** um arquivo TAR com caminho especialmente construído pode causar
recursão não controlada e encerramento por estouro de pilha. O pacote aparece
na cadeia de ferramentas nativas. A aplicação não possui caso de uso que
extraia TAR enviado por usuário, então alcance em produção parece baixo.

**Mitigação:**

1. Atualize `node-gyp` ou o pacote pai que o instala.
2. Não aceite nem extraia arquivos TAR não confiáveis na API.
3. Se uma extração futura for necessária, imponha limite de tamanho, número de
   entradas, profundidade de caminhos, tempo e memória em processo isolado.
4. Confirme remoção da versão com `yarn why tar`.

### GG-04 — `valibot`

**Severidade do scanner:** média.

**Evidência:** `backend/yarn.lock:2882` resolve `valibot@1.2.0` por meio de
`@prisma/dev@0.24.3`.

**Explicação:** nomes herdados de propriedades podem fazer `flatten()` lançar
uma exceção ao processar erros de `record()`. O backend usa Zod para entrada da
API; não há uso direto de Valibot. A exposição é principalmente da ferramenta
Prisma, não das rotas Express.

**Mitigação:**

1. Atualize `prisma`, `@prisma/client` e `@prisma/adapter-pg` em conjunto.
2. Regenere o Prisma Client.
3. Execute migrations somente após revisar o diff gerado.
4. Confirme a árvore com `yarn why valibot`.

Não adicione Valibot como dependência direta apenas para controlar sua versão.

### GG-05 — `@hono/node-server`

**Severidade do scanner:** média.

**Evidência:** backend resolve `1.19.11` por meio de `@prisma/dev`. Frontend já
resolve `2.0.12`. O advisory de repetição de barras corrige a linha 1.x em
`1.19.13`; o advisory de backslash codificada indica correção oficial em
`2.0.5`.

**Explicação:** falhas em `serveStatic` podem permitir bypass de middleware ou
path traversal. AMS usa Express e não chama `@hono/node-server` nem
`serveStatic` diretamente. O pacote está na cadeia do Prisma, então o caminho
vulnerável não parece alcançável no servidor de produção atual.

**Mitigação:**

1. Atualize a família Prisma para uma versão que aceite Hono `2.0.5` ou maior.
2. Não force uma atualização principal transitiva sem testar Prisma CLI,
   geração, migrations e build.
3. Mantenha ferramentas de desenvolvimento fora do artefato de produção
   quando a plataforma permitir.
4. Confirme que `serveStatic` não foi introduzido no backend.
5. Documente aceitação temporária se o pacote pai ainda bloquear a correção.

## Achados de cadeia de suprimentos

### GG-06 — GitHub Actions referenciadas por tags mutáveis

**Severidade do scanner:** média.

**Evidência:** `.github/workflows/backend.yml:27`,
`.github/workflows/backend.yml:30`, `.github/workflows/frontend.yml:27` e
`.github/workflows/frontend.yml:30` usam `actions/checkout@v4` e
`actions/setup-node@v4`.

**Explicação:** tags podem ser movidas. Se uma action ou sua conta for
comprometida, workflow pode executar código diferente do revisado e acessar
tokens ou segredos de deploy.

**Mitigação:**

1. Resolva cada tag para o SHA completo do commit oficial.
2. Preserve a versão em comentário para facilitar atualização:

   ```yaml
   uses: actions/checkout@<sha-completo> # v4
   ```

3. Adicione `permissions: contents: read` no nível do workflow ou job.
4. Habilite política do repositório que exige actions fixadas por SHA.
5. Configure Dependabot para atualizar GitHub Actions.

O SHA deve vir do repositório oficial da action. Não copie SHA de fork ou fonte
não verificada.

### GG-07 — Yarn sem janela mínima segura

**Severidade do scanner:** média.

**Evidência:** `backend/.yarnrc.yml:8` define `npmMinimalAgeGate: 0`; o frontend
não define política explícita.

**Explicação:** versões recém-publicadas podem ser instaladas antes de a
comunidade detectar comprometimento, typosquatting ou publicação maliciosa.

**Mitigação:** configure a mesma política nos dois arquivos:

```yaml
npmMinimalAgeGate: 1d
```

Para postura mais conservadora, use `3d` ou `1w`. Adicione exceções estreitas
em `npmPreapprovedPackages` somente quando uma correção urgente precisar furar
a janela. Mantenha `yarn install --immutable` no CI e habilite Hardened Mode em
ao menos um job de pull request.

O backend também possui `approvedGitRepositories: ["**"]` e
`enableScripts: true`. Restrinja repositórios Git a origens necessárias e
avalie scripts de instalação por pacote para reduzir risco adicional.

## Achados de headers HTTP

### GG-08 — Alertas do Helmet

**Severidade do scanner:** baixa.

**Evidência:** `backend/src/app.ts:22` executa `app.use(helmet())` antes das
rotas. O relatório sinaliza HSTS, `nosniff`, `X-Powered-By`, XSS Filter,
DNS prefetch e headers legados sem fornecer localização.

**Explicação:** vários alertas provavelmente são falsos positivos da análise
estática. `helmet()` configura headers seguros por padrão, mas o scanner pode
procurar chamadas individuais. Alguns headers antigos, como
`X-XSS-Protection`, não devem ser ativados cegamente; políticas modernas podem
desabilitá-los deliberadamente.

**Mitigação:**

1. Verifique os headers na resposta implantada, não apenas no código.
2. Adicione `app.disable("x-powered-by")` para tornar intenção explícita.
3. Confirme `X-Content-Type-Options: nosniff`, proteção de framing,
   `Referrer-Policy` e CSP adequada.
4. Configure HSTS somente após confirmar HTTPS em todos os subdomínios e
   entender impacto de cache do navegador.
5. Não adicione `X-XSS-Protection: 1`; navegadores modernos usam CSP e o valor
   legado pode criar comportamento inseguro.
6. Registre no scanner quais regras são cobertas por `helmet()` e aceite apenas
   falsos positivos comprovados por teste de runtime.

Exemplo de verificação local:

```bash
curl -I http://localhost:3000/health
```

Repita contra URL HTTPS de produção para validar HSTS e comportamento do proxy.

## Plano de execução

### Fase 1 — Correções de alta prioridade

1. Crie branch dedicada para atualização de dependências.
2. Atualize pacotes pais de `fast-uri`, `tar`, Valibot e Hono.
3. Atualize React Router após confirmar versão corrigida e compatibilidade.
4. Regenere e revise `backend/yarn.lock` e `frontend/yarn.lock`.
5. Fixe actions por SHA e reduza `GITHUB_TOKEN` para `contents: read`.

### Fase 2 — Endurecimento de instalação e headers

1. Defina `npmMinimalAgeGate` nos dois projetos.
2. Restrinja `approvedGitRepositories` e scripts de instalação.
3. Teste headers HTTP em desenvolvimento e produção.
4. Documente exceções e riscos aceitos com proprietário e data de revisão.

### Fase 3 — Validação

Execute no backend:

```bash
yarn install --immutable
yarn npm audit --all --recursive
yarn prisma generate
yarn typecheck
yarn build
```

Execute no frontend:

```bash
yarn install --immutable
yarn npm audit --all --recursive
yarn lint
yarn build
```

Depois:

1. Reexecute GitGuard na branch atualizada.
2. Compare findings por ID e pacote.
3. Teste login, refresh, upload, download, preview e CRUD de projetos.
4. Confirme que cookies, CORS e headers continuam corretos em produção.

## Critérios de conclusão

Considere mitigação concluída quando:

- lockfiles não contiverem versões vulneráveis, ou houver aceitação de risco
  documentada para dependência transitiva sem correção alcançável;
- workflows usarem SHAs completos e permissões mínimas;
- ambos os projetos aplicarem age gate do Yarn;
- headers forem confirmados por teste de runtime;
- typecheck, lint, build e fluxos críticos passarem;
- novo scan não apresentar achados sem triagem.

## Referências

- [Relatório GitGuard original](./gitguard-report-teuaraujoo-asset-management-ryp6enid.md)
- [GitHub: uso seguro de Actions](https://docs.github.com/en/actions/reference/security/secure-use)
- [Yarn: configurações de segurança](https://yarnpkg.com/features/security)
- [Yarn: `npmMinimalAgeGate`](https://yarnpkg.com/configuration/yarnrc/#npmMinimalAgeGate)
- [GitHub Advisory: React Router](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)
- [GitHub Advisory: Hono repeated slashes](https://github.com/advisories/GHSA-92pp-h63x-v22m)
- [GitHub Advisory: Valibot](https://github.com/advisories/GHSA-5qjj-4xww-7phc)
