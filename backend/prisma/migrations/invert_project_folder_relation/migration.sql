BEGIN;

ALTER TABLE "folders"
ADD COLUMN "project_id" UUID;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "projects"
        GROUP BY "folder_id"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'A folder is linked to more than one project.';
    END IF;
END $$;

UPDATE "folders" AS f
SET "project_id" = p."id"
FROM "projects" AS p
WHERE p."folder_id" = f."id";

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "folders"
        WHERE "project_id" IS NULL
    ) THEN
        RAISE EXCEPTION 'A folder exists without a linked project.';
    END IF;
END $$;

ALTER TABLE "projects"
DROP CONSTRAINT "projects_folder_id_fkey";

ALTER TABLE "folders"
ALTER COLUMN "project_id" SET NOT NULL;

CREATE UNIQUE INDEX "folders_project_id_key"
ON "folders"("project_id");

ALTER TABLE "folders"
ADD CONSTRAINT "folders_project_id_fkey"
FOREIGN KEY ("project_id")
REFERENCES "projects"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "projects"
DROP COLUMN "folder_id";

COMMIT;
