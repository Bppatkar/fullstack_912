import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000 
    });
    
    console.log('DataBase connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); 
  }
};

export default connectDB;