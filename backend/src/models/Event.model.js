import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  time: { type: String, required: true },
  activity: { type: String, required: true },
  description: String
}, { _id: false });

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  confirmed: { type: Boolean, default: false },
  attended: { type: Boolean, default: false },
  companions: { type: Number, default: 0 },
  menuType: {
    type: String,
    enum: ['adult', 'child'],
    default: 'adult'
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true
  },
  confirmedAt: Date
}, { _id: true });

const themeSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#8B5CF6' },
  secondaryColor: { type: String, default: '#EC4899' },
  accentColor: { type: String, default: '#F59E0B' },
  fontFamily: { type: String, default: 'Inter' },
  backgroundColor: { type: String, default: '#F9FAFB' }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  hosts: [{
    type: String,
    required: true
  }],
  schedule: [scheduleSchema],
  guests: [guestSchema],
  theme: {
    type: themeSchema,
    default: () => ({})
  },
  media: {
    photos: [String],
    video: String
  },
  settings: {
    allowCompanions: { type: Boolean, default: true },
    requireMenuSelection: { type: Boolean, default: false },
    maxCompanions: { type: Number, default: 2 }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ userId: 1, date: -1 });
eventSchema.index({ 'guests.confirmationCode': 1 });

// Generate unique confirmation code for guests
eventSchema.methods.generateConfirmationCode = function(guestName) {
  const name = guestName.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase();
  return `${name}${random}${timestamp}`;
};

const Event = mongoose.model('Event', eventSchema);

export default Event;
