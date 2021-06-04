import { Application } from 'express';
import AuthService from "../services/AuthService";
import   projectController from '../controllers/projectController';


export default class ProjectRoutes {

  static init(app: Application) {

    app.post(
      '/images_upload',
      // AuthService.isAuthenticated(),
      projectController.uploadImages
    );

    app.post(
      '/image_upload',
      AuthService.isAuthenticated(),
      projectController.uploadImage
    );

    app.post(
      '/resume_upload',
      // AuthService.isAuthenticated(),
      projectController.uploadResume
    );
  }
}