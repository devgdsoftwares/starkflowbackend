import { Application } from 'express';
import AuthService from '../services/AuthService';
import ProfileController from '../controllers/ProfileController';

export default class AuthRoutes {

  static init(app: Application) {
    // Get data
    app.get('/users/me', AuthService.isAuthenticated(), ProfileController.me);
    app.get('/user/:id', AuthService.isAuthenticated(), ProfileController.getUserById);
    app.get('/users/getCompany', AuthService.isAuthenticated(), ProfileController.getCompanyId);
    app.get('/users/me/onboarding', AuthService.isAuthenticated(), ProfileController.onboarding);
    app.put('/users', AuthService.isAuthenticated(), ProfileController.update);
    app.get('/candidate', ProfileController.candidate);
    app.get('/expected_salary', ProfileController.update_expected);
    app.post('/admin_approve', ProfileController.adminApprove);
    app.post('/active_email', AuthService.isAuthenticated(), ProfileController.emailApprove);
    app.put('/unsubscribe_email', ProfileController.unsubscribeEmail);
    app.get('/get/user', AuthService.isAuthenticated(), ProfileController.getUserId);
    app.post('/public/profiles', ProfileController.getPublicProfiles);
    app.post(
      '/candidates/:id/show',
      ProfileController.public
    );

    app.get('/profile/places', ProfileController.getPlaces);

    app.get('/users/profile/login',
      AuthService.isAuthenticated(),
      AuthService.isAdmin,
      ProfileController.loginToProfile
    );
    app.get('/users/invite',
      AuthService.isAuthenticated(),
      AuthService.isAdmin,
      ProfileController.invitation
    );
    app.get('/admin/dashboard',
      AuthService.isAuthenticated(),
      AuthService.isAdmin,
      ProfileController.getDashboardCount
    );
    app.post(
      '/applyJobUnregisterCandidate',
      ProfileController.registerUnregisteredCandidate
    );
    app.post(
      '/sendMessageUnregisterClient',
      ProfileController.registerUnregisteredClient
    );

    //job convert salary object
    app.get(
      '/jobs/updateSalary',
      ProfileController.updateJobSalaryObject
    );

    //candidate profile convert salary object
    app.get(
      '/candidate/updateSalary',
      ProfileController.updateCandidateSalaryObject
    );

    //candidate convert salary value
    app.get(
      '/candidate/updateCandidateSalaryValue',
      ProfileController.updateCandidateSalaryValue
    );

    //job convert salary value
    app.get(
      '/jobs/updateJobSalaryValue',
      ProfileController.updateJobSalaryValue
    );
    
  }
}