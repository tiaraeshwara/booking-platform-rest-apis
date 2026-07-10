import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TYPE "public"."bookings_status_enum" AS ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED',
        'COMPLETED'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying,
        "refreshToken" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "services" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "duration" integer NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdById" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_services_created_by" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerName" character varying NOT NULL,
        "customerEmail" character varying NOT NULL,
        "customerPhone" character varying NOT NULL,
        "serviceId" uuid NOT NULL,
        "bookingDate" date NOT NULL,
        "bookingTime" time NOT NULL,
        "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING',
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bookings_service" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(
      'CREATE INDEX "IDX_bookings_service_date_time" ON "bookings" ("serviceId", "bookingDate", "bookingTime")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "public"."IDX_bookings_service_date_time"',
    );
    await queryRunner.query('DROP TABLE "bookings"');
    await queryRunner.query('DROP TABLE "services"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TYPE "public"."bookings_status_enum"');
  }
}
