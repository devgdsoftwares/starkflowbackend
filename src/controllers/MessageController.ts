import { Request, Response } from "express";
import Message from "../models/Message";
import { Types } from "mongoose";
import { isMongoId } from 'validator';
import User from '../models/User';
import SourceableMailer from '../mailers/sourceableMailer';
import SlackService from '../services/SlackService';
import { ObjectID, ObjectId } from "mongodb";
import Job from "../models/Job";
import Company from "../models/Company";
import { forEach } from "lodash";

export default class MessageController {
  // Data to show the sidebar of the messaging (all chats)
  static applicatioStatus = {
    '1': 'Hired',
    '2': 'Rejected'
  }
  static async index(req: Request, res: Response) {

    let { page, limit } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const user = req.user._id;
    console.log('req from select', user, req.query);

    const $match = {
      // archived: false,
      $or: [{ from: user }, { to: user }],
    };

    const matchUnreadCount = {
      $or: [{ from: user }, { to: user }],
      seen: false,
      open: false
    };
    // if (req.query.job_id && isMongoId(req.query.job_id)) {
    //   $match["job"] = Types.ObjectId(req.query.job_id);
    // }
    $match["open"] = false;
    if (req.query.q) {
      $match["text"] = new RegExp(req.query.q, "ig");
    }
    if (req.query && (req.query.status || req.query.status == 0)) {
      $match['status'] = req.query.status;
    }
    let conversation = { "$match": { "to._id": { $exists: true } } };
    //differentiating on the basis of candidate application
    if (req.user && req.user.role == 'hr') {
      if (req.query.conversation == 'submitted_from_job_posting')
        conversation = { "$match": { $or: [{ "to.role": 'candidate' }, { "from.role": 'candidate' }] } };
      else if (req.query.conversation == 'submitted_the_cv')
        conversation = { "$match": { "to._id": { $exists: true }, $or: [{ "to.unregistered_role": 'candidate' }, { "from.unregistered_role": 'candidate' }] } };
      else
        conversation = await{ "$match": { "to._id": { $exists: true } } };
    }

    console.log('conversation', conversation)
    const aggregate =
      [
        {
          $match
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            createdAt: 1,
            text: 1,
            users: { from: "$from", to: "$to" },
            from: 1,
            to: 1,
            job: 1,
            archived: 1,
            seen: 1,
            status: 1,
            userIds: [
              {
                $cond: {
                  if: { $eq: ["$from", user] },
                  then: "$from",
                  else: "$to"
                }
              },
              {
                $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
              }
            ]
          }
        },
        {
          $group: {
            _id: { userIds: "$userIds", job: "$job" },
            users: { $first: "$users" },
            text: { $first: "$text" },
            createdAt: { $first: "$createdAt" },
            archived: { $first: "$archived" },
            seen: { $first: "$seen" },
            status: { $first: "$status" }
          }
        },
        {
          $lookup: {
            localField: "users.from",
            foreignField: "_id",
            from: "users",
            as: "from"
          }
        },
        {
          $lookup: {
            localField: "users.to",
            foreignField: "_id",
            from: "users",
            as: "to"
          }
        },
        conversation,
        // {"$match":{"to.role":null}},
        {
          $lookup: {
            localField: "_id.job",
            foreignField: "_id",
            from: "jobs",
            as: "job"
          }
        },
        { $unwind: "$from" },
        { $unwind: "$to" },
        { $unwind: "$job" },
        {
          $lookup: {
            localField: "job.company",
            foreignField: "_id",
            from: "companies",
            as: "job.company"
          }
        },
        { $unwind: "$job.company" },
        {
          $project: {
            _id: 0,
            text: 1,
            createdAt: 1,
            archived: 1,
            seen: 1,
            from: { _id: 1, name: 1, avatar: 1, experience: 1, summary: 1, availability: 1, skills: 1, designation: 1, last_logged_in: 1, role: 1, resume: 1, fluency: 1, location: 1, looking_for: 1, unregistered_role: 1 },
            to: { _id: 1, name: 1, avatar: 1, hiring_status: 1, expected_salary: 1, salary: 1, experience: 1, summary: 1, availability: 1, skills: 1, designation: 1, last_logged_in: 1, role: 1, resume: 1, fluency: 1, location: 1, looking_for: 1, unregistered_role: 1 },
            job: { _id: 1, title: 1, salary: 1, start_salary: 1, end_salary: 1, company: { _id: 1, title: 1, logo: 1 }, domains: 1, skills: 1, experience_required: 1, looking_for: 1, fluency: 1 },
            status: 1
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]


    const countaggregate = [
      {
        $match: matchUnreadCount,
      },
      {
        $lookup: {
          localField: "from",
          foreignField: "_id",
          from: "users",
          as: "from"
        }
      },
      {
        $lookup: {
          localField: "to",
          foreignField: "_id",
          from: "users",
          as: "to"
        }
      },
      conversation,
      {
        $group: { _id: '$from._id', count: { $sum: 1 } }
      },
      {
<<<<<<< HEAD
        $project: {
          _id: 0,
          text: 1,
          createdAt: 1,
          archived: 1,
          seen: 1,
          from: { _id: 1, name: 1, avatar: 1, experience: 1, summary: 1, availability: 1, skills: 1, designation: 1, last_logged_in: 1, role: 1, resume: 1, fluency: 1, location: 1, looking_for: 1, unregistered_role: 1 },
          to: { _id: 1, name: 1, avatar: 1, hiring_status: 1, expected_salary: 1, salary: 1, experience: 1, summary: 1, availability: 1, skills: 1, designation: 1, last_logged_in: 1, role: 1, resume: 1, fluency: 1, location: 1, looking_for: 1, unregistered_role: 1 },
          job: { _id: 1, title: 1, salary: 1, start_salary: 1, end_salary: 1, company: { _id: 1, title: 1, logo: 1 }, domains: 1, skills: 1, experience_required: 1, looking_for: 1, fluency: 1 },
          status: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];

    try {
      let messages = await Message.aggregate(
        [
          {
            $facet: {
              'data': aggregate,
              'unreadCount': countaggregate
            }
          }
        ]
      );

      messages[0].data = messages[0].data.map(x =>
        MessageController.transformMessage(x, req.user._id)
      );

      return res.json({ error: false, data: messages[0].data, counter: messages[0].unreadCount });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured." + e
      });
    }
  }

  static async getMessagesCount(req: Request, res: Response) {

    const user = req.user._id;
    const role = req.user.role
    console.log('req from select', user, req.query);

    const $match = {
      // archived: false,
      $or: [{ from: Types.ObjectId(user) }, { to: Types.ObjectId(user) }],
      // seen: false
      open: false
    };

    const matchUnreadCount = {
      to: Types.ObjectId(user),
      seen: false,
      open: false
    };

    const matchOpen = {
      // archived: false,
      $or: [{ from: Types.ObjectId(user) }, { to: Types.ObjectId(user) }],
      open: true
    };

    const matchOpenUnreadCount = {
      // archived: false,
      to: Types.ObjectId(user),
      seen: false,
      open: true
    };

    let aggregateSumJobPosting
    let aggregateSumCVPosting
    let aggregateSumCVPostingCandidate

    // open-messages
    const conversation_open = { "$match": { "to._id": { $exists: true } } };

    const aggregateSumOpen = [
      { $match: matchOpen },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          users: { from: "$from", to: "$to" },
          userIds: [
            {
              $cond: {
                if: { $eq: ["$from", user] },
                then: "$from",
                else: "$to"
              }
            },
            {
              $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
            }
          ]
        }
      },
      {
        $group: {
          _id: { userIds: "$userIds", job: "$job" },
          users: { $first: "$users" }
        }
      },
      {
        $lookup: {
          localField: "users.to",
          foreignField: "_id",
          from: "users",
          as: "to"
        }
      },
      conversation_open,
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } }
    ]

    const aggregateSumOpenUnread = [
      { $match: matchOpenUnreadCount },
      {
        $lookup: {
          localField: "to",
          foreignField: "_id",
          from: "users",
          as: "to"
        }
      },
      conversation_open,
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } }
    ]

    let messagesCount_job
    let messagesCount_job_unread_count
    let messagesCount_cv
    let messagesCount_cv_unread_count
    let messagesCount_job_posting_candidate
    try {
      let messagesCount_open = await Message.aggregate(aggregateSumOpen)
      let messagesCount_open_unread = await Message.aggregate(aggregateSumOpenUnread)
      let counter

      if (role == 'hr') {
        // 'submitted_from_job_posting'
        const conversation_job_posting = { "$match": { $or: [{ "to.role": 'candidate' }, { "from.role": 'candidate' }] } };
        const conversation_job_posting_unread = { "$match": { $or: [{ "to.role": 'candidate' }, { "from.role": 'candidate' }] } };
        // submitted_the_cv
        const conversation_cv_posting = { "$match": { "to._id": { $exists: true }, $or: [{ "to.unregistered_role": 'candidate' }, { "from.unregistered_role": 'candidate' }] } };
        const conversation_cv_posting__unread = { "$match": { "to._id": { $exists: true }, "to.role": { $ne: "candidate" } } };

        const aggregateSumJobPosting = [
          { $match },
          { $sort: { createdAt: -1 } },
          {
            $project: {
              createdAt: 1,
              text: 1,
              users: { from: "$from", to: "$to" },
              from: 1,
              to: 1,
              job: 1,
              archived: 1,
              seen: 1,
              status: 1,
              userIds: [
                {
                  $cond: {
                    if: { $eq: ["$from", user] },
                    then: "$from",
                    else: "$to"
                  }
                },
                {
                  $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
                }
              ]
            }
          },
          {
            $group: {
              _id: { userIds: "$userIds", job: "$job" },
              users: { $first: "$users" },
              text: { $first: "$text" },
              createdAt: { $first: "$createdAt" },
              archived: { $first: "$archived" },
              seen: { $first: "$seen" },
              status: { $first: "$status" }
            }
          },
          {
            $lookup: {
              localField: "users.from",
              foreignField: "_id",
              from: "users",
              as: "from"
            }
          },
          {
            $lookup: {
              localField: "users.to",
              foreignField: "_id",
              from: "users",
              as: "to"
            }
          },
          conversation_job_posting,
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]

        const aggregateSumJobPostingUnread = [
          { $match: matchUnreadCount },
          {
            $lookup: {
              localField: "from",
              foreignField: "_id",
              from: "users",
              as: "from"
            }
          },
          {
            $lookup: {
              localField: "to",
              foreignField: "_id",
              from: "users",
              as: "to"
            }
          },
          conversation_job_posting_unread,
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]

        const aggregateSumCVPosting = [
          { $match },
          { $sort: { createdAt: -1 } },
          {
            $project: {
              createdAt: 1,
              text: 1,
              users: { from: "$from", to: "$to" },
              from: 1,
              to: 1,
              job: 1,
              archived: 1,
              seen: 1,
              status: 1,
              userIds: [
                {
                  $cond: {
                    if: { $eq: ["$from", user] },
                    then: "$from",
                    else: "$to"
                  }
                },
                {
                  $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
                }
              ]
            }
          },
          {
            $group: {
              _id: { userIds: "$userIds", job: "$job" },
              users: { $first: "$users" },
              text: { $first: "$text" },
              createdAt: { $first: "$createdAt" },
              archived: { $first: "$archived" },
              seen: { $first: "$seen" },
              status: { $first: "$status" }
            }
          },
          {
            $lookup: {
              localField: "users.from",
              foreignField: "_id",
              from: "users",
              as: "from"
            }
          },
          {
            $lookup: {
              localField: "users.to",
              foreignField: "_id",
              from: "users",
              as: "to"
            }
          },
          conversation_cv_posting,
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]

        const aggregateSumCVPostingUnread = [
          { $match: matchUnreadCount },
          {
            $lookup: {
              localField: "from",
              foreignField: "_id",
              from: "users",
              as: "from"
            }
          },
          {
            $lookup: {
              localField: "to",
              foreignField: "_id",
              from: "users",
              as: "to"
            }
          },
          conversation_cv_posting__unread,
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]

        let messagesCount_job = await Message.aggregate(aggregateSumJobPosting)
        let messagesCount_job_unread_count = await Message.aggregate(aggregateSumJobPostingUnread)
        let messagesCount_cv = await Message.aggregate(aggregateSumCVPosting)
        let messagesCount_cv_unread_count = await Message.aggregate(aggregateSumCVPostingUnread)
        let counter = { 'messagesCount_job': messagesCount_job.length > 0 ? messagesCount_job[0].count : 0, 'messagesCount_job_unread_count': messagesCount_job_unread_count.length > 0 ? messagesCount_job_unread_count[0].count : 0, 'messagesCount_cv': messagesCount_cv.length > 0 ? messagesCount_cv[0].count : 0, 'messagesCount_cv_unread_count': messagesCount_cv_unread_count.length > 0 ? messagesCount_cv_unread_count[0].count : 0, 'messagesCount_open': messagesCount_open.length > 0 ? messagesCount_open[0].count : 0, 'messagesCount_open_unread': messagesCount_open_unread.length > 0 ? messagesCount_open_unread[0].count : 0 }
        return res.json({ error: false, data: counter });
      }

      if (role == 'candidate') {
        // const conversation_cv_posting_candidate = { "$match": { "to.role": 'hr' } };
        const conversation_cv_posting_candidate = {
          "$match": {
            $or: [{ "to.role": 'hr' }, { "from.role": 'hr' }],
          }
        };

        const aggregateSumCVPostingCandidate = [
          { $match },
          {
            $project: {
              users: { from: "$from", to: "$to" },
              userIds: [
                {
                  $cond: {
                    if: { $eq: ["$from", user] },
                    then: "$from",
                    else: "$to"
                  }
                },
                {
                  $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
                }
              ]
            }
          },
          {
            $group: {
              _id: { userIds: "$userIds", job: "$job" },
              users: { $first: "$users" }
            }
          },
          {
            $lookup: {
              localField: "users.to",
              foreignField: "_id",
              from: "users",
              as: "to"
            }
          },
          {
            $lookup: {
              localField: "users.from",
              foreignField: "_id",
              from: "users",
              as: "from"
            }
          },
          conversation_cv_posting_candidate,
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]

        const aggregateSumCVPostingCandidateUnreadCount = [
          { $match: matchUnreadCount },
          {
            $lookup: {
              localField: "to",
              foreignField: "_id",
              from: "users",
              as: "to"
            }
          },
          {
            $lookup: {
              localField: "from",
              foreignField: "_id",
              from: "users",
              as: "from"
            }
          },
          conversation_cv_posting_candidate,
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } }
        ]

        let messagesCount_job_posting_candidate = await Message.aggregate(aggregateSumCVPostingCandidate)
        let messagesCount_job_unread_candidate = await Message.aggregate(aggregateSumCVPostingCandidateUnreadCount)
        let counter = { 'messagesCount_job': messagesCount_job_posting_candidate.length > 0 ? messagesCount_job_posting_candidate[0].count : 0, 'messagesCount_job_unread': messagesCount_job_unread_candidate.length > 0 ? messagesCount_job_unread_candidate[0].count : 0, 'messagesCount_open': messagesCount_open.length > 0 ? messagesCount_open[0].count : 0, 'messagesCount_open_unread': messagesCount_open_unread.length > 0 ? messagesCount_open_unread[0].count : 0 }

        return res.json({ error: false, data: counter });

      }




    }
    catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }


  }

  // Create a message
  static async create(req: Request, res: Response) {
    console.log('reached message create', req.user);

    try {
      const errors = MessageController.validateMessage(req.body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors,
          message: "Validation failed."
        });
      }

      if (String(req.user._id) !== String(req.body.from)) {
        return res.json({ error: true, status: 401, message: "Unauthorized." });
      }

      if (String(req.user._id) === String(req.body.to)) {
        return res.json({
          error: true,
          status: 422,
          message: "Can not send message to yourself."
        });
      }

      let message = await Message.create(req.body);
      message = await Message.findById(message._id)
        .populate({ path: "to", select: ["_id", "name", "avatar", "email", "email_approve", "role"] })
        .populate({ path: "from", select: ["_id", "name", "avatar", "email", "role"] })
        .populate({ path: "job", select: ["_id", "title"] });
      const msg = {
        toId: message.to._id,
        to: message.to.email,
        toname: message.to.name,
        from: message.from.email,
        fromname: message.from.name,
        fromId: message.from._id,
        text: message.text,
        jobId: message.job._id,
        jobTitle: message.job.title,
        fromRole: message.from.role
      };
      // const responseFromSlack = await SlackService.sendMessageToSlack(message);
      if (message.to.email_approve) {
        SourceableMailer.sendMail(msg);
      }
      message = MessageController.transformMessage(message, req.user._id);
      return res.json({
        error: false,
        message: "Message sent.",
        data: message
      });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  // Create a message
  static async createOpen(req: Request, res: Response) {
    console.log('check for open', req.user, req.body);

    try {
      const errors = MessageController.validateMessage(req.body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors,
          message: "Validation failed."
        });
      }

      if (req.user && (String(req.user._id) !== String(req.body.from))) {
        return res.json({ error: true, status: 401, message: "Unauthorized." });
      }

      if (req.user && (String(req.user._id) === String(req.body.to))) {
        return res.json({
          error: true,
          status: 422,
          message: "Can not send message to yourself."
        });
      }

      let message = await Message.create(req.body);
      message = await Message.findById(message._id)
        .populate({ path: "to", select: ["_id", "name", "avatar", "email", "email_approve"] })
        .populate({ path: "from", select: ["_id", "name", "avatar", "email", "role"] })

      const msg = {
        toId: message.to._id,
        to: message.to.email,
        toname: message.to.name,
        from: message.from.email,
        fromname: message.from.name,
        fromId: message.from._id,
        text: message.text,
        jobId: null,
        fromRole: message.from.role
      };
      // const responseFromSlack = await SlackService.sendMessageToSlack(message);
      if (message.to.email_approve) {
        SourceableMailer.sendMail(msg);
      }
      message = MessageController.transformMessage(message, req.user._id);
      return res.json({
        error: false,
        message: "Message sent.",
        data: message
      });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  // Create a message
  static async createUnregistered(req: Request, res: Response) {
    try {
      console.log('body', req.body, req.query);

      const errors = MessageController.validateMessage(req.body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors,
          message: "Validation failed."
        });
      }

      let message = await Message.create(req.body);
      message = await Message.findById(message._id)
        .populate({ path: "to", select: ["_id", "name", "avatar", "email", "email_approve"] })
        .populate({ path: "from", select: ["_id", "name", "avatar", "email", "role", "resume"] })
        .populate({ path: "job", select: ["_id", "title"] });
      const msg = {
        toId: message.to._id,
        to: message.to.email,
        toname: message.to.name,
        from: message.from.email,
        fromname: message.from.name,
        fromrole: message.from.role,
        fromresume: message.from.resume,
        fromId: message.from._id,
        text: message.text,
        jobId: message.job._id,
        jobTitle: message.job.title
      };
      console.log('message details', message);
      if (message.to.email_approve) {
        SourceableMailer.sendMail(msg);
      }
      if (req.query && req.query['sendMail'] == 'true')
        SourceableMailer.sendMailToUnregisteredUser(msg);
      return res.json({
        error: false,
        message: "Message sent.",
        data: message
      });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  // Create a message
  static async createUnregisteredClient(req: Request, res: Response) {
    try {
      console.log('body', req.body);

      const errors = MessageController.validateMessage(req.body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors,
          message: "Validation failed."
        });
      }

      let message = await Message.create(req.body);
      message = await Message.findById(message._id)
        .populate({ path: "to", select: ["_id", "name", "avatar", "email", "email_approve"] })
        .populate({ path: "from", select: ["_id", "name", "avatar", "email", "role", "resume"] })
        .populate({ path: "job", select: ["_id", "title"] });
      const msg = {
        toId: message.to._id,
        to: message.to.email,
        toname: message.to.name,
        from: message.from.email,
        fromname: message.from.name,
        fromrole: message.from.role,
        fromId: message.from._id,
        text: message.text
      };
      console.log('message details', message);
      if (message.to.email_approve) {
        SourceableMailer.sendMail(msg);
      }
      if (req.query && req.query['sendMail'] == 'true')
        SourceableMailer.sendMailToUnregisteredUser(msg);
      return res.json({
        error: false,
        message: "Message sent.",
        data: message
      });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: `An error occured. ${e.message}`
      });
    }
  }

  // Show a chat thread between passed user and the logged in user
  static async showOpenMessage(req: Request, res: Response) {
    let { page, limit } = req.query;
    const { otherUser } = req.params;

    if (req.user._id === otherUser) {
      return res.json({
        error: true,
        status: 400,
        message: "The other user id is invalid."
      });
    }

    if (!req.query.other_id) {
      return res.json({
        error: true,
        status: 422,
        message: "Validation failed.",
        data: [{ type: "job_id", message: "Other ID is required." }]
      });
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let finder: any = {
      $and: [
        { from: { $in: [req.user._id, otherUser] } },
        { to: { $in: [req.user._id, otherUser] } }
      ],
      // from: req.query.other_id,
      open: true
    };

    try {
      let messages = await Message.find(finder)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "job", select: ["_id", "title", "archived",] })
        .populate({ path: "to", select: ["_id", "name", "avatar",] })
        .populate({ path: "from", select: ["_id", "name", "avatar", "company_id"] });
      messages = messages.map(x =>
        MessageController.transformMessage(x, req.user._id)
      );
      finder.seen = false;
      // finder.to = req.user._id;
      await Message.find(finder).updateMany({
        $set: { seen: true, seenAt: new Date() }
      });

      if (messages.length > 0) {
        if (messages[0]['other'].company_id) {
          let Cmp = await Company.findById(messages[0]['other'].company_id)
          messages[0]['other'].company_details = Cmp
        }
      }
      // const finddata = await Message.find(finder)
      return res.json({ error: false, data: messages });
    } catch (e) {
      return res.json({
        error: false,
        status: 500,
        message: "An error occured."
      });
    }
  }

  // Show a chat thread between passed user and the logged in user
  static async show(req: Request, res: Response) {
    let { page, limit } = req.query;
    const { otherUser } = req.params;

    if (req.user._id === otherUser) {
      return res.json({
        error: true,
        status: 400,
        message: "The other user id is invalid."
      });
    }

    if (!req.query.job_id) {
      return res.json({
        error: true,
        status: 422,
        message: "Validation failed.",
        data: [{ type: "job_id", message: "The job is required." }]
      });
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let finder: any = {
      $and: [
        { from: { $in: [req.user._id, otherUser] } },
        { to: { $in: [req.user._id, otherUser] } }
      ],
      job: req.query.job_id,
      // archived: false
    };

    try {
      let messages = await Message.find(finder)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "job", select: ["_id", "title", "archived",] })
        .populate({ path: "to", select: ["_id", "name", "avatar", "role"] })
        .populate({ path: "from", select: ["_id", "name", "avatar", "role"] });
      messages = messages.map(x =>
        MessageController.transformMessage(x, req.user._id)
      );
      finder.seen = false;
      // finder.to = req.user._id;
      await Message.find(finder).updateMany({
        $set: { seen: true, seenAt: new Date() }
      });
      // const finddata = await Message.find(finder)
      return res.json({ error: false, data: messages });
    } catch (e) {
      return res.json({
        error: false,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async UnseenMessages(req: Request, res: Response) {

    let finder: any = {
      to: req.user._id,
      archived: false,
      seen: false
    }

    try {
      let count = await Message.find(finder).count();
      return res.json({ error: false, status: 200, data: count })
    } catch (e) {
      return res.json({
        error: false,
        status: 500,
        message: "An error occured."
      });
    }
  }
  // Create a message validation
  private static validateMessage(data) {
    const errors = [];
    if (!data.from) {
      errors.push({ type: "from", message: "Sender of message is required." });
    }

    if (!data.to) {
      errors.push({ type: "to", message: "Receiver of message is required." });
    }

    if (!data.text) {
      errors.push({ type: "text", message: "Text of message is required." });
    }

    if (!data.job && !data.open) {
      errors.push({ type: "job", message: "Job of message is required." });
    }

    if (data.from && data.to && data.from === data.to) {
      errors.push({
        type: "to",
        message: "You can not send message to yourself."
      });
    }

    if (errors.length === 0) {
      return false;
    }
    return errors;
  }
  // change the status of aplication
  static async changeStatus(req: Request, res: Response) {
    //For status constant is defined above application status
    const query = req.body;
    let matchQuery;

    try {
      console.log('change status req body', req.body);
      query.forEach(async element => {
        let toCandidate = await User.findById(element.to).select({ 'name': 1, 'email': 1, 'email_approve': 1 });
        let fromCandidate = await User.findById(element.from).select({ 'name': 1, 'email': 1 });
        let job, company;
        if (element.jobId) {
          job = await Job.findById(element.jobId).select({ 'title': 1, 'company': 1 });
          company = await Company.findById(job.company).select({ 'title': 1 });
        }

        console.log('change status details', toCandidate, fromCandidate, element.jobId);
        let msg;
        if (element.jobId) {
          msg = {
            toId: toCandidate._id,
            to: toCandidate.email,
            toname: toCandidate.name,
            from: fromCandidate._id,
            fromname: fromCandidate.name,
            jobId: job._id,
            jobTitle: job.title,
            companyTitle: company.title,
            status: 'Hired'
          };
          matchQuery = {
            $and: [{ job: element.jobId },
            {
              $or: [{
                $and: [{ to: element.to },
                { from: element.from }]
              },
              { $and: [{ to: element.from }, { from: element.to }] }]
            }]
          };
        }
        else {
          msg = {
            toId: toCandidate._id,
            to: toCandidate.email,
            toname: toCandidate.name,
            from: fromCandidate._id,
            fromname: fromCandidate.name,
            status: 'Hired'
          };
          matchQuery = {
            $and: [
              // { job: element.jobId },
              {
                $or: [{
                  $and: [{ to: element.to },
                  { from: element.from }]
                },
                { $and: [{ to: element.from }, { from: element.to }] }]
              }
            ]
          };
        }

        if (toCandidate.email_approve) {
          // await SourceableMailer.sendMailStatus(msg);
        }
        if (element.jobId)
          await User.updateMany({ _id: new ObjectId(element.to) }, { $set: { hiring_status: { status: element.status, job: new ObjectId(element.jobId), hirer_id: new ObjectId(element.from) } } })
        else
          await User.updateMany({ _id: new ObjectId(element.to) }, { $set: { hiring_status: { status: element.status, hirer_id: new ObjectId(element.from) } } })
        await Message.updateMany(matchQuery, { $set: { status: element.status } })

      });

      return res.json({ error: false, status: 200, message: 'Profile updated sucessfully' })
    } catch (e) {
      console.log(e);

      return res.json({ error: true, status: 500, message: 'Server Error' })
    }
  }
  // Transform a message
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

  static async getOpenMessages(req: Request, res: Response) {

    let { page, limit } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const user = req.user._id;
    console.log('req from select', user, req.query);

    const $match = {
      $or: [{ from: user }, { to: user }]
    };
    $match["open"] = true

    const matchUnreadCount = {
      // archived: false,
      $or: [{ from: user }, { to: user }],
      seen: false,
      open: true
    };


    if (req.query.q) {
      $match["text"] = new RegExp(req.query.q, "ig");
    }
    console.log('match filter', $match)
    const aggregate = [
      {
        $match
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          createdAt: 1,
          text: 1,
          users: { from: "$from", to: "$to" },
          from: 1,
          to: 1,
          open: 1,
          archived: 1,
          seen: 1,
          status: 1,
          userIds: [
            {
              $cond: {
                if: { $eq: ["$from", user] },
                then: "$from",
                else: "$to"
              }
            },
            {
              $cond: { if: { $ne: ["$to", user] }, then: "$to", else: "$from" }
            }
          ]
        }
      },
      {
        $group: {
          _id: { userIds: "$userIds" },
          users: { $first: "$users" },
          text: { $first: "$text" },
          createdAt: { $first: "$createdAt" },
          archived: { $first: "$archived" },
          seen: { $first: "$seen" },
        }
      },
      {
        $lookup: {
          localField: "users.from",
          foreignField: "_id",
          from: "users",
          as: "from"
        }
      },
      {
        $lookup: {
          localField: "users.to",
          foreignField: "_id",
          from: "users",
          as: "to"
        }
      },
      { $unwind: "$from" },
      { $unwind: "$to" },
      {
        $project: {
          _id: 0,
          text: 1,
          createdAt: 1,
          archived: 1,
          seen: 1,
          from: { _id: 1, name: 1, avatar: 1, experience: 1, company_id: 1, summary: 1, availability: 1, skills: 1, designation: 1, last_logged_in: 1, role: 1, resume: 1, expected_salary: 1 },
to: { _id: 1, name: 1, avatar: 1, hiring_status: 1, company_id: 1, expected_salary: 1, salary: 1, experience: 1, summary: 1, availability: 1, skills: 1, designation: 1, last_logged_in: 1, role: 1, resume: 1 },
          status: 1,
          open: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];

    const countaggregate = [
      {
        $match: matchUnreadCount,
      },
      {
        $lookup: {
          localField: "from",
          foreignField: "_id",
          from: "users",
          as: "from"
        }
      },
      {
        $lookup: {
          localField: "to",
          foreignField: "_id",
          from: "users",
          as: "to"
        }
      },
      {
        $group: { _id: '$from._id', count: { $sum: 1 } }
      },
      {
        $unwind: '$_id'
      }
    ]

    try {
      let messages = await Message.aggregate(
        [
          {
            $facet: {
              'data': aggregate,
              'unreadCount': countaggregate
            }
          }
        ]
      );
     
      messages[0].data = messages[0].data.map(x =>
        MessageController.transformMessage(x, req.user._id)
      );

      if (messages[0].data.length > 0) {
        messages[0].data.forEach(async (msg, index) => {
          if (msg.other.company_id) {
            let Cmp = await Company.findById(Types.ObjectId(msg.other.company_id))
            msg.other.company_details = Cmp;
          }
          if (index == messages[0].data.length - 1) {
            return res.json({
              error: false, data: messages[0].data, counter: messages[0].unreadCount
            });
          }
        })
      }
      else {
        return res.json({ error: false, data: messages[0].data, counter: messages[0].unreadCount });
      }

    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured."
      });
    }
  }

  static async getUnregisteredJobConversation(req: Request, res: Response) {
    let { jobId, unregistereduserId, page } = req.query;

    let ClientId = await Job.findById(jobId, 'user')
    page = Number(page) || 1;
    let limit = Number(limit) || 10;

    let finder: any = {
      $and: [
        { from: { $in: [unregistereduserId, ClientId.user] } },
        { to: { $in: [unregistereduserId, ClientId.user] } }
      ],
      // from: unregistereduserId,
      // to: ClientId.user,
      job: jobId
    };

    try {
      let messages = await Message.find(finder)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "job", select: ["_id", "title", "archived",] })
        .populate({ path: "to", select: ["_id", "name", "avatar", "company_id"] })
        .populate({ path: "from", select: ["_id", "name", "email", "company_id"] });

      console.log(messages)
      messages = messages.map(x =>
        MessageController.transformMessage(x, unregistereduserId)
      );
      finder.seen = false;
      // finder.to = req.user._id;
      await Message.find(finder).updateMany({
        $set: { seen: true, seenAt: new Date() }
      });

      if (messages.length > 0) {
        if (messages[0]['other'].company_id) {
          let Cmp = await Company.findById(messages[0]['other'].company_id)
          messages[0]['other'].company_details = Cmp
        }
      }
      // const finddata = await Message.find(finder)
      return res.json({ error: false, data: messages });
    } catch (e) {
      return res.json({
        error: false,
        status: 500,
        message: "An error occured."
      });
    }
  }
  static async getUnregisteredClientConversation(req: Request, res: Response) {
    let { ClientId, unregistereduserId, page } = req.query;

    page = Number(page) || 1;
    let limit = Number(limit) || 10;

    let finder: any = {
      $and: [
        { from: { $in: [unregistereduserId, ClientId] } },
        { to: { $in: [unregistereduserId, ClientId] } }
      ]
    };

    try {
      let messages = await Message.find(finder)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "to", select: ["_id", "name", "avatar", "experience", "designation"] })
        .populate({ path: "from", select: ["_id", "name", "email", "company_id", "experience", "designation", "avatar"] });

      console.log(messages)
      messages = messages.map(x =>
        MessageController.transformMessage(x, unregistereduserId)
      );
      finder.seen = false;
      // finder.to = req.user._id;
      await Message.find(finder).updateMany({
        $set: { seen: true, seenAt: new Date() }
      });

      if (messages.length > 0) {
        if (messages[0]['other'].company_id) {
          let Cmp = await Company.findById(messages[0]['other'].company_id)
          messages[0]['other'].company_details = Cmp
        }
      }
      // const finddata = await Message.find(finder)
      return res.json({ error: false, data: messages });
    } catch (e) {
      return res.json({
        error: false,
        status: 500,
        message: "An error occured."
      });
    }
  }
}
