import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  contact: { type: String, required: true },
  amenities: [{
    name: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  rooms: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  slug: { type: String, unique: true }
}, { timestamps: true });

const Hostel = mongoose.model('Hostel', hostelSchema);

// Read hostel data from the client file
const hostelDataPath = path.join(process.cwd(), '../client/src/data/hostels.js');
const hostelFileContent = fs.readFileSync(hostelDataPath, 'utf8');

// Extract the hostelData object (simple regex approach)
const dataMatch = hostelFileContent.match(/const hostelData = ({[\s\S]*?});/);
if (!dataMatch) {
  throw new Error('Could not extract hostel data from file');
}

// Use eval to parse the object (in production, use a proper parser)
const hostelData = eval(`(${dataMatch[1]})`);

async function migrateAllHostels() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Hostel.deleteMany({});
    console.log('Cleared existing hostels');

    const hostelsToInsert = Object.entries(hostelData).map(([slug, data]) => ({
      ...data,
      slug,
      images: data.images || [] // Handle hostels without images
    }));

    await Hostel.insertMany(hostelsToInsert);
    console.log(`Inserted ${hostelsToInsert.length} hostels`);

    console.log('All hostels migrated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateAllHostels();