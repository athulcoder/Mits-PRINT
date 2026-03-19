import { prisma } from "@/lib/prisma";
import { parseStudentEmail } from "./utils";

export async function upsertStudent(user) {
  const { batch, department } = parseStudentEmail(user.email);

  return await prisma.student.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      batch,
      department,
    },
    create: {
      email: user.email,
      name: user.name,
      batch,
      department,
    },
  });
}