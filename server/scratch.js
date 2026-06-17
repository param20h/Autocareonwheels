const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const services = await prisma.service.findMany({ include: { category: true } });
  console.log(services.map(s => ({ id: s.id, name: s.name, category: s.category.name })));
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
