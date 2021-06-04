import { Application } from 'express';

import MatchController from '../controllers/MatchController';
import AuthService from '../services/AuthService';

export default class MatchRoutes {

  static init(app: Application) {
    app.post(
      '/matches',
      AuthService.isAuthenticated(),
      MatchController.index
    );
    app.put('/matches/status' , 
      AuthService.isAuthenticated(),
      MatchController.updateStatus  
    );
    app.patch('/matches/toggle' , 
      AuthService.isAuthenticated(),
      MatchController.toggle
    );
    app.get('/matches/maxSalary' , 
      AuthService.isAuthenticated(),
      MatchController.findMaxSalary
    );
    app.get('/matches/maxExperience' , 
      AuthService.isAuthenticated(),
      MatchController.findMaxExperience
    );
    app.get('/get_resumes' , 
      MatchController.get_resumes
    );
  }
}