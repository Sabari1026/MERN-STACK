require('../backend/node_modules/dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });
const mongoose = require('../backend/node_modules/mongoose');

async function testMongo() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection to MongoDB URI...');
  console.log('URI host:', uri.replace(/\/\/.*@/, '//<credentials>@'));

  try {
    console.log('Attempting mongoose.connect with serverSelectionTimeoutMS: 5000...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('SUCCESS! Connected to MongoDB Atlas.');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections count:', collections.length);
    console.log('Collections:', collections.map(c => c.name));
    await mongoose.disconnect();
  } catch (err) {
    console.error('ERROR during connect:');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    if (err.reason) {
      console.error('Reason:', JSON.stringify(err.reason, null, 2));
    }
  }
}

testMongo();
