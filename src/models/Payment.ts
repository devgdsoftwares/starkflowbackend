import * as mongoose from 'mongoose';

const payment = new mongoose.Schema(
  {
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    company_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    payment_id:{
      type: String,
      required:true
    },
    token:{
        type: String,
        required:true
    },
    payer_id:{
        type: String
    },
    amount:{
        type: Number,
        default: 3750
    },
    currency:{
        type: String,
        default:'IN'
    },
    completed:{
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,    
    versionKey: false
  }
);

export default mongoose.model('Payment', payment);