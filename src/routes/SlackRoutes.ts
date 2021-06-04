import { Application } from 'express';

import SlackController from '../controllers/SlackController';
import SlackService from '../services/SlackService';

export default class SlackRoutes {

  static init(app: Application) {
    app.get('/slack/authorize', SlackController.authorize);

    app.post(
      '/slack/webhook',
      SlackService.isAuthenticated,
      SlackController.webhook
    );

    app.post(
      '/slack/actions',
      SlackService.isAuthenticated,
      SlackController.actions
    );

    app.post(
      '/slack/hiring-notification',
      SlackService.isAuthenticated,
      SlackController.sendJobHiringNotification
    )
  }
}