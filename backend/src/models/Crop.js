import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Crop must be associated with a farmer'],
      index: true,
    },
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Crop must be assigned to a farm'],
      index: true,
    },
    cropName: {
      type: String,
      required: [true, 'Please provide a crop name'],
      trim: true,
    },
    variety: {
      type: String,
      trim: true,
      default: null,
    },
    growthStage: {
      type: String,
      required: [true, 'Please specify the crop growth stage'],
      trim: true,
    },
    plantingDate: {
      type: Date,
      default: null,
    },
    expectedHarvestDate: {
      type: Date,
      default: null,
    },
    cropPhoto: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

cropSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
