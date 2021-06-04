import * as mongoose from 'mongoose';

const no_interested_cand = new mongoose.Schema(
  {
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

export default mongoose.model('no_interested_cand', no_interested_cand);