import * as mongoose from 'mongoose';

const FieldOfStudy = new mongoose.Schema({
    id:{
        type: String
    },
    degree: {
        type: String
  },
  field_of_study:{
      type: []
  }
}, {
  timestamps: true,
  collection: 'field_of_studies'
});

export default mongoose.model('FieldOfStudy', FieldOfStudy);