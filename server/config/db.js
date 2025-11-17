import mongoose from 'mongoose';

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Use local fallback
    try {
      const localConn = await mongoose.connect('mongodb://localhost:27017/hostel-booking', {
        serverSelectionTimeoutMS: 5000
      });
      console.log('Connected to local MongoDB');
    } catch (localError) {
      console.error('Local MongoDB also failed:', localError.message);
      process.exit(1);
    }
  }
};

export default connectDB;