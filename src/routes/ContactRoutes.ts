import { Application } from 'express';

import ContactController  from '../controllers/ContactController';
import AuthService from '../services/AuthService';

export default class ContactRoutes {
static init(app: Application) {
  app.post(
    '/contact',
    ContactController.contactForm
  );
}
}