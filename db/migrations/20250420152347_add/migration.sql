-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roles_id_fkey" FOREIGN KEY ("roles_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
