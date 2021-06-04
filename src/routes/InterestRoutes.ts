import { Application } from 'express';

import InterestController from '../controllers/InterestController';
import AuthService from '../services/AuthService';
import AuthController from '../controllers/AuthController';

export default class InterestRoutes {

  static init(app: Application) {

    app.post(
      '/interests',
      AuthService.isAuthenticated(),
      InterestController.checkJobApplyEligibility,
      InterestController.toggle
    );

    app.post(
      '/interests/can-apply',
      AuthService.isAuthenticated(),
      InterestController.canApply
    );

    app.post(
      '/interests/public_jobs',
      AuthService.login,
      InterestController.checkJobApplyEligibility,
      InterestController.toggle
    );
  }
}