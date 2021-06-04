import { Request, Response } from 'express';
import * as multer from 'multer'
import User from '../models/User';
import Company from '../models/Company';
import UserService from '../services/UserService';
import { UserEvents } from '../events/UserEvents';

export default class ProjectController {
  static async uploadImages(req: Request, res: Response) {
    let filepath;
    const Storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './images')
      },
      filename:async function (req, file, callback) {
        filepath = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
      }
    });
    const upload = multer({
      storage: Storage
    }).array("images", 20);
      upload(req, res, (err) => {
      if (err) 
        return res.json({ error: true, data: 'error' });
      else {
        return res.json({ error: false, data: filepath, message: 'from jenkins' });
      }
    })
  }

  static async uploadImage(req: Request, res: Response) {
    let filepath;
    const origin = req.protocol + '://' + req.get('Host');
    console.log('origin', origin);
    
    const Storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './images')
      },
      filename:async function (req, file, callback) {
        filepath =  ( origin === 'http://localhost:3201' ? 'http://localhost:3201' : 'https://qa.starkflow.co/api' )+ '/' +file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
      }
    });
    const upload = multer({
      storage: Storage
    }).single("images");
      upload(req, res, (err) => {
      if (err) 
        return res.json({ error: true, data: 'error' });
      else {
        return res.json({ error: false, data: filepath, message: 'from jenkins' });
      }
    })
  }

  static async uploadResume(req: Request, res: Response) {
    let filepath;
    const origin = req.protocol + '://' + req.get('Host');
    const Storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './resumes')
      },
      filename:async function (req, file, callback) {
        filepath =  ( origin === 'http://localhost:3201' ? origin : 'https://qa.starkflow.co/api' )+ '/' +file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
      }
    });
    const upload = multer({
      storage: Storage
    }).single("resumes");
      upload(req, res, (err) => {
      if (err) 
        return res.json({ error: true, data: 'error' });
      else {
        return res.json({ error: false, data: filepath });
      }
    })
  }

}