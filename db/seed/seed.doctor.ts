import prisma from "../../src/utils/prisma";
import { doctors } from "./data.doctor";

export async function seedDoctors() {
  await prisma.doctors.deleteMany();
  console.log("success delete all doctors");

  await prisma.doctors.createMany({
    data: doctors,
  });
  console.log("success seed all doctors");
}
