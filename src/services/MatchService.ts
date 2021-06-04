import Job from "../models/Job";
import User from "../models/User";
import KPIScores from "../config/KPIScores";
import * as _ from "lodash";
import ProcessedData from "../models/ProcessedData";
import Match from "../models/Match";
import InterestEvents from '../events/InterestEvents';

export default class MatchService {
  static count = 0;
  static errorCount = 0;

  static async transformJob(job_id) {
    const job: any = await Job.findById(job_id);
    let processedJob = {
      job_id: job._id,
      user_id: job.user,
      type: "job",
      domains: [],
      modules: []
    };

    job.skills
      ? job.skills.forEach(skillGroup => {
          processedJob[skillGroup.parent.toLowerCase()] = MatchService.getIds(
            skillGroup.data
          );
        })
      : [];

    job.domains
      ? (processedJob.domains = MatchService.getIds(job.domains))
      : [];

    job.modules
      ? job.modules.forEach(m => {
          processedJob.modules = processedJob.modules.concat(
            MatchService.getIds(m.sub_modules)
          );
        })
      : [];

    return processedJob;
  }

  static async transformUser(user_id) {
    const user: any = await User.findById(user_id);
    let transformedUser = {
      user_id: user._id,
      type: "candidate",
      domains: [],
      modules: []
    };

    user.skills
      ? user.skills.forEach(skillGroup => {
          transformedUser[
            skillGroup.parent.toLowerCase()
          ] = MatchService.getIds(skillGroup.data);
        })
      : [];

    user.projects
      ? user.projects.forEach(p => {
          transformedUser.domains = transformedUser.domains.concat(
            MatchService.getIds(p.domains)
          );
        })
      : [];

    user.projects
      ? user.projects.forEach(p => {
          p.features.forEach(m => {
            transformedUser.modules = transformedUser.modules.concat(
              MatchService.getIds(m.sub_modules)
            );
          });
        })
      : [];

    return transformedUser;
  }

  static getIds(data: any[]) {
    return data.map(x => (x && x._id ? String(x._id) : null)).filter(x => x);
  }

  static async processMatchesForJob(job, callback) {
    job._id = job.job_id;
    const cursor = ProcessedData.find({ type: "candidate" }).cursor();
    cursor.eachAsync(async candidate => {
      candidate = candidate.toJSON();
      try {
        await MatchService.processJobAndCandidate(
          candidate,
          job,
          job.user_id,
          job.job_id,
          candidate.user_id
        );
      } catch (e) {
        MatchService.errorCount++;
        console.log(
          `Error @ processMatchesForJob # ${MatchService.errorCount} > ${
            e.message
          }`
        );
      }
    }, callback);
  }

  static async processMatchesForCandidate(candidate, callback) {
    const cursor = ProcessedData.find({ type: "job" }).cursor();
    cursor.eachAsync(async job => {
      job = job.toJSON();
      try {
        await MatchService.processJobAndCandidate(
          job,
          candidate,
          job.user_id,
          job.job_id,
          candidate.user_id
        );
      } catch (e) {
        MatchService.errorCount++;
        console.log(
          `Error @ processMatchesForCandidate # ${MatchService.errorCount} > ${
            e.message
          }`
        );
      }
    }, callback);
  }

  private static async processJobAndCandidate(
    first,
    second,
    hr,
    job,
    candidate
  ) {
    
    const scores: any = {
      total: 0
    };
    _.map(KPIScores, (item, name) => {
      if (first[name] && second[name]) {
        scores[name] = item.calc(first[name], second[name]);
        scores.total += scores[name];
      }
    });
    // Map the scores and round to 2
    for (var key in scores) {
      scores[key] = _.round(scores[key], 2);
    }

    const data = {
      hr,
      job,
      candidate,
      score: scores
    };
    await Match.findOneAndUpdate(
      { hr, candidate, job },
      { $set: { score: data.score, archived: false } },
      { upsert: true }
    );

    if(data.score.total >= 75) {
      const user = await User.findById(candidate).lean();
      console.log('user found', user);
      
      if(user.autoMatch) {
        InterestEvents.toggle({
          user,
          to: hr,
          from: candidate,
          job
        });
      }
    }
  }
}
