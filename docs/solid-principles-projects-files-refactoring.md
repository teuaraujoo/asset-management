Após refatoração, quatro princípios SOLID aparecem claramente. Um está apenas parcialmente aplicado.

## 1. SRP — Responsabilidade Única

Bem aplicado pela separação:

- Controller cuida de HTTP.
- Service cuida das regras de negócio.
- Repository cuida do banco.
- Mapper converte formatos.
- Storage Provider cuida do armazenamento.
- Composition Root monta dependências.

Exemplo:

```text
FilesController
      ↓
FilesService
      ↓
IFilesRepository
      ↓
PostgresFilesRepository
```

O `FilesService` não executa consultas Prisma. O repository não gera URL de upload. Isso reduz mistura de responsabilidades.

Porém, ainda existe violação parcial:

```ts
FolderService.getById(...)
```

`FolderService` aparentemente funciona como instância estática/global. Isso esconde dependência do `FilesService` e do `ProjectsService`.

---

## 2. OCP — Aberto/Fechado

Aplicado principalmente no armazenamento:

```ts
interface StorageProvider {
    delete(...): Promise<unknown>;
    generatePresignedUrl(...): Promise<PreparedUpload>;
}
```

R2 implementa contrato:

```ts
class R2StorageProvider implements StorageProvider
```

Agora pode criar:

```ts
class S3StorageProvider implements StorageProvider
class SupabaseStorageProvider implements StorageProvider
```

Sem modificar `FilesService` ou `ProjectsService`. Basta trocar implementação no composition root.

Também ocorre nos repositories:

```ts
class PostgresFilesRepository implements IFilesRepository
```

Poderia criar repository em memória para testes:

```ts
class InMemoryFilesRepository implements IFilesRepository
```

Services permanecem fechados para modificação, mas abertos para novas implementações.

---

## 3. LSP — Substituição de Liskov

Aplicado pelos contratos:

```ts
StorageProvider
IFilesRepository
IProjectsRepository
```

Qualquer implementação válida deveria poder substituir outra:

```ts
const storage: StorageProvider =
    new R2StorageProvider(...);
```

Ou:

```ts
const storage: StorageProvider =
    new S3StorageProvider(...);
```

Desde que comportamento e retornos respeitem contrato.

Há pequeno problema:

```ts
delete(...): Promise<unknown>
```

`unknown` deixa comportamento pouco previsível. Como service ignora retorno, melhor:

```ts
delete(objectKey: string): Promise<void>;
deleteByPrefix(prefix: string): Promise<void>;
rename(oldKey: string, newKey: string): Promise<void>;
```

Isso fortalece LSP porque todas implementações terão retorno consistente.

---

## 4. ISP — Segregação de Interfaces

Parcialmente aplicado.

Interfaces de repository estão relativamente específicas:

```ts
interface IFilesRepository
interface IProjectsRepository
```

Services não recebem repository genérico gigante com operações desnecessárias.

Porém, `StorageProvider` reúne upload, download, preview, rename, metadata e exclusão. Os dois services recebem contrato inteiro, mesmo sem usar todos métodos:

- `ProjectsService` usa apenas `deleteByPrefix()`.
- `FilesService` usa quase todo restante.

Forma mais rigorosa de ISP:

```ts
interface ObjectStorageReader {
    getObjectMetaData(...): Promise<ObjectMetaData | null>;
    generateDownloadPresignedUrl(...): Promise<string>;
    generatePreviewUrl(...): Promise<string>;
}

interface ObjectStorageWriter {
    generatePresignedUrl(...): Promise<PreparedUpload>;
    delete(...): Promise<void>;
    rename(...): Promise<void>;
}

interface ObjectStorageCleaner {
    deleteByPrefix(...): Promise<void>;
}
```

Não é obrigatório agora. Interface atual ainda é pequena. Mas ISP não está totalmente otimizado.

---

## 5. DIP — Inversão de Dependência

É principal princípio aplicado.

Antes:

```text
FilesService → Cloudflare R2
FilesService → Prisma
```

Agora:

```text
FilesService → StorageProvider
FilesService → IFilesRepository
```

Service depende de abstrações, não de infraestrutura concreta.

Composition root decide implementações:

```ts
const storageProvider = new R2StorageProvider(s3, bucket);
const filesRepository = new PostgresFilesRepository();

const filesService = new FilesServices(
    storageProvider,
    projectsService,
    filesRepository,
);
```

Porém, DIP ainda está incompleto por duas dependências concretas:

```ts
private ProjectsService: ProjectService
```

e:

```ts
FolderService.getById(...)
```

`FilesService` depende da classe concreta `ProjectService`. Melhor criar contrato pequeno:

```ts
export interface ProjectReader {
    getByFolderId(
        folderId: string,
        userId: string,
    ): Promise<ProjectWithFolder>;
}
```

Então:

```ts
constructor(
    private readonly storageProvider: StorageProvider,
    private readonly projectsService: ProjectReader,
    private readonly filesRepository: IFilesRepository,
) {}
```

`ProjectsService` implementará naturalmente esse contrato.

O mesmo deve acontecer com folder:

```ts
interface FolderServiceContract {
    getById(id: string): Promise<Folder | null>;
    toPrepareCreate(...): Promise<FolderData>;
    toPrepareUpdate(...): Promise<FolderData>;
}
```

E ser injetado:

```ts
constructor(
    private readonly storageProvider: StorageProvider,
    private readonly projectsRepository: IProjectsRepository,
    private readonly folderService: FolderServiceContract,
) {}
```

## Resultado

- SRP: aplicado, mas `FolderService` estático reduz separação.
- OCP: bem aplicado.
- LSP: aplicado, podendo melhorar retornos do storage.
- ISP: parcialmente aplicado.
- DIP: bem aplicado em storage e repositories; incompleto entre services e no `FolderService`.

Termos técnicos para alteração:

- Dependency Inversion
- Dependency Injection
- Repository Pattern
- Provider Pattern
- Composition Root
- Ports and Adapters, parcialmente
- Desacoplamento da infraestrutura

Maior próximo passo: criar contratos para comunicação entre services e injetar `FolderService`, removendo chamadas estáticas/globais.
