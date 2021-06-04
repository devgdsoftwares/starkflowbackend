import * as mongoose from 'mongoose';

const company = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      // unique: true
    },
    adminApproved: {
      type: Boolean,
      required: true,
      default: false
    },
    tier: {
      type: Number,
      required: true,
      default: 3
    },
    description: {
      type: String
    },
    email: {
      type: String
    },
    contact: {
      type: String
    },
    logo: {
      type: String
    },
    website: {
      type: String
    },
    perks: {
      type: Array
    },
    facts: {
      type: Array
    },
    InterviewProcess: {
      type: Array
    },
    location: {
      type: Object
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    linkedIn: {
      id: {
        type: Number,
        // unique: true
      },
      industry: String,
      name: String,
      size: String,
      type: {
        type: String
      }
    }
  },
  {
    strict: false,
    // versionKey: true,
    timestamps: true
  }
);

export default mongoose.model('Company', company);
