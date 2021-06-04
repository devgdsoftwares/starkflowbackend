import { Request, Response } from 'express';
import { createCipher, randomBytes } from 'crypto';

import User from '../models/User';
import Job from '../models/Job';
import Company from '../models/Company';
import UserService from '../services/UserService';
import { UserEvents } from '../events/UserEvents';
import { Types } from "mongoose";
import Pagination from "../services/Pagination";
import AuthService from '../services/AuthService';
import AuthController from './AuthController';
import SourceableMailer from '../mailers/sourceableMailer';
import no_interested_cand from '../models/Notinterestcand';
const { ALGORITHM, SECRET } = process.env;
import Profile from '../templates/Profile';
import Invite from '../templates/Invite';

import * as request from "request-promise-native";
import MatchController from './MatchController';
import { bindKey, over } from 'lodash';
import Cron from '../services/Cron';
import AdminConfig from '../models/adminConfig.model'
import { ObjectID } from 'mongodb';


declare function require(name: string);
// const convertCurrency = require('nodejs-currency-converter');
// import currency_converter from 'nodejs-currency-converter';
var https = require('https');
const axios = require('axios')

const key = process.env.GOOGLE_API_KEY

export default class ProfileController {

  static me(req: Request, res: Response) {
    let { user } = req;

    let data: any = {};
    if (user.role === 'candidate') {
      data = {
        _id: user._id,
        approved: user.approved,
        avatar: user.avatar,
        bio: user.bio,
        company: user.company,
        login: user.login,
        name: user.name
      };
    } else if (user.role === 'hr') {
      data = {
        _id: user._id,
        approved: user.approved,
        avatar: user.avatar,
        name: user.name,
      };
    } else {
    }
    return res.json({ error: false, data });
  }

  static getCompanyId(req: Request, res: Response) {
    let { user } = req;

    let data: any = {};
    if (user.role === 'hr') {
      data = {
        _id: user._id,
        company_id: user.company_id,
        admin_approve: user.admin_approve
      };
    } else {
    }
    return res.json({ error: false, data });
  }

  static async onboarding(req: Request, res: Response) {
    const { user } = req;
    user = user.toJSON();
    console.log('user:::::',user);
    let data = {};

    if (user.role === 'candidate') {
      data = {
        onboarding: user.onboarding,
        profile: {
          avatar: user.avatar,
          email: user.email,
          name: user.name
        },
        avatar: user.avatar,
        resume: user.resume,
        resume_name: user.resume_name,
        designation: user.designation,
        summary: user.summary,
        phone: user.phone,
        skills: user.skills,
        projects: user.projects,
        looking_for: user.looking_for,
        availability: user.availability,
        salary: user.salary,
        current_location: user.current_location,
        experience: user.experience,
        certificate: user.certificate,
        course: user.course,
        education: user.education,
        industry: user.industry,
        fluency: (user.fluency || ''),
        timezone: (user.timezone || ''),
        location: (user.location || '')
      }
    } else {
      data = {
        onboarding: user.onboarding,
        profile: {
          avatar: user.avatar,
          email: user.email,
          locations: user.locations,
          name: user.name,
          phone: user.phone,
          company: user.company_id ? await Company.findById(user.company_id) : null
        }
      }
    }

    return res.json({ error: false, data });
  }

  static update(req: Request, res: Response) {

    const { user } = req;
    console.log(user);

    if (user.role === 'candidate') {
      return ProfileController.updateCandidate(req, res);
    } else if (user.role === 'hr') {
      return ProfileController.updateHR(req, res);
    } else {
      // return ProfileController.updateCandidate(req, res);
    }
    return res.json({ error: true, status: 404, message: 'Invalid request.' });
  }

