import { Application } from 'express';

import PaymentController from '../controllers/PaymentController';

import AuthService from '../services/AuthService';


export default class PaymentRoutes {

  static init(app: Application) {

    app.get('/payment/create',
      AuthService.isAuthenticated(),
      PaymentController.createPayment
    );
    app.post('/payments/data', PaymentController.storeVault);
    app.get('/payment/success', PaymentController.paymentSuccess);
    app.post('/payments/info', PaymentController.paymentInfo);
    app.get('/payment/error', PaymentController.paymentFail);
    app.post('/payments/team', PaymentController.getTeam);
    app.post('/payments/history', PaymentController.getTransaction);
    app.get('/payments/cardtransaction', PaymentController.savedCardTransaction);
    app.post('/removeCards', PaymentController.removeCards);
    app.post('/deleteCard', PaymentController.deleteCard);
    app.post('/primaryCard', PaymentController.makePrimary);
    app.post('/getCard', PaymentController.getCard);
    app.get('/card-details/:id', PaymentController.getCardById);
    app.put('/update-card/:id', PaymentController.updateCard);
    app.post('/customer/create',PaymentController.CreateCustomer);
    app.post('/customer/update',PaymentController.UpdateCustomer);
    app.post('/customer/addAddress',PaymentController.AddAddress);
    app.put('/customer/updateAddress',PaymentController.UpdateAddress);
    app.post('/customer/search',PaymentController.SearchCustomer);
    app.get('/customer/addressExists/:id',PaymentController.CheckCustomerAddress);
  }
}