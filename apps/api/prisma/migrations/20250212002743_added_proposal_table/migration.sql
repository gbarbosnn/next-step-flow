-- CreateEnum
CREATE TYPE "Status" AS ENUM ('REVIEW', 'APPROVED', 'REJECTED', 'STANDBY');

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
