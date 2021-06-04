import * as mongoose from 'mongoose';

const no_interested = new mongoose.Schema(
  {
   job_id : {
    type: String,
    required:true
    },
    candidate_id:{
      type: String,
      required:true
    },
    hr_id:{
       type:mongoose.Schema.Types.ObjectId,
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model('no_interested', no_interested);