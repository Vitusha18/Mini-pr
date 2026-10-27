import mongoose from 'mongoose';

const weatherSnapshotSchema = new mongoose.Schema(
  {
    temperature: { type: Number, default: null },
    humidity: { type: Number, default: null },
    rainfall: { type: Number, default: null },
    windSpeed: { type: Number, default: null },
    pressure: { type: Number, default: null },
    soilTemperature: { type: Number, default: null },
    soilMoisture: { type: Number, default: null },
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Prediction must be associated with a farmer'],
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Prediction must be associated with a farm'],
      index: true,
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: [true, 'Prediction must be associated with a crop'],
      index: true,
    },
    weatherSnapshot: {
      type: weatherSnapshotSchema,
      default: () => ({}),
    },
    prediction: {
      type: String,
      trim: true,
      default: null,
    },
    riskLevel: {
      type: String,
      enum: {
        values: ['Low', 'Moderate', 'High'],
        message: '{VALUE} is not a valid risk level. Must be Low, Moderate, or High',
      },
      default: null,
    },
    confidence: {
      type: Number,
      default: null,
    },
    recommendation: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

predictionSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
