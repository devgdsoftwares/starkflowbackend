import * as mongoose from 'mongoose';

const school = new mongoose.Schema({
    name: {
        type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('School', school);