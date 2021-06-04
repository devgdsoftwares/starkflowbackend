import { Request, Response, NextFunction } from "express";
import SlackService from "../services/SlackService";
import Message from "../models/Message";
import Match from "../models/Match";
import SourceableMailer from '../mailers/sourceableMailer';
import User from '../models/User';
import Job from "../models/Job";
import { read } from "fs";
import Company from "../models/Company";

export default class InterestController {
  static async toggle(req: Request, res: Response) {
    console.log('toggleController' , req.body);
    let element = req.body;
    const errors = InterestController.validate(req.user, req.body, 'toggle');
    if (errors) {
      return res.json({
        error: true,
        status: 422,
        data: errors
      });
    }

    // Validate
    if (String(req.user._id) !== String(req.body.from) || String(req.user._id) === String(req.body.to)) {
      return res.json({ error: true, status: 401, message: "Unauthorized." });
    }
    const receiverDetail = await User.findById(req.body.to).lean();
    const jobDetails = await Job.findById(req.body.job).lean();
    const interest = {
      job: req.body.job,
      to: req.body.to,
      from: req.user._id,
      status: '1',
      text: req.user.role === "candidate" ? 
        "Hi " + receiverDetail.name + ", I am interested in this job." : 
        "Hi " + receiverDetail.name + ", Our team is doing some interesting work for which we shall look forward to you as a " + jobDetails.title + ".\n  Please share your thoughts on this."
    };
  
    // When interest is sent, we initilize a new message (that's it)
    // If message with interest is not found, then we have to send one
    // Else we have to archive that job for that candidate or archive that candidate for that HR
    const messageQuery = req.user.role === "candidate" ? {
      job: interest.job,
      $or: [{ from: interest.from }, { to: interest.from }]
    } : {
        job: interest.job,
        $or: [{ from: interest.to }, { to: interest.to }]
      }

    const matchQuery: any = req.user.role === "candidate" ? {
      $and: [{ candidate: req.body.from },
      { hr: req.body.to },
      { job: req.body.job }]
    } : {
        $and: [{ candidate: req.body.to },
        { hr: req.body.from },
        { job: req.body.job }]
      }


    try {
      const message = await Message.findOne(messageQuery);
      if (message) {
        if(req.body.publicJob)
        {
          return res.json({ 
            error: false, 
            message: "Already applied to this job.",
            data:{
              mandatoryFields:[],
              messages:[],
              user: req.user,
              token: req.body.token,
              company: req.body.company
            }   
          });
        }

        await Message.updateMany(messageQuery, { $set: { archived: true , status : '2' } });
        let toCandidate = await User.findById(element.to).select({'name':1, 'email':1, 'email_approve':1});
        let fromCandidate = await User.findById(element.from).select({'name':1, 'email':1});
        let job = await Job.findById(element.job).select({'title':1,'company':1});
        let company = await Company.findById(job.company).select({'title':1});
        let status = 'Rejected';
        let rejectionreason = element.rejectionreason ? element.rejectionreason.title : '';
        const msg = {
          toId : toCandidate._id,
          to: toCandidate.email,
          toname:toCandidate.name,
          from: fromCandidate._id,
          fromname:fromCandidate.name,
          jobId: job._id,
          jobTitle: job.title,
          companyTitle: company.title,
          status: status,
          rejectionreason: rejectionreason
        };
        console.log('change status details',toCandidate,fromCandidate,job);
        
        if(toCandidate.email_approve && req.user.role === "hr") {
        await SourceableMailer.sendMailStatus(msg);
        }
        req.user.role === "candidate" ?
          await Match.findOneAndUpdate(matchQuery,
            { $set: { candidatestatus: { 
              status: 'Rejected', 
              _id: req.body.from ,
              message: 'Employer has moved to next step in their hiring process',
              updated: new Date(),
              reason: req.body.rejectionreason
          } } }) :
          await Match.findOneAndUpdate(matchQuery,
            { $set: { hrstatus: { 
              status: 'Rejected', 
              _id: req.body.from ,
              message: `You've discarded this profile`,
              updated: new Date(),
              reason: req.body.rejectionreason
          } } })
        return res.json({ 
          error: false, 
          message: "Interest removed.",
          data: {}
        });
      } else {
        await Message.create(interest);
        SourceableMailer.fetchUserDetails(interest, req);
        req.user.role === "candidate" ?
          await Match.findOneAndUpdate(matchQuery,
            { $set: { candidatestatus: { 
              status: 'Applied', 
              _id: req.body.from ,
              message: `You've applied to this job` ,
              updated: new Date()
          } } }) :
          await Match.findOneAndUpdate(matchQuery,
            { $set: { hrstatus: { 
              status: 'Contacted', 
              _id: req.body.from ,
              message: `You've contacted the candidate`,
              updated: new Date()
          } } })

        if(req.user.role === "candidate" ) {
            const SendMessageToSlack ={
              text : interest.text,
              job:jobDetails,
              to : receiverDetail ,
              from :req.user , 
              type : 'intro'
            }
            SlackService.sendMessageToSlack(SendMessageToSlack)
          
        }

        return res.json({ 
          error: false, 
          message: "Interest sent." ,
          data: req.body.publicJob && {
            mandatoryFields:[],
            messages:[],
            user: req.user,
            token: req.body.token,
            company: req.body.company
          }   
        });
      }
    } catch (e) {
      console.log(e);
      
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async canApply(req: Request, res: Response) {
    const errors = InterestController.validate(req.user, req.body);
    if (errors) {
      return res.json({
        error: true,
        status: 422,
        data: errors
      });
    }

    // If loggedin user is hr, toId is candidate id and if loggedin user is candidate, toId is job id
    
    const messageQuery: any = req.user.role === "candidate" ? {
      job: req.body.job,
      $or: [{ from: req.user._id }, { to: req.user._id }]
    } : {
        job: req.body.job,
        $or: [{ from: req.body.to }, { to: req.body.to }]
      }

    const matchQuery: any = req.user.role === "candidate" ? {
      $and: [{ candidate: req.body.from },
      { hr: req.body.to },
      { job: req.body.job }]
    } : {
        $and: [{ candidate: req.body.to },
        { hr: req.body.from },
        { job: req.body.job }]
      }
    try {
      let message = await Message.findOne(messageQuery);
      if (!message) {
        req.user.role === "candidate" ?
          await Match.findOneAndUpdate(matchQuery,
            { $set: { candidatestatus: { 
              status: 'Profile Viewed', 
              _id: req.body.from ,
              message: `You've viewed this job`,
              updated: new Date()
          } } }) :
          await Match.findOneAndUpdate(matchQuery,
            { $set: { hrstatus: { 
              status: 'Profile Viewed', 
              _id: req.body.from, 
              message: `You've viewed this profile`,
              updated: new Date()
          } } })
        return res.json({ error: false, data: { canApply: true, canWithDraw: false } });
      }

      // If user has archived
      messageQuery.archived = true;
      message = await Message.findOne(messageQuery);

      if (!message) {
        req.user.role === "candidate" ?
          await Match.findOneAndUpdate(matchQuery,
            { $set: { candidatestatus: { 
              status: 'Applied',
              _id: req.body.from ,
              message: `You've applied to this job` ,
              updated: new Date()
          } } }) :
          await Match.findOneAndUpdate(matchQuery,
            { $set: { hrstatus: { 
              status: 'Contacted', 
              _id: req.body.from ,
              message: `You've contacted the candidate`,
              updated: new Date()
          } } })
        return res.json({ error: false, data: { canApply: false, canWithdraw: true } });
      }
      req.user.role === "candidate" ?
        await Match.findOneAndUpdate(matchQuery,
          { $set: { candidatestatus: { 
            status: 'Rejected',
            _id: req.body.from ,
            message: 'Employer has moved to next step in their hiring process' ,
            updated: new Date()
        } } }) :
        await Match.findOneAndUpdate(matchQuery,
          { $set: { hrstatus: { 
            status: 'Rejected', 
            _id: req.body.from ,
            message: `You've discarded this profile`,
            updated: new Date()
        } } })
      return res.json({ error: false, data: { canApply: false, canWithdraw: false } });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  private static validate(user, data, type = null) {
    const errors = [];

    if (user.role === "hr") {
      if (!data.job) {
        errors.push({ path: "job", text: "Job is required." });
      }
      if (!data.to) {
        errors.push({ path: "to", text: "Candidate is required." });
      }
    } else {
      if (!data.job) {
        errors.push({ path: "job", text: "Job is required." });
      }
      if (type && type === 'toggle') {
        if (!data.to) {
          errors.push({ path: "to", text: "HR is required." });
        }
      }
    }
    return errors.length > 0 ? errors : false;
  }

  static async checkJobApplyEligibility(req: Request, res: Response, next: NextFunction) {
    const job :  any = await Job.findById(req.body.job).lean();

    if(!job)
    {
      return res.json({ 
        error: true,
        message: "Job not found or Job has expired",
        data:{
        }
      });
    }

    let company;
    if(req.body.publicJob)
    {
      req.body.from = `${req.user._id}`;
      req.body.to = `${job.user}`;
      company = await Company.findById(job.company).lean();
      req.body.company = company;
    }
  
    const { mandatory } = job; 
    // const { user } = req;
    
    const user = JSON.parse(JSON.stringify(req.user));

    let mandatoryFields = [];
    let messages = [];
    
    if(user.role !== "hr" && ((user.skills && !user.skills.length) || !user.skills ))
    {
      if(mandatory && mandatory.length)
      {
        mandatoryFields.push("skills");
        messages.push("Skills section is missing");
      }
      else {
        return res.json({ 
          error: false,
          data:{
            mandatoryFields:["skills"],
            messages:["Skills section is missing"],
            user,
            company,
            token: req.body.token
          }
        });
      }
    }

    if (mandatory && mandatory.length) {

      for (let i in mandatory) {
        switch (mandatory[i].title) {

          case "experience_role":
            if (
              !user.experience_role ||
              (
                user.experience_role &&
                (job.experience_role !== user.experience_role)
              )
            ) {

              mandatoryFields.push("experience_role");
              messages.push(
                `Experience Role required for the job is ${job.experience_role}`
              );
            }
            break;

          case "looking_for":
            if (
              !user.looking_for ||
              (user.looking_for.length &&
                !job.looking_for.some((type) => user.looking_for.includes(type))
              )
            ) {
              mandatoryFields.push("looking_for");
              messages.push(`Looking for a ${job.looking_for.join(', ')} position`);
            }
            break;

          case "school":
            {
              const school = user.education && user.education.reduce((school, education) => {
                if (education.school && education.school._id) {
                  school.push(`${education.school._id}`);
                }
                return school;
              }, []);

              if (
                !user.education ||
                !school.length ||
                (school.length &&
                  mandatory[i].values.length &&
                  !mandatory[i].values.some(values => school.includes(values._id))
                )
              ) {
                mandatoryFields.push("school");
                messages.push(mandatory[i].values.length ?
                  `Applications accepted only from ${
                  mandatory[i].values.map(school => school.name).join(', ')
                  }` : `Please update the education (school) section to apply`
                );
              }
              break;
            }

          case "degree":
            {
              const degree = user.education && user.education.reduce((degree, education) => {
                if (education.degree && education.degree.id) {
                  degree.push(education.degree.id);
                }
                return degree;
              }, []);

              if (
                !user.education ||
                !degree.length ||
                (degree.length &&
                  mandatory[i].values.length &&
                  !mandatory[i].values.some(values => degree.includes(values.id))
                )
              ) {
                mandatoryFields.push("degree");
                messages.push(mandatory[i].values.length ?
                  `Applications accepted only from the following background ${
                  mandatory[i].values.map(degree => degree.name).join(', ')
                  }` : `Please update the education (degree) section to apply`
                );
              }
              break;
            }

          case "company":
            {
              const company = user.experience && user.experience.reduce((company,experience)=>{
                if(experience.company)
                { 
                  company.push(experience.company);
                }
                return company;
              },[]);

              if(
                !user.experience ||
                ( user.experience && 
                  mandatory[i].values.length &&
                  !mandatory[i].values.some(values=>company.includes(values.name))
                )
              )
              {
                mandatoryFields.push("company");
                messages.push(mandatory[i].values.length ?
                  `Applications accepted only for the candidates having experience from ${
                  mandatory[i].values.map(company => company.name).join(', ')
                  }` : `Please update the experience section to apply`
                );
              }
              break;
            }

          case "availability":
            if (
              !user.notice_period ||
              (user.notice_period &&
                (job.notice_period < user.notice_period)
              )
            ) {
              mandatoryFields.push("availability");
              messages.push(`Notice period is ${job.availability}`);
            }
            break;

          case "salary":
            if (
              !user.expected_salary ||
              (user.expected_salary &&
                (job.end_salary < user.expected_salary)
              )
            ) {
              const { end, currency, duration } = job.salary;
              mandatoryFields.push("salary");
              messages.push(
                `Maximum compensation for this role is ${currency} ${end} / ${duration}`
              );
            }
            break;
        }
      }
      
      if(mandatoryFields.length)
      {
        return res.json({ 
          error: false,
          data:{
            mandatoryFields,
            messages,
            user,
            company,
            token: req.body.token
          }
        });
      }
    }
    return next();
  }
}
