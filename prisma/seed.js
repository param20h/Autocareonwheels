const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  await prisma.bookingAddon.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.mechanic.deleteMany();

  // Categories
  const cat1 = await prisma.category.create({ data: { name: 'Maintenance', icon: 'wrench', display_order: 1 } });
  const cat2 = await prisma.category.create({ data: { name: 'Cleaning', icon: 'droplets', display_order: 2 } });
  const cat3 = await prisma.category.create({ data: { name: 'Repair', icon: 'settings', display_order: 3 } });

  // Services + Addons
  const svc1 = await prisma.service.create({
    data: {
      name: 'Premium Oil Change', description: 'Full synthetic fluid replacement, comprehensive filter change, and a 20-point health inspection checklist.', price: 1499, duration_mins: 45, category_id: cat1.id,
      addons: { create: [
        { name: 'Engine Flush', price: 599 },
        { name: 'Coolant Top-Up', price: 349 },
        { name: 'Air Filter Replacement', price: 449 },
      ]}
    }
  });

  const svc2 = await prisma.service.create({
    data: {
      name: 'Engine Diagnostics', description: 'Advanced OBD-II computer scanning, error code resolution, and mechanical performance tuning report.', price: 2199, duration_mins: 60, category_id: cat3.id,
      addons: { create: [
        { name: 'Live Data Logging', price: 799 },
        { name: 'Spark Plug Inspection', price: 399 },
        { name: 'Battery Health Report', price: 249 },
        { name: 'Emission Test', price: 549 },
      ]}
    }
  });

  const svc3 = await prisma.service.create({
    data: {
      name: 'Master Car Wash', description: 'Exterior foam detailing, interior vacuuming, dashboard polishing, tire dressing, and glass cleaning.', price: 899, duration_mins: 30, category_id: cat2.id,
      addons: { create: [
        { name: 'Ceramic Coating', price: 1499 },
        { name: 'Interior Steam Clean', price: 699 },
        { name: 'Headlight Restoration', price: 499 },
      ]}
    }
  });

  const svc4 = await prisma.service.create({
    data: {
      name: 'Brake Inspection & Service', description: 'Complete brake pad assessment, rotor inspection, fluid check, and adjustment for optimal stopping power.', price: 1799, duration_mins: 50, category_id: cat3.id,
      addons: { create: [
        { name: 'Brake Pad Replacement', price: 1299 },
        { name: 'Brake Fluid Change', price: 499 },
        { name: 'Rotor Resurfacing', price: 899 },
      ]}
    }
  });

  const svc5 = await prisma.service.create({
    data: {
      name: 'AC Service & Repair', description: 'Gas refill, compressor check, cabin filter replacement, and full cooling performance test.', price: 2499, duration_mins: 75, category_id: cat3.id,
      addons: { create: [
        { name: 'AC Gas Top-Up (R134a)', price: 799 },
        { name: 'Cabin Filter Upgrade (HEPA)', price: 649 },
        { name: 'Condenser Cleaning', price: 549 },
        { name: 'Thermostat Replacement', price: 899 },
      ]}
    }
  });

  const svc6 = await prisma.service.create({
    data: {
      name: 'Battery Health Check', description: 'Voltage test, terminal cleaning, charging system analysis, and replacement recommendation if needed.', price: 499, duration_mins: 20, category_id: cat1.id,
      addons: { create: [
        { name: 'Terminal Anti-Corrosion Coating', price: 199 },
        { name: 'Battery Replacement (Standard)', price: 2999 },
        { name: 'Alternator Test', price: 349 },
      ]}
    }
  });

  // Mechanics
  await prisma.mechanic.createMany({
    data: [
      { name: 'Rajesh Kumar', phone: '+91 9876500001', email: 'rajesh@autocare.com', is_available: true },
      { name: 'Amit Verma', phone: '+91 9876500002', email: 'amit@autocare.com', is_available: true },
      { name: 'Suresh Patel', phone: '+91 9876500003', email: 'suresh@autocare.com', is_available: false },
    ]
  });

  console.log('✅ Database seeded with 6 services, 20 add-ons, and 3 mechanics!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
