const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace('provider = "mysql"', 'provider = "sqlite"');
schema = schema.replace(/@db\.Text/g, '');
schema = schema.replace(/@db\.Date/g, '');
schema = schema.replace(/@db\.Decimal\(\d+,\s*\d+\)/g, '');
schema = schema.replace(/Decimal/g, 'Float');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Prisma schema converted for SQLite');
