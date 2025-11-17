import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    course: {
      type: String,
    },
    // Booking profile fields
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    dateOfBirth: {
      type: Date,
    },
    yearOfStudy: {
      type: String,
    },
    studentNumber: {
      type: String,
    },
    residence: {
      type: String,
    },
    nextOfKinName: String,
    nextOfKinContact: String,
    guardianName: String,
    guardianContact: String,
    profileCompleted: {
      type: Boolean,
      default: false
    },
    profilePicture: {
      type: String,
    },
    nextOfKin: {
      name: String,
      contact: String,
    },
    guardian: {
      name: String,
      contact: String,
    },
    notes: {
      type: String,
    },
    healthIssues: {
      type: String,
    },
    role: {
      type: String,
      enum: ['student', 'custodian', 'Student', 'Custodian'],
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
