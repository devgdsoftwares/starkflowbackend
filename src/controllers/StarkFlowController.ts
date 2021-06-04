import { Request, Response } from "express";
import * as _ from "lodash";

import StarkflowMailer from "../mailers/StarkflowMailer";
import StarkFlow from "../models/StarkFlow";
import User from "../models/User";
import { Types } from "mongoose";
import { parse } from "dotenv/types";
export default class StarkFlowController {
  static async data(req: Request, res: Response) {
    let { page, limit, type } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    type = type || "contact";

    try {
      const data = await StarkFlow.find({ type })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.json({ error: false, data });
    } catch (e) {
      return res.json({
        error: true,
        status: 500,
        message: "An error occured.",
      });
    }
  }

  static async wizard(req: Request, res: Response) {
    const { name, email } = req.body;

    const data = { name, email };
    const errors = StarkFlowController.validate(data);
    if (errors) {
      return res
        .status(422)
        .json({ error: true, message: "Validation failed.", data: errors });
    }

    req.body.type = "wizard";

    return StarkFlowController.insertData(req.body, res);
  }

  static async custom(req: Request, res: Response) {
    const { client, name, email, details, similar } = req.body;

    const data = { name, email, details, similar };
    const errors = StarkFlowController.validate(data);
    if (errors) {
      return res
        .status(422)
        .json({ error: true, message: "Validation failed.", data: errors });
    }

    data["type"] = "custom";
    data["client"] = client;

    return StarkFlowController.insertData(data, res);
  }

  static async contact(req: Request, res: Response) {
    const { client, name, email, message, country, phone } = req.body;

    const data = { name, email, message, country, phone };
    const errors = StarkFlowController.validate(data);
    if (errors) {
      return res
        .status(422)
        .json({ error: true, message: "Validation failed.", data: errors });
    }

    data["type"] = "contact";
    data["client"] = client;

    return StarkFlowController.insertData(data, res);
  }
  static async UpdateStatus(req: Request, res: Response) {
    const { UserId, status, onboarding } = req.body;
  
    // const errors = StarkFlowController.validate(data);
    // if (errors) {
    //   return res
    //     .status(422)
    //     .json({ error: true, message: "Validation failed.", data: errors });
    // }

    try {
      const updateDoc = {
        $set: {
          admin_approve: status,
        },
      };
      await User.updateOne({ _id : Types.ObjectId(UserId) }, updateDoc);
       
      return res.status(200)
        .json({ status: true, data: { message: "Enabled/ disabled successfully " } });
    } catch (e) {
      console.log(e);
      return res.json({
        error: true,
        status: 500,
        message: "An error occured.",
      });
    }

    
  }
  static async professionals(req: Request, res: Response) {
    const { name, email } = req.body;

    const errors = StarkFlowController.validate({ name, email });
    if (errors) {
      return res
        .status(422)
        .json({ error: true, message: "Validation failed.", data: errors });
    }

    req.body["type"] = "professionals";
    return StarkFlowController.insertData(req.body, res);
  }

  static validate(data) {
    const errors = [];

    _.forEach(data, (value, title) => {
      if (!value) {
        errors.push(`${_.upperFirst(title)} is required.`);
      }
    });

    return errors.length > 0 ? errors : false;
  }

  static async insertData(data, res) {
    try {
      const sf = await StarkFlow.create(data);
      const mailer = new StarkflowMailer(process.env.STARKFLOW_EMAILS);
      mailer.sendMessage(sf);
      return res.status(200).json({ error: false, message: "Message sent." });
    } catch (e) {
      return res.status(500).json({ error: true, message: "Error occured." });
    }
  }
}
