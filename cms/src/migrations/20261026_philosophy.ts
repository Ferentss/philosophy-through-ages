// Адаптаційна міграція на основі початкової схеми 20261020_074222.
// Перед запуском на існуючій production-базі створіть резервну копію.
import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
ALTER TABLE "common" ADD COLUMN IF NOT EXISTS "logo_text" varchar;
CREATE TABLE "epochs" (
"id" serial PRIMARY KEY NOT NULL,
"slug" varchar NOT NULL,
"title" varchar NOT NULL,
"period" varchar NOT NULL,
"description" varchar NOT NULL,
"detail" varchar,
"image_id" integer,
"image_url" varchar,
"order" numeric DEFAULT 0 NOT NULL,
"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "epochs_slug_idx" ON "epochs" USING btree ("slug");
CREATE INDEX "epochs_updated_at_idx" ON "epochs" USING btree ("updated_at");
CREATE INDEX "epochs_created_at_idx" ON "epochs" USING btree ("created_at");
CREATE TABLE "philosophers" (
"id" serial PRIMARY KEY NOT NULL,
"slug" varchar NOT NULL,
"name" varchar NOT NULL,
"years" varchar NOT NULL,
"idea" varchar NOT NULL,
"bio" varchar NOT NULL,
"epoch_id" integer,
"image_id" integer,
"image_url" varchar,
"order" numeric DEFAULT 0 NOT NULL,
"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "philosophers_slug_idx" ON "philosophers" USING btree ("slug");
CREATE INDEX "philosophers_updated_at_idx" ON "philosophers" USING btree ("updated_at");
CREATE INDEX "philosophers_created_at_idx" ON "philosophers" USING btree ("created_at");
CREATE TABLE "quotes" (
"id" serial PRIMARY KEY NOT NULL,
"slug" varchar NOT NULL,
"text" varchar NOT NULL,
"author" varchar NOT NULL,
"source" varchar,
"is_paraphrase" boolean DEFAULT true,
"philosopher_id" integer,
"order" numeric DEFAULT 0 NOT NULL,
"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "quotes_slug_idx" ON "quotes" USING btree ("slug");
CREATE INDEX "quotes_updated_at_idx" ON "quotes" USING btree ("updated_at");
CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
ALTER TABLE "epochs" ADD CONSTRAINT "epochs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "philosophers" ADD CONSTRAINT "philosophers_epoch_id_epochs_id_fk" FOREIGN KEY ("epoch_id") REFERENCES "public"."epochs"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "philosophers" ADD CONSTRAINT "philosophers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_philosopher_id_philosophers_id_fk" FOREIGN KEY ("philosopher_id") REFERENCES "public"."philosophers"("id") ON DELETE set null ON UPDATE no action;
CREATE INDEX "epochs_image_idx" ON "epochs" USING btree ("image_id");
CREATE INDEX "philosophers_epoch_idx" ON "philosophers" USING btree ("epoch_id");
CREATE INDEX "philosophers_image_idx" ON "philosophers" USING btree ("image_id");
CREATE INDEX "quotes_philosopher_idx" ON "quotes" USING btree ("philosopher_id");
CREATE TABLE "pages_blocks_about" (
"_order" integer NOT NULL,
"_parent_id" integer NOT NULL,
"_path" text NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"anchor" varchar,
"title" varchar NOT NULL,
"text" varchar NOT NULL,
"block_name" varchar
);
ALTER TABLE "pages_blocks_about" ADD CONSTRAINT "pages_blocks_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_about_order_idx" ON "pages_blocks_about" USING btree ("_order");
CREATE INDEX "pages_blocks_about_parent_id_idx" ON "pages_blocks_about" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_about_path_idx" ON "pages_blocks_about" USING btree ("_path");
CREATE TABLE "pages_blocks_epochs" (
"_order" integer NOT NULL,
"_parent_id" integer NOT NULL,
"_path" text NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"anchor" varchar,
"title" varchar NOT NULL,
"subtitle" varchar,
"block_name" varchar
);
ALTER TABLE "pages_blocks_epochs" ADD CONSTRAINT "pages_blocks_epochs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_epochs_order_idx" ON "pages_blocks_epochs" USING btree ("_order");
CREATE INDEX "pages_blocks_epochs_parent_id_idx" ON "pages_blocks_epochs" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_epochs_path_idx" ON "pages_blocks_epochs" USING btree ("_path");
CREATE TABLE "pages_blocks_philosophers" (
"_order" integer NOT NULL,
"_parent_id" integer NOT NULL,
"_path" text NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"anchor" varchar,
"title" varchar NOT NULL,
"subtitle" varchar,
"block_name" varchar
);
ALTER TABLE "pages_blocks_philosophers" ADD CONSTRAINT "pages_blocks_philosophers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_philosophers_order_idx" ON "pages_blocks_philosophers" USING btree ("_order");
CREATE INDEX "pages_blocks_philosophers_parent_id_idx" ON "pages_blocks_philosophers" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_philosophers_path_idx" ON "pages_blocks_philosophers" USING btree ("_path");
CREATE TABLE "pages_blocks_questions" (
"_order" integer NOT NULL,
"_parent_id" integer NOT NULL,
"_path" text NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"anchor" varchar,
"title" varchar NOT NULL,
"block_name" varchar
);
ALTER TABLE "pages_blocks_questions" ADD CONSTRAINT "pages_blocks_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_questions_order_idx" ON "pages_blocks_questions" USING btree ("_order");
CREATE INDEX "pages_blocks_questions_parent_id_idx" ON "pages_blocks_questions" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_questions_path_idx" ON "pages_blocks_questions" USING btree ("_path");
CREATE TABLE "pages_blocks_quotes" (
"_order" integer NOT NULL,
"_parent_id" integer NOT NULL,
"_path" text NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"anchor" varchar,
"title" varchar NOT NULL,
"subtitle" varchar,
"block_name" varchar
);
ALTER TABLE "pages_blocks_quotes" ADD CONSTRAINT "pages_blocks_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_quotes_order_idx" ON "pages_blocks_quotes" USING btree ("_order");
CREATE INDEX "pages_blocks_quotes_parent_id_idx" ON "pages_blocks_quotes" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_quotes_path_idx" ON "pages_blocks_quotes" USING btree ("_path");
CREATE TABLE "pages_blocks_project_info" (
"_order" integer NOT NULL,
"_parent_id" integer NOT NULL,
"_path" text NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"anchor" varchar,
"title" varchar NOT NULL,
"text" varchar NOT NULL,
"contact_email" varchar,
"block_name" varchar
);
ALTER TABLE "pages_blocks_project_info" ADD CONSTRAINT "pages_blocks_project_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_project_info_order_idx" ON "pages_blocks_project_info" USING btree ("_order");
CREATE INDEX "pages_blocks_project_info_parent_id_idx" ON "pages_blocks_project_info" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_project_info_path_idx" ON "pages_blocks_project_info" USING btree ("_path");
CREATE TABLE "pages_blocks_about_topics" (
"_order" integer NOT NULL,
"_parent_id" varchar NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"icon" varchar NOT NULL,
"title" varchar NOT NULL,
"text" varchar NOT NULL
);
ALTER TABLE "pages_blocks_about_topics" ADD CONSTRAINT "pages_blocks_about_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_about_topics_order_idx" ON "pages_blocks_about_topics" USING btree ("_order");
CREATE INDEX "pages_blocks_about_topics_parent_id_idx" ON "pages_blocks_about_topics" USING btree ("_parent_id");
CREATE TABLE "pages_blocks_questions_items" (
"_order" integer NOT NULL,
"_parent_id" varchar NOT NULL,
"id" varchar PRIMARY KEY NOT NULL,
"question" varchar NOT NULL,
"answer" varchar NOT NULL
);
ALTER TABLE "pages_blocks_questions_items" ADD CONSTRAINT "pages_blocks_questions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_questions"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_questions_items_order_idx" ON "pages_blocks_questions_items" USING btree ("_order");
CREATE INDEX "pages_blocks_questions_items_parent_id_idx" ON "pages_blocks_questions_items" USING btree ("_parent_id");
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "epochs_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_epochs_fk" FOREIGN KEY ("epochs_id") REFERENCES "public"."epochs"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "payload_locked_documents_rels_epochs_id_idx" ON "payload_locked_documents_rels" USING btree ("epochs_id");
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "philosophers_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_philosophers_fk" FOREIGN KEY ("philosophers_id") REFERENCES "public"."philosophers"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "payload_locked_documents_rels_philosophers_id_idx" ON "payload_locked_documents_rels" USING btree ("philosophers_id");
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "quotes_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "payload_locked_documents_rels_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("quotes_id");
  `)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "epochs_id";
ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "philosophers_id";
ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "quotes_id";
DROP TABLE IF EXISTS "pages_blocks_about_topics" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_questions_items" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_about" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_epochs" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_philosophers" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_questions" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_quotes" CASCADE;
DROP TABLE IF EXISTS "pages_blocks_project_info" CASCADE;
DROP TABLE IF EXISTS "quotes" CASCADE;
DROP TABLE IF EXISTS "philosophers" CASCADE;
DROP TABLE IF EXISTS "epochs" CASCADE;
ALTER TABLE "common" DROP COLUMN IF EXISTS "logo_text";
  `)
}
