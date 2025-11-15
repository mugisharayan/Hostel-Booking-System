import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

const hostelData = {
  "muhika-hostel": {
    name: "Muhika Hostel",
    location: "Kikoni",
    images: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://hostels.campusbee.ug/wp-content/uploads/2022/01/IMG_20220127_112025-85b876ea-750x536.jpg"
    ],
    contact: "0780562202",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "24/7 Security", icon: "fa-shield-halved" },
      { name: "Laundry Services", icon: "fa-shirt" },
      { name: "Shuttle Service", icon: "fa-bus" }
    ],
    rooms: [
      { name: "Double (Shared) Room", price: 650000, description: "Affordable shared living space.", icon: "fa-user-group" },
      { name: "Single Room (Not Self-Contained)", price: 1000000, description: "Your own private room.", icon: "fa-user" },
      { name: "Single Room (Self-Contained)", price: 1200000, description: "Private room with en-suite bathroom.", icon: "fa-bath" }
    ]
  },
  "castle-ville-hostel": {
    name: "Castle Ville Hostel",
    location: "Kikoni",
    images: [
      "https://hostels.campusbee.ug/wp-content/uploads/2022/01/IMG_20220127_112025-85b876ea-750x536.jpg"
    ],
    contact: "0782206832",
    amenities: [
      { name: "Free Wi-Fi", icon: "fa-wifi" },
      { name: "Weekly cleaning service", icon: "fa-broom" },
      { name: "Parking Space", icon: "fa-car" },
      { name: "Lounge Area", icon: "fa-tv" }
    ],
    rooms: [
      { name: "Double (Self-Contained)", price: 800000, description: "Shared room with en-suite bathroom.", icon: "fa-user-group" },
      { name: "Single (Self-Contained)", price: 1300000, description: "Your own private room and bathroom.", icon: "fa-bath" }
    ]
  }
};

async function migrateHostels() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Hostel.deleteMany({});
    console.log('Cleared existing hostels');

    const hostelsToInsert = Object.entries(hostelData).map(([slug, data]) => ({
      ...data,
      slug
    }));

    await Hostel.insertMany(hostelsToInsert);
    console.log(`Inserted ${hostelsToInsert.length} hostels`);

    console.log('Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateHostels();