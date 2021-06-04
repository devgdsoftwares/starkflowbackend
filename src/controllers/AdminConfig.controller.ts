import e, { Request, Response } from 'express';
import AdminConfig from '../models/adminConfig.model';
import * as request from "request-promise-native";

export default class AdminConfigController {
    static async postAdminConfig(req: Request, res: Response) {
        const { query, body } = req;
        const data = await AdminConfig.create(body)
        return res.json({ error: false, message: 'Configuration Added Successfully', data: data })
    }

    static async getAdminConfig(req: Request, res: Response) {
        const { query } = req;
        const data = await AdminConfig.find({})
        return res.json({ error: false, data: data[0] })
    }

    static async updateAdminConfig(req: Request, res: Response) {
        const data = await AdminConfig.findByIdAndUpdate(req.body._id, req.body);
        return res.json({ error: false, message: 'Configuration Updated Successfully',data:data })
    }

    static async convertJobSalary(req: Request, res: Response) {
        const { body } = req;
        const data = await AdminConfig.find({})

        
        const baseUrl = 'http://apilayer.net/api/live?access_key=258c5cbf147e728619a0e129997a524f&currencies='+body.salary.currency+'&source=USD&format=1';
          var options = {
            uri: baseUrl,
          };
          let result = await request.get(options), currency2, range_sal;
          result = JSON.parse(result);

          if (body.range) {
            const baseUrl2 = 'http://apilayer.net/api/live?access_key=258c5cbf147e728619a0e129997a524f&currencies='+body.range.currency+'&source='+body.currency+'&format=1';
            var options = {
                uri: baseUrl2,
            };
            let result2 = await request.get(options);
            result2 = JSON.parse(result2);
            currency2 = result['quotes'][body.currency+body.range.currency];
            let range = body.range;
            range_sal = {min: parseInt(range.min * currency2), max: parseInt(range.max * currency2)}
          }
          console.log('range in USD', data[0].minJobsSalary, currency);
          
          let currency = result['quotes'][body.currency+body.range.currency];
          let salary = {minSalary: parseInt(data[0].minJobsSalary * currency), maxSalary: parseInt(data[0].maxJobsSalary * currency)}
        return res.json({ error: false, message: 'Salary Converted Successfully', data: salary, range: range_sal })
    }
}