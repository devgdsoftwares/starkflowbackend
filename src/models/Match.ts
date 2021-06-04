import * as mongoose from "mongoose";

const match = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    score: {
      type: Object,
      required: true
    },
    hrstatus :{
      type : Object ,
      timestamps: true, 
    },
    candidatestatus :{
      type : Object ,
      timestamps: true, 
    },
    archived :{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    id: false,
    toJSON: {
      getters: true,
      virtuals: true
    },
    toObject: {
      getters: true,
      virtuals: true
    },
    collection: "matches",
    versionKey: false
  }
);

match.index({ hr: 1, candidate: 1, job: 1 }, { unique: true });

export default mongoose.model("Match", match);
