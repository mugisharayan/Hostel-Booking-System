import mongoose from 'mongoose';
import {
  GENDER_TYPES,
  USER_ROLES,
  createEmailField,
  createRequiredStringField,
  createOptionalStringField,
  createEnumField,
  createPasswordHashMiddleware,
  createPasswordMatchMethod
} from '../utils/model.helpers.js';

const userSchema = new mongoose.Schema(
  {
    // Basic information
    name: createRequiredStringField(),
    email: createEmailField(),
    password: createRequiredStringField({ select: false }),
    phone: createOptionalStringField(),
    role: createEnumField(USER_ROLES, true),
    
    // Academic information
    course: createOptionalStringField(),
    yearOfStudy: createOptionalStringField(),
    studentNumber: createOptionalStringField(),
    
    // Personal information
    gender: createEnumField(GENDER_TYPES),
    dateOfBirth: { type: Date },
    residence: createOptionalStringField(),
    profilePicture: createOptionalStringField(),
    
    // Contact information
    nextOfKinName: createOptionalStringField(),
    nextOfKinContact: createOptionalStringField(),
    guardianName: createOptionalStringField(),
    guardianContact: createOptionalStringField(),
    
    // Legacy nested objects (for backward compatibility)
    nextOfKin: {
      name: createOptionalStringField(),
      contact: createOptionalStringField(),
    },
    guardian: {
      name: createOptionalStringField(),
      contact: createOptionalStringField(),
    },
    
    // Additional information
    notes: createOptionalStringField(),
    healthIssues: createOptionalStringField(),
    
    // Profile status
    profileCompleted: {
      type: Boolean,
      default: false
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ studentNumber: 1 });

// Virtual for full name (if needed)
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Pre-save middleware
userSchema.pre('save', createPasswordHashMiddleware());

// Instance methods
userSchema.methods.matchPassword = createPasswordMatchMethod();

userSchema.methods.isProfileComplete = function() {
  const requiredFields = ['name', 'email', 'phone', 'gender', 'course'];
  return requiredFields.every(field => this[field]);
};

userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
