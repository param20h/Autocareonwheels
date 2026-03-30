require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Super Admin';
  const phone = process.env.ADMIN_PHONE || '0000000000';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', password: hashedPassword },
    create: { 
      name,
      email,
      password: hashedPassword, 
      role: 'ADMIN',
      phone
    }
  });
  console.log(`Admin account ensured for ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
