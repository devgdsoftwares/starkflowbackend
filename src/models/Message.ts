import * as mongoose from 'mongoose';

const message = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      required: true
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    data: Object,
    archived: {
      type: Boolean,
      default: false
    },
    seen :{
      type : Boolean , 
      default : false
    },
    withdraw :{
      type: Boolean
    },
    status :{
      type : Object
    }
  },
  {
    timestamps: true,
    collection: 'messages'
  }
);

export default mongoose.model('Message', message);
