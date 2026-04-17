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
  const tyreCategory = await prisma.category.create({ data: { name: 'Tyre & Wheel', icon: 'wrench', display_order: 1 } });
  const coolingCategory = await prisma.category.create({ data: { name: 'Cooling & AC', icon: 'droplets', display_order: 2 } });
  const repairCategory = await prisma.category.create({ data: { name: 'Brakes, Suspension & Steering', icon: 'settings', display_order: 3 } });

  // Services + Addons (real catalog)
  await prisma.service.create({
    data: {
      name: 'Tyre Services',
      description: 'Tyre fitting, puncture repair, mobile fitting, emergency replacement, balancing, and tyre safety checks.',
      price: 149,
      duration_mins: 60,
      category_id: tyreCategory.id,
      addons: {
        create: [
          { name: 'Tyre fitting and installation', price: 89 },
          { name: 'Emergency tyre replacement', price: 119 },
          { name: 'On-site puncture repair', price: 69 },
          { name: 'Mobile tyre fitting at home or work', price: 99 },
          { name: 'Breakdown assistance', price: 129 },
          { name: 'Wheel balancing', price: 79 },
          { name: 'Tyre inspection and safety check', price: 49 },
          { name: 'Tyre pressure check and adjustment', price: 29 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: 'Cooling System Services',
      description: 'Complete cooling system inspection, leak detection, replacement, and overheating diagnostics.',
      price: 189,
      duration_mins: 90,
      category_id: coolingCategory.id,
      addons: {
        create: [
          { name: 'Radiator inspection and replacement', price: 129 },
          { name: 'Coolant flush and refill', price: 99 },
          { name: 'Thermostat replacement', price: 89 },
          { name: 'Water pump repair and replacement', price: 149 },
          { name: 'Radiator hose inspection and replacement', price: 79 },
          { name: 'Cooling fan repair and replacement', price: 109 },
          { name: 'Heater core inspection and repair', price: 129 },
          { name: 'Expansion tank replacement', price: 89 },
          { name: 'Coolant leak detection and repair', price: 99 },
          { name: 'Pressure testing of cooling system', price: 69 },
          { name: 'Temperature sensor replacement', price: 69 },
          { name: 'Radiator cap testing and replacement', price: 39 },
          { name: 'Engine overheating diagnosis', price: 99 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: 'Basic Car AC Service',
      description: 'AC performance checks, refrigerant diagnostics, cleaning, and component inspection with optional advanced repair.',
      price: 159,
      duration_mins: 75,
      category_id: coolingCategory.id,
      addons: {
        create: [
          { name: 'AC performance check', price: 49 },
          { name: 'Hose and connection visual inspection', price: 39 },
          { name: 'Refrigerant gas level check', price: 49 },
          { name: 'AC pressure testing (high and low side)', price: 59 },
          { name: 'Cabin air filter cleaning or replacement', price: 59 },
          { name: 'Evaporator cleaning', price: 79 },
          { name: 'Condenser cleaning', price: 79 },
          { name: 'AC vent cleaning and sanitization', price: 69 },
          { name: 'Compressor check', price: 69 },
          { name: 'Cooling fan inspection', price: 49 },
          { name: 'Blower motor check', price: 59 },
          { name: 'Electrical system check', price: 79 },
          { name: 'Refrigerant refill or top-up', price: 99 },
          { name: 'Leak detection test', price: 89 },
          { name: 'AC oil level check and top-up', price: 59 },
          { name: 'Full AC system flush', price: 129 },
          { name: 'Leak repair (pipes, seals, O-rings)', price: 139 },
          { name: 'Compressor repair or replacement', price: 199 },
          { name: 'Condenser or evaporator replacement', price: 179 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: 'Brakes Service',
      description: 'Brake inspection, fluid service, and replacement of core brake components for safe stopping performance.',
      price: 179,
      duration_mins: 75,
      category_id: repairCategory.id,
      addons: {
        create: [
          { name: 'Brake pad replacement', price: 119 },
          { name: 'Brake disc or rotor resurfacing or replacement', price: 149 },
          { name: 'Brake shoe replacement', price: 99 },
          { name: 'Caliper repair or replacement', price: 139 },
          { name: 'Wheel cylinder check', price: 79 },
          { name: 'Brake fluid top-up', price: 39 },
          { name: 'Brake fluid bleeding', price: 69 },
          { name: 'Brake fluid replacement', price: 79 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: 'Suspension Service',
      description: 'Suspension inspection, cleaning, lubrication, and replacement of worn suspension components.',
      price: 169,
      duration_mins: 80,
      category_id: repairCategory.id,
      addons: {
        create: [
          { name: 'Shock absorbers and struts check', price: 79 },
          { name: 'Coil springs inspection', price: 59 },
          { name: 'Control arms and bushes check', price: 69 },
          { name: 'Ball joints inspection', price: 59 },
          { name: 'Tie rod ends check', price: 59 },
          { name: 'Sway bar links and bushes inspection', price: 59 },
          { name: 'Suspension components cleaning', price: 49 },
          { name: 'Lubrication of joints and bushes', price: 39 },
          { name: 'Tightening of nuts and bolts', price: 39 },
          { name: 'Shock absorber or strut replacement', price: 149 },
          { name: 'Bushings replacement', price: 99 },
          { name: 'Ball joints replacement', price: 109 },
          { name: 'Tie rod ends replacement', price: 109 },
          { name: 'Sway bar links replacement', price: 99 },
          { name: 'Control arm replacement', price: 139 },
        ],
      },
    },
  });

  await prisma.service.create({
    data: {
      name: 'Steering Service',
      description: 'Steering system inspection, fluid service, and replacement of steering components where needed.',
      price: 169,
      duration_mins: 80,
      category_id: repairCategory.id,
      addons: {
        create: [
          { name: 'Steering wheel free play check', price: 49 },
          { name: 'Steering rack inspection', price: 79 },
          { name: 'Tie rod ends check (inner and outer)', price: 59 },
          { name: 'Steering column and joints inspection', price: 59 },
          { name: 'Power steering pump check', price: 69 },
          { name: 'Steering fluid level and condition check', price: 39 },
          { name: 'Cleaning steering components', price: 49 },
          { name: 'Lubrication of steering joints', price: 39 },
          { name: 'Tightening loose bolts and connections', price: 39 },
          { name: 'Power steering fluid top-up', price: 39 },
          { name: 'Power steering fluid flush and replacement', price: 79 },
          { name: 'Air bleeding from steering system', price: 59 },
          { name: 'Tie rod ends replacement', price: 109 },
          { name: 'Steering rack repair or replacement', price: 179 },
          { name: 'Power steering pump replacement', price: 169 },
          { name: 'Steering hoses and pipes replacement', price: 119 },
          { name: 'Rack boots replacement', price: 89 },
        ],
      },
    },
  });

  // Mechanics
  await prisma.mechanic.createMany({
    data: [
      { name: 'Liam Carter', phone: '0427001001', email: 'liam@autocare.com', is_available: true },
      { name: 'Noah Bennett', phone: '0427001002', email: 'noah@autocare.com', is_available: true },
      { name: 'Jack Wilson', phone: '0427001003', email: 'jack@autocare.com', is_available: false },
    ]
  });

  console.log('Database seeded with 6 real services, detailed add-ons, and 3 mechanics.');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
