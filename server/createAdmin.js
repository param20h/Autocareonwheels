const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@autocare.com' },
    update: { role: 'ADMIN', password: hashedPassword },
    create: { 
      name: 'Super Admin', 
      email: 'admin@autocare.com', 
      password: hashedPassword, 
      role: 'ADMIN',
      phone: '0000000000'
    }
  });
  console.log('Admin account created successfully: admin@autocare.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
