import { Request, Response } from "express";
import Pagination from "../services/Pagination";
import no_interested from "../models/Notinterest";
import no_interested_cand from "../models/Notinterestcand";
import { Types } from "mongoose";


export default class NotinterestedController {
  static async not_interested(req: Request, res: Response) {
 let {job_id , candidate_id } = req.body ;
 job_id = Types.ObjectId(job_id);
 console.log(job_id , candidate_id , req.body);
 if(!job_id || !candidate_id ) {
  return res.json({error : true , data : 'Check validations'});
 }
 else {
   try{
    const response = await no_interested.create({job_id: job_id , candidate_id : candidate_id});
    return res.json({error : false , data : 'success'});
  } catch(e){
     return  res.json({error : true , data : e});
   }
  }}


  static async not_interest_candidates(req: Request, res: Response) {
    let {candidate_id , hr_id } = req.body ;
    console.log(candidate_id , hr_id , req.body);
    if(!candidate_id  || !hr_id ) {
     return res.json({error : true , data : 'Check validations'});
    }
    else {
      try{
       const response = await no_interested_cand.create({candidate_id : candidate_id , hr_id : hr_id});
       return res.json({error : false , data : 'success'});
     } catch(e){
        return  res.json({error : true , data : e});
      }
     }}
   

}