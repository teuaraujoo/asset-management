import { describe, expect, it, vi } from "vitest";
import type { IProjectStorageCleaner } from "../../../providers/storage/storage.provider";
import type { ProjectFolderService } from "../../folders/folders.contracts";
import type { IProjectsRepository } from "../projects.repositories";
import type { ProjectDetails } from "../projects.types";
import { ProjectsService } from "../projects.services";

const ids = { project: "project-1", user: "user-1", folder: "folder-1" };

function project(overrides: Partial<ProjectDetails> = {}): ProjectDetails {
    return {
        id: ids.project, userId: ids.user, folderId: ids.folder,
        name: "Meu projeto", miniDescription: "Descrição curta", description: "Descrição completa",
        createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-02"),
        folder: { id: ids.folder, name: "Meu projeto", description: "Descrição completa", slug: "meu-projeto", path: "projects/meu-projeto/", createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-02") },
        user: { name: "Usuário", email: "usuario@example.com", isActive: true },
        ...overrides,
    };
}

function repository(overrides: Partial<IProjectsRepository> = {}) {
    const value = project();
    return {
        get: vi.fn(async () => [value]), getById: vi.fn(async () => value),
        getByFolderId: vi.fn(async () => value), create: vi.fn(async () => value),
        update: vi.fn(async () => value), delete: vi.fn(async () => undefined), ...overrides,
    } satisfies IProjectsRepository;
}

function folders(overrides: Partial<ProjectFolderService> = {}) {
    const value = project();
    return {
        getById: vi.fn(async () => value.folder),
        toPrepareCreate: vi.fn(async () => ({ id: ids.folder, name: value.name, description: value.description, slug: value.folder.slug, path: value.folder.path })),
        toPrepareUpdate: vi.fn(async () => ({ name: value.name, description: value.description, slug: value.folder.slug })),
        ...overrides,
    } satisfies ProjectFolderService;
}

function storage(overrides: Partial<IProjectStorageCleaner> = {}) {
    return { deleteByPrefix: vi.fn(async () => undefined), ...overrides } satisfies IProjectStorageCleaner;
}

function sut(repo = repository(), folder = folders(), store = storage()) {
    return { service: new ProjectsService(store, folder, repo), repo, folder, store };
}

describe("ProjectsService.get", () => {
    it("lista e mapeia os projetos do usuário", async () => {
        const { service, repo } = sut();
        await expect(service.get(ids.user)).resolves.toEqual([expect.objectContaining({ id: ids.project, folder_id: ids.folder, mini_description: "Descrição curta", slug: "meu-projeto", user: { id: ids.user, name: "Usuário", email: "usuario@example.com" } })]);
        expect(repo.get).toHaveBeenCalledWith(ids.user);
    });

    it("retorna lista vazia", async () => {
        const { service } = sut(repository({ get: vi.fn(async () => []) }));
        await expect(service.get(ids.user)).resolves.toEqual([]);
    });
});

describe("ProjectsService.getById", () => {
    it("retorna o projeto e verifica a pasta", async () => {
        const { service, folder } = sut();
        await expect(service.getById(ids.project, ids.user)).resolves.toMatchObject({ id: ids.project, folder_id: ids.folder });
        expect(folder.getById).toHaveBeenCalledWith(ids.folder);
    });

    it("rejeita projeto inexistente antes de consultar a pasta", async () => {
        const { service, folder } = sut(repository({ getById: vi.fn(async () => null) }));
        await expect(service.getById("missing", ids.user)).rejects.toMatchObject({ message: "Projeto não encontrado.", statusCode: 404 });
        expect(folder.getById).not.toHaveBeenCalled();
    });
});

describe("ProjectsService.getByFolderId", () => {
    it("retorna o projeto da pasta", async () => {
        const { service, repo } = sut();
        await expect(service.getByFolderId(ids.folder, ids.user)).resolves.toMatchObject({ id: ids.project });
        expect(repo.getByFolderId).toHaveBeenCalledWith(ids.folder, ids.user);
    });

    it("rejeita pasta sem projeto", async () => {
        const { service } = sut(repository({ getByFolderId: vi.fn(async () => null) }));
        await expect(service.getByFolderId("missing", ids.user)).rejects.toMatchObject({ message: "Projeto sem pasta vinculada ou não encontrado.", statusCode: 404 });
    });

    it("rejeita projeto de outro usuário", async () => {
        const { service } = sut(repository({ getByFolderId: vi.fn(async () => project({ userId: "other" })) }));
        await expect(service.getByFolderId(ids.folder, ids.user)).rejects.toMatchObject({ message: "Você não tem permissão para realizar essa ação.", statusCode: 403 });
    });
});

describe("ProjectsService.create", () => {
    const body = { name: "Novo projeto", mini_description: "Descrição curta", description: "Descrição completa" };

    it("prepara a pasta e persiste o projeto mapeado", async () => {
        const { service, folder, repo } = sut();
        await expect(service.create(body, ids.user)).resolves.toBeUndefined();
        expect(folder.toPrepareCreate).toHaveBeenCalledWith({ name: body.name, description: body.description });
        expect(repo.create).toHaveBeenCalledWith({ userId: ids.user, name: body.name, miniDescription: body.mini_description, description: body.description, folder: expect.objectContaining({ id: ids.folder, slug: "meu-projeto" }) });
    });

    it("rejeita entrada inválida antes das dependências", async () => {
        const { service, folder, repo } = sut();
        await expect(service.create({ ...body, name: "" }, ids.user)).rejects.toBeDefined();
        expect(folder.toPrepareCreate).not.toHaveBeenCalled();
        expect(repo.create).not.toHaveBeenCalled();
    });

    it("não persiste quando a pasta falha", async () => {
        const folder = folders({ toPrepareCreate: vi.fn(async () => { throw new Error("folder failure"); }) });
        const { service, repo } = sut(repository(), folder);
        await expect(service.create(body, ids.user)).rejects.toThrow("folder failure");
        expect(repo.create).not.toHaveBeenCalled();
    });
});

describe("ProjectsService.update", () => {
    it("atualiza pasta e projeto", async () => {
        const { service, folder, repo } = sut();
        const body = { name: "Atualizado", mini_description: "Nova curta", description: "Nova descrição" };
        await expect(service.update(ids.project, ids.user, body)).resolves.toMatchObject({ id: ids.project, folder_id: ids.folder });
        expect(folder.toPrepareUpdate).toHaveBeenCalledWith(ids.folder, { name: body.name, description: body.description });
        expect(repo.update).toHaveBeenCalledWith(ids.project, { name: body.name, miniDescription: body.mini_description, description: body.description, updatedAt: expect.any(Date), folder: expect.objectContaining({ slug: "meu-projeto" }) });
    });

    it("usa valores existentes na atualização parcial", async () => {
        const { service, folder } = sut();
        await service.update(ids.project, ids.user, { mini_description: "Nova curta" });
        expect(folder.toPrepareUpdate).toHaveBeenCalledWith(ids.folder, { name: "Meu projeto", description: "Descrição completa" });
    });

    it("rejeita projeto inexistente sem atualizar", async () => {
        const { service, folder, repo } = sut(repository({ getById: vi.fn(async () => null) }));
        await expect(service.update("missing", ids.user, {})).rejects.toMatchObject({ message: "Projeto não encontrado.", statusCode: 404 });
        expect(folder.toPrepareUpdate).not.toHaveBeenCalled();
        expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejeita projeto de outro usuário", async () => {
        const repo = repository({ getById: vi.fn(async () => project({ userId: "other" })) });
        const { service } = sut(repo);
        await expect(service.update(ids.project, ids.user, {})).rejects.toMatchObject({ message: "Usuário sem permissão para realizar essa ação.", statusCode: 403 });
        expect(repo.update).not.toHaveBeenCalled();
    });

    it("não persiste entrada inválida", async () => {
        const { service, folder, repo } = sut();
        await expect(service.update(ids.project, ids.user, { name: "" })).rejects.toBeDefined();
        expect(folder.toPrepareUpdate).not.toHaveBeenCalled();
        expect(repo.update).not.toHaveBeenCalled();
    });
});

describe("ProjectsService.delete", () => {
    it("remove objetos antes dos metadados", async () => {
        const deleteByPrefix = vi.fn(async () => undefined);
        const deleteProject = vi.fn(async () => undefined);
        const { service, store, repo } = sut(
            repository({ delete: deleteProject }),
            folders(),
            storage({ deleteByPrefix }),
        );
        await expect(service.delete(ids.project, ids.user)).resolves.toBeUndefined();
        expect(store.deleteByPrefix).toHaveBeenCalledWith("projects/meu-projeto/");
        expect(repo.delete).toHaveBeenCalledWith(ids.project);
        expect(deleteByPrefix.mock.invocationCallOrder[0])
            .toBeLessThan(deleteProject.mock.invocationCallOrder[0]);
    });

    it("rejeita projeto inexistente sem excluir", async () => {
        const { service, store, repo } = sut(repository({ getById: vi.fn(async () => null) }));
        await expect(service.delete("missing", ids.user)).rejects.toMatchObject({ message: "Projeto não encontrado ou já deletado.", statusCode: 404 });
        expect(store.deleteByPrefix).not.toHaveBeenCalled();
        expect(repo.delete).not.toHaveBeenCalled();
    });

    it("preserva metadados se o storage falhar", async () => {
        const store = storage({ deleteByPrefix: vi.fn(async () => { throw new Error("storage failure"); }) });
        const { service, repo } = sut(repository(), folders(), store);
        await expect(service.delete(ids.project, ids.user)).rejects.toThrow("storage failure");
        expect(repo.delete).not.toHaveBeenCalled();
    });
});
