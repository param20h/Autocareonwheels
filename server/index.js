require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('./app');

if (!process.env.JWT_SECRET) {
  console.error('Missing required env: JWT_SECRET');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
