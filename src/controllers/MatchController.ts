import { Request, Response } from "express";
import Pagination from "../services/Pagination";
import Match from "../models/Match";
import { Types, ConnectionBase } from "mongoose";
import { isMongoId } from 'validator';
import no_interested from '../models/Notinterest';
import no_interested_cand from '../models/Notinterestcand';
import message from '../models/Message';
import User from "../models/User";
import Job from "../models/Job";
import AdminConfig from '../models/adminConfig.model'
import { breakStatement } from "babel-types";
import { ObjectId } from "mongodb";
// import { Object } from "es6-shim";

export default class MatchController {
  static async index(req: Request, res: Response) {
    let { body, user } = req;
    let bodyUnfilteredMax
    let bodyUnfilteredMin
    let minSalary, maxSalary, minExperience, maxExperience

    // Get Min, max salary and min max experience from admin config values
   // Get Min, max salary and min max experience from admin config values
   let filterParam = await AdminConfig.find({})

   if(filterParam){
     if (user.role === "hr"){
       minSalary = filterParam[0]['minSalary']
       maxSalary = filterParam[0]['maxSalary']
     }
     else{
       minSalary = filterParam[0]['minJobsSalary']
       maxSalary = filterParam[0]['maxJobsSalary']
     }
 
     minExperience = filterParam[0]['minExperience']
     maxExperience = filterParam[0]['maxExperience']
   }


    console.log('match body request: ', body, user);

    // if (user.role === "hr" && !body.job) {
    //   return res.json({ error: false, data: {} });
    // }
    // else
    if (user.role === "hr" || user.role === 'candidate') {
      // let job_title = await Job.findById(body.job).select('title');
      // if (!body.title)
        body.title = body.role;
      console.log('job title', body.title);

    }
    // if (user.role === 'candidate') {
    //   body.title = user.designation;
    // }
    user = user.toJSON();
    // console.log('userrr',user);

    let job, candidate, type, checkStatus;
    const details = user.role === 'hr' ? await Job.findById(body.job).lean() : user;
    const hr = { _id: 1, name: 1, firstName: 1, lastName: 1, avatar: 1 };
    const company = {
      _id: 1,
      title: 1,
      description: 1,
      logo: 1,
    };
    if (user.role === "hr") {
      type = "hr";
      body = MatchController.processInputBody(body, "hr", details);
      bodyUnfilteredMin = JSON.parse(JSON.stringify(body));
      bodyUnfilteredMin.finder['job._id'] = Types.ObjectId(bodyUnfilteredMin.finder['job._id'])
      bodyUnfilteredMax = JSON.parse(JSON.stringify(body));
      bodyUnfilteredMax.finder['job._id'] = Types.ObjectId(bodyUnfilteredMax.finder['job._id'])
      if (!body.finder['candidate.expected_salary']) {
        body.finder['candidate.expected_salary'] = { '$lte': maxSalary, '$gte': minSalary }
      }
      bodyUnfilteredMin.finder['candidate.expected_salary'] = { '$lt': minSalary }
      bodyUnfilteredMax.finder['candidate.expected_salary'] = { '$gt': maxSalary }
      job = {
        _id: 1,
        title: 1,
        company
      };
      candidate = {
        _id: 1,
        name: 1,
        avatar: 1,
        bio: 1,
        bioHTML: 1,
        locations: 1,
        current_location: 1,
        projects: 1,
        skills: 1,
        education: 1,
        salary: 1,
        expected_salary: 1,
        experience_role: 1,
        designation: 1,
        summary: 1,
        availability: 1,
        looking_for: 1,
        url: 1,
        phone: 1,
        skypeId: 1,
        course: 1,
        certificate: 1,
        experience: 1,
        last_logged_in: 1,
        overall_tier: 1
      };
    } else {
      type = "candidate";
      body = MatchController.processInputBody(body, "candidate", details);
      // console.log('processed body candidate: ', body, 'body end');
      // { 'job.start_salary': { '$gte': 299 },
      // 'job.end_salary': { '$lte': 6834 }
      //  'job.title': { '$eq': 'Front-End Developer' },
      //  'job.experience_required': { '$lte': 8, '$gte': 1 } }
      bodyUnfilteredMin = JSON.parse(JSON.stringify(body));
      bodyUnfilteredMax = JSON.parse(JSON.stringify(body));
      if (!body.finder['job.start_salary']) {
        body.finder['job.start_salary'] = { '$gte': minSalary }
      }
      if (!body.finder['job.end_salary']) {
        body.finder['job.end_salary'] = { '$lte': maxSalary }
      }

      if (!body.finder['job.experience_required']) {
        body.finder['job.experience_required.min'] = { '$gte': minExperience };
        body.finder['job.experience_required.max'] = { '$lte': maxExperience }
      }
      console.log('finder', body.finder)
      bodyUnfilteredMin.finder['job.start_salary'] = { '$gt': maxSalary }
      bodyUnfilteredMin.finder['job.end_salary'] = { '$lt': minSalary }
      bodyUnfilteredMin.finder['job.experience_required.min'] = { '$gte': minExperience };

      bodyUnfilteredMax.finder['job.start_salary'] = { '$gt': maxSalary }
      bodyUnfilteredMax.finder['job.end_salary'] = { '$lt': minSalary }
      bodyUnfilteredMin.finder['job.experience_required.max'] = { '$lte': maxExperience }

      job = {
        apps: 1,
        _id: 1,
        company,
        archived: 1,
        availability: 1,
        notice_period: 1,
        experience_role: 1,
        experience_required: 1,
        salary: 1,
        end_salary: 1,
        start_salary: 1,
        mandatory: 1,
        createdAt: 1,
        updatedAt: 1,
        description: 1,
        short_description: 1,
        domains: 1,
        locations: 1,
        looking_for: 1,
        modules: 1,
        skills: 1,
        title: 1
      };
      candidate = { _id: 1, name: 1 };
    }

    checkStatus = {
      $and: [{ "hrstatus.status": { '$nin': ['Rejected'] } },
      { "candidatestatus.status": { '$nin': ['Rejected'] } }]
    }
    const $match = {
      // "score.total": { $gt: 0 },
      [type]: user._id,
      archived: false
    };
    if (user.role === 'hr') {
      $match['job'] = Types.ObjectId(req.body.job);
    }

    //Remove matches which are skipped or not interested
    const notinterested: any = await no_interested.find({ candidate_id: user._id }, { job_id: 1, _id: 0 });
    const notjobId = notinterested.map(item => { if (item.job_id != undefined) return Types.ObjectId(item.job_id) });

    const notinterestedcand: any = await no_interested_cand.find({ hr_id: user._id }, { candidate_id: 1, _id: 0 });
    const notcandId = notinterestedcand.map(item => { if (item.candidate_id != undefined) return Types.ObjectId(item.candidate_id) });
    // console.log('notjobid',notjobId,notcandId);

    //Remove matches which are already contacted
    const inboxMatch: any = await message.find({ from: user._id }, { to: 1, job: 1, _id: 0 });
    var notInboxId: any;
    if (type == 'hr')
      notInboxId = inboxMatch.map(item => { if (item.to != undefined) return Types.ObjectId(item.to) });
    else if (type == 'candidate')
      notInboxId = inboxMatch.map(item => { if (item.to != undefined) return Types.ObjectId(item.job) });
    // console.log('inboxMatch',notInboxId);
    // body.per_page = 1;

    const aggregate = [
      {
        $match
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "companies",
          localField: "job.company",
          foreignField: "_id",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      { $match: checkStatus },
      { $match: body.finder },
      { $match: body.mandatoryFilters },
      { $sort: { [body.sort_by]: body.sort_as } },
      // { $skip: body.per_page * (body.page - 1) },
      // { $limit: 20 },
      { $match: { "candidate.overall_tier": { $in: [1, 2, 3] } } },  //tier
      { $match: { "candidate.onboarding": false } },  //check expiry user
      { $match: { "candidate.admin_approve": true } },  //check admin approval
      { $match: { "job.archived": false } },  //check expiry job
      { $match: { "job._id": { '$nin': notjobId } } },
      { $match: { "candidate._id": { '$nin': notcandId } } },
      { $match: { "candidate._id": { '$nin': notInboxId } } },                //don't send in matches if already contacted through chat
      { $match: { "job._id": { '$nin': notInboxId } } },
      { $sort: { "candidate.overall_tier": 1 } },
      {
        $project: {
          _id: 0,
          score: 1,
          job,
          hr,
          candidate,
          hrstatus: 1,
          candidatestatus: 1
        }
      },
    ];

    // if (user.role == "hr") {
    // for Unfiltered Profile (min salary logic)
    const aggregateUnfilteredMin = [
      {
        $match
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "companies",
          localField: "job.company",
          foreignField: "_id",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      { $match: checkStatus },
      { $match: bodyUnfilteredMin.finder },
      { $match: bodyUnfilteredMin.mandatoryFilters },
      { $sort: { [bodyUnfilteredMin.sort_by]: bodyUnfilteredMin.sort_as } },
      // { $skip: body.per_page * (body.page - 1) },
      // { $limit: 20 },
      { $match: { "candidate.overall_tier": { $in: [1, 2, 3] } } },  //tier
      { $match: { "candidate.onboarding": false } },  //check expiry user
      { $match: { "candidate.admin_approve": true } },  //check admin approval
      { $match: { "job.archived": false } },  //check expiry job
      { $match: { "job._id": { '$nin': notjobId } } },
      { $match: { "candidate._id": { '$nin': notcandId } } },
      { $match: { "candidate._id": { '$nin': notInboxId } } },                //don't send in matches if already contacted through chat
      { $match: { "job._id": { '$nin': notInboxId } } },
      { $sort: { "candidate.overall_tier": 1 } },
      {
        $project: {
          _id: 0,
          score: 1,
          job,
          hr,
          candidate,
          hrstatus: 1,
          candidatestatus: 1
        }
      },
    ];

    // for Unfiltered Profile (max salary logic)
    const aggregateUnfilteredMax = [
      {
        $match
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "companies",
          localField: "job.company",
          foreignField: "_id",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      { $match: checkStatus },
      { $match: bodyUnfilteredMax.finder },
      { $match: bodyUnfilteredMax.mandatoryFilters },
      { $sort: { [bodyUnfilteredMax.sort_by]: bodyUnfilteredMax.sort_as } },
      // { $skip: body.per_page * (body.page - 1) },
      // { $limit: 20 },
      { $match: { "candidate.overall_tier": { $in: [1, 2, 3] } } },  //tier
      { $match: { "candidate.onboarding": false } },  //check expiry user
      { $match: { "candidate.admin_approve": true } },  //check admin approval
      { $match: { "job.archived": false } },  //check expiry job
      { $match: { "job._id": { '$nin': notjobId } } },
      { $match: { "candidate._id": { '$nin': notcandId } } },
      { $match: { "candidate._id": { '$nin': notInboxId } } },                //don't send in matches if already contacted through chat
      { $match: { "job._id": { '$nin': notInboxId } } },
      { $sort: { "candidate.overall_tier": 1 } },
      {
        $project: {
          _id: 0,
          score: 1,
          job,
          hr,
          candidate,
          hrstatus: 1,
          candidatestatus: 1
        }
      },
    ];
    // }

    const aggregate2 = [
      {
        $match
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "companies",
          localField: "job.company",
          foreignField: "_id",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      { $match: checkStatus },
      { $match: body.finder },
      { $match: body.mandatoryFilters },
      { $sort: { [body.sort_by]: body.sort_as } },
      { $match: { "candidate.onboarding": false } },  //check expiry user
      { $match: { "candidate.admin_approve": true } },  //check admin approval
      { $match: { "job.archived": false } },  //check expiry job
      { $match: { "job._id": { '$nin': notjobId } } },
      { $match: { "candidate._id": { '$nin': notcandId } } },
      { $match: { "candidate._id": { '$nin': notInboxId } } },                //don't send in matches if already contacted through chat
      { $match: { "job._id": { '$nin': notInboxId } } },
      {
        $project: {
          _id: 0,
          score: 1,
          job,
          hr,
          candidate,
          hrstatus: 1,
          candidatestatus: 1
        }
      },
    ];
    const countAggregate = [
      {
        $match
      },
      {
        $lookup: {
          from: "users",
          localField: "candidate",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hr",
          foreignField: "_id",
          as: "hr"
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$hr" },
      { $unwind: "$job" },
      { $unwind: "$candidate" },
      {
        $lookup: {
          from: "companies",
          localField: "job.company",
          foreignField: "_id",
          as: "job.company"
        }
      },
      { $unwind: "$job.company" },
      { $match: checkStatus },
      { $match: body.finder },
      { $match: body.mandatoryFilters },
      { $sort: { [body.sort_by]: body.sort_as } },
      // { $skip: body.per_page * (body.page - 1) },
      // { $limit: 20 },
      { $match: { "candidate.overall_tier": { $in: [1, 2, 3] } } },  //tier
      { $match: { "candidate.onboarding": false } },  //check expiry user
      { $match: { "candidate.admin_approve": true } },  //check admin approval
      { $match: { "job.archived": false } },  //check expiry job
      { $match: { "job._id": { '$nin': notjobId } } },
      { $match: { "candidate._id": { '$nin': notcandId } } },
      { $match: { "candidate._id": { '$nin': notInboxId } } },                //don't send in matches if already contacted through chat
      { $match: { "job._id": { '$nin': notInboxId } } },
      { $sort: { "candidate.overall_tier": 1 } },
      {
        $count: "count"
      }
    ];

    try {

      let data = await Match.aggregate(aggregate);
      let dataUnfilteredMin
      let dataUnfilteredMax
      // if (user.role == "hr") {
      dataUnfilteredMin = await Match.aggregate(aggregateUnfilteredMin);
      dataUnfilteredMax = await Match.aggregate(aggregateUnfilteredMax);
      // }
      let data2 = await Match.aggregate(aggregate2);

      data = data.map(item => {
        // console.log('job id and not', data);
        if (notjobId.indexOf(item.job._id.toString()) === -1) {
          return item;
        }
      });

      // if (user.role == "hr") {
      dataUnfilteredMin = dataUnfilteredMin.map(item => {
        // console.log('job id and not', data);
        if (notjobId.indexOf(item.job._id.toString()) === -1) {
          return item;
        }
      });

      dataUnfilteredMax = dataUnfilteredMax.map(item => {
        // console.log('job id and not', data);
        if (notjobId.indexOf(item.job._id.toString()) === -1) {
          return item;
        }
      });
      // }

      if (data.length > 0) {
        console.log('min expected salary', minSalary, maxSalary, minExperience, maxExperience);
      }

      if (user.role !== "hr") {
        data = data.reduce((data, jobData) => {
          const job = jobData.job;

          // console.log('job dataaaaaaaa: ', jobData.job);
          data.push(jobData);

          return data;
        }, []);

        dataUnfilteredMin = data.reduce((data, jobData) => {
          const job = jobData.job;

          // console.log('job dataaaaaaaa: ', jobData.job);
          dataUnfilteredMin.push(jobData);

          return data;
        }, []);

        dataUnfilteredMax = data.reduce((data, jobData) => {
          const job = jobData.job;

          // console.log('job dataaaaaaaa: ', jobData.job);
          dataUnfilteredMax.push(jobData);

          return data;
        }, []);

      }

      const count = await Match.aggregate(countAggregate);
      let finaldata
      // if (user.role == "hr") {
      finaldata = [...data, ...dataUnfilteredMin, ...dataUnfilteredMax].slice(((body.page - 1) * body.per_page), (body.page * body.per_page))
      var finalDataCount = [...data, ...dataUnfilteredMin, ...dataUnfilteredMax].length
      // }
      // else {
      //   finaldata = [...data].slice(((body.page - 1) * body.per_page), (body.page * body.per_page))
      //   var finalDataCount = [...data].length
      // }


      const paginate = Pagination(
        // count[0] ? count[0].count : 0,
        finalDataCount,
        finaldata.length,
        body.per_page,
        body.page
      );

      // console.log('data received',data2);

      // if (data.length <= 0 && user.role !== 'hr') {
      //   const Userdata: any = await User.findById(user._id);
      //   console.log('userdata',Userdata.profile_status);

      //   if (Userdata.profile_status === 'Completed') {
      //     return res.json({ error: false, data: { paginate, data } });
      //   } else if (Userdata.profile_status === 'Incomplete') {
      //     const randomJobs = await MatchController.getRandonJobs(req, res);
      //     return res.json({ error: false, data: randomJobs });
      //   }
      // } else {
      return res.json({ error: false, data: { paginate, data: finaldata }, values: { minSalary, maxSalary, minExperience, maxExperience } });
      // }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  public static checkTrueValue(value) {
    // console.log('value checked',value)
    if (value >= 0)
      return true;
    else
      return false;
  }

  public static getYs(array, role, property, isPublic) {
    if (role == 'hr') {
      // console.log('array here',array);
      if ((property == 'minSal' || property == 'maxSal') && isPublic)
        return array.map(d => d.expected_salary);
      else if ((property == 'minSal' || property == 'maxSal') && !isPublic)
        return array.map(d => d.candidate.expected_salary);
      else if ((property == 'minExp' || property == 'maxExp') && isPublic)
        return array.map(d => d.experience.period.value);
      else if ((property == 'minExp' || property == 'maxExp') && !isPublic)
        return array.map(d => d.candidate.experience.period.value);
    }
    else if (role !== 'hr') {
      if (property == 'minSal')
        return array.map(d => MatchController.checkTrueValue(d.start_salary) ? d.start_salary : d.job.start_salary);
      else if (property == 'maxSal')
        return array.map(d => MatchController.checkTrueValue(d.end_salary) ? d.end_salary : d.job.end_salary);
      else if (property == 'minExp' || property == 'maxExp')
        return array.map(d => MatchController.checkTrueValue(d.experience_required) ? d.experience_required : d.job.experience_required);
    }
  }
  public static getMinY(array, role, property, isPublic) {
    // console.log('min experience',role,property,this.getYs(array, role, property, isPublic));

    return Math.min(...this.getYs(array, role, property, isPublic));
  }
  public static getMaxY(array, role, property, isPublic) {
    return Math.max(...this.getYs(array, role, property, isPublic));
  }

  private static processInputBody(body, role, data) {
    // console.log('bodyyyy: ', data);

    body.page = Number(body.page) || 1;
    body.per_page = Number(body.per_page) || 20;

    const finder = {};
    const mandatoryFilters = {};
    let prefix = "";
    const title = data.mandatory && data.mandatory.map(obj => obj.title);

    if (role === "hr") {
      console.log('for role hrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:', body);

      prefix = "candidate";
      if (body.job && isMongoId(body.job)) {
        finder["job._id"] = Types.ObjectId(body.job);
      }
    } else {
      prefix = "job";
    }

    const allowedSorts = ["name", "title", "createdAt", "updatedAt", "last_logged_in"];

    if (
      !body.sort_by ||
      (body.sort_by && allowedSorts.indexOf(body.sort_by) === -1)
    ) {
      // body.sort_by = "score.total";
      // body.sort_by = `${prefix}.last_logged_in`;
      body.sort_by = `${prefix}.overall_tier`;
    } else {
      body.sort_by = `${prefix}.{body.sort_by}`;
    }

    if (!body.sort_as || (body.sort_as && body.sort_as === "desc")) {
      body.sort_as = -1;
    } else {
      body.sort_as = 1;
    }

    if (body.q) {
      if (role === "hr") {
        finder[`${prefix}.name`] = new RegExp(body.q, "ig");
      } else if (role === "candidate") {
        finder['$or'] = [
          {
            [`${prefix}.title`]: new RegExp(body.q, "ig"),
          },
          {
            [`${prefix}.company.title`]: new RegExp(body.q, "ig"),
          }
        ];
      }
    }
    if (body.locations && body.locations.length > 0) {
      finder[`${prefix}.locations.title`] = { $in: body.locations.map(location => location.title) };
    }
    if (body.skills && body.skills.length > 0) {
      // console.log('skillss', body.skills, role, prefix);

      if (role === 'hr')
        finder[`${prefix}.skills.data.title`] = { $in: body.skills };
      else if (role === 'candidate') {
        finder[`${prefix}.skills.data.title`] = { $in: body.skills };
      }
    }
    if (body.salary_range && body.salary_range.min != null && body.salary_range.max != null) {
      // console.log('salary_role',role,prefix, body.salary_range);
      if (role == 'hr') {
        finder[`${prefix}.expected_salary`] = { $lte: +(body.salary_range.max), $gte: +(body.salary_range.min) };
      }
      else {
        finder[`${prefix}.start_salary`] = { $gte: body.salary_range.min };
        finder[`${prefix}.end_salary`] = { $lte: +(body.salary_range.max) };
      }
    }
    if (body.title) {
      console.log('uu', body.title);

      if (role == 'hr') {
        finder[`${prefix}.designation`] = { $eq: body.title };
      }
      else if (role === 'candidate') {
        finder[`${prefix}.title`] = { $eq: body.title };
      }
    }
    if (body.role && body.role.length > 0 && body.user_type) {
      // console.log('reached role and user type', body.role, body.user_type);

      if (body.user_type == 'hr')
        finder[`${prefix}.designation`] = { $eq: body.role };
      else
        finder[`${prefix}.title`] = { $eq: body.role };
    }
    if (body.experience && body.experience.min != null && body.experience.max != null) {
      console.log('experiencce_role', role, prefix);
      if (role == 'hr') {
        finder[`${prefix}.experience.period.value`] = { $lte: body.experience.max, $gte: body.experience.min };
      }
      else {
        finder[`${prefix}.experience_required.min`] = { $gte: body.experience.min };
        finder[`${prefix}.experience_required.max`] = { $lte: body.experience.max };
      }
    }
    if (
      (body.type && body.type.length) ||
      (title && title.includes("looking_for"))
    ) {
      if (body.type && body.type.length) {
        finder[`${prefix}.looking_for`] = { $in: body.type };
      } else {
        mandatoryFilters[`${prefix}.looking_for`] = { $in: data.looking_for };
      }
    }
    // if (
    //   (body.role && body.role.length) || 
    //   ( title && title.includes("experience_role")
    // )
    // ) {

    //   if(body.role && body.role.length) {
    //     finder[`${prefix}.experience_role`] = { $in: body.role };
    //   } else {
    //     mandatoryFilters[`${prefix}.experience_role`] = { $in: [data.experience_role] };
    //   }
    // }

    if (
      (body.school && body.school.length) ||
      (title && title.includes("school"))
    ) {

      // checking for whether mandatory fields include school  
      const mandatory = data.mandatory &&
        data.mandatory.filter(education => education.title === 'school')[0];

      // values for school field
      const school = mandatory ? mandatory.values.map(school => Types.ObjectId(school._id)) : [];

      if (
        (!body.school || (body.school && !body.school.length)) && !school.length
      ) {
        mandatoryFilters[`${prefix}.education.school`] = { $exists: true };
      } else {
        if (body.school && body.school.length) {

          finder[`${prefix}.education.school._id`] = {
            $in: body.school.map(school => Types.ObjectId(school))
          };
        } else {
          mandatoryFilters[`${prefix}.education.school._id`] = {
            $in: school
          };
        }
      }
    }

    if (
      (body.company && body.company.length) ||
      (title && title.includes("company"))
    ) {
      body.company = body.company.map(element => Types.ObjectId(element));
      // checking for whether mandatory fields include company  
      const mandatory = data.mandatory &&
        data.mandatory.filter(education => education.title === 'company')[0];

      // values for company field
      const company = mandatory ? mandatory.values.map(company => company.name) : [];

      if (
        (!body.company || (body.company && !body.company.length)) && !company.length
      ) {
        mandatoryFilters[`${prefix}.experience.company`] = { $exists: true };
      }
      else {
        console.log('body company', body.company);
        if (body.company && body.company.length) {
          finder[`${prefix}.experience.current_company._id`] = { $elemMatch: { _id: { $in: body.company } }}
        } else {
          mandatoryFilters[`${prefix}.experience.company`] = {
            $in: company
          };
        }
      }
    }

    if (body.working_at && body.working_at.length > 0) {
      body.working_at = body.working_at.map(element => Types.ObjectId(element));
      console.log('company', body.working_at);
      finder[`${prefix}.experience.current_company._id`] = { $in: body.working_at }
    }


    const mandatory = body.mandatory ? body.mandatory : data.mandatory;

    if (role === "hr" && mandatory) {
      for (let i in mandatory) {
        switch (mandatory[i].title) {
          case "availability":
            mandatoryFilters[`${prefix}.notice_period`] = { $lte: data.notice_period };
            break;

          case "salary":
            mandatoryFilters[`${prefix}.expected_salary`] = { $lte: data.end_salary };
            break;
        }
      }
    }
    body.finder = finder;
    body.mandatoryFilters = mandatoryFilters;
    // console.log('filterssssmandatoryFilterssssssssssssssssssss:', body.finder, body.mandatoryFilters);

    return body;
  }
  static async updateStatus(req: Request, res: Response) {
    const { hr, candidate, job, status } = req.body;
    let finder: any = {
      $and: [
        { hr: hr },
        { candidate: candidate },
        { job: job }
      ],
    };
    try {
      const data = await Match.findOneAndUpdate(finder, { $set: { status: status } })
      return res.json({ error: false, data: data });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  static async getRandonJobs(req: Request, res: Response) {
    let { body } = req;
    // console.log('get random jobs');

    body = MatchController.finderRandomJobs(body);
    const jobs = await Job.find(body.finder)
      .populate('company', "title  description logo location website")
      .sort({ [body.sort_by]: body.sort_as })
      .skip(body.per_page * (body.page - 1))
      .limit(body.per_page)

    let count = await Job.find(body.finder).count()
    const paginate = Pagination(
      count ? count : 0,
      jobs.length,
      body.per_page,
      body.page
    );

    return { jobs, paginate };
  }
  static finderRandomJobs(body) {
    body.page = Number(body.page) || 1;
    body.per_page = Number(body.per_page) || 20;
    const finder = {};
    if (!body.sort_as || (body.sort_as && body.sort_as === "desc")) {
      body.sort_as = -1;
    } else {
      body.sort_as = 1;
    }
    if (body.q) {
      finder[`title`] = new RegExp(body.q, "ig");
    }
    if (body.locations && body.locations.length > 0) {
      finder[`locations`] = { $in: body.locations };
    }
    if (body.type && body.type.length > 0) {

      finder[`looking_for`] = { $in: body.type };

    }
    if (body.role && body.role.length > 0) {
      finder[`experience_role`] = { $in: body.role };
    }

    body.finder = finder;
    return body;
  }

  static async toggle(req: Request, res: Response) {
    // console.log('toggle request: ', req);

    try {
      if (req.user.role === "candidate") {
        await User.updateOne({ _id: req.user._id }, { $set: { autoMatch: req.body.autoMatch } });
        return res.json({ error: false, message: "Activity Successfull" });
      } else {
        return res.json({ error: false, message: "Unauthorized" });
      }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  static async findMaxSalary(req: Request, res: Response) {
    console.log('max salary  request: ', req.user);

    try {
      if (req.user.role === "hr") {
        const maxSal = await User.findOne({ role: 'candidate', onboarding: false, admin_approve: true, expected_salary: { $exists: true, $ne: null } }, { expected_salary: 1 }).sort({ "expected_salary": -1 })
        const minSal = await User.findOne({ role: 'candidate', onboarding: false, admin_approve: true, expected_salary: { $exists: true, $ne: null } }, { expected_salary: 1 }).sort({ "expected_salary": 1 })
        return res.json({ error: false, message: "Candidates salary range", min: minSal, max: maxSal });
      } else {
        const maxSal = await Job.findOne({}, { end_salary: 1 }).sort({ "end_salary": -1 })
        const minSal = await Job.findOne({}, { start_salary: 1 }).sort({ "start_salary": 1 })
        return res.json({ error: false, message: "Jobs salary range", min: minSal, max: maxSal });
      }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  static async findMaxExperience(req: Request, res: Response) {
    // console.log('max salary  request: ', req);

    try {
      if (req.user.role === "hr") {
        const expMax = await User.findOne({ role: 'candidate', onboarding: false, admin_approve: true, experience: { $exists: true, $ne: ['', null] } }, { 'experience.period.value': 1 }).sort({
          "experience.period.value": -1
        });
        const expMin = await User.findOne({ role: 'candidate', onboarding: false, admin_approve: true, experience: { $exists: true, $ne: null } }, { 'experience.period.value': 1 }).sort({
          "experience.period.value": 1
        });
        return res.json({ error: false, message: "Activity Successfull", expMin, expMax });
      } else {
        let expMax = await Job.findOne({}, { experience_required: 1 }).sort({
          "experience_required.max": -1
        });
        let expMin = await Job.findOne({}, { experience_required: 1 }).sort({
          "experience_required.min": 1
        });
        // console.log('experr',exp);
        return res.json({ error: false, message: "Activity Successfull", expMax,expMin });
      }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  static async get_resumes(req: Request, res: Response) {
    console.log('max salary  request: ', req);

    try {
      // if(req.user.role === "hr") {
      const maxSal = await User.findOne({ role: 'candidate', onboarding: false, admin_approve: true, designation: 'Front-End Developer' }, { resume: 1 })
      // const minSal = await User.findOne({role:'candidate', onboarding:false, admin_approve: true, expected_salary: {$exists:true, $ne: null}},{expected_salary:1}).sort({ "expected_salary": 1 })
      return res.json({ error: false, message: "Candidates salary range", max: maxSal });
      // } else {
      //   const maxSal = await Job.findOne({},{end_salary:1}).sort({ "end_salary": -1 })
      //   const minSal = await Job.findOne({},{start_salary:1}).sort({ "start_salary": 1 })
      //   return res.json({ error: false, message: "Jobs salary range" , min: minSal, max: maxSal});   
      // }
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }


}
