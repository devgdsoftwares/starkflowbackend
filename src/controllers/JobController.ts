import { Request, Response } from "express";

import Job from "../models/Job";
import Match from "../models/Match";
import JobService from "../services/JobService";
import Pagination from "../services/Pagination";
import { JobEvents } from "../events/JobEvents";
import ProcessedData from "../models/ProcessedData";
import { Mongoose, Types } from "mongoose";
import Payment from "../models/Payment";
import Message from "../models/Message";
import * as request from "request-promise-native";
import MatchController from "./MatchController";
import AuthService from "../services/AuthService";
import AdminConfig from "../models/adminConfig.model"
import User from "../models/User";
import no_interested from '../models/Notinterest';

export default class JobController {
  static async index(req: Request, res: Response) {
    const { query } = req;
    // console.log('request',req);


    if (!query.page) {
      query.page = 1;
    }

    if (!query.per_page) {
      query.per_page = 20;
    }

    if (
      !query.sort_by ||
      (query.sort_by && ["title", "updatedAt"].indexOf(query.sort_by) === -1)
    ) {
      query.sort_by = "updatedAt";
    }

    if (!query.sort_as || (query.sort_as && query.sort_as === "desc")) {
      query.sort_as = -1;
    } else {
      query.sort_as = 1;
    }

    let finder;

    if (query.from_admin == 1) {
      finder = {
        user: query.client_id
      };
    }
    else {
      finder = {
        user: req.user._id
      };
    }

    if (query.company_id) {
      finder['company'] = Types.ObjectId(query.company_id);
    }
    if (query.q) {
      finder['title'] = { $regex: new RegExp(query.q), $options: 'ig' };
    }

    // Archived Jobs Filter
    if (query.archived) {
      finder["archived"] = query.archived;
    }
    // else {
    //   finder["archived"] = false;
    // }

    console.log('finder', finder)

    try {
      // console.log('finder' , finder);
      const jobs = await Job.find(finder)
        .skip((query.page * 1 - 1) * (query.per_page * 1))
        .limit(query.per_page * 1)
        .sort({ [query.sort_by]: query.sort_as })
        .populate("user", "firstName lastName pictureUrl")
        .populate("company", "title  description logo website InterviewProcess perks facts");


      const totalJobs = await Job.count(finder);
      const paginate = Pagination(
        totalJobs,
        jobs.length,
        query.per_page,
        query.page
      );

      let archivedJobs, totalArchivedJobs, archivedPaginate;

      if (!query.archived) {
        finder["archived"] = true;

        archivedJobs = await Job.find(finder)
          .skip((query.page * 1 - 1) * (query.per_page * 1))
          .limit(query.per_page * 1)
          .sort({ [query.sort_by]: query.sort_as })
          .populate("user", "firstName lastName pictureUrl")
          .populate("company", "title  description logo InterviewProcess perks facts");


        totalArchivedJobs = await Job.count(finder);
        archivedPaginate = Pagination(
          totalArchivedJobs,
          archivedJobs.length,
          query.per_page,
          query.page
        );
      }
      return res.json({
        error: false, data: {
          jobs,
          paginate,
          archived: {
            jobs: archivedJobs,
            paginate: archivedPaginate
          }
        }
      });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async create(req: Request, res: Response) {
    if (!req.user.company_id) {
      return res.json({
        error: true,
        status: 422,
        message: "Please add the company"
      });
    }

    try {
      const data = req.body;
      const errors = JobService.validate(data);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          message: "Validation failed",
          data: errors
        });
      }
      data.archived = false;
      data.user = req.user._id;
      data.company = data.companyId ? Types.ObjectId(data.companyId) : Types.ObjectId(req.user.company_id);

      // Setting 30 Day Expiry Time
      data.expiry_date = new Date(new Date().setDate(new Date().getDate() + 30));
      data.notice_period = 1;
      // needs refactoring
      if (data.availability) {
        switch (data.availability) {
          case "Immediately":
            data.notice_period = 1;
            break;

          default:
            data.notice_period = 1;
            break;

        }
      }

      if (data.salary && Object.keys(data.salary).length) {
        let currency, duration;

        (async () => {
          // const baseUrl = 'http://apilayer.net/api/live?access_key=258c5cbf147e728619a0e129997a524f&currencies='+data.salary.currency+'&source=USD&format=1'

          // base/target
          const baseUrl = 'https://v6.exchangerate-api.com/v6/1a334af3220072f3ae5bde4d/pair/'+data.salary.currency+'/USD';
          var options = {
            uri: baseUrl,
          };
          console.log('salary currency: ', data.salary, data.salary.currency, baseUrl);

          let result = await request.get(options);
          result = JSON.parse(result)
          // console.log('rates result: ', result, result['quotes']['USD'+data.salary.currrency]);
          console.log('rates result: ', result, result['conversion_rate']);
          // currency = result['quotes']['USD'+data.salary.currency];
          currency = result['conversion_rate'];
          data.start_salary = +(parseFloat(data.salary.start * currency).toFixed(2));
          data.end_salary = +(parseFloat(data.salary.end * currency).toFixed(2));
          const job = await Job.create(data);
          JobEvents.created(job);
          return res.json({
            error: false,
            status: 201,
            message: "Job posted successfully.",
            data: job
          });
        })()
      }

    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { query } = req.query;
      const job = await Job.findById(id).populate(
        "user",
        "firstName lastName pictureUrl"
      ).populate("company", "title  description logo");
      
      const otherJobs = await Job.find({
        'user': req['user']._id,
        '_id': { $nin: id }
      }).limit(3).sort({archived:1})

      console.log('customerId::::::------',req['user'].customerId);
      console.log('jobID::::::------',job.user._id);



      console.log('userrrrrr: ', req.user.customerId, req.user.customerId != job.user._id);
      console.log('jobbbbbbb: ', job.user._id, req.user.customerId == job.user._id);
      // if (req.user.customerId == job.user._id) {
      //   return res.json({ error: false, data: job, otherJobs: otherJobs });
      // }
      // if (req.user.customerId != job.user._id) {
      //   return res.json({
      //     error: true,
      //     status: 404,
      //     message: "You're not authorized to view this job."
      //   });
      // }
      // if (req.user.customerId == job.user._id) {
      //   return res.json({ error: false, data: job, otherJobs: otherJobs });
      // }
      if (!job) {
        return res.json({
          error: true,
          status: 404,
          message: "Job not found."
        });
      }else{
        return res.json({ error: false, data: job, otherJobs: otherJobs });
      }
      
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async public(req: Request, res: Response) {
    console.log('check user', req.headers.authorization);

    let similarJobs;
    try {
      const { id } = req.params;
      var job: any;
      if (!req.headers.authorization)
        job = await Job.findById(id)
          .populate("user", "firstName lastName")
          .populate("company", "title  description logo location website perks facts InterviewProcess");
      else if (req.headers.authorization)
        job = await Job.findById(id)
          .populate("user", "firstName lastName")
          .populate("company", "title  description logo location website perks facts InterviewProcess");
      if (job) {
        similarJobs = await Job.find({ 'title': job.title }, { domains: 0, modules: 0, apps: 0 })
          .limit(3)
          .populate('company', "title  description logo location website ");
      }
      if (!job) {
        return res.json({
          error: true,
          status: 404,
          message: "Job not found."
        });
      }
      return res.json({ error: false, data: job, similarJobs: similarJobs });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured." + e
      });
    }
  }

  static async update(req: Request, res: Response) {
    // const { id } = req.params;
    // let job: any = await Job.findById(id);
    // JobEvents.updated(job);
    // return res.json({
    //   error: false,
    //   data: job,
    //   message: "Job updated successfully."
    // });
    try {
      const data = req.body;
      data.notice_period = 1;

      if (data.availability) {

        switch (data.availability) {
          case "Immediately":
            data.notice_period = 1;
            break;

          default:
            data.notice_period = 1;
            break;



        }
      }

      if (data.salary && Object.keys(data.salary).length) {
        let currency, duration;
        (async () => {
          // const baseUrl = 'http://apilayer.net/api/live?access_key=258c5cbf147e728619a0e129997a524f&currencies='+data.salary.currency+'&source=USD&format=1'
          
          // base/target
          const baseUrl = 'https://v6.exchangerate-api.com/v6/1a334af3220072f3ae5bde4d/pair/'+data.salary.currency+'/USD';
          var options = {
            uri: baseUrl,
          };
          console.log('salary currency: ', data.salary, data.salary.currency, baseUrl);
          
          // await request.get('https://v6.exchangerate-api.com/v6/1a334af3220072f3ae5bde4d/pair/'+data.salary.currrency+'/USD', function(err, res, body) {
          //     console.log('result from request', body);
          // });

          let result = await request.get(options);
          result = JSON.parse(result)
          // console.log('rates result: ', result, result['quotes']['USD'+data.salary.currrency]);
          console.log('rates result: ', result, result['conversion_rate']);
          // currency = result['quotes']['USD'+data.salary.currency];
          currency = result['conversion_rate'];
          data.start_salary = +(parseFloat(data.salary.start * currency).toFixed(2));
          data.end_salary = +(parseFloat(data.salary.end * currency).toFixed(2));
          data.expiry_date = new Date(new Date().setDate(new Date().getDate() + 30));
          data.archived = false;
          const errors = JobService.validate(data);
          if (errors) {
            return res.json({
              error: true,
              status: 422,
              message: "Validation failed",
              data: errors
            });
          }
          data.user = req.user._id;

          const { id } = req.params;
          let job: any = await Job.findById(id);

          // No Job
          if (!job) {
            return res.json({
              error: true,
              status: 404,
              message: "Job not found."
            });
          }

          // Job is archived
          // if (job.archived) {
          //   return res.json({
          //     error: true,
          //     status: 422,
          //     message: "Job is archived and can not be updated."
          //   });
          // }

          job = job.toJSON();
          job = { ...job, ...data };
          await Job.findByIdAndUpdate(id, { $set: job });
          JobEvents.updated(job);
          return res.json({
            error: false,
            data: job,
            message: "Job updated successfully."
          });
        })()
      }

    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async archive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let archived = req.body.archived;
      let message = archived ? "Job archived successfully." : "Job unarchived successfully."
      const job: any = await Job.findById(id);
      console.log('req.body', req.body.archived, req.params, archived);
      if (`${job.user}` !== `${req.user._id}`) {
        return res.json({ error: true, status: 401, message: "Unauthorized." });
      }
      await Job.updateOne({ _id: Types.ObjectId(id) }, { $set: { archived: archived } });

      await Match.updateMany({ job: Types.ObjectId(id) }, { $set: { archived: archived } });

      await Message.updateMany({ job: Types.ObjectId(id) }, { $set: { archived: archived } });

      await ProcessedData.updateOne(
        { type: "job", job_id: id },
        { $set: { archived: true } }
      );

      return res.json({ error: false, message: message });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }
  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await Job.findById(id);

      if (job.user.toString() !== req.user._id.toString()) {
        return res.json({ error: true, status: 401, message: "Unauthorized." });
      }

      await Job.findByIdAndRemove(id);

      await ProcessedData.deleteOne({ type: "job", job_id: id });

      return res.json({ error: false, message: "Job deleted successfully." });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }
  static async getJobs(req: Request, res: Response) {
    let { body } = req;
    let finder = {};
    let finderUnfilteredMin = {};
    let finderUnfilteredMax = {};
    let minSalary, maxSalary, minExperience, maxExperience;
    let filterConfig = await AdminConfig.find({})
    if (filterConfig) {
      minSalary = filterConfig[0]['minJobsSalary']
      maxSalary = filterConfig[0]['maxJobsSalary']
      minExperience = filterConfig[0]['minExperience']
      maxExperience = filterConfig[0]['maxExperience']
    }
    // console.log('body job', minSalary, maxSalary, minExperience, maxExperience);
    const user_id = req.query && req.query.user_id ? Types.ObjectId(req.query.user_id) : null
    await AdminConfig.find({}, function (err, resp) {
      if (err) {
        return res.json({
          error: true,
          status: 500,
          message: `An error occured. ${err.message}`
        });
      }
      minSalary = resp[0]['minJobsSalary']
      maxSalary = resp[0]['maxJobsSalary']

      minExperience = resp[0]['minExperience']
      maxExperience = resp[0]['maxExperience']
    })

    if (!body.page) {
      body.page = 1;
    }
    if (!body.per_page) {
      body.per_page = 20;
    }

    if (body.role && body.role.length > 0) {
      finder[`title`] = { $in: body.role };
    }

    if (body.type && body.type.length > 0) {
      // console.log('body type', body.type);

      finder[`looking_for`] = { $in: body.type };
    }


    if (body.skills && body.skills.length > 0) {
      // console.log('body skills', body.skills);
      finder[`skills.data.title`] = { $in: body.skills };
    }

    if (body.experience) {
      console.log('experience checked: ', body.experience);
      if (body.experience.max == 9) {
        finder[`$or`] = [
        { 'experience_required.value': { $eq: null}},
        {
           'experience_required.value': { $lte: +(body.experience.max), $gte: +(body.experience.min) }
        }
        ]
      }
      else
        finder[`experience_required.value`] = { $lte: +(body.experience.max), $gte: +(body.experience.min) };
      // finder[`experience_required.value`] = { $eq: +(body.experience.value) };
      // finder[`experience_required.max`] = { $lte: +(body.experience.max) };
    }

    // New Design Filters

    if (body.salary) {
      finder[`end_salary`] = { $lte: +(body.salary) };
    }

    if (body.availability) {
      finder[`availability`] = { $eq: body.availability }
    }

    if (body.fluency) {
      finder[`fluency`] = { $eq: body.fluency }
    }

    if (body.locations && body.locations.length > 0) {
      finder[`locations`] = { $in: body.locations }
    }

    finder[`archived`] = false;

    let notjobId = [];
    let project;
    if (req.headers.authorization && req.headers.authorization !== 'null') {
      const notinterested: any = await no_interested.find({ candidate_id: user_id }, { job_id: 1, _id: 0 });
      notjobId = notinterested.map(item => { if (item.job_id != undefined) return Types.ObjectId(item.job_id) });
      project = await { "lastName": 0, "email": 0, "phone": 0, "emailAddress": 0 };
    }
    else
      project = await { "company.logo": 0, "company.title": 0 };
    try {
      console.log('not interested', project);
      
      // let minSalary, maxSalary, minExperience, maxExperience;
      const jobsList = await Job.aggregate(
        [
          { $project: project },
          {
            $lookup:
            {
              from: "companies",
              localField: "company",
              foreignField: "_id",
              as: "company"
            }
          },
          {
            $unwind: "$company"
          },
          {
            $match: finder
          },
          { $match: { "_id": { '$nin': notjobId } } },
          {
            $sort: { createdAt: 1 }
          },
          { $skip: body.per_page * (body.page - 1) },
          { $limit: 20 },
        ]
      );


      let jobs = jobsList
      let query;
      if (body.role)
        query = { title: body.role, archived: false, 'experience_required': { $exists: true, $ne: null } }, { experience_required: 1 };
      else
        query = { archived: false, 'experience_required': { $exists: true, $ne: null } }, { experience_required: 1 }
      const totalJobs = await Job.count(finder);

      const paginate = Pagination(
        (totalJobs),
        jobs.length,
        body.per_page,
        body.page
      );
      return res.json({ error: false, data: { jobs, paginate }, values: { minSalary, maxSalary, minExperience, maxExperience } });
    }
    catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }
  static async checkJobAddition(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const jobCount = await Job.count({ archived: false, company: Types.ObjectId(id) });

      if (!jobCount)
        return res.json({ error: false, go: true });

      const paymentCount = await Payment.count({ completed: true, company_id: Types.ObjectId(id) });
      const go = (jobCount - paymentCount) <= 1;

      return res.json({ error: false, go });
    }
    catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async getJobsTeamBill(req: Request, res: Response) {
    const { query } = req;
    const user = req.user._id;
    const finder = {
      user: user
    };
    finder["archived"] = false;
    try {
      // console.log('finder' , finder);
      const jobs = await Job.find(finder, '_id')
      let jobsList = jobs.map(res => {
        return Types.ObjectId(res._id)
      })
      const $match = {
        'hiring_status.job': { $in: jobsList },
        'hiring_status.status': 1,
        'hiring_status': { $exists: true }
      };
      const aggregate = [
        {
          $match
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            totalBill: { $sum: "$expected_salary" }
          }
        }
      ]
      const teamMembers = await User.aggregate(aggregate)
      if (teamMembers.length > 0) {
        let total = 0
        teamMembers.forEach((val, index) => {
          total = total + (val.totalBill / 12)
          if (index == teamMembers.length - 1) {
            return res.json({
              error: false, data: total.toFixed(2)
            });
          }
        })
      }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }


  }

  static async getTeam(req: Request, res: Response) {
    const { query } = req;
    const user = req.user._id;
    let finder;
    if (query.from_admin == 1) {
      finder = {
        user: query.client_id
      };
    }
    else {
      finder = {
        user: user
      };
    }
    // const finder = {
    //   user: user
    // };

    const teamProject = {
      admin_approve: 1,
      approved: 1,
      autoMatch: 1,
      availability: 1,
      avatar: 1,
      designation: 1,
      education: 1,
      email: 1,
      expected_salary: 1,
      experience: 1,
      firstName: 1,
      hiring_status: 1,
      industry: 1,
      jobDetail: 1,
      lastName: 1,
      looking_for: 1,
      name: 1,
      notice_period: 1,
      onboarding: 1,
      overall_tier: 1,
      phone: 1,
      projects: 1,
      recruiter: 1,
      resume: 1,
      resume_name: 1,
      salary: 1,
      skills: 1,
      summary: 1,
      updatedAt: 1,
      last_logged_in: 1
    }

    const teamWithBillProject = {
      avatar: 1,
      designation: 1,
      expected_salary: 1,
      experience: 1,
      firstName: 1,
      jobDetail: 1,
      lastName: 1,
      name: 1,
    }
    // let conversation = { "$match": { "to._id": { $exists: true } } };
    // if (req.query.conversation == 'submitted_from_job_posting')
    //     conversation = { "$match": { "to.role": 'candidate' } };
    //   else if (req.query.conversation == 'submitted_the_cv')
    //     conversation = { "$match": { "to._id": { $exists: true }, "to.role": { $ne: "candidate" } } };
    //   else
    //     conversation = { "$match": { "to._id": { $exists: true } } };
    // }
    finder["archived"] = false;

    try {
      
      const jobs = await Job.find(finder, '_id')
      let jobsList = jobs.map(res => {
        return Types.ObjectId(res._id)
      })
      
      if (!query.jobId && query.from_admin == 1) jobsList = [];
      if (query.jobId && query.from_admin == 1) {jobsList = []; await jobsList.push(Types.ObjectId(query.jobId))}
      console.log('finder' , finder, jobsList);
      // let $match, aggregate1, $match2, aggregate2;
        // if ((jobsList.length > 0 && query.from_admin) || !query.from_admin) {
          const aggregate1 = [
            { $match:  {
                'hiring_status.job': { $in: jobsList },
                'hiring_status.status': 1,
                'hiring_status': { $exists: true },
                // 'jojobDetail._id': query.jobId
              
            }},
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: "jobs",
                localField: "hiring_status.job",
                foreignField: "_id",
                as: "jobDetail"
              }
            },
            { $unwind: "$jobDetail" },
            {
              $lookup: {
                from: "companies",
                localField: "jobDetail.company",
                foreignField: "_id",
                as: "jobDetail.companyDetail"
              }
            },
            { $unwind: "$jobDetail.companyDetail" },
            {
              $lookup: {
                from: "users",
                localField: "hiring_status.hirer_id",
                foreignField: "_id",
                as: "recruiter"
              }
            },
            { $unwind: "$recruiter" },
            {
              $project: query.bill == '1' ? teamWithBillProject : teamProject
            }
          ]
          const client_id = query.from_admin ? query.client_id : user;
          const aggregate2 = [
            { $match:{
              'hiring_status.job': { $exists: false },
              'hiring_status.status': 1,
              'hiring_status.hirer_id': Types.ObjectId(client_id),
              'hiring_status': { $exists: true },
              // 'jojobDetail._id': query.jobId
            }},
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: "users",
                localField: "hiring_status.hirer_id",
                foreignField: "_id",
                as: "recruiter"
              }
            },
            { $unwind: "$recruiter" },
            {
              $project: query.bill == '1' ? teamWithBillProject : teamProject
            }
          ]
          let teamMembers;
          //from admin got job id
          if ((jobsList.length > 0 && query.from_admin))
             teamMembers = await User.aggregate(aggregate1)
          //from admin no job
          if ((jobsList.length == 0 && query.from_admin))
             teamMembers = await User.aggregate(aggregate2)
          //from client login get team
          if (!query.from_admin) {
            const result1 = await User.aggregate(aggregate1)
            const result2 = await User.aggregate(aggregate2)
            teamMembers = [...result1, ...result2]
          }
            
      return res.json({
        error: false, data: teamMembers
      });


    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."+e
      });
    }


  }

  private static transformMessage(message: any, myId: any) {
    /**
     * LoggedInUser: Basit
     * {
     *    from: {id: 1,  name: 'Basit'},
     *    to: {id: 2,  name: 'Narek'},
     *    text: 'Yello'
     * }
     */
    if (message.toJSON) {
      message = message.toJSON();
    }
    // If message is from Basit to Narek
    if (String(message.from._id) === String(myId)) {
      message.me = message.from;
      message.other = message.to;
      message.position = "right";
    } else {
      message.me = message.to;
      message.other = message.from;
      message.position = "left";
    }

    delete message.to;
    delete message.from;
    return message;
  }


}
