import { Request, Response } from 'express';

import AppData from '../models/AppData';
import HrRoles from '../models/hrRoles.model';
import School from '../models/School';
import FieldOfStudy from '../models/FieldOfStudy';
import Bundle from '../models/Bundle';
import SubModule from '../models/SubModule';
import Platform from '../models/Platform';
import Category from '../models/Category';
import Job from '../models/Job';
import User from '../models/User';
import AdminDataService from "../services/admindataService";
import * as _ from "lodash";


export default class AppDataController {

  static async skills(req: Request, res: Response) {
    req.query.type = 'skills';
    return AppDataController.findData(req, res);
  }

  static async designations(req: Request, res: Response) {
    req.query.type = 'designations';
    return AppDataController.findData(req, res);
  }

  static async domains(req: Request, res: Response) {
    req.query.type = 'domains';
    return AppDataController.findData(req, res);
  }

  static async features(req: Request, res: Response) {
    req.query.type = 'features';
    return AppDataController.findData(req, res);
  }

  private static async findData(req: Request, res: Response) {
    let { q, type, category } = req.query;

    const project = { _id: 1, title: 1 };
    if (type === 'skills') {
      project['parent'] = 1;
    }

    if (req.query.pagelimit) {
      const pageLimit = parseInt(req.query.pagelimit)
    }

    const finder = { type };
    if (category) {
      finder['parent'] = category
    }
    // Searching
    if (q) {
      finder['title'] = { $regex: `${q}`, $options: 'i' }
    }


    console.log('finder', finder)
    try {
      const data = await AppData.find(finder, project).sort({ title: 1 }).limit((pageLimit));
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured' });
    }
  }

