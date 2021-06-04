import { Request, Response } from 'express';
import * as request from 'request';
import { Types } from "mongoose";
import SourceableMailer from '../mailers/sourceableMailer';
import Slack from '../models/Slack';
import Message from "../models/Message";
import Match from "../models/Match";
import User from "../models/User";
const https = require('https');
const axios = require('axios');
const qs = require('qs');
const slackToken = 'xoxb-712701040913-1718810307748-cDWyhACvqY6UJhrju1Js0PVR';




export default class SlackController {
    // command = '/login' and call authorize
    static async authorize(req: Request, res: Response) {
        const { SlackToken, email, role } = req.query;
        if (!SlackToken || !email || !role) {
            return res.json({
                error: true,
                status: 404,
                message: "Validation Failed"
            });
        }
        let sourceableUserId;
        try {
            const finder = {
                $and: [{
                    $or: [{ 'emailAddress': email }, { 'email': email }]
                },
                {
                    role: role
                }]
            };
            sourceableUserId = await User.findOne(finder, { _id: 1 });
            console.log(sourceableUserId);
            if (!sourceableUserId || !sourceableUserId._id) {
                return res.json({
                    error: true,
                    status: 404,
                    message: "Please Check Email or Provide"
                });
            }
        } catch (e) {
            return res.json({
                error: true,
                status: 500,
                message: "An error occured."
            });
        }

        const options = {
            uri: 'https://slack.com/api/oauth.access?code='
                + SlackToken +
                '&client_id=' + process.env.SLACK_CLIENT_ID +
                '&client_secret=' + process.env.SLACK_CLIENT_SECRET,
            method: 'GET'
        };

        new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) return reject(err);

                const JSONresponse = JSON.parse(body);
                console.log('res', JSONresponse)
                if (!JSONresponse.ok) {
                    reject();
                } else {
                    resolve(JSONresponse);
                }
            });
        }).then(({
            access_token,
            scope,
            user_id,
            team_id,
            incoming_webhook: {
                channel_id,
                url
            }
        }) => {
            console.log(sourceableUserId)
            Slack.updateOne({
                user_id,
                team_id,
                channel_id,
                sourceableUserId: sourceableUserId._id
            }, {
                $set: {
                    access_token,
                    scope,
                    url,
                    sourceableUserId: sourceableUserId._id
                }
            }, { upsert: true }, (err) => {

                if (err) {
                    return res.json({
                        error: true,
                        status: 500,
                        message: err
                    });
                }

                return res.json({
                    error: false,
                    message: "Activity Successfull."
                });
            });

        }).catch(e => {
            return res.json({
                error: true,
                status: 500,
                message: e
            });
        });
    }

    static async webhook(req: Request, res: Response) {
        const {
            team_id,
            channel_id,
            user_id
        } = req.body;

        try {
            const slack = await Slack.findOne({
                team_id,
                channel_id,
                user_id
            }, 'url');

            const text = slack && slack.url ? slack.url : '';

            return res.json({
                text
            });

        } catch (e) {
            return res.json({
                error: true,
                status: 500,
                message: "An error occured."
            });
        }
    }

    static async actions(req: Request, res: Response) {
        const body = JSON.parse(req.body.payload);
        const { callback_id } = body;
        let text;

        try {
            if (callback_id === "employer_action") {
                const { name, value } = body.actions[0];
                const valueData = value.split(',');


                if (name === "Shortlist") {
                    const from = valueData[0];
                    const to = valueData[1];
                    const job = valueData[2];
                    console.log('valueJobToFrom', from, to, job);
                    const interest = {
                        job,
                        to,
                        from,
                        text: "congratulations! You application has been approved."
                    };
                    await Message.create(interest);
                    const user: any = User.findById(from).lean();

                    SourceableMailer.fetchUserDetails(interest, {
                        user: {
                            name: user.name,
                            email: user.email
                        }
                    });

                    text = "You've approved this application request";
                } else {
                    const from = valueData[1];
                    const to = valueData[0];
                    const job = valueData[2];
                    console.log('valueJobToFrom', from, to, job);
                    const interest = {
                        job,
                        to,
                        from,
                        text: "Sorry! You application has been Rejected but no worry we have lots of opportunity for you potential."
                    };
                    const messageQuery = {
                        job: Types.ObjectId(job),
                        $or: [{ from: Types.ObjectId(from) }, { to: Types.ObjectId(from) }]
                    };

                    const matchQuery: any = {
                        $and: [{ candidate: Types.ObjectId(to) },
                        { hr: Types.ObjectId(from) },
                        { job: Types.ObjectId(job) }]
                    };

                    await Message.updateMany(messageQuery, { $set: { archived: true } });
                    await Match.findOneAndUpdate(matchQuery,
                        {
                            $set: {
                                hrstatus: {
                                    status: 'Rejected',
                                    _id: Types.ObjectId(from),
                                    message: `You've discarded this profile`,
                                    updated: new Date(),
                                    reason: "Position Filled" // this needs to be dynamic before pushing to production
                                }
                            }
                        });

                    text = "You've rejected this application request";
                }
            }

            return res.json({
                text
            });
        } catch (e) {
            return res.json({
                error: true,
                status: 500,
                message: "An error occured."
            });
        }
    }


    static async sendJobHiringNotification(req: Request, res: Response) {
        try {
            const userDetail = await User.findById(req.body.candidateId, 'email name')

            console.log('req::::user::::',req.user);
            console.log('userDetail::::',userDetail);
            let blocks = [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: req.body.message
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Client Name : ${req.body.clientName}`
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Client Email : ${req.body.clientEmail}`
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Candidate Name : ${userDetail.name}`
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Candidate Email : ${userDetail.email}`
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Candidate Profile : https://qa.starkflow.co/candidates/${req.body.candidateId}`
                    }
                }

            ]

            let message = {
                token: slackToken,
                channel: '#hiring-notifications',
                blocks: JSON.stringify(blocks)
            };


            const url = 'https://slack.com/api/chat.postMessage';
            const resp = await axios.post(url, qs.stringify(message));

            return res.json({ error: false, data: 'Done' })
        }
        catch (e) {
            return res.json({
                error: true,
                status: 500,
                message: "An error occured."
            });
        }

    }
}