import { Application } from 'express';

import AuthController from '../controllers/AuthController';

export default class AuthRoutes {

    static init(app: Application) {
        // Register/Login a user
        /**
         * @api {post} /sessions/create Get login token
         * @apiName GetLoginToken
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         *            {
         *               "id": "rlgDR4tOfI",
         *               "name": "Anvita Dubey",
         *               "firstName": "Anvita",
         *               "lastName": "Dubey",
         *               "avatar": "https://media-exp1.licdn.com/dms/image/C5603AQEv5iq8fqlvbQ/profile-displayphoto-shrink_100_100/0/1601409938566?e=1620259200&v=beta&t=p8imbiEVNl-UIxK7mZa_D_9bsUmneGI0bnvLy8jDZjM",
         *               "emailAddress": "anvitaaps23@gmail.com",
         *               "role": "hr",
         *               "provider": "linkedin",
         *               "job": "",
         *               "publicJob": true
         *             }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {"error":false,"message":"Welcome, Anvita Dubey","data":{"user":{"_id":"600c77aeb6dab0278cc29052","name":"Anvita Dubey",*"avatar":"http://localhost:3201/anvitaaps23@gmail.com_candidate_1611429806827","onboarding":false,"role":"hr",*"company":"6013e8b979a3d857fbd5dcbf","admin_approve":true,"email_approve":true,"user_company":{"adminApproved":false,"tier":3,*"perks":["Team Bonding Events","Technology and Community Discounts","Fitness Classes","Community Education"],"facts":["Top *company","Long-term projects","Amazing peer network","Compensation as per Industry Standards"],"InterviewProcess":["Technical *Round","HR Round"],"_id":"6013e8b979a3d857fbd5dcbf","title":"hanna ostapenko","description":"","email":"","logo":"",*"website":"abv.com","contact":"","addedBy":"600c77aeb6dab0278cc29052","createdAt":"2021-01-29T10:51:37.716Z",*"updatedAt":"2021-01-29T10:51:37.716Z","__v":0},"autoMatch":true,"email":"anvitaaps23@gmail.com"},*"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*eyJfaWQiOiI2MDBjNzdhZWI2ZGFiMDI3OGNjMjkwNTIiLCJuYW1lIjoiQW52aXRhIER1YmV5IiwiaWF0IjoxNjE0NjEyNjYyfQ.*--kXvtd7HWYTZlBhmo8KbF5OAbEA-6o_9AdNdVnO2r0"}}
         * 
         */
        app.post('/sessions/create', AuthController.login);
        // Logout a user
        app.post('/sessions/destroy', AuthController.logout);

        /**
         * @api {post} /sf/login Admin login
         * @apiName AdminLogin
         * @apiGroup AdminConfig
         * @apiParamExample {json} Request-Example:
         *            {"email":"support@sourceable.ai","password":"accessdenied"}
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *      {
         *        "error":false,
         *       "data":
         *        {
         *          "user":
            *        { "_id":"5efc33675c13a432342d9af5",
            *          "name":"sourceable-admin"},
            *          "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*       *eyJfaWQiOiI1ZWZjMzM2NzVjMTNhNDMyMzQyZDlhZjUiLCJuYW1lIjoic291cmNlYWJsZS1hZG1pbiIsImlhdCI6MTYxNDYxMzM3OH0.*-LZtU5fMj--PAvecYdGQyeLUOKCDXtlKtwDTSHFzKTI"
         *           }
         *        }
         *      }
         * 
         */
        app.post('/sf/login', AuthController.adminLogin);

        /**
         * @api {post} /client_sign_up Create Client
         * @apiName CreateClient
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         * { "name": "anvi", "email": "anvi@starkflow.co", "password": "anvi", "role": "hr", "company": { "title": "anvi123", "tier": 3 * } }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *         "error": false,
         *         "message": "User Created Successfully"
         *     }
         * 
         */
        app.post('/client_sign_up', AuthController.ClientSignUp);

        /**
         * @api {post} /candidate_sign_up Create Candidate
         * @apiName CreateCandidate
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         * {
         *     "email": "anvita@starkflow.co",
         *     "name": "Anvi", 
         *     "designation": "Back-End Developer",
         *     "role": "candidate"
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *         "error": false,
         *         "message": "User Created Successfully"
         *     }
         * 
         */
        app.post('/candidate_sign_up', AuthController.CandidateSignUp);

        /**
         * @api {post} /client_login Client Login
         * @apiName CandidateLogin
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         * {
         *     "email": "anvita@starkflow.co",
         *     "password": "Anvi", 
         *     "role": "hr"
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         * {
         *   "error": false,
         *   "message": "Welcome, Anvi",
         *   "data": {
         *     "user": {
         *       "_id": "603e2784fd4b5f79759616df",
         *       "name": "Anvi",
         *       "avatar": "",
         *       "onboarding": true,
         *       "role": "hr",
         *       "company": "603e2784fd4b5f79759616de",
         *       "admin_approve": true,
         *       "email_approve": true,
         *       "user_company": {
         *         "adminApproved": false,
         *         "tier": 3,
         *         "perks": [],
         *         "facts": [],
         *         "InterviewProcess": [],
         *         "_id": "603e2784fd4b5f79759616de",
         *         "title": "anviCompany",
         *         "createdAt": "2021-03-02T11:54:44.368Z",
         *         "updatedAt": "2021-03-02T11:54:44.368Z",
         *         "__v": 0
         *       },
         *       "autoMatch": true,
         *       "email": "anvi@starkflow.co"
         *     },
         *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
         *   }
         * }
         * 
         */
        app.post('/client_login', AuthController.ClientLogin);

        /**
         * @api {post} /forgot_password Client Forgot Password
         * @apiName ClientForgotPassword
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         * {
         *       "email": "anvi@starkflow.co",
         *       "role": "hr"
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *   {
         *       "error": false,
         *       "message": "Reset Password Link Sent Successfully",
         *       "data": {}
         *   }
         * 
         */
        app.post('/candidate_login', AuthController.CandidateLogin);

        /**
         * @api {post} /forgot_password Client Forgot Password
         * @apiName ClientForgotPassword
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         * {
         *       "email": "anvi@starkflow.co",
         *       "role": "hr"
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *   {
         *       "error": false,
         *       "message": "Reset Password Link Sent Successfully",
         *       "data": {}
         *   }
         * 
         */
        app.post('/forgot_password', AuthController.ForgotPassword);

        /**
         * @api {get} /reset_password/:token Get Client Reset Token
         * @apiName GetClientResetToken
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         * {
         *       "email": "anvi@starkflow.co",
         *       "role": "hr"
         * }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *   HTTP/1.1 200 OK
         *   {
         *     "error": false,
         *     "message": "Valid Token",
         *     "data": {}
         *   }
         * 
         */
        app.get('/reset_password/:token', AuthController.checkResetPasswordToken);

        /**
         * @api {post} /reset_password/:token Client Reset Password
         * @apiName ClientResetPassword
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         *   {
         *     "password": "anvita",
         *     "confirmpassword": "anvita"
         *   }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *   HTTP/1.1 200 OK
         *   {
         *     "error": false,
         *     "message": "Password Reset Successfully",
         *     "data": {}
         *   }
         * 
         */
        app.post('/reset_password/:token', AuthController.setPassword);

        /**
         * @api {post} /get_linkedin_acess_token Get LinkedIn Access Token
         * @apiName GetLinkedInAccessToken
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         *   {
         *     "code": *"AQQJvAuBeaUEyncEHJ7cnFDevaQdmqBxOjXiFmOKNQomQui_XlNuMYeS9u-SowAu2o0Ra2O-5IHSkc608RihHvbxX9khozFBYp",
         *     "role": "hr"
         *   }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *   HTTP/1.1 200 OK
         *     {
         *         "error": false,
         *         "status": 200,
         *         "data": {
         *           "id": "rlgDR4tOfI",
         *           "name": "Anvita Dubey",
         *           "firstName": "Anvita",
         *           "lastName": "Dubey",
         *           "avatar": "https://media-exp1.licdn.com/dms/image/C5603AQEv5iq8fqlvbQ/profile-displayphoto",
         *           "emailAddress": "anvitaaps23@gmail.com"
         *         }
         *       }
         * 
         */
        app.post('/get_linkedin_acess_token', AuthController.getLinkedInAccessToken);

        /**
         * @api {post} /google-signin Google Login
         * @apiName GoogleLogin
         * @apiGroup Authentication
         * @apiParamExample {json} Request-Example:
         *   {
         *     "name": "Anvita Dubey",
         *     "email": "anvita@starkflow.co",
         *     "password": "123",
         *     "role": "hr"
         *   }
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *   HTTP/1.1 200 OK
         *     {
         *       "error": false,
         *       "message": "User Created Successfully",
         *       "data": {
         *         "googleSignUp": true
         *       }
         *     }
         * 
         */
        app.post('/google-signin', AuthController.clientGoogleSignIn);


        app.get('/verify_account/:url/:id', AuthController.VerifyAccount);
    }
}