  private static async updateCandidate(req: Request, res: Response) {
    try {
      // var admin_approve = false;
      const { user, body } = req;
      var profile_status = 'Incomplete';
      const errors = UserService.validateCandidate(user, body);
      console.log('error from validate candidate: ', errors, body.onboarding);

      if (!errors) {
        profile_status = 'Completed'
        //  if (body.onboarding)
        //   admin_approve = true;
      } else {
        profile_status = 'Incomplete'

      }
      body.notice_period = 1;
      // needs refactoring
      if (body.availability) {
        switch (body.availability) {
          case "Immediately":
            body.notice_period = 1;
            break;

          default:
            body.notice_period = 1;
            break;


        }
      }

      if (body.salary && Object.keys(body.salary).length) {
        let currency, onboarding, overall_tier;
        let admin_approve: any;
        let admin_onboarding: any = await User.find({ 'email': body.email, 'role': 'candidate' }).select('onboarding');
        console.log('check admin var', admin_onboarding,(admin_onboarding)[0].onboarding, user.admin_approve, profile_status);

        if (!(admin_onboarding)[0].onboarding && profile_status == 'Completed') {
          admin_approve = true;
        }
        else
          admin_approve = user.admin_approve;

        if (profile_status == 'Completed') { onboarding = false; }
        else {
          onboarding = true;
          if (user.email_approve) {
            if (onboarding === true) {
              setTimeout(() => {
                if (onboarding === true)
                  Cron.sendMail(user);
              }, 7200000)
            }
          }
        }

        (async () => {
          var overall_tier = 3;
          let prev_comp_array = [];
          //updating the type of id's in companies object
          if (body.experience.previous_company)
            body.experience.previous_company.forEach(element => {
              prev_comp_array.push({ _id: Types.ObjectId(element._id), title: element.title, tier: +(element.tier), adminApproved: element.adminApproved })
            });
          body.experience.previous_company = prev_comp_array;
          console.log(JSON.stringify(body.experience) + '------------>');
          if (body.experience.current_company)
            body.experience.current_company._id = Types.ObjectId(body.experience.current_company._id);
          // update value of overall tier on the basis of current and previous companies
          if (body.experience && (body.experience.current_company || body.experience.previous_company)) {
            console.log('updating overall tier', body.experience);

            //check current company tier
            if (body.experience.current_company && (body.experience.current_company.tier < overall_tier))
              overall_tier = body.experience.current_company.tier;

            //check previous companies tier
            body.experience.previous_company.forEach(element => {
              if (element.tier < overall_tier)
                overall_tier = element.tier;
            });
          }
          console.log('overall tier', overall_tier);
          // const baseUrl = 'https://api.exchangeratesapi.io/latest?base=' + body.salary.currency;
          // base/target
          const baseUrl = 'https://v6.exchangerate-api.com/v6/1a334af3220072f3ae5bde4d/pair/'+body.salary.currency+'/USD';
          var options = {
            uri: baseUrl,
          };

          let result = await request.get(options);
          result = JSON.parse(result)
          // console.log('rates result: ', result, result['quotes']['USD'+body.salary.curzrency]);
          console.log('rates result: ', result, result['conversion_rate']);
          // currency = result['quotes']['USD'+data.salary.currency];
          currency = result['conversion_rate'];
          // currency = result['quotes']['USD'+body.salary.currency];
          // console.log('result from cur', user.admin_approve);
          body.expected_salary = parseFloat(body.salary.value * currency).toFixed(2);
          // Update object
          const update = {
            designation: body.designation,
            summary: body.summary,
            phone: body.phone,
            skills: body.skills,
            education: body.education,
            name: body.name,
            email: body.email,
            industry: body.industry,
            admin_approve: user.admin_approve,
            looking_for: body.looking_for,
            availability: body.availability,
            salary: body.salary,
            profile_status: profile_status,
            experience: body.experience,
            onboarding: onboarding,
            notice_period: body.notice_period,
            expected_salary: body.expected_salary,
            avatar: body.avatar,
            resume: body.resume,
            resume_name: body.resume_name,
            overall_tier: overall_tier,
            fluency: body.fluency,
            timezone: body.timezone,
            location: body.location
          };
          console.log('update object:', update);
          // Update
          await User.findByIdAndUpdate(user._id, { $set: update });
          UserEvents.updated(user);
          return res.json({ error: false, message: 'Profile updated successfully.' });
        })()

        // // convert to year as base reference
        // switch(body.salary.duration)
        // {
        //   case "Hour":
        //   duration = 44*40;
        //   break;

        //   case "Week":
        //   duration = 44;
        //   break;

        //   case "Month":
        //   duration = 12;
        //   break;

        //   case "Year":
        //   duration = 1;
        //   break;
        // }

      }

    } catch (e) {
      // console.log('unknown error', e);

      return res.json({ error: true, status: 500, message: 'An error occured.', });
    }
  }

