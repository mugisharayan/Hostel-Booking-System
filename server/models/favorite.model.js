import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only favorite a hostel once
favoriteSchema.index({ student: 1, hostel: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
