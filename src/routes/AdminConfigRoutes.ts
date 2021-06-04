import { Application } from 'express';
import AdminConfigController from '../controllers/AdminConfig.controller'
import AuthService from '../services/AuthService';

export default class AdminConfigRoutes {

    static init(app: Application) {
        
        app.post('/admin/config',
            AuthService.isAuthenticated(),
            AdminConfigController.postAdminConfig
        )

        /**
         * @api {put} /admin/config Update admin config
         * @apiName UpdateAdminConfig
         * @apiGroup AdminConfig
         * @apiParamExample {json} Request-Example:
         *            {"minExperience":0,"maxExperience":25,"minSalary":5000,"maxSalary":50000,"minJobsSalary":5000,"maxJobsSalary":50000,"_id":"5fa5238509bf47c7c18e910d"}
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *      {
         *           "error": false,
         *           "message": "Configuration Updated Successfully.",
         *           "data": {
         *               "_id": "5fa5238509bf47c7c18e910d",
         *               "minSalary": 5000,
         *               "maxSalary": 50000,
         *               "minExperience": 0,
         *               "maxExperience": 25,
         *               "updatedAt": "2021-03-01T14:16:44.136Z",
         *               "maxJobsSalary": 50000,
         *               "minJobsSalary": 5000
         *           }
         *       }
         * 
         */
        app.put('/admin/config',
            AuthService.isAuthenticated(),
            AdminConfigController.updateAdminConfig
        );

        /**
         * @api {get} /admin/config Get admin config details
         * @apiName GetAdminConfig
         * @apiGroup AdminConfig
         * @apiSuccess {String} error If expected error occured.
         * @apiSuccess {Object} data  Object data.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *      {
         *           "error": false,
         *           "message": "Configuration Updated Successfully",
         *           "data": {
         *               "_id": "5fa5238509bf47c7c18e910d",
         *               "minSalary": 5000,
         *               "maxSalary": 50000,
         *               "minExperience": 0,
         *               "maxExperience": 25,
         *               "updatedAt": "2021-03-01T14:16:44.136Z",
         *               "maxJobsSalary": 50000,
         *               "minJobsSalary": 5000
         *           }
         *       }
         * 
         */
        app.get('/admin/config',
            AdminConfigController.getAdminConfig
        );
        app.post('/admin/config/convertJobSalary',
            AuthService.isAuthenticated(),
            AdminConfigController.convertJobSalary
        )
    }
}