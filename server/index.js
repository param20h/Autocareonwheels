require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
