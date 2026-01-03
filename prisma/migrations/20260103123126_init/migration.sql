-- CreateTable
CREATE TABLE "schools" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "npsn" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verified_at" DATETIME,
    "registration_link" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "school_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "program" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "form_data" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "registrations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "registrations_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registration_files" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registration_id" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "registration_files_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_email_key" ON "schools"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schools_registration_link_key" ON "schools"("registration_link");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
