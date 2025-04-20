import prisma from "../src/utils/prisma";
import { seedDoctors } from "./seed/seed.doctor";

async function seed() {
  try {
    await seedDoctors();
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  }
}

seed();
