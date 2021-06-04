import { Application } from 'express';

import JobController from '../controllers/JobController';
import AuthService from '../services/AuthService';
import Job from '../models/Job';
import { JobEvents } from '../events/JobEvents';
import User from '../models/User';
import { UserEvents } from '../events/UserEvents';

export default class JobRoutes {

  static init(app: Application) {
    /**
     * @api {get} /jobs Job List
     * @apiName GetJobs
     * @apiGroup Job
     *
     * @apiParam {Number} per_page=20 Jobs to show per page.
     * @apiParam {Number} page=1 Page number.
     * @apiParam {String="asc", "desc"} sort_as="desc" Sort the jobs as.
     * @apiParam {String="createdAt", "updateAt", "title"} sort_by="createdAt" Sort job by.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Paginate and Jobs object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *          "jobs": [
     *           {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *                "pictureUrl": "http://placehold.it/400x400"
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *            },
     *          ],
     *          "paginate": {
     *            "total_item": 25,
     *            "showing": 20,
     *            "first_page": 1,
     *            "previous_page": 1,
     *            "current_page": 1,
     *            "next_page": 2,
     *            "last_page": 2
     *          }
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get(
      '/jobs',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.index
    );

    /**
     * @api {post} /jobs Create a Job
     * @apiName CreateJob
     * @apiGroup Job
     *
     * @apiParamExample {json} Request-Example:
     *    {
     *      "skills": [
     *        {
     *          "_id": "5adf1ab90f17bdb02064b4b1",
     *          "title": "MongoDB"
     *        }
     *      ],
     *      "title": "Fullstack Developer - Second latest",
     *      "description": "Some random description for the job"
     *    }
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample ValidationFailed:
     *    HTTP/1.1 200 ValidationFailed
     *    {
     *      "error": true,
     *      "message": "Validation failed",
     *      "data": {
     *        "title": "Job title is required",
     *        "description": "Job description is required",
     *        "skills": "Job skills are required"
     *      }
     *    }
     *
     * @apiSuccessExample Job Created Successfully:
     *     HTTP/1.1 201 OK
     *     {
     *        "error":false,
     *        "message": "Job posted successfully.",
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *                "pictureUrl": "http://placehold.it/400x400"
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.post(
      '/jobs',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.create
    );

    /**
     * @api {get} /jobs/:id Get a Job
     * @apiName GetJob
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *                "pictureUrl": "http://placehold.it/400x400"
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError NotFoundError Job not found.
     * @apiErrorExample NotFoundError:
     *     HTTP/1.1 404 NotFoundError
     *     "Job not found."
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get(
      '/jobs/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.show
    );

    /**
     * @api {get} /jobs/:id/show Get a Job (Public)
     * @apiName GetJobPublic
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError NotFoundError Job not found.
     * @apiErrorExample NotFoundError:
     *     HTTP/1.1 404 NotFoundError
     *     "Job not found."
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get(
      '/jobs/:id/show',
      JobController.public
    );

    /**
     * @api {post} /jobs/:id Update a Job
     * @apiName UpdateJob
     * @apiGroup Job
     *
     * @apiParamExample {json} Request-Example:
     *    {
     *      "skills": [
     *        {
     *          "_id": "5adf1ab90f17bdb02064b4b1",
     *          "title": "MongoDB"
     *        }
     *      ],
     *      "title": "Fullstack Developer - Second latest",
     *      "description": "Some random description for the job"
     *    }
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample ValidationFailed:
     *    HTTP/1.1 200 ValidationFailed
     *    {
     *      "error": true,
     *      "message": "Validation failed",
     *      "data": {
     *        "title": "Job title is required",
     *        "description": "Job description is required",
     *        "skills": "Job skills are required"
     *      }
     *    }
     *
     * @apiSuccessExample Job Created Successfully:
     *     HTTP/1.1 201 OK
     *     {
     *        "error":false,
     *        "message": "Job updated successfully.",
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError NotFoundError Job not found.
     * @apiErrorExample NotFoundError:
     *     HTTP/1.1 404 NotFoundError
     *     "Job not found."
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.put(
      '/jobs/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.update
    );

    /**
     * @api {put} /jobs/:id Archive a Job
     * @apiName ArchiveJob
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "message": "Job archived successfully."
     *     }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.put(
      '/jobs/:id/archive',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.archive
    );

    /**
     * @api {delete} /jobs/:id Delete a Job
     * @apiName DeleteJob
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "message": "Job deleted successfully."
     *     }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.delete(
      '/jobs/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.destroy
    );

        /**
         * @api {post} /public/jobs Get public jobs
         * @apiName GetLoginToken
         * @apiGroup Job
         * @apiParamExample {json} Request-Example:
         * {
         *   "role": [],
         *   "type": [
         *     "Contract",
         *     "Permanent"
         *  ],
         *   "skills": [],
         *   "page": 1,
         *   "experience": null,
         *   "salary_range": null,
         *   "company": [],
         *   "working_at": [],
         *   "timezone": []
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {
         *   "error": false,
         *   "data": {
         *     "jobs": [
         *       {
         *         "_id": "5ffee9d372afd53a9044c0a0",
         *         "timezone": [
         *           "CTT",
         *           "EET",
         *           "CET"
         *         ],
         *         "skills": [
         *           {
         *             "parent": "Tools",
         *             "data": [
         *               {
         *                 "title": "Adobe Premier Pro",
         *                 "_id": "5adf1ab90f17bdb02064b33d"
         *               },
         *               {
         *                 "title": "Adobe Story Plus",
         *                 "_id": "5adf1ab90f17bdb02064b343"
         *               }
         *             ]
         *           }
         *         ],
         *         "modules": [],
         *         "domains": [
         *           "Edtech",
         *           "Legaltech"
         *         ],
         *         "archived": false,
         *         "companyId": "5fab98e60faae22890443e84",
         *         "description": "<p>this is a job desc</p>",
         *         "experience_required": {
         *           "id": 3,
         *           "title": "3 Years",
         *           "value": 3
         *         },
         *         "title": "Back-End Developer",
         *         "availability": "Immediately",
         *         "experience_role": "",
         *         "looking_for": [
         *           "Permanent",
         *           "Contract"
         *         ],
         *         "fluency": "Good",
         *         "salary": {
         *           "start": null,
         *           "end": 7300,
         *           "currency": "GBP",
         *           "duration": "Year"
         *         },
         *         "user": "5fab9676e4daa828f832f502",
         *         "company": {
         *           "_id": "5fab98e60faae22890443e84",
         *           "perks": [
         *             "Team Bonding Events",
         *             "Technology and Community Discounts",
         *             "Fitness Classes",
         *             "Community Education"
         *           ],
         *           "facts": [
         *             "Top company",
         *             "Long-term projects",
         *             "Amazing peer network",
         *             "Compensation as per Industry Standards"
         *           ],
         *           "InterviewProcess": [
         *             "Technical Round",
         *             "HR Round"
         *           ],
         *           "title": "anvita dubey",
         *           "adminApproved": true,
         *           "tier": 2,
         *           "createdAt": "2020-11-11T07:55:18.917Z",
         *           "updatedAt": "2021-03-02T19:06:43.101Z",
         *           "__v": 0,
         *           "addedBy": "5fab9676e4daa828f832f502",
         *           "contact": "7788665544",
         *           "description": "",
         *           "email": "dd@c.com",
         *           "logo": "http://localhost:3201/images_1613511001579_blob",
         *           "website": "ss.com"
         *         },
         *         "expiry_date": "2021-03-03T10:06:37.639Z",
         *         "notice_period": 1,
         *         "start_salary": 0,
         *         "end_salary": 10023.74,
         *       "education": [],
         *         "createdAt": "2021-01-13T12:38:43.523Z",
         *         "updatedAt": "2021-02-16T21:34:45.423Z",
         *         "__v": 0,
         *         "locations": "Tivim, Goa, India"
         *       },
         *     ],
         *     "paginate": {
         *       "total_item": 5,
         *       "showing": 5,
         *       "first_page": 1,
         *       "previous_page": 1,
         *       "current_page": 1,
         *       "next_page": 2,
         *       "last_page": 1
         *     }
         *   },
         *   "values": {
         *     "minSalary": 5000,
         *     "maxSalary": 50000,
         *     "minExperience": 0,
         *     "maxExperience": 25
         *   }
         * }
         * 
         */
    app.post(
      '/public/jobs',
      JobController.getJobs
    );
    app.get(
      '/jobs/check',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.checkJobAddition
    );

        /**
         * @api {get} /get-job-bill GetJobBill
         * @apiName GetJobBill
         * @apiGroup Job
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {"error":false,"data":"7395.72"}
         * 
         */
    app.get(
      '/get-job-bill',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.getJobsTeamBill
    )

        /**
         * @api {get} /team Get Team List
         * @apiName GetTeamList
         * @apiGroup Job
         * @apiHeader {String} Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiOTY3NmU0ZGFhODI4ZjgzMmY1MDIiL.
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {"error":false,"data":"7395.72"}
         * 
         */
    // to get whole team hired by client
    app.get(
      '/team',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.getTeam
    )

  }
}