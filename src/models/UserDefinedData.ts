import * as mongoose from 'mongoose';

const userDefinedData = new mongoose.Schema(
  {
  skills: {
    type : Array
  } , 
  domains :{
    type : Array
  },
  modules : {
    type : Array
  }, 
  apps:{
    type : Array
  }
  })