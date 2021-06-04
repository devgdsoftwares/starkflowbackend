import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import * as expressJWT from 'express-jwt';
import * as CO from 'composable-middleware';

import User from '../models/User';
import AuthController from '../controllers/AuthController';
const validateJwt = expressJWT({ secret: process.env.SESSION });

export default class AuthService {
	static isAuthenticated() {
		return CO()
			.use(AuthService.validateToken)
      .use(AuthService.attachUser);
  }

  static validateToken(req: Request, res: Response, next: NextFunction) {
    console.log('request.query:', req.query.hasOwnProperty('access_token'));
    
    // allow access_token to be passed through query parameter as well
    if(req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    validateJwt(req, res, (error) => {
      if(error) {
        console.log('validate jwt: ', error);
        
        return res.status(401).send(`Unauthorized - ${error}`);
      }
      next();
    });
  }

  static isPublic(req: Request) {
    console.log('request.query:', req.query.hasOwnProperty('access_token'));
    
    // allow access_token to be passed through query parameter as well
    if(req.query && req.query.hasOwnProperty('access_token')) {
      return true;
    }
  }

  static attachUser(req: Request, res: Response, next: NextFunction) {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).send('An error occured');
      if (!user) return res.status(401).send('Unauthorized');
      req.user = user;
      next();
    });
  }

  static isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.json({error: true, status: 401, message: 'Unauthorized.'});
  }

  static isHR(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.role === 'hr') {
      return next();
    }
    return res.json({error: true, status: 401, message: 'Unauthorized.'});
  }

  static isCandidate(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.role === 'candidate') {
      return next();
    }
    return res.json({error: true, status: 401, message: 'Unauthorized.'});
  }

  static hasRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.user && roles.indexOf(req.user.role) !== -1 ) {
        return next();
      }
      return res.json({error: true, status: 401, message: 'Unauthorized.'});
    }
  }

	static signToken({_id, name}) {
		return JWT.sign({ _id, name }, process.env.SESSION);
	}

	static createToken() {
		return Math.random().toString(36).substring(2);
  }
  
  static login(req: Request, res: Response, next: NextFunction){
    req.body.isMiddleware = true;
    return AuthController.login(req, res, next);
  }
}