  private static convertCurrency(amount, fromCurrency, toCurrency, cb) {
    var apiKey = 'b2d29098a8dc1c53294c';

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    var query = fromCurrency + '_' + toCurrency;

    var url = 'https://api.currconv.com/api/v7/convert?q='
      + query + '&compact=ultra&apiKey=b2d29098a8dc1c53294c';

    https.get(url, function (res) {
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        try {
          var jsonObj = JSON.parse(body);
          // console.log('json obj', jsonObj);

          var val = jsonObj[query];
          if (val) {
            var total = val * amount;
            cb(null, Math.round(total * 100) / 100);
          } else {
            var err = new Error("Value not found for " + query);
            // console.log(err);
            cb(err);
          }
        } catch (e) {
          // console.log("Parse error: ", e);
          cb(e);
        }
      });
    }).on('error', function (e) {
      // console.log("Got an error: ", e);
      cb(e);
    });
  }

  private static async updateHR(req: Request, res: Response) {
    try {
      const { user, body } = req;

      const errors = UserService.validateHR(user, body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors
        });
      }
      // console.log('hr body data', body);

      // Update object
      const update = {
        name: body.name,
        email: body.email,
        company_id: body.company_id,
        avatar: body.avatar,
        onboarding: false,
        phone: body.phone
      };

      // Update
      await User.findByIdAndUpdate(user._id, { $set: update });
      return res.json({ error: false, message: 'Profile updated successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.', });
    }
  }
  static async candidate(req: Request, res: Response) {
    const { query: body } = req;
    let regex = new RegExp(body.q, 'i');
    try {

      const candidates = await User.find({ $and: [{ $or: [{ name: regex }, { email: regex }] }, { role: body.role }] }, { password: 0 })
        .sort({ [body.sort_by || "_id"]: body.sort_as || -1 })
        .skip(body.per_page * (body.page - 1))
        .limit(parseInt(body.per_page));

      const count = await User.find({ $and: [{ $or: [{ name: regex }, { email: regex }] }, { role: body.role }] }).count();


      const paginate = Pagination(
        count ? count : 0,
        candidates.length,
        body.per_page,
        body.page
      );

      return res.json({ error: false, data: { candidates, paginate } });
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }
  static async adminApprove(req: Request, res: Response) {
    try {
      const userId = req.body.UserId;
      const status = req.body.status;
      const user = await User.findByIdAndUpdate(userId, { $set: { 'admin_approve': status } });

      if (status) {
        const details = {
          unsubscribe: `https://qa.starkflow.co/${user._id}/unsubscribe`
        };

        const msg = {
          to: user.email,
          from: {
            email: 'notification@starkflow.co',
            name: 'StarkFlow Support'
          },
          subject: 'Your profile is approved',
          html: Profile.generateProfileApprovalTemplate(details),
        };

        SourceableMailer.sendCustomMail(msg)
      }
      return res.json({ error: false, data: user })
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }

  static async emailApprove(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const status = req.body.status;
      await User.findByIdAndUpdate(userId, { $set: { 'email_approve': status } });
      return res.json({ error: false, status: 200, message: 'Successful' })
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }
  static async getUserId(req: Request, res: Response) {
    const { id } = req.query;
    const { user } = req;
    let getQuery;
    const company = {
      _id: 1,
      title: 1,
      description: 1,
      logo: 1
    };
    if (user.role === "hr") {
      getQuery = {
        _id: 1,
        name: 1,
        avatar: 1,
        bio: 1,
        bioHTML: 1,
        locations: 1,
        projects: 1,
        skills: 1,
        salary: 1,
        designation: 1,
        summary: 1,
        availability: 1,
        looking_for: 1,
        current_location: 1,
        url: 1,
        phone: 1,
        skypeId: 1,
      };
    } else {
      getQuery = {
        archived: 1,
        availability: 1,
        categories: 1,
        client: 1,
        company: 1,
        createdAt: 1,
        description: 1,
        domains: 1,
        looking_for: 1,
        modules: 1,
        salary: 1,
        skills: 1,
        title: 1,
        _id: 0,
        apps: 1,
      }
    }
    try {
      let data;
      if (user.role === "hr") {
        data = await User.find({ _id: Types.ObjectId(id) }, getQuery);
      } else {
        data = await Job.find({ _id: Types.ObjectId(id) }, getQuery).populate('company');
      }
      return res.json({ error: false, status: 200, data: data })
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }
  public static async unsubscribeEmail(req: Request, res: Response) {
    const { id } = req.body;
    try {
      await User.updateOne({ "_id": Types.ObjectId(id) }, { $set: { email_approve: false } });
      return res.json({ error: false, status: 200, message: 'successful' })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }

  static async loginToProfile(req: Request, res: Response) {
    const { id } = req.query;

    try {
      const user: any = await User.findById(id);

      if (!user) {
        return res.json({ error: true, status: 203, message: 'User Not Found' });
      }

      return res.json({
        error: false,
        status: 200,
        message: `Welcome, ${user.name}`,
        data: await AuthController.userAndToken(user)
      });

    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }

  static async invitation(req: Request, res: Response) {
    const { id } = req.query;

    try {
      const user: any = await User.findById(id);
      const resetToken = randomBytes(20).toString('hex');
      const cipher = createCipher(ALGORITHM, SECRET);
      const token = cipher.update(`${new Date(new Date().setDate(new Date().getDate() + 1000))}_${user._id}_${resetToken}`, 'utf8', 'hex') + cipher.final('hex');
      const reset_url = `https://qa.starkflow.co/reset/${token}`;

      await User.update({ _id: user._id }, {
        $set: {
          resetToken
        }, $inc: {
          invitationCount: 1
        }
      });

      if (!user || (user && !user.password)) {
        return res.json({ error: true, status: 203, message: user ? 'User is registered via social platform' : 'User Not Found' });
      }

      const details = {
        name: user.name,
        email: user.email,
        reset_url
      };

      const msg = {
        to: user.email,
        from: {
          email: 'notification@starkflow.co',
          name: 'StarkFlow Support'
        },
        subject: ' Your are invited',
        html: Invite.generateEmployerInviteTemplate(details),
      };

      SourceableMailer.sendCustomMail(msg);

      return res.json({
        error: false,
        status: 200,
        message: `Invitation Sent`,
        data: { invitationCount: user.invitationCount }
      });

    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' })
    }
  }

  static async getPublicProfiles(req: Request, res: Response) {
    let { body } = req;
    console.log('query for userrr', body);
    const user_id = req.query && req.query.user_id ? Types.ObjectId(req.query.user_id) : null
    let minSalary, maxSalary, minExperience, maxExperience;

    // Get Min, max salary and min max experience from admin config values
    let filterConfig = await AdminConfig.find({})
    if (filterConfig) {
      minSalary = filterConfig[0]['minSalary']
      maxSalary = filterConfig[0]['maxSalary']
      minExperience = filterConfig[0]['minExperience']
      maxExperience = filterConfig[0]['maxExperience']
    }
    // console.log('min ranges: ', minSalary, maxSalary, minExperience, maxExperience);

    let finder = { role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false };
    // let finderUnfilteredMin = { role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false };
    // let finderUnfilteredMax = { role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false };
    let notcandId = [];
    if (req.headers.authorization && req.headers.authorization !== 'null') {
      //Remove matches which are skipped or not interested
      const notinterestedcand: any = await no_interested_cand.find({ hr_id: user_id }, { candidate_id: 1, _id: 0 });
      notcandId = notinterestedcand.map(item => { if (item.candidate_id != undefined) return Types.ObjectId(item.candidate_id) });

    }

    if (!body.page) {

      body.page = 1;
    }

    if (!body.per_page) {
      body.per_page = 20;
    }
    if (body.role && body.role.length > 0) {
      finder[`designation`] = { $in: body.role };
      // finderUnfilteredMin[`designation`] = { $eq: body.role };
      // finderUnfilteredMax[`designation`] = { $eq: body.role };
    }
    if (body.type && body.type.length > 0) {
      // console.log('body type',body.type);

      finder[`looking_for`] = { $in: body.type };
      // finderUnfilteredMin[`looking_for`] = { $in: body.type };
      // finderUnfilteredMax[`looking_for`] = { $in: body.type };

    }
    if (body.company && body.company.length > 0) {
      body.company = body.company.map(element => Types.ObjectId(element));
      console.log('company', body.company);
      finder[`experience.previous_company`] = { $elemMatch: { _id: { $in: body.company } } }
      // finderUnfilteredMin[`experience.previous_company`] = { $elemMatch: { _id: { $in: body.company } } }
      // finderUnfilteredMax[`experience.previous_company`] = { $elemMatch: { _id: { $in: body.company } } }
    }
    if (body.working_at && body.working_at.length > 0) {
      body.working_at = await body.working_at.map(element => Types.ObjectId(element));
      console.log('company', body.working_at);
      finder[`experience.current_company._id`] = { $in: body.working_at }
      // finderUnfilteredMin[`experience.current_company._id`] = { $in: body.working_at }
      // finderUnfilteredMax[`experience.current_company._id`] = { $in: body.working_at }
    }
    if (body.skills && body.skills.length > 0) {
      console.log('body skills---------', body.skills);
      finder[`skills.title`] = { $in: body.skills };
      // finderUnfilteredMin[`skills.data.title`] = { $in: body.skills };
      // finderUnfilteredMax[`skills.data.title`] = { $in: body.skills };
    }
    // if (body.salary_range) {
    //   // console.log('body salary', body.salary_range);
    //   finder[`expected_salary`] = { $lte: +(body.salary_range.max) , $gte: +(body.salary_range.min)};
    // }
    // else {
    //   finder[`expected_salary`] = { $lte: maxSalary, $gte: minSalary };
    // }





    if (body.experience) {
        console.log('body experience', body.experience);
        if ((body.experience.min == 0) && (body.experience.max == 9)) {
          delete finder['experience.period.value.value'];
        }else{
          finder[`experience.period.value.value`] = { $lte: +(body.experience.max), $gte: +(body.experience.min) };
        }
        
    }

    // new design additions
    if (body.salary) {
      finder[`expected_salary`] = { $lte: +(body.salary) }
    }

    if (body.fluency) {
      finder[`fluency`] = { $eq: body.fluency }
    }

    if (body.availability) {
      if(body.availability.length > 0){
        finder[`availability`] = { $in: body.availability }
      }else{
        delete finder['availability'];
      }
      // finder[`designation`] = { $in: body.role };
     
    }

    if (body.timezone && body.timezone.length > 0) {
      finder[`timezone`] = { $in: body.timezone };
    }

    if (body.locations && body.locations.length > 0) {
      finder[`location`] = { $in: body.locations }
    }


    // finderUnfilteredMin[`$or`] = [{ expected_salary: { '$lt': +(body.salary_range) ? (+(body.salary_range.min) > minSalary ? +(body.salary_range.min) : minSalary) : minSalary } }, { 'experience.period.value': { '$lt': +(body.experience) ? (+(body.experience.min) < minExperience ? +(body.experience.min) : minExperience) : minExperience } }];
    // finderUnfilteredMax[`$or`] = [{ expected_salary: { '$gt': +(body.salary_range) ? (+(body.salary_range.max) < maxSalary ? +(body.salary_range.max) : maxSalary) : maxSalary } }, { 'experience.period.value': { '$gt': +(body.experience) ? (+(body.experience.max) < maxExperience ? +(body.experience.max) : maxExperience) : maxExperience } }];

    try {
      console.log('finder this', finder)
      let project;

      if (req.headers.authorization && req.headers.authorization !== 'null')
        project = await { "lastName": 0, "email": 0, "phone": 0 };
      else
        project = await { "name": 0, "phone": 0, "firstName": 0, "lastName": 0, "resume": 0, "resume_name": 0 };
      console.log('..', Number(body.page - 1) * Number(body.per_page), Number(body.per_page));
      
      const users = await User.aggregate(
        [
          { $project: project },
          {
            $match: finder
          },
          {
            $sort: { overall_tier: 1, updatedAt: 1 }
          },
          { $match: { "_id": { '$nin': notcandId } } },
          {
            $skip: Number(body.page - 1) * Number(body.per_page)
          },
          {
            $limit: Number(body.per_page)
          }
        ]
      );

      // unfiltered users LTE
      // const usersUnfilteredMin = await User.aggregate(
      //   [
      //     { $project: project },
      //     {
      //       $match: finderUnfilteredMin
      //     },
      //     { $match: { "_id": { '$nin': notcandId } } },
      //     {
      //       $sort: { overall_tier: 1 }
      //     },
      //   ]
      // );

      // unfiltered users GTE
      // const usersUnfilteredMax = await User.aggregate(
      //   [
      //     { $project: project },
      //     {
      //       $match: finderUnfilteredMax
      //     },
      //     { $match: { "_id": { '$nin': notcandId } } },
      //     {
      //       $sort: { overall_tier: 1 }
      //     },
      //   ]
      // );

      // let OverallResult = [...users, ...usersUnfilteredMin, ...usersUnfilteredMax].slice(((body.page - 1) * body.per_page), (body.page * body.per_page))
      let OverallResult = users
      // let query1 = body.role ? { designation: body.role, role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false } : { role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false, expected_salary: { $exists: true } };
      // let query2 = body.role ? { designation: body.role, role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false, 'experience.period.value': { $exists: true, $type: 16 } } : { role: 'candidate', profile_status: 'Completed', admin_approve: true, onboarding: false, 'experience.period.value': { $exists: true, $type: 16 } };

      // let maxsalarray = await User.find(query1).sort({expected_salary:-1}).limit(1);
      // let minsalarray = await User.find(query1).sort({expected_salary:1}).limit(1);
      // let minexparay = await User.find(query2).sort({"experience.period.value":1}).limit(1);
      // let maxexparay = await User.find(query2).sort({"experience.period.value":-1}).limit(1);
      // minSalary = (minsalarray && minsalarray[0]) ? ( minsalarray[0]['expected_salary'] <= minSalary ? minSalary : (minsalarray[0]['expected_salary'] > maxSalary ? maxSalary :minsalarray[0]['expected_salary']) ) : null;
      // maxSalary = (maxsalarray && maxsalarray[0]) ? ( maxsalarray[0]['expected_salary'] >= maxSalary  ? maxSalary : (maxsalarray[0]['expected_salary'] < minSalary ? minSalary : maxsalarray[0]['expected_salary']) ) : null;
      // minExperience = (minexparay && minexparay[0]) ? minexparay[0]['experience']['period']['value'] : null;
      // maxExperience = (maxexparay && maxexparay[0]) ? maxexparay[0]['experience']['period']['value'] : null;

      const totalUsers = await User.count(finder);
      // const usersUnfilteredMinCount = await User.count(finderUnfilteredMin);
      // const usersUnfilteredMaxCount = await User.count(finderUnfilteredMax);

      const paginate = Pagination(
        (totalUsers),
        OverallResult.length,
        body.per_page,
        body.page
      );
      return res.json({ error: false, data: { users: OverallResult, paginate }, values: { minSalary, maxSalary, minExperience, maxExperience }, message: 'Deployed on testing server check2' });

    }
    catch (e) {
      //  console.log('see error',e);

      return res.json({
        error: true,
        status: 500,
        message: "An error occured." + e
      });
    }
  }

  static async public(req: Request, res: Response) {
    let similarUsers;
    try {
      let role = req.body.role;
      let project;
      if (req.headers.authorization && req.headers.authorization !== 'null')
        project = { "lastName": 0 };
      else
        project = { "name": 0, "email": 0, "phone": 0, "emailAddress": 0, "resume": 0, "resume_name": 0 };

      const { id } = req.params;
      var user: any;
      if (!role) {
        user = await User.findById(id).select(project);
        // console.log('user here',user); 
      }
      else if (role) {
        if (role === 'hr')
          user = await User.findById(id);
        else if (role === 'candidate')
          user = await User.findById(id).select(project);
      }


      // .populate("user", "firstName lastName")
      // .populate("company" ,"title  description logo location website perks facts InterviewProcess");;
      if (user) {
        if (role === 'hr')
          similarUsers = await User.find({
            'name': { $exists: true, $ne: null },
            'role': 'candidate',
            'designation': { $exists: true, $ne: null, $eq: user['designation'] },
            'admin_approve': true,
            'onboarding': false,
            'profile_status': 'Completed',
            '_id': { $nin: id }
          })
            .limit(3)
        else
          similarUsers = await User.find({
            'name': { $exists: true, $ne: null },
            'role': 'candidate',
            'designation': user['designation'],
            'admin_approve': true,
            'onboarding': false,
            'profile_status': 'Completed',
            // "salary": 0, "expected_salary": 0,
            '_id': { $nin: id }
          })
            .limit(3)
        //  .populate('company' , "title  description logo location website ");
      }
      if (!User) {
        return res.json({
          error: true,
          status: 404,
          message: "Job not found."
        });
      }
      return res.json({ error: false, data: user, similarUsers: similarUsers });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async getPlaces(req: Request, res: Response) {
    const query = req.query.q
    try {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&sensor=false&types=(cities)&key=${key}`
      )
      res.json({ error: false, data: data.predictions })
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  //update expected salary for candidates with value as Nan
  static async update_expected(req: Request, res: Response) {
    try {
      const experience_job = await [
        { id: 1, title: '0-2 Years', min: 0, max: 2 },
        { id: 2, title: '2-4 Years', min: 2, max: 4 },
        { id: 4, title: '4-6 Years', min: 4, max: 6 },
        { id: 5, title: '6-8 Years', min: 6, max: 8 },
        { id: 6, title: '8+ Years', min: 8, max: null },
      ]
      const users = await User.find({_id:Types.ObjectId('6008495fd97a0c2b85011e72'), 'experience.period': { $exists: true } });
      users.forEach(async item => {  
        var x = JSON.parse(JSON.stringify(item));
        console.log(x, x.experience.period.value, typeof x.experience.period.value);
        
        let new_experience = await (experience_job.filter(i => (x.experience.period.value >= i.min && x.experience.period.value < i.max)).pop())
        if (x.experience.period.value >= 8)
          new_experience = await { id: 6, title: '8+ Years', min: 8, max: null };
        // await experience_job.findIndex(async i=> {console.log('ii',i);
        // if(x.experience.period.value >= i.min && x.experience.period.value <=i.max)
        //   console.log('index: ', i);
        //   });
        console.log('new experience: ', new_experience, x.experience.period);
        if (new_experience && typeof x.experience.period.value == 'number')
        await User.update({ _id: Types.ObjectId(item._id) }, { $set: { 'experience.period.value': new_experience } })
      })

      // const users = await Company.find({ 'tier': 3 });
      // const maxSal = await User.find({role:'candidate', onboarding:false, admin_approve: true, designation: 'Front-End Developer'},{resume:1})
      // users.forEach(async item=> { 
      //   var avatar;
      //   if(item && item['avatar']) {
      //     item['avatar'] = item['avatar'].replace("https://qa.starkflow.co", "https://qa.starkflow.co");
      //   console.log('item',item['avatar'], avatar);
      //   await User.update({_id:Types.ObjectId(item._id)},{$set: {'avatar':item['avatar']}})
      //   }

      // })
      // candidates.forEach(async item=> {
      //   const baseUrl = 'https://api.exchangeratesapi.io/latest?base='+item['salary']['currency'];
      //   var options = {
      //       uri: baseUrl,
      //   };
      //   let result = await request.get(options);
      //   result = JSON.parse(result)
      //   let currency = result['rates']['USD'];
      //   let start_salary =+(parseFloat(item['salary']['start']*currency).toFixed(2));
      //   let end_salary =+(parseFloat(item['salary']['end']*currency).toFixed(2));
      //   console.log('result from cur', currency, start_salary,end_salary);
      //   await Job.updateMany({_id:Types.ObjectId(item._id)},{$set: {'start_salary':start_salary, 'end_salary':end_salary}})
      // })
      // const all_companies:any = await Company.aggregate([
      //   {"$group" : { "_id": "$title", "count": { "$sum": 1 } } },
      //   {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } },
      //   {"$sort": {"count" : -1} },
      //   {"$project": {"title" : "$_id", "_id" : 0} }
      // ]);
      // all_companies.forEach(async arrayCompany => {
      //   const companies = await Company.find({title:(arrayCompany.title)});
      // console.log('same companies',arrayCompany,companies);

      // var users = [];
      // let main_id = (companies && companies.length>0) ? companies[0]._id : null;
      // let main_object = (companies && companies.length>0) ? { _id: Types.ObjectId(companies[0]._id), title: companies[0].title, tier: +(companies[0].tier), adminApproved: companies[0].adminApproved} : null;
      // console.log('main object',main_object);
      // if (main_id) {
      //   companies.forEach(async item=> {
      //     const coun1 = await User.find({role: 'candidate', "experience.previous_company": {$elemMatch: { _id: Types.ObjectId(item._id) } }}).count();
      //     const coun2 = await User.find({role: 'candidate', "experience.current_company._id" : Types.ObjectId(item._id)}).count();
      // users.push(user);
      // if (item._id!=main_id) {
      //   await User.updateMany({role: 'candidate', "experience.previous_company": {$elemMatch: { _id: Types.ObjectId(item._id) } }},{$set:{"experience.previous_company.$":main_object}});
      //   await User.updateMany({role: 'candidate', "experience.current_company._id" : Types.ObjectId(item._id)},{$set:{"experience.current_company" : main_object}});
      // }
      // console.log('result from cur', coun1, coun2, item['title'], item['_id']);
      // if ((coun1+coun2) == 0) {
      //   const userUsinCompanyId = await User.find({company_id: Types.ObjectId(item._id)});
      //   if (userUsinCompanyId.length == 0) {
      //     console.log('not getting used', item['title'], item._id);

      // await Company.deleteOne({_id:Types.ObjectId(item._id)})
      //   }

      // }
      // await Company.update({_id:Types.ObjectId(item._id)},{$set: {adminApproved: true}})
      // })
      // }
      // })

      return res.json({ error: false, status: 200, users })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }

  }

  static async updateJobSalaryObject(req: Request, res: Response) {
    try {
      let currency_mapping = [
        { id: 1, title: 'USD', icon: '$', salary_ranges: [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000] },
        { id: 2, title: 'EUR', icon: '€', salary_ranges: [4055, 8000, 12000, 16000, 20000, 24000, 28000, 32000, 36000, 40000] },
        { id: 3, title: 'INR', icon: '₹', salary_ranges: [360000, 730000, 1000000, 1400000, 1800000, 2100000, 2500000, 2900000, 3200000, 4000000] },
        { id: 4, title: 'GBP', icon: '£', salary_ranges: [3600, 7300, 11000, 14000, 18000, 22000, 26000, 30000, 33000, 37000] },
        { id: 5, title: 'RUB', icon: '₽', salary_ranges: [360000, 730000, 1000000, 1400000, 1800000, 2100000, 2500000, 2900000, 3200000, 4000000] },
      ]
      const jobs = await Job.find({ 'start_salary': { $exists: true }, 'end_salary': { $exists: true } });
      jobs.forEach(async item => {
        var x = JSON.parse(JSON.stringify(item));
        let currencyIndex = await currency_mapping.findIndex(a => a.title === x.salary.currency);
        let salaryRanges = await (currency_mapping[currencyIndex]['salary_ranges']).reverse();
        let updatedEndSalary, endUSD;
        salaryRanges.forEach(async currentItem => {
          console.log('current item: ', currentItem, item['salary']);
          if (currentItem >= item['salary']['end']) {
            updatedEndSalary = await currentItem;
            return;
          }
        })
        const baseUrl = 'http://apilayer.net/api/live?access_key=258c5cbf147e728619a0e129997a524f&currencies='+body.salary.currency+'&source=USD&format=1'
          var options = {
            uri: baseUrl,
          };

          let result = await request.get(options);
          result = JSON.parse(result)
          console.log('rates result: ', result, result['quotes']['USD'+body.salary.curzrency]);
          
          let currency = result['quotes']['USD'+body.salary.currency];
        endUSD = await +(parseFloat(updatedEndSalary * currency).toFixed(2));
        await Job.update({ _id: Types.ObjectId(item._id) }, { $set: { 'end_salary': endUSD, 'salary.end': updatedEndSalary, 'start_salary': null, 'salary.start': null } })
      })
      return res.json({ error: false, status: 200, jobs })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }

  }

  static async updateCandidateSalaryObject(req: Request, res: Response) {
    try {
      let currency_mapping = [
        { id: 1, title: 'USD', icon: '$', salary_ranges: [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000] },
        { id: 2, title: 'EUR', icon: '€', salary_ranges: [4055, 8000, 12000, 16000, 20000, 24000, 28000, 32000, 36000, 40000] },
        { id: 3, title: 'INR', icon: '₹', salary_ranges: [360000, 730000, 1000000, 1400000, 1800000, 2100000, 2500000, 2900000, 3200000, 4000000] },
        { id: 4, title: 'GBP', icon: '£', salary_ranges: [3600, 7300, 11000, 14000, 18000, 22000, 26000, 30000, 33000, 37000] },
        { id: 5, title: 'RUB', icon: '₽', salary_ranges: [360000, 730000, 1000000, 1400000, 1800000, 2100000, 2500000, 2900000, 3200000, 4000000] },
      ]
      const candidates = await User.find({ 'role': 'candidate', 'expected_salary': { $exists: true }, 'salary.currency': { $exists: true } });
      candidates.forEach(async item => {
        var x = JSON.parse(JSON.stringify(item));
        let currencyIndex = await currency_mapping.findIndex(a => a.title === x.salary.currency);
        let salaryRanges = await (currency_mapping[currencyIndex]['salary_ranges']).reverse();
        let updatedSalary, salUSD;
        salaryRanges.forEach(async currentItem => {
          if (currentItem >= item['salary']['value']) {
            // console.log('current item: ', currentItem, item['salary']);
            updatedSalary = await currentItem;
            return;
          }
        })
        const baseUrl = 'http://apilayer.net/api/live?access_key=258c5cbf147e728619a0e129997a524f&currencies='+body.salary.currency+'&source=USD&format=1'
          var options = {
            uri: baseUrl,
          };

          let result = await request.get(options);
          result = JSON.parse(result)
          console.log('rates result: ', result, result['quotes']['USD'+body.salary.curzrency]);
          
          let currency = result['quotes']['USD'+body.salary.currency];
        salUSD = await +(parseFloat(updatedSalary * currency).toFixed(2));
        console.log('updated salary: ', salUSD, updatedSalary);
        if (salUSD && updatedSalary)
          await User.update({ _id: Types.ObjectId(item._id) }, { $set: { 'expected_salary': salUSD, 'salary.value': updatedSalary } })
      })
      return res.json({ error: false, status: 200, candidates })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }

  }

  static async updateCandidateSalaryValue(req: Request, res: Response) {
    try {
      const jobs = await User.find({'_id':Types.ObjectId('6008495fd97a0c2b85011e72'),  'experience.period': { $exists: true } });
      jobs.forEach(async item => {  
        var x = JSON.parse(JSON.stringify(item));
        let new_experience: any;
        switch(x.experience.period.value.id) {
          case 1: new_experience = await { id: 1, title: '1 Year', value: 1 }; break;
          case 2: new_experience = await { id: 3, title: '3 Years', value: 3 }; break;
          case 4: new_experience = await { id: 5, title: '5 Years', value: 5 }; break;
          case 5: new_experience = await { id: 7, title: '7 Years', value: 7 }; break;
          case 6: new_experience = await { id: 9, title: '8+ Years', value: null }; break;
          default: new_experience = await { id: 1, title: '1 Year', value: 1 }; break;
        }
        console.log('new experience: ', new_experience, x.experience.period);
        // if (new_experience && typeof x.experience.period.value == 'number')
        await User.update({ _id: Types.ObjectId(item._id) }, { $set: { 'experience.period.value': new_experience } })
      })
      return res.json({ error: false, status: 200, jobs })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }

  }

  static async updateJobSalaryValue(req: Request, res: Response) {
    try {
      const jobs = await Job.find({'experience_required': { $exists: true } });
      jobs.forEach(async item => {  
        var x = JSON.parse(JSON.stringify(item));
        let new_experience: any;
        switch(x.experience_required.id) {
          case 1: new_experience = await { id: 1, title: '1 Year', value: 1 }; break;
          case 2: new_experience = await { id: 3, title: '3 Years', value: 3 }; break;
          case 4: new_experience = await { id: 5, title: '5 Years', value: 5 }; break;
          case 5: new_experience = await { id: 7, title: '7 Years', value: 7 }; break;
          case 6: new_experience = await { id: 9, title: '8+ Years', value: null }; break;
          default: new_experience = await { id: 1, title: '1 Year', value: 1 }; break;
        }
        console.log('new experience: ', new_experience, x.experience_required);
        // if (new_experience && typeof x.experience.period.value == 'number')
        await Job.update({ _id: Types.ObjectId(item._id) }, { $set: { 'experience_required': new_experience } })
      })
      return res.json({ error: false, status: 200, jobs })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }

  }

  //update expected salary for candidates with value as Nan
  static async getDashboardCount(req: Request, res: Response) {
    try {
      const total_users = await User.find({ 'role': 'candidate' }).count();
      const complete_users = await User.find({ 'role': 'candidate', 'profile_status': 'Completed' }).count();
      const incomplete_users = await User.find({ 'role': 'candidate', 'profile_status': 'Incomplete' }).count();
      return res.json({ error: false, status: 200, total_users, complete_users, incomplete_users })
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const userDetail = await User.find({ '_id': Types.ObjectId(req.params.id) })
      if (userDetail[0]['customerId']) {
        return res.json({ error: false, status: 200, data: true })
      }
      else {
        return res.json({ error: false, status: 200, data: false })
      }
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }
  }

  static async registerUnregisteredCandidate(req: Request, res: Response) {
    try {
      const candidateRegistered = await User.findOne({ 'email': req.body.email, 'role': 'candidate' })
      // User's candidate account already exists
      if (candidateRegistered) {
        return res.json({ error: true, message: "You're already registered with us! Please login and Apply." })
      }
      else if (!candidateRegistered) {
        let user;
        const emailExists = await User.findOne({ 'email': req.body.email, 'unregistered_role': 'candidate' })
        // Create a new user in collection
        if (!emailExists)
          user = await User.create(req.body)
        else
          user = await User.updateOne({ '_id': Types.ObjectId(emailExists['_id']) }, { $set: { 'name': req.body.name, 'resume': req.body.resume } })
        console.log('userrr', user);
        let user_id = emailExists ? emailExists : user
        return res.json({ error: false, status: 200, user_id: user_id['_id'] })
      }
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }
  }

  static async registerUnregisteredClient(req: Request, res: Response) {
    console.log('req.body', req.body);

    try {
      const candidateRegistered = await User.findOne({ 'email': req.body.email, 'role': 'hr' })
      // User's candidate account already exists
      if (candidateRegistered) {
        return res.json({ error: true, message: "You're already registered with us! Please login and Chat." })
      }
      else if (!candidateRegistered) {
        let user;
        const emailExists = await User.findOne({ 'email': req.body.email, 'role': { $exists: false } })
        // Create a new client in collection
        if (!emailExists)
          user = await User.create(req.body)
        else
          user = await User.updateOne({ '_id': Types.ObjectId(emailExists['_id']) }, { $set: { 'name': req.body.name, 'resume': req.body.resume } })
        console.log('userrr', user);
        let user_id = emailExists ? emailExists : user
        return res.json({ error: false, status: 200, user_id: user_id['_id'] })
      }
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' + e })
    }
  }
}