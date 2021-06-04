import e, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import Company from '../models/Company';
import Pagination from '../services/Pagination';
import { Types } from 'mongoose';
import User from "../models/User";
import { CONNREFUSED } from 'dns';
import { ObjectId } from 'mongodb';

export default class CompanyController {

  static async index(req: Request, res: Response) {
    const { query } = req;

    query.page = Number(query.page) || 1;
    query.per_page = Number(query.per_page) || 20;

    if (!query.sort_by || (query.sort_by && ['title', 'updatedAt'].indexOf(query.sort_by) === -1)) {
      query.sort_by = 'createdAt';
    }

    if (!query.sort_as || (query.sort_as && query.sort_as === 'desc')) {
      query.sort_as = -1;
    } else {
      query.sort_as = 1;
    }

    const finder = {
      title: new RegExp(query.q, 'ig')
    };

    try {
      const companies = await Company.find(finder)
        .skip(Number(query.page - 1) * Number(query.per_page))
        .limit(Number(query.per_page))
        .sort({ [query.sort_by]: query.sort_as });

      const totalCompanies = await Company.count(finder);
      const paginate = Pagination(totalCompanies, companies.length, query.per_page, query.page);
      return res.json({ error: false, data: { companies, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async create(req: Request, res: Response) {
    const { body } = req;
    body.addedBy = req.user._id;
    // if (!body.title) {
    //   return res.json({ error: true, status: 422, data: [{ path: 'title', message: 'Title of the company is required.' }] });
    // }
    try {
        let data
        let payload 
        let error
      switch(req.user.role){
        case 'hr' : 
          error = await Company.findOne({title: req.body.title});
          if (error && req.body.title) 
            return res.json({ error: true, message: 'Company name already exists.'});
          if (!req.body.title)
            req.body.title = req.user.name;
          req.body.title = req.body.title.replace(/\s+/g," ").trim();
          payload = req.body
          payload.adminApproved = false;
          payload.tier = 3;
          console.log(req.body);
          
          data = await Company.create(req.body);
          await User.updateOne({_id : req.user._id }, {$set : {'company_id' :  Types.ObjectId(data._id)}});
          break
        case 'candidate': 
          if (!req.body.title)
            return res.json({ error: true, message: 'Company with blank name cant be created'});
          data = await Company.findOne({title: req.body.title});
          // if company exists with the same title, send the existing object
          if (data) break;
          payload = {title:req.body.title , adminApproved: false , tier : 3, addedBy: req.user._id}
          data = await Company.create(payload);
          break
        case 'admin' : 
          error = await Company.findOne({title: req.body.title});
          if (error) 
            return res.json({ error: true, message: 'Company name already exists.'});
          payload = {title:req.body.title , adminApproved: true , tier : req.body.tier}
          data = await Company.create(payload);
          break
      }
      return res.json({ error: false, message: 'Company added successfully.', data });
    } catch (e) {
      console.log('company error',e);
      
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const data = await Company.findById(req.params.id);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async update(req: Request, res: Response) {
    const { body } = req;
    try {
      const error = await Company.findOne({title: body.title, _id: {$ne: Types.ObjectId(req.params.id)}});
      console.log(error, req.params);
      
      if (error) 
        return res.json({ error: true, message: 'Company name already exists.'})
      const company: any = await Company.findById(req.params.id);
      if(body.title !== company.title) {
        company.title = body.title.replace(/\s+/g," ").trim() || company.title;
      }
      if (!company.title)
        company.title = req.user.name;
      company.addedBy = req.user._id;
      company.description = body.description || company.description;
      company.logo = body.logo;
      company.website = body.website || company.website;
      company.location = body.location || company.location;
      company.perks = body.perks || company.perks;
      company.facts = body.facts || company.facts;
      company.email = body.email || company.email;
      company.contact = body.contact || company.contact;
      company.InterviewProcess = body.InterviewProcess || company.InterviewProcess;
      console.log('req' , req.params , company)
      const response = await Company.findByIdAndUpdate(req.params.id, company);
      return res.json({ error: false, message: 'Company updated successfully.' });
    } catch (e) {
      console.log('e' , e)
      return res.json({ error: true, status: 500, message: 'Company update failed.' });
    }
  }

  static async getCompaniesByHrId(req : Request , res : Response) {
    const id = req.params.adminid;
    console.log('requset'  , req)
    try {
      console.log('id' , id)
      const data = await Company.find({addedBy : Types.ObjectId(id)})
      return res.json({error : false , data : data })
    } catch(e) {
      return res.json({error : true , status : 500 , message : e})
    }
  }

  static list(req : Request , res : Response){
    Company.find({ title: { $regex: (req.query.q || ''), $options: "i" }}, function(err, success) {
      if(err) return res.json({error : true , status : 500 , message : err});
      return res.json({error : false , data:success })
    });   
  }

  static adminAllList(req : Request , res : Response){
    Company.find({ title: { $regex: (req.query.q || ''), $options: "i" } }, function(err, success) {
      if(err) return res.json({error : true , status : 500 , message : err});
      return res.json({error : false , data:success })
    });   
  }


  static async adminList(req : Request , res : Response){
    const { body } = req;
      const data = await Company.find({ title: { $regex: (body.q || ''), $options: "i" }}).sort({ [body.sort_by || "updatedAt"]: body.sort_as || -1 }).skip(Number(body.page - 1) * Number(body.per_page))
      .limit(Number(body.per_page))
      var page = body.page || 1,
      per_page = body.per_page || 30;
      const total_companies = await Company.count({ title: { $regex: (body.q || ''), $options: "i" }});
      const total_pages = parseInt(total_companies/per_page);
      return res.json({
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: data.length,
      total_pages: total_pages,
      total_companies: total_companies,
      data: data
      });
    
  }

  static async updateCompanyAdmin(req: Request, res: Response) {
    let tier = req.body.tier;
    let adminApproved = req.body.adminApproved;
    console.log('req',req.body, tier);  
    
    const company = await Company.findByIdAndUpdate(req.body._id ,{ $set: { 'tier' : tier , 'adminApproved': adminApproved}}); 
    return res.json({ error: false, message: 'Company updated! Click on Apply to reflect changes' })
  }

  static async companyAdminApprove(req: Request, res: Response) {
    try {
      const companyId = req.body.companyId;
      const status = req.body.status;
      const user = await Company.findByIdAndUpdate(companyId ,{ $set: { 'adminApproved' : status }}); 
      return res.json({ error: false, message: 'Status updated successfully' })
    }
    catch(e) {
      return res.json({ error: true,status: 500, message: 'An error occured.' })
    } 
  } 

  //apply tier to all candidate profiles
  static async applyToProfiles(req: Request, res: Response) {
    let company_array = req.body;
    company_array.forEach(element => {
      console.log('reached here', element);
      if (!element.tier)
        element.tier = 3;
     // update previous company for candidates
     User.updateMany({role: 'candidate', "experience.previous_company": {$elemMatch: { _id: Types.ObjectId(element._id) } }},{$set:{"experience.previous_company.$":{ _id: Types.ObjectId(element._id), title: element.title, tier: +(element.tier), adminApproved: element.adminApproved}}},function(err, candidates){
      // console.log('cand',candidates);
     });

     // update current company for candidates
     User.updateMany({ role: 'candidate', "experience.current_company._id" : Types.ObjectId(element._id)},{$set:{"experience.current_company":{ _id: Types.ObjectId(element._id), title: element.title, tier: +(element.tier), adminApproved: element.adminApproved}}},function(err, candidates){
      // console.log('cand',candidates);
     });

     // update overall tier for candidates
    //  User.updateMany({role: 'candidate', $or : [{"experience.previous_company": {$elemMatch: { _id: Types.ObjectId(element._id) } }},{"experience.current_company._id" : Types.ObjectId(element._id)}], overall_tier: {$gte: +(element.tier)}},{$set:{"overall_tier":+(element.tier)}},function(err, candidates){
    //   console.log('cand',candidates,err);
    //  });

    User.find({role: 'candidate', $or : [{"experience.previous_company": {$elemMatch: { _id: Types.ObjectId(element._id) } }},{"experience.current_company._id" : Types.ObjectId(element._id)}]},function(err, candidates){
      candidates.forEach(cand => {
        const maxPrevTier = cand['experience']['previous_company'].reduce((p, c) => p.tier < c.tier ? p : c);
        let overall_tier;
        if (cand['experience']['current_company'])
          overall_tier = maxPrevTier['tier'] < cand['experience']['current_company']['tier'] ? maxPrevTier['tier'] : cand['experience']['current_company']['tier'];
        else 
          overall_tier = maxPrevTier['tier'];
        console.log('cand',cand['name'],maxPrevTier['tier'], overall_tier);
         User.update({_id: Types.ObjectId(cand['_id']), role: 'candidate', $or : [{"experience.previous_company": {$elemMatch: { _id: Types.ObjectId(element._id) } }},{"experience.current_company._id" : Types.ObjectId(element._id)}]},{$set:{"overall_tier":(overall_tier)}},function(err, candidates){
          console.log('cand',candidates,err);
        });
      })
     });

    });
    
    // let company_object;
    // const candidates = await User.find({role: 'candidate', "experience.current_company": {$exists: true }}); 
    // candidates.forEach((item: any) => {
    //   console.log('canidates',item);
    //   let current_company_name = item.experience.current_company;
    //   // let company_object = Company.find({title : current_company_name}, {_id: 1});
    //   Company.findOne({title : current_company_name}, {_id: 1, title: 1, adminApproved: 1, tier: 1},function(err, userObj){
    //     company_object = userObj;
    //     console.log('company',userObj, typeof current_company_name);
    //     if ((typeof current_company_name) == 'string') {
    //       User.updateOne({_id : Types.ObjectId(item._id)}, { $set: { "experience.current_company": company_object } },function(err, res){
    //         console.log('update one res', res);
    //       });
    //     }
    //   });
    // })
    return res.json({ error: false, message: 'Profiles updated successfully' })
  }

  //update expected salary for candidates with value as Nan
  static async getTierCategorization(req: Request, res: Response) {
    console.log('tier request',req.body);
    let tier_search = +(req.body.tier);
    try {
      const { PaginationQueryParams } = req.body;
      var page = PaginationQueryParams.page || 1,
      per_page = PaginationQueryParams.per_page || 30;
      const tier = await Company.find({tier:tier_search})
      .skip(Number(PaginationQueryParams.page - 1) * Number(PaginationQueryParams.per_page))
      .limit(Number(PaginationQueryParams.per_page))
      .sort('title'); 
      const total_companies = await Company.count({tier: tier_search});
      const total_pages = +(total_companies/per_page);
      // const data = await Company.find({ title: { $regex: (req.query.q || ''), $options: "i" }})
      return res.json({
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: tier.length,
      total_companies: total_companies,
      total_pages: total_pages,
      tier: tier
      });
    } catch (e) {
      return res.json({ error: true,status: 500, message: 'An error occured.'+e })
    } 
  }

  static async checkCompanyName(req: Request, res: Response) {
    const { body } = req;
    try {
      const error = req.params.id ? await Company.findOne({title: body.title, _id: {$ne: Types.ObjectId(req.params.id)}}) : await Company.findOne({title: body.title});
      console.log(error, req.params);
      
      if (error) 
        return res.json({ error: true, message: 'Company name already exists.'})
      return res.json({ error: false, message: 'Company name can be used.' });
    } catch (e) {
      console.log('e' , e)
      return res.json({ error: true, status: 500, message: 'Company update failed.' });
    }
  }

}