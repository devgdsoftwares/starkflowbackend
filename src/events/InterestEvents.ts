import Message from "../models/Message";
import Match from "../models/Match";
import SourceableMailer from '../mailers/sourceableMailer';
import User from '../models/User';
import Job from "../models/Job";
import Tracking from './Tracking';
import SlackService from "../services/SlackService";

export default class InterestEvents {
  static async toggle({
    user,
    from,
    to,
    job
  }) {
  
    // Validate
    if (String(user._id) === String(from) || String(user._id) !== String(to)) {
      const receiverDetail = await User.findById(to).lean();
      const jobDetails = await Job.findById(job).lean();
      const interest = {
        job,
        to,
        from: user._id,
        text: user.role === "candidate" ? 
          "Hi " + receiverDetail.name + ", I am interested in this job." : 
          "Hi " + receiverDetail.name + ", Our team is doing some interesting work for which we shall look forward to you as a " + jobDetails.title + ".\n  Please share your thoughts on this."
      };
      const messageQuery = user.role === "candidate" ? {
        job: interest.job,
        $or: [{ from: interest.from }, { to: interest.from }]
      } : {
          job: interest.job,
          $or: [{ from: interest.to }, { to: interest.to }]
        }
  
      const matchQuery: any = user.role === "candidate" ? {
        $and: [{ candidate: from },
        { hr: to },
        { job }]
      } : {
          $and: [{ candidate: to },
          { hr: from },
          { job }]
        }
  
  
      try {
        const message = await Message.findOne(messageQuery);
        if (!message) {

          await Message.create(interest);
          SourceableMailer.fetchUserDetails(interest, { user });
          user.role === "candidate" ?
          await Match.findOneAndUpdate(matchQuery,
            { $set: { candidatestatus: { 
              status: 'Applied', 
              _id: from ,
              message: `You've applied to this job` ,
              updated: new Date()
          } } }) :
          await Match.findOneAndUpdate(matchQuery,
            { $set: { hrstatus: { 
              status: 'Contacted', 
              _id: from ,
              message: `You've contacted the candidate`,
              updated: new Date()
          } } })

          if(user.role === "candidate" && receiverDetail.slack && receiverDetail.slack.url) {
            SlackService.notify({
              url: receiverDetail.slack.url,
              jobTitle: jobDetails.title,
              id: `${to},${from},${job}`,
              candidate:{
                name: user.name,
                avatar: user.avatar,
                portfolio: user.portfolio
              }
            });
          }
        }
      } catch (e) {
        Tracking.log({
          type: "Auto Apply",
          message: `Error occured while applying to job ${job}`,
          data: {}
        });
      }
    }

    // When interest is sent, we initilize a new message (that's it)
    // If message with interest is not found, then we have to send one
    // Else we have to archive that job for that candidate or archive that candidate for that HR
  }
}