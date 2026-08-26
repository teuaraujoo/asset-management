> 🔒 **Localização e sugestão de correção disponíveis no PROguard.** Este relatório FREE mostra o que foi encontrado, não onde nem como corrigir.

# Relatório de Segurança — teuaraujoo/asset-management

**Scan:** `cmt7kywy3007d10d7ryp6enid` · MANUAL · branch `main` · commit `cec1af800248`
**Status:** COMPLETED · **Executado em:** 2026-08-24T18:39:44.928Z · **Concluído em:** 2026-08-24T18:42:01.261Z
**Relatório gerado em:** 2026-08-24T18:45:20.952Z por GitGuard

## Instruções para a IA que for corrigir isto

- Repositório alvo: teuaraujoo/asset-management, branch "main", commit cec1af8002487f0752fce84efd80ff18f8468d96. Aplique as correções diretamente nesse checkout.
- Em "dependencyUpgrades", cada entrada agrupa TODOS os CVEs de um mesmo pacote — faça UM upgrade por pacote (para "recommendedVersion" ou mais recente), não uma correção por CVE.
- Em "secrets", nunca tente adivinhar ou reconstruir o valor original do segredo (ele foi propositalmente redigido) — apenas remova/rotacione conforme "remediation".
- Depois de aplicar as correções, rode os testes existentes do projeto e, se disponível, o linter/build antes de considerar concluído.

## Resumo

- **Total de findings:** 18
- **Por severidade:** HIGH: 2 · MEDIUM: 10 · LOW: 6
- **Por scanner:** TRIVY: 6 · SEMGREP: 12

## Dependências para atualizar

### 📦 `fast-uri` (1 CVE) — severidade máxima: HIGH

**Ação recomendada:** atualizar de `3.1.3` para `a versão mais recente` (ou superior).

| Severidade | CVE | Descrição | Corrigido em |
|---|---|---|---|
| HIGH | CVE-2026-16221 | Impact: fast-uri versions from 2.3.1 through 4.1.0 (including the 3.x  ... | — |

### 📦 `react-router` (1 CVE) — severidade máxima: HIGH

**Ação recomendada:** atualizar de `7.18.2` para `a versão mais recente` (ou superior).

| Severidade | CVE | Descrição | Corrigido em |
|---|---|---|---|
| HIGH | — | React Router: RSC Mode CSRF Bypass Allows Action Execution Before 400 Response | — |

### 📦 `tar` (1 CVE) — severidade máxima: MEDIUM

**Ação recomendada:** atualizar de `7.5.20` para `a versão mais recente` (ou superior).

| Severidade | CVE | Descrição | Corrigido em |
|---|---|---|---|
| MEDIUM | — | node-tar: Uncontrolled recursion in mapHas/filesFilter allows uncatchable stack-overflow DoS via crafted long-path tar with member selection | — |

### 📦 `valibot` (1 CVE) — severidade máxima: MEDIUM

**Ação recomendada:** atualizar de `1.2.0` para `a versão mais recente` (ou superior).

| Severidade | CVE | Descrição | Corrigido em |
|---|---|---|---|
| MEDIUM | CVE-2026-59952 | Valibot: record() issue paths can make flatten() throw for inherited Object property names | — |

### 📦 `@hono/node-server` (2 CVEs) — severidade máxima: MEDIUM

**Ação recomendada:** atualizar de `1.19.11` para `a versão mais recente` (ou superior).

| Severidade | CVE | Descrição | Corrigido em |
|---|---|---|---|
| MEDIUM | CVE-2026-39406 | @hono/node-server: Middleware bypass via repeated slashes in serveStatic | — |
| MEDIUM | — | Node.js Adapter for Hono: Path traversal in `serve-static` on Windows via encoded backslash (`%5C`) | — |

## Outros findings

| Severidade | Scanner | Categoria | Título | Local |
|---|---|---|---|---|
| MEDIUM | SEMGREP | SAST | Semgrep Finding: rules.yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag | — |
| MEDIUM | SEMGREP | SAST | Semgrep Finding: rules.yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag | — |
| MEDIUM | SEMGREP | SAST | Semgrep Finding: rules.yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag | — |
| MEDIUM | SEMGREP | SAST | Semgrep Finding: rules.yaml.github-actions.security.github-actions-mutable-action-tag.github-actions-mutable-action-tag | — |
| MEDIUM | SEMGREP | SAST | Semgrep Finding: rules.package_managers.yarn.yarn-missing-minimal-age-gate.yarn-missing-minimal-age-gate | — |
| MEDIUM | SEMGREP | SAST | Semgrep Finding: rules.package_managers.yarn.yarn-missing-minimal-age-gate.yarn-missing-minimal-age-gate | — |
| LOW | SEMGREP | SAST | Semgrep Finding: rules.ajinabraham.njsscan.good.good_helmet_checks.helmet_header_hsts | — |
| LOW | SEMGREP | SAST | Semgrep Finding: rules.ajinabraham.njsscan.good.good_helmet_checks.helmet_header_nosniff | — |
| LOW | SEMGREP | SAST | Semgrep Finding: rules.ajinabraham.njsscan.good.good_helmet_checks.helmet_header_ienoopen | — |
| LOW | SEMGREP | SAST | Semgrep Finding: rules.ajinabraham.njsscan.good.good_helmet_checks.helmet_header_x_powered_by | — |
| LOW | SEMGREP | SAST | Semgrep Finding: rules.ajinabraham.njsscan.good.good_helmet_checks.helmet_header_xss_filter | — |
| LOW | SEMGREP | SAST | Semgrep Finding: rules.ajinabraham.njsscan.good.good_helmet_checks.helmet_header_dns_prefetch | — |
