import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/invitaciones_test';

console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);
console.log('This will time out after 20 seconds if it fails...');

const connectWithTimeout = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000 // 20 seconds
    });
    console.log('✅✅✅ SUCCESS: MongoDB connection established!');
    await mongoose.disconnect();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌❌❌ FAILURE: Could not connect to MongoDB.');
    console.error('Error details:', error);
    process.exit(1);
  }
};

connectWithTimeout();
