import { Application } from 'express';

import AppDataController from '../controllers/AppDataController';

export default class AuthRoutes {

  static init(app: Application) {
    /**
     * @api {get} /data/skills Skills
     * @apiName GetSkills
     * @apiGroup AppData
     *
     * @apiParam {String} q Search skill.
     * @apiParamExample {json} Request-Example:
     *            { "q": "Node" }
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of skills.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Node.JS",
     *            "parent":"Tools/Platforms/Apis"
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/skills', AppDataController.skills);

    /**
     * @api {get} /data/designations Get designations
     * @apiName GetDesignations
     * @apiGroup AppData
     *
     * @apiParam {String} q Designations.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of designations.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Backend Developer",
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/designations', AppDataController.designations);

    /**
     * @api {get} /data/domains Domains
     * @apiName GetDomains
     * @apiGroup AppData
     *
     * @apiParam {String} q Search domains.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of domains.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Market Research",
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/domains', AppDataController.domains);

    /**
     * @api {get} /data/features Features
     * @apiName GetFeatures
     * @apiGroup AppData
     *
     * @apiParam {String} q Search features.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of features.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *               "_id": "5bd06a579a1a8f29dcdfd389",
     *               "title": "Accounting"
     *           }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/features', AppDataController.domains);

    app.get('/data/bundles', AppDataController.bundles);
    app.get('/data/modules', AppDataController.modules);
    app.get('/data/categories', AppDataController.categories);
    app.get('/data/sf', AppDataController.initalDataSF);

     /**
     * @api {get} /data/candidates Candidate Wizard Data
     * @apiName GetCandidateWizardData
     * @apiGroup AppData
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Object data.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *          experience_role: [
     *             {id: 1, title: 'Intern'},
     *             {id: 2, title: 'Fresher'},
     *             {id: 3, title: 'Junior'},
     *             {id: 4, title: 'Mid Level'},
     *             {id: 5, title: 'Senior'},
     *             {id: 6, title: 'Lead'},
     *           ],
     *           looking_for: [
     *             {id: 1, title: 'Contract'},
     *             {id: 2, title: 'Permanent'},
     *             {id: 3, title: 'Both'},
     *           ],
     *           availability: [
     *             {id: 1, title: 'Immediately'},
     *             {id: 2, title: 'In 1 week'},
     *             {id: 3, title: 'In 2 weeks'},
     *             {id: 4, title: 'In 1 month'},
     *             {id: 5, title: 'More than a month'},
     *           ],
     *           salary: {
     *             curreny: [
     *               {id: 1, title: 'USD'},
     *               {id: 2, title: 'EUR'},
     *               {id: 3, title: 'GBP'},
     *               {id: 4, title: 'INR'},
     *               {id: 5, title: 'RUB'},
     *             ],
     *             duration: [
     *               {id: 1, title: 'Hour'},
     *               {id: 2, title: 'Week'},
     *               {id: 3, title: 'Month'},
     *               {id: 4, title: 'Year'}
     *             ]
     *           }
     *        }
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/candidates', AppDataController.initalDataCandidates);

     /**
     * @api {get} /job-profiles Job Profiles Data
     * @apiName GetJobProfilesData
     * @apiGroup AppData
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Object data.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *          {
     *             "_id": "5ff6e913131e889e7d8c2328",
     *             "title": "Account Manager"
     *           }
     *         }
     *    }
     */
    app.get('/job-profiles', AppDataController.getJobProfiles);

    /**
     * @api {post} /add/skills Add Skills
     * @apiName AddSkillsData
     * @apiGroup AppData
     *
     * @apiParamExample {json} Request-Example:
     *     {"title": "Angular2", "parent": "Frameworks"}
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Object data.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *           "error": false,
     *           "status": 200,
     *           "message": "Sucessfully Added"
     *       }
     */
    app.post('/add/skills' , AppDataController.AddSkills);

    /**
     * @api {get} /data/getparent Get Parent for skills selection
     * @apiName GetParentsData
     * @apiGroup AppData
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Object data.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *       "error": false,
     *       "status": 200,
     *       "data": [
     *           "Analytics",
     *           "Frameworks",
     *           "Languages",
     *           "Misc",
     *           "Project Management",
     *           "Software Design",
     *           "Software Development",
     *           "Storage",
     *           "Tools"
     *       ]
     *   }
     * 
     */
    app.get('/data/getparent', AppDataController.getSkillsParent);

    app.get('/data/customskills', AppDataController.getCustomSkills);

    /**
     * @api {post} /data/skills/admin Get skills for admin dashboard
     * @apiName GetSkillsData
     * @apiGroup AppData
     *
     * @apiParamExample {json} Request-Example:
     *     {"q": "Angular 9"}
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Object data.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *       {
     *       "page": 1,
     *       "per_page": 30,
     *       "pre_page": null,
     *       "next_page": null,
     *       "total": 1,
     *       "total_pages": 0,
     *       "total_skills": 1,
     *       "data": [
     *           {
     *               "_id": "5f2bf58338b26c1ef1574f21",
     *               "title": "Angular 9",
     *               "type": "skills",
     *               "parent": "Frameworks",
     *               "createdAt": "2020-08-06T12:20:19.993Z",
     *               "updatedAt": "2020-08-06T12:20:19.993Z",
     *               "__v": 0
     *           }
     *       ]
     *   }
     * 
     */
    app.post('/data/skills/admin', AppDataController.getSkillsAdmin);
    app.get('/data/field_of_studies', AppDataController.getFieldOfStudies);
    app.get('/data/schools', AppDataController.getSchools);

    /**
     * @api {get} /data/sass/domains Get sass skills
     * @apiName GetSassSkillsData
     * @apiGroup AppData
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Object data.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *     "error": false,
     *     "status": 200,
     *     "data": [
     *         {
     *             "_id": "5ff6e42fa0d95cf75f7cb549",
     *             "title": "HRtech",
     *             "type": "domains",
     *             "sass": true
     *         },
     * 
     */
    app.get('/data/sass/domains', AppDataController.getSassDomains);
  }

}