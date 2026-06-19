import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const {
    SUPREME_ADMIN_NAME,
    SUPREME_ADMIN_USERNAME,
    SUPREME_ADMIN_EMAIL,
    SUPREME_ADMIN_PASSWORD,
  } = process.env;

  if (
    !SUPREME_ADMIN_NAME ||
    !SUPREME_ADMIN_USERNAME ||
    !SUPREME_ADMIN_EMAIL ||
    !SUPREME_ADMIN_PASSWORD
  ) {
    throw new Error('Missing supreme admin env variables');
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: SUPREME_ADMIN_EMAIL },
        { username: SUPREME_ADMIN_USERNAME },
      ],
    },
  });

  if (existing) {
    console.log('Supreme admin already exists');
    return;
  }

  const passwordHash = await bcrypt.hash(
    SUPREME_ADMIN_PASSWORD,
    10,
  );

  await prisma.user.create({
    data: {
      name: SUPREME_ADMIN_NAME,
      username: SUPREME_ADMIN_USERNAME.toLowerCase(),
      email: SUPREME_ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: Role.SUPREME_ADMIN,
    },
  });

  console.log('Supreme admin created');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });