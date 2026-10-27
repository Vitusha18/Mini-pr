import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farm must belong to a farmer'],
      index: true,
    },
    farmName: {
      type: String,
      required: [true, 'Please provide a farm name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide the farm location (e.g. Palghar, Maharashtra)'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Please provide the farm latitude'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide the farm longitude'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    farmArea: {
      type: Number,
      required: [true, 'Please provide the farm area'],
      min: [0.01, 'Farm area must be greater than 0'],
    },
    areaUnit: {
      type: String,
      enum: {
        values: ['Acre', 'Hectare'],
        message: '{VALUE} is not a supported area unit. Must be Acre or Hectare',
      },
      default: 'Acre',
    },
    soilType: {
      type: String,
      trim: true,
      default: null,
    },
    irrigationType: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

farmSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Farm = mongoose.model('Farm', farmSchema);

export default Farm;
