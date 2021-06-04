import * as mongoose from 'mongoose';

const job = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fluency: {
    type: String
  },
  timezone: {
    type: [],
    default: []
  },
  title: {
    type: String
  },
  short_description: {
    type: String
  },
  skills: {
    type: [],
    default: []
  },
  modules: {
    type: [],
    default: []
  },
  domains: {
    type: [],
    default: []
  },
  salary: {
    type: Object
  },
  designation: {
    type: String
  },
  education: [{
    school: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
      },
      name: String
    },
    degree: {
      id: String,
      name: String
    },
    studyfield: String,
    grades: String,
    summary: String
  }],
  archived: {
    type: Boolean,
    default: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
}, {
    strict: false,
    timestamps: true
  });

export default mongoose.model('Job', job);