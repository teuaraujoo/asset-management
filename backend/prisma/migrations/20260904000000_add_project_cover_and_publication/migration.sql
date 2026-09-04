BEGIN;

ALTER TABLE "public"."projects"
ADD COLUMN "cover_file_id" UUID,
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "published_at" TIMESTAMP(6);

CREATE UNIQUE INDEX "projects_cover_file_id_key"
ON "public"."projects"("cover_file_id");

CREATE INDEX "idx_projects_published_created_at"
ON "public"."projects"("published", "created_at");

ALTER TABLE "public"."projects"
ADD CONSTRAINT "projects_cover_file_id_fkey"
FOREIGN KEY ("cover_file_id")
REFERENCES "public"."files"("id")
ON DELETE SET NULL
ON UPDATE NO ACTION;

COMMIT;
