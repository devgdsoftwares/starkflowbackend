import * as mongoose from 'mongoose';

const Contact = new mongoose.Schema({
name :{
  type : String
},
email :{
  type : String
},
phone : {
  type : Number
},
message : {
  type : String
},
referenceId: {
  type: String
}
},{
  strict: false,
	timestamps: true
});

export default mongoose.model('contact', Contact);

