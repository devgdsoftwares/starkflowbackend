import { Request, Response, NextFunction } from 'express';
import * as request from 'request';
import Tracking from '../events/Tracking';
import Slack from '../models/Slack';
import { Types } from 'mongoose';
import Match from "../models/Match";

export default class SlackService {
    static isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (
            (
                req.body &&
                req.body.token === process.env.SLACK_VERIFICATION_TOKEN
            ) || (
                req.body && req.body.payload &&
                JSON.parse(req.body.payload).token === process.env.SLACK_VERIFICATION_TOKEN
            )
        ) {
            return next();
        } else {
            return res.status(401).send(`Unauthorized`);
        }
    }

    static notify({
        url,
        jobTitle,
        id,
        candidate: {
            name,
            avatar,
            portfolio
        }
    }) {

        const slackMessage = {
            "text": `Application for ${jobTitle}`,
            "attachments": [
                {
                    "author_name": name,
                    "author_icon": avatar,
                    "image_url": portfolio
                },
                {
                    "fallback": "What would you like to do?",
                    "title": "What would you like to do?",
                    "callback_id": "employer_action",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "approve",
                            "text": "Approve",
                            "type": "button",
                            "value": id
                        },
                        {
                            "name": "reject",
                            "text": "Reject",
                            "type": "button",
                            "value": id
                        }
                    ]
                }
            ]
        };

        request({
            url,
            method: "POST",
            json: true,
            body: slackMessage
        }, function (error, response, body) {
            if (error) {
                Tracking.log({
                    type: "Slack Notification",
                    message: `Error occured while sending notification to employer for ${jobTitle} profile.`,
                    data: {}
                });
            }
        });

    }
    static async sendMessageToSlack(UserDetails) {
        console.log('UserDetails', UserDetails)
        const data: any = await Slack.findOne({ sourceableUserId: Types.ObjectId(UserDetails.to._id) }, { url: 1, channel: 1 })
        if (!data.url) {
            return;
        }

        const UserInformation: any = UserDetails && UserDetails.type === 'intro' ? await this.getCandidateInfoandMatch(UserDetails.from._id, UserDetails.job._id) : '';
        if (UserInformation && UserInformation!= '' && UserDetails.type === 'intro' && ( UserInformation.error || !UserInformation.data)) {
            return;
        }
        const message = UserDetails && UserDetails.type === 'intro' ?
            {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `${UserDetails.from.name} intersted in your Job : ${UserDetails.job.title}`
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "block_id": "section567",
                        "text": {
                            "type": "mrkdwn",
                            "text": `Matching Percentange : ${UserInformation.data.score.total}%\nNotice Period : ${UserInformation.data.candidate.availability}\nExperience Role : ${UserInformation.data.candidate.experience_role}`,
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": `${UserDetails.from.avatar}`,
                            "alt_text": "Haunted hotel image"
                        }
                    },
                    {
                        "type": "divider"
                    }
                ],
                "attachments": [
                    {
                        "fallback": "congratulations! You got a new candidate Interest",
                        "callback_id": "employer_action",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "fields": this.createMessageFormatSlack(UserInformation.data.candidate.skills),
                        "actions": [
                            {
                                "name": "Shortlist",
                                "text": "Shortlist",
                                "type": "button",
                                "value": `${UserDetails.to._id},${UserDetails.from._id},${UserDetails.job._id}`,
                                "style": "primary"
                            },
                            {
                                "name": "reject",
                                "text": "Reject",
                                "type": "button",
                                "value": `${UserDetails.from._id},${UserDetails.from._id},${UserDetails.job._id}`,
                                "style": "danger"
                            }
                        ]
                    }
                ],
            }
            : {
                "attachments": [
                    {
                        "fallback": String(UserDetails.text).replace(/\n/g, ''),
                        "title": `Job:${UserDetails.job.title}`,
                        "author_name": `${UserDetails.from.name} messaged`,
                        "author_icon": UserDetails.from.avatar,
                        "title_link": 'https://starkflow.co',
                        "color": "#3AA3E3",
                        "text": String(UserDetails.text).replace(/\n/g, ''),
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "View Profile",
                                "text": "View Profile",
                                "type": "button",
                                "value": 'View Profile',
                                "url": 'https://starkflow.co',
                                "style": "primary"
                            }
                        ],
                        "footer": "Starkflow.co",
                    }
                ]
            }
            // console.log('userInfoEducation' ,UserInformation.data.candidate.education )
            // if(UserInformation.data.candidate.education && UserInformation.data.candidate.education.length >0 ) {
            //     UserInformation.data.candidate.education.forEach(element => {
            //         message.blocks.push( {
            //             "type": "section",
            //             "text": {
            //                 "type": "mrkdwn",
            //                 "text": `*Skills* \n
            //                 Completed ${element.degree.name} from ${element.school.name} in ${element.studyfield} domain with ${element.grades}`
            //             }
            //         },
            //         {
            //             "type": "divider"
            //         })
            //    });
              
            // }
        return request.post({
            url: data.url,
            body: message,
            json: true
        }, function (error, response, body) {
            console.log(error, body);
            return response
        })

    }
   static createMessageFormatSlack(skills) {
    const formatMessage = [];
    skills.forEach(item => {
        const subFieds = {
            "title": item.parent,
            "value": '',
            "short": true
        }
        item.data.forEach(element => {
            subFieds.value = subFieds.value + `${element.title}\n`
        });
        formatMessage.push(subFieds);
    });
    return formatMessage;
}
  static async  getCandidateInfoandMatch(Userid, jobId) {
    console.log('user entered userId ', jobId, Userid)
    const $match = {
        "score.total": { $gt: 0 },
        'candidate': Types.ObjectId(Userid),
        'job': Types.ObjectId(jobId),
        archived: false
    };
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
        { $unwind: "$candidate" },
        {
            $project: {
                _id: 0,
                score: 1,
                candidate: 1
            }
        },
    ];
    try {
        const data = await Match.aggregate(aggregate);
        return {
            data: data[0],
            error: false
        }
    } catch (e) {
        return {
            error: true,
            message: e
        }
    }
}
}