  static async initalDataSF(req: Request, res: Response) {
    try {
      const platforms = await Platform.find({}, { title: 1, description: 1, icon: 1 });
      const categories = await Category.find({}, { title: 1, description: 1, icon: 1 });
      return res.json({ error: false, data: { categories, platforms } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async bundles(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) {
      return res.json({ error: true, message: 'Search param is required.' });
    }

    try {
      const lookups = ['categories', 'platforms', 'sub_modules'];

      const aggreate: any = [
        { $match: { title: new RegExp(q, 'ig') } }
      ];

      lookups.forEach(item => {
        aggreate.push({ $unwind: { path: `$${item}`, preserveNullAndEmptyArrays: true } });
        aggreate.push({
          $lookup: {
            "from": item,
            "as": item,
            "localField": item,
            "foreignField": "_id"
          }
        });
        aggreate.push({ $unwind: { path: `$${item}`, preserveNullAndEmptyArrays: true } });
      });

      aggreate.push({
        "$lookup": {
          "from": "modules",
          "as": "sub_modules.module",
          "localField": "sub_modules.module_id",
          "foreignField": "_id"
        }
      });
      aggreate.push({
        "$unwind": {
          "path": "$sub_modules.module",
          "preserveNullAndEmptyArrays": true
        }
      });

      aggreate.push({
        $group: {
          _id: { _id: "$_id", title: "$title", description: "$description" },
          categories: { $addToSet: "$categories" },
          platforms: { $addToSet: "$platforms" },
          sub_modules: { $addToSet: "$sub_modules" },
        }
      });

      aggreate.push({
        $project: {
          _id: "$_id._id", title: "$_id.title", description: "$_id.description",
          platforms: {
            _id: 1,
            title: 1,
            description: 1,
            icon: 1,
          }, categories: {
            _id: 1,
            title: 1,
            description: 1
          }, sub_modules: {
            _id: 1,
            title: 1,
            description: 1,
            module: { _id: 1, title: 1 }
          }
        }
      });

      const data = await Bundle.aggregate(aggreate);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async modules(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) {
      return res.json({ error: true, message: 'Search param is required.' });
    }

    try {
      console.log('query', q);

      const aggreate = [
        { $match: { title: new RegExp(q, 'ig') } },
        {
          $lookup: {
            "from": "modules",
            "as": "module",
            "localField": "module_id",
            "foreignField": "_id"
          }
        },
        { $unwind: { path: "$module", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1, title: 1, description: 1, module: 1
          }
        }
      ];

      const data = await SubModule.aggregate(aggreate);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async categories(req: Request, res: Response) {
    const { q } = req.query;
    const aggreate = [
      { $match: { title: new RegExp(q, 'ig') } },
      {
        $lookup: {
          from: "bundles",
          localField: "_id",
          foreignField: "categories",
          as: "apps"
        }

      }, {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          apps: {
            _id: 1,
            title: 1
          }
        }
      }
    ]
    try {
      const data = await Category.aggregate(aggreate);
      return res.json({ error: false, data: data });
    } catch (e) {
      return res.json({ error: true, message: 'An error occured' });
    }

  }


  static async AddSkills(req: Request, res: Response) {
    const { title, parent } = req.body;
    if (!title || !parent) {
      return res.json({ error: true, message: 'Title and Parent are required field' });
    }
    try {
      const exist = await AppData.find({ title: title });
      if (exist.length > 0) {
        return res.json({ error: true, message: 'Already Exist' });
      }
      await AppData.create({ title: title, parent: parent, type: 'skills' });
      return res.json({ error: false, status: 200, message: 'Sucessfully Added' });
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }
  static async getSkillsParent(req: Request, res: Response) {
    try {
      const data = await AppData.distinct('parent');
      return res.json({ error: false, status: 200, data: data });
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }
  static async getCustomSkills(req: Request, res: Response) {
    const { query: body } = req;
    let page = parseInt(body.page)
    let limit = parseInt(body.limit)
    let regex = new RegExp(body.q, 'i');

    try {
      const JobSkills = await Job.find({ $and: [{ 'skills.data.title': regex }, { 'skills': { $elemMatch: { 'parent': 'Misc' } } }] }, { 'skills.data.$': 1 })
      const candidateSkills = await User.find({ $and: [{ 'skills.data.title': regex }, { 'skills': { $elemMatch: { 'parent': 'Misc' } } }] }, { 'skills.data.$': 1 })
      let array = AdminDataService.processdata(JobSkills, candidateSkills);

      let sortedArray = _.orderBy(array, ['title'], [body.sortOrder]);
      let finalData = sortedArray.slice(limit * (page - 1), limit * (page))
      let pagination = { currentPage: page, total: array.length, limit: limit }

      //  console.log(array)
      return res.json({ error: false, status: 200, data: finalData, paginationData: pagination });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async getSkillsAdmin(req: Request, res: Response) {
    const { body } = req;
    console.log('body...', body);

    const data = await AppData.find({ title: { $regex: (body.q || ''), $options: "i" }, type: "skills" }).sort('title').skip(Number(body.page - 1) * Number(body.per_page))
      .limit(Number(body.per_page))
    var page = body.page || 1,
      per_page = body.per_page || 30;
    const total_skills = await AppData.count({ title: { $regex: (body.q || ''), $options: "i" }, type: "skills" });
    const total_pages = parseInt(total_skills / per_page);
    return res.json({
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: data.length,
      total_pages: total_pages,
      total_skills: total_skills,
      data: data
    });

  }



  static async getSassDomains(req: Request, res: Response) {
    const { query: body } = req;
    // let page = parseInt(body.page)
    // let limit = parseInt(body.limit)
    let regex = new RegExp(body.q, 'i');
    const data = await AppData.find({ title: { $regex: regex }, type: "domains", sass: true }).limit(11);
    return res.json({ error: false, status: 200, data });
  }

  static initalDataCandidates(req: Request, res: Response) {
    const data = {
      hr_roles: [
        { id: 1, title: 'Account Manager' },
        { id: 2, title: 'Back-End Developer' },
        { id: 3, title: 'Content Marketing Manager' },
        { id: 4, title: "Data Analyst" },
        { id: 5, title: 'Data Engineer' },
        { id: 6, title: "Data Scientist" },
        { id: 7, title: "Database Administrator" },
        { id: 8, title: 'DevOps' },
        { id: 9, title: 'Digital Marketing Manager' },
        { id: 10, title: 'Full Stack Developer' },
        { id: 11, title: 'Front-End Developer' },
        { id: 12, title: "Gaming Engineer" },
        { id: 13, title: 'Growth Marketing Manager' },
        { id: 14, title: "Hardware Engineer" },
        { id: 15, title: "Machine Learning Engineer" },
        { id: 16, title: 'Marketing Manager' },
        { id: 17, title: 'Marketing Specialist' },
        { id: 18, title: "Mobile Engineer" },
        { id: 19, title: 'Performance Marketing Manager' },
        { id: 20, title: 'Product Manager' },
        { id: 21, title: 'Product Marketing Manager' },
        { id: 22, title: "QA Test Automation Engineer" },
        { id: 23, title: 'Sales Executive' },
        { id: 24, title: "Salesforce Developer" },
        { id: 25, title: "Salesforce Lightning Developer position" },
        { id: 26, title: "Search Engineer" },
        { id: 27, title: "Security Engineer" },
        { id: 28, title: 'Shopify Developer' },
        { id: 29, title: "Solutions Architect" },
        { id: 30, title: "Solutions Engineer" },
        { id: 31, title: "Software Engineer" },
        { id: 32, title: 'Sr. Clinical Data Manager' },
        { id: 33, title: 'Statistical Programmer' },
        { id: 34, title: 'Strategic Account Manager' }
      ],

      experience_role: [
        { id: 1, title: 'Intern' },
        { id: 2, title: 'Fresher' },
        { id: 3, title: 'Junior' },
        { id: 4, title: 'Mid Level' },
        { id: 5, title: 'Senior' },
        { id: 6, title: 'Lead' },
      ],
      looking_for: [
        { id: 1, title: 'Contract' },
        // {id: 2, title: 'Both'},
        { id: 3, title: 'Permanent' },
      ],
      availability: [
        { id: 1, title: 'Immediately' },
        { id: 2, title: 'In 1 week' },
        { id: 3, title: 'In 2 weeks' },
        { id: 4, title: 'In 1 month' },
      ],
      currency: [
        { id: 1, title: 'USD', icon: '$', salary_ranges: [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000] },
        { id: 2, title: 'EUR', icon: '€', salary_ranges: [4055, 8000, 12000, 16000, 20000, 24000, 28000, 32000, 36000, 40000, 50000] },
        { id: 3, title: 'INR', icon: '₹', salary_ranges: [360000, 730000, 1000000, 1400000, 1800000, 2100000, 2500000, 2900000, 3200000, 4000000, 5000000] },
        { id: 4, title: 'GBP', icon: '£', salary_ranges: [3600, 7300, 11000, 14000, 18000, 22000, 26000, 30000, 33000, 37000, 40000] },
        { id: 5, title: 'RUB', icon: '₽', salary_ranges: [360000, 730000, 1000000, 1400000, 1800000, 2100000, 2500000, 2900000, 3200000, 4000000, 5000000] },
      ],
      duration: [
        { id: 1, title: 'Hour' },
        { id: 2, title: 'Week' },
        { id: 3, title: 'Month' },
        { id: 4, title: 'Year' }
      ],
      project_duration: [
        { id: 1, title: 'Week' },
        { id: 2, title: 'Month' },
        { id: 3, title: 'Year' }
      ],
      salary: {
        curreny: [
          { id: 1, title: 'USD' },
          { id: 2, title: 'EUR' },
          { id: 3, title: 'GBP' },
          { id: 4, title: 'INR' },
          { id: 5, title: 'RUB' },
        ],
        duration: [
          { id: 1, title: 'Hour' },
          { id: 2, title: 'Week' },
          { id: 3, title: 'Month' },
          { id: 4, title: 'Year' }
        ]
      },
      experience: {
        duration: [
          { id: 1, title: 'Month' },
          { id: 2, title: 'Year' }
        ]
      },
      experience_job: [
        // { id: 1, title: '0-2 Years', min: 0, max: 2 },
        // { id: 2, title: '2-4 Years', min: 2, max: 4 },
        // { id: 4, title: '4-6 Years', min: 4, max: 6 },
        // { id: 5, title: '6-8 Years', min: 6, max: 8 },
        // { id: 6, title: '8+ Years', min: 8, max: null },

        { id: 1, title: '1 Year', value: 1 },
        { id: 2, title: '2 Years', value: 2 },
        { id: 3, title: '3 Years', value: 3 },
        { id: 4, title: '4 Years', value: 4 },
        { id: 5, title: '5 Years', value: 5 },
        { id: 6, title: '6 Year', value: 6 },
        { id: 7, title: '7 Years', value: 7 },
        { id: 8, title: '8 Years', value: 8 },
        { id: 9, title: '8+ Years', value: null }
      ],
      timezone: ['EST', 'IST', 'CET', 'WET', 'EEST', 'GMT', 'UTC',
        'ECT', 'EET', 'ART', 'MET', 'NET', 'BST', 'VST',
        'CTT', 'AET', 'NST', 'MIT', 'HST',
        'AST', 'PST', 'MNT', 'CST'
      ],
      fluency: ['Amateur', 'Intermediate', 'Good', 'Fluent']
    }
    return res.json({ error: false, data });
  }

  static async getJobProfiles(req: Request, res: Response) {
    let { q } = req.query;
    const project = { _id: 1, title: 1 };

    const finder = {};
    // Searching
    if (q) {
      finder['title'] = { $regex: `${q}`, $options: 'i' }
    }
    try {
      const data = await HrRoles.find(finder, project).sort({ title: 1 });
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async getFieldOfStudies(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const data = await FieldOfStudy.find({ id });
      return res.json({ error: false, status: 200, data });
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async getSchools(req: Request, res: Response) {
    const { q } = req.query;
    try {
      const data = await School.find({ name: { $regex: new RegExp(q), $options: 'i' } }).limit(10);
      return res.json({ error: false, status: 200, data });
    }
    catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }
}
