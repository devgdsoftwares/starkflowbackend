import { Application } from 'express';

import CompanyController from '../controllers/CompanyController';
import AuthService from '../services/AuthService';

export default class CompanyRoutes {

  static init(app: Application) {
        /**
         * @api {get} /companies Get Companies
         * @apiName GetCompanies
         * @apiGroup Company
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *         "error": false,
         *         "data": {
         *             "companies": [
         *                 {
         *                     "adminApproved": false,
         *                     "tier": 3,
         *                     "perks": [],
         *                     "facts": [],
         *                     "InterviewProcess": [],
         *                     "_id": "603e2784fd4b5f79759616de",
         *                     "title": "anviCompany",
         *                     "createdAt": "2021-03-02T11:54:44.368Z",
         *                     "updatedAt": "2021-03-02T11:54:44.368Z",
         *                     "__v": 0
         *                 }
         *               ]
         *             }
         *       }
         * 
         */
    app.get(
      '/companies',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.index
    );

        /**
         * @api {post} /companies Create Company
         * @apiName CreateCompany
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         *   {
         *     "title": "anvita dubey",
         *     "description": "",
         *     "email": "dd@c.com",
         *     "logo": "http://localhost:3201/images_1613511001579_blob",
         *     "website": "ss.com",
         *     "contact": "7788665544",
         *     "InterviewProcess": [
         *       "Technical Round",
         *       "HR Round"
         *     ],
         *     "perks": [
         *       "Team Bonding Events",
         *       "Technology and Community Discounts",
         *       "Fitness Classes",
         *       "Community Education"
         *     ],
         *     "facts": [
         *       "Top company",
         *       "Long-term projects",
         *       "Amazing peer network",
         *       "Compensation as per Industry Standards"
         *     ]
         *   }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "error": false,
         *       "message": "Company added successfully."
         *     }
         * 
         */
    app.post(
      '/companies',
      AuthService.isAuthenticated(),
      // AuthService.hasRole(['hr', 'admin','candidate']),
      CompanyController.create
    );

        /**
         * @api {get} /companies/:id Get Company Details
         * @apiName GetCompanyDetails
         * @apiGroup Company
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *   {
         *   "error": false,
         *   "data": {
         *     "adminApproved": false,
         *     "tier": 3,
         *     "perks": [
         *       "Team Bonding Events",
         *       "Technology and Community Discounts",
         *       "Fitness Classes",
         *       "Community Education"
         *     ],
         *     "facts": [
         *       "Top company",
         *       "Long-term projects",
         *       "Amazing peer network",
         *       "Compensation as per Industry Standards"
         *     ],
         *     "InterviewProcess": [
         *       "Technical Round",
         *       "HR Round"
         *     ],
         *     "_id": "5fab98e60faae22890443e84",
         *     "title": "anvita dubey",
         *     "createdAt": "2020-11-11T07:55:18.917Z",
         *     "updatedAt": "2021-03-02T18:04:36.646Z",
         *     "__v": 0,
         *     "addedBy": "5fab9676e4daa828f832f502",
         *     "contact": "7788665544",
         *     "description": "",
         *     "email": "dd@c.com",
         *     "logo": "http://localhost:3201/images_1613511001579_blob",
         *     "website": "ss.com"
         *   }
         * }
         * 
         */
    app.get(
      '/companies/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.show
    );

            /**
         * @api {post} /companies/checkName/:id? Check Company Title
         * @apiName CheckCompanyTitle
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         *   {
         *       "title": "anvita dubey"
         *   }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "error": false,
         *       "message": "Company name can be used."
         *     }
         * 
         */
    app.post(
      '/companies/checkName/:id?',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.checkCompanyName
    );

        /**
         * @api {put} /companies/:id Update Company Details
         * @apiName UpdateCompanyDetails
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         *   {
         *     "title": "anvita dubey",
         *     "description": "",
         *     "email": "dd@c.com",
         *     "logo": "http://localhost:3201/images_1613511001579_blob",
         *     "website": "ss.com",
         *     "contact": "7788665544",
         *     "InterviewProcess": [
         *       "Technical Round",
         *       "HR Round"
         *     ],
         *     "perks": [
         *       "Team Bonding Events",
         *       "Technology and Community Discounts",
         *       "Fitness Classes",
         *       "Community Education"
         *     ],
         *     "facts": [
         *       "Top company",
         *       "Long-term projects",
         *       "Amazing peer network",
         *       "Compensation as per Industry Standards"
         *     ]
         *   }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "error": false,
         *       "message": "Company updated successfully."
         *     }
         * 
         */
    app.put(
      '/companies/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.update
    );

    app.get(
      '/getcompanies/:adminid',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.getCompaniesByHrId
    );

        /**
         * @api {get} /company/list?q=test Get Company List
         * @apiName GetCompanyList
         * @apiGroup Company
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {
         *   "error": false,
         *   "data": [
         *       {
         *           "adminApproved": false,
         *           "tier": 3,
         *           "perks": [],
         *           "facts": [],
         *           "InterviewProcess": [],
         *           "_id": "5fbc010d4590b97d1a19c22e",
         *           "title": "test invite",
         *           "createdAt": "2020-11-23T18:35:57.662Z",
         *           "updatedAt": "2020-11-23T18:35:57.662Z",
         *           "__v": 0
         *       },
         *     ]
         * }
         * 
         */
    app.get(
      '/company/list',
      // AuthService.isAuthenticated(),
      CompanyController.list
    );

    app.get(
      '/company/adminList',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin']),
      CompanyController.adminAllList
    );

        /**
         * @api {post} /company/admin/list Admin Get Company List
         * @apiName AdminGetCompanyList
         * @apiGroup Company
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *   {
         *     "page": 1,
         *     "per_page": 30,
         *     "pre_page": null,
         *     "next_page": 2,
         *     "total": 1608,
         *     "total_pages": 53,
         *     "total_companies": 1608,
         *     "data": [
         *         {
         *             "adminApproved": false,
         *             "tier": 3,
         *             "perks": [
         *                 "Team Bonding Events",
         *                 "Technology and Community Discounts",
         *                 "Fitness Classes",
         *                 "Community Education"
         *             ],
         *             "facts": [
         *                 "Top company",
         *                 "Long-term projects",
         *                 "Amazing peer network",
         *                 "Compensation as per Industry Standards"
         *             ],
         *             "InterviewProcess": [
         *                 "Technical Round",
         *                 "HR Round"
         *             ],
         *             "_id": "5fab98e60faae22890443e84",
         *             "title": "anvita dubey",
         *             "createdAt": "2020-11-11T07:55:18.917Z",
         *             "updatedAt": "2021-03-02T18:17:59.784Z",
         *             "__v": 0,
         *             "addedBy": "5fab9676e4daa828f832f502",
         *             "contact": "7788665544",
         *             "description": "",
         *             "email": "dd@c.com",
         *             "logo": "http://localhost:3201/images_1613511001579_blob",
         *             "website": "ss.com"
         *         }
         *       ]
         *     }
         * 
         */
    app.post(
      '/company/admin/list',
      // AuthService.isAuthenticated(),
      CompanyController.adminList
    );

        /**
         * @api {post} /company/admin/list/update Update Company Details Admin
         * @apiName UpdateCompanyDetailsAdmin
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         *   {"adminApproved":false,"tier":3,"perks":["Team Bonding Events","Technology and Community Discounts","Fitness Classes","Community Education"],"facts":["Top company","Long-term projects","Amazing peer network","Compensation as per Industry Standards"],"InterviewProcess":["Technical Round","HR Round"],"_id":"5fab98e60faae22890443e84","title":"anvita dubey","createdAt":"2020-11-11T07:55:18.917Z","updatedAt":"2021-03-02T18:17:59.784Z","__v":0,"addedBy":"5fab9676e4daa828f832f502","contact":"7788665544","description":"","email":"dd@c.com","logo":"http://localhost:3201/images_1613511001579_blob","website":"ss.com"}
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "error": false,
         *       "message": "Company updated successfully."
         *     }
         * 
         */
    app.post(
      '/company/admin/list/update',
      // AuthService.isAuthenticated(),
      CompanyController.updateCompanyAdmin
    );

        /**
         * @api {post} /company/admin/applyToProfiles Apply Tier Updation to Profiles
         * @apiName ApplyTierUpdationtoProfiles
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         * [
         *     {
         *       "_id": "5fab98e60faae22890443e84",
         *       "title": "anvita dubey",
         *       "tier": "2",
         *       "adminApproved": false
         *     }
         *   ]
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {
         *     "error": false,
         *     "message": "Profiles updated successfully"
         *   }
         * 
         */
    app.post(
      '/company/admin/applyToProfiles',
      // AuthService.isAuthenticated(),
      CompanyController.applyToProfiles
    );

        /**
         * @api {post} /company/admin_approve Company Admin Approval
         * @apiName CompanyAdminApproval
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         * {
         *   "companyId": "5fab98e60faae22890443e84",
         *   "status": true
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *   {
         *     "error": false,
         *     "message": "Status updated successfully"
         *   }
         * 
         */
    app.post('/company/admin_approve' , CompanyController.companyAdminApprove);

        /**
         * @api {post} /admin/tierCategorization Company Tier Categorization
         * @apiName CompanyTierCategorization
         * @apiGroup Company
         * @apiParamExample {json} Request-Example:
         * {
         *     "tier": 1,
         *     "PaginationQueryParams": {
         *       "per_page": 50,
         *       "page": 1,
         *       "total_pages": 1
         *     }
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {
         *     "page": 1,
         *     "per_page": 50,
         *     "pre_page": null,
         *     "next_page": 2,
         *     "total": 50,
         *     "total_companies": 603,
         *     "total_pages": 12.06,
         *     "tier": [
         *       {
         *         "adminApproved": true,
         *         "tier": 1,
         *         "perks": [],
         *         "facts": [],
         *         "InterviewProcess": [],
         *         "_id": "5f8d507ef9a53a4b60fdfa77",
         *         "title": "3i Infotech",
         *         "createdAt": "2020-10-19T08:38:23.050Z",
         *         "updatedAt": "2020-10-19T08:38:23.050Z",
         *         "__v": 0
         *       }
         *     ]
         *   }
         * 
         */
    app.post('/admin/tierCategorization',
      AuthService.isAuthenticated(), 
      AuthService.isAdmin,
      CompanyController.getTierCategorization
    );
	}
}