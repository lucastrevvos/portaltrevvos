// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = process.env.AUTH_ADMIN_EMAIL || 'admin@trevvos.com';
  const adminPassword = process.env.AUTH_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      '⚠️ AUTH_ADMIN_PASSWORD is not set in environment variables',
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Administrador',
      email: adminEmail,
      password: hash,
      role: 'ADMIN', // ajuste se for ENUM diferente
    },
  });

  console.log(`👤 Admin user ensured: ${admin.email}`);

  const categories = ['Finanças', 'Saúde', 'Tecnologia'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: {
        name,
        slug: name.toLowerCase(),
      },
    });
  }

  console.log('📂 Categorias seedadas:', categories.join(', '));
}

main()
  .then(async () => {
    console.log('✅ Seed finished');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
