import { Application } from 'express';
import AuthService from "../services/AuthService";
import   NotinterestedController from '../controllers/Notinterested';

export default class NotInterested {

  static init(app: Application) {

    app.post(
      '/no_interested',
      // AuthService.isAuthenticated(),
      NotinterestedController.not_interested
    );

    app.post(
      '/no_interested_cand',
      // AuthService.isAuthenticated(),
      NotinterestedController.not_interest_candidates
    );
    
  }
}