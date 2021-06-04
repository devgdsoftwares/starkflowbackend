import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { createCipher, createDecipher, randomBytes } from 'crypto';
import ResetPassword from '../templates/ResetPassword';
import Register from '../templates/Register';
import Profile from '../templates/Profile';
import User from "../models/User";
import Tracking from '../events/Tracking';
import GithubService from '../services/GithubService';
import AuthService from '../services/AuthService';
import AuthEvents from '../events/AuthEvents';
import { UserEvents } from '../events/UserEvents';
import Company from '../models/Company';
import { Types } from 'mongoose';
import SourceableMailer from '../mailers/sourceableMailer';
import LinkedInService from '../services/LinkedInService';
import * as https from 'https';
import * as fs from 'fs';

const { ALGORITHM, SECRET } = process.env;

export default class AuthController {

  static login(req: Request, res: Response, next: NextFunction) {
    console.log('loginnnnnnnnnnnnnnn request: ', req.body);

    const { provider } = req.body;
    if (provider === 'linkedin') {
      return AuthController.authenticateLI(req, res, next);
    } else {
      return AuthController.authenticateGH(req, res, next);
    }
  }

  static logout(req: Request, res: Response) {
    // Add logic to track
    req.logout();

    Tracking.log({ type: 'auth.logout', message: 'Logout', data: {} });
    return res.json({
      error: false,
      message: `Logout successful`
    });
  }

  static async adminLogin(req: Request, res: Response) {
    try {
      console.log('admin request: ', req.body);

      const { email, password } = req.body;
      if (!email || !password) {
        return res.json({
          error: true,
          status: 422,
          data: [
            { path: 'email', message: 'Email is required.' },
            { path: 'password', message: 'Password is required.' }
          ]
        });
      }

      const user: any = await User.findOne({ email, role: 'admin' });

      if (!user) {
        return res.json({ error: true, status: 404, message: 'User not found.' });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ error: true, status: 401, message: 'Incorrect password.' });
      }

      return res.json({
        error: false,
        data: {
          user: {
            _id: user._id,
            name: user.name,
          },
          token: AuthService.signToken(user)
        }
      });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static async authenticateGH(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body;
    if (!token) {
      return res.json({
        error: true,
        status: 422,
        data: [{ path: 'token', message: 'Github access token is required.' }]
      });
    }

    Tracking.log({ type: 'auth.login', message: 'Login user', data: { provider: 'github', role: 'user' } });

    try {
      const origin = req.get('Origin');

      const accessToken: any = await GithubService.getAccessToken(token, origin);
      const githubUser: any = await GithubService.getUserFromAccessToken(accessToken);
      console.log('githubuser', githubUser, req.body);

      // const userExists: any = await User.findOne({ id: githubUser.id });
      let userExists: any = await User.findOne({ url: githubUser.url });
      console.log('userexists', userExists);
      if (!userExists)
        userExists = await User.findOne({ email: githubUser.email, $or: [{ role: { $exists: false } }, { role: 'candidate' }] });
      // Set the role to candidate
      githubUser.role = 'candidate';
      console.log('userexists', userExists);

      if (userExists) {
        githubUser._id = userExists._id;
        githubUser.onboarding = userExists.onboarding;
        githubUser.email = userExists.email;
        githubUser.email_approve = userExists.email_approve;
        githubUser.last_logged_in = new Date();
        githubUser.role = 'candidate';
        githubUser.avatar = userExists.avatar;
        githubUser.name = userExists.name;
        await userExists.update({ ...githubUser });
        Tracking.log({ type: 'auth.login', message: 'Login successful', data: { ...githubUser } });
      } else {
        // const user: any = await User.create(githubUser)
        // githubUser._id = user._id;
        // githubUser.onboarding = user.onboarding;
        // githubUser.email_approve = user.email_approve;
        // Tracking.log({ type: 'auth.register', message: 'Register successful', data: { ...githubUser } });
        // UserEvents.created(user);
      }

      if (req.body.isMiddleware) {
        req.body.token = AuthService.signToken(githubUser);
        req.user = userExists || githubUser;
        return next();
      }

      return res.json({
        error: false,
        data: await AuthController.userAndToken(githubUser),
        message: `Welcome, ${userExists.name || 'User'}`
      });
    } catch (e) {
      Tracking.log({ type: 'auth.error', message: 'Error occured logging in.', data: e });
      return res.json({ error: true, status: 500, message: 'An error occured.' + e });
    }
  }

  private static async authenticateLI(req: Request, res: Response, next: NextFunction) {
    // console.log('authenticate li', req.body.avatar,);

    try {
      Tracking.log({ type: 'auth.login', message: 'Login', data: { provider: 'linkedin', role: req.body.role } });
      console.log('got request for linkedin: ', req.body);

      let user: any;
      if (req.body.role === 'hr')
        user = await User.findOne({ email: req.body.emailAddress, $or: [{ unregistered_role: 'hr' }, { role: 'hr' }] });
      else if (req.body.role === 'candidate')
        user = await User.findOne({ email: req.body.emailAddress, $or: [{ unregistered_role: 'candidate' }, { role: 'candidate' }] });
      console.log('founded user', user);

      req.body.last_logged_in = new Date();
      if (user) {
        if (user.name) {
          req.body.name = user.name;
        }
        if (user.email) {
          req.body.email = user.email;
        }
        if (user.avatar) {
          req.body.avatar = user.avatar;
        }
        //console.log('update body',req.body);

        await user.update({ ...req.body });
        user = user.toJSON();
        Tracking.log({ type: 'auth.login', message: 'Login successfull', data: { ...user } });
      } else {
        const origin = req.protocol + '://' + req.get('Host');
        let image_path = (origin === 'http://localhost:3201' ? origin : 'https://qa.starkflow.co/api') + '/' + req.body.emailAddress + "_candidate_" + Date.now();
        let save_image_path = './images/' + req.body.emailAddress + "_candidate_" + Date.now()
        let localImageUrl = await AuthController.saveImageToDisk(req.body.avatar, save_image_path);
        console.log('ssaved immages', localImageUrl);

        req.body.name = req.body.name;
        req.body.email = req.body.emailAddress;
        req.body.avatar = image_path;
        req.body.admin_approve = true;
        req.body.email_approve = true;
        user = await User.create(req.body);

        const details = {
          unsubscribe: `https://qa.starkflow.co/${user._id}/unsubscribe`
        };

        const msg = {
          to: user.email,
          from: {
            email: 'notification@starkflow.co',
            name: 'StarkFlow Support'
          },
          subject: 'Thanks for signing up!!',
          html: Profile.generateProfileReviewTemplate(details),
        };

        if (req.body.role === "hr") {
          SourceableMailer.sendCustomMail(msg);
        }

        Tracking.log({ type: 'auth.register', message: 'Register successful', data: { ...user } });
      }

      if (req.body.isMiddleware) {
        req.body.token = AuthService.signToken(user);
        req.user = user;
        return next();
      }

      // Once HR has created profile from LinkedIn we wil use user.positions.values
      // to get the companies and add them in our DB
      if (user.positions && user.positions._total > 0) {
        user = await AuthEvents.hrCreated(user);
        console.log(user);
      }

      return res.json({
        error: false,
        message: `Welcome, ${user.name}`,
        data: await AuthController.userAndToken(user)
      });
    } catch (e) {
      Tracking.log({ type: 'auth.error', message: 'Error occured logging in.', data: e });
      return res.json({ error: true, status: 500, message: `An error occured. ${e.message}` });
    }
  }

  //Node.js Function to save image from External URL.
  static async saveImageToDisk(url, localPath) {
    var fullUrl = url;
    var file = await fs.createWriteStream(localPath);
    var request = await https.get(url, function (response) {
      response.pipe(file);
    });
  }

  static async userAndToken(user) {
    let hasOnboarding = user.onboarding;
    let userCompanyDetails;
    if (!user.email && !user.name) {
      hasOnboarding = true;
    }
    if (user.company_id && user.role === 'hr') {
      userCompanyDetails = await Company.findById(user.company_id);
    }
    return {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        onboarding: hasOnboarding,
        role: user.role,
        company: user.company_id || user.company,
        admin_approve: user.admin_approve,
        email_approve: user.email_approve,
        user_company: userCompanyDetails,
        autoMatch: user.autoMatch,
        email: user.emailAddress || user.email || '',
      },
      token: AuthService.signToken(user)
    }
  }
  static async ClientSignUp(req: Request, res: Response) {

    const { email } = req.body;
    const user:any = {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      password: req.body.password,
      admin_approve: true,
      email_approve: false,
    }
    console.log('user', req.body);
    bcrypt.hash(user.password, 10, async (err, hash) => {
      if (hash) {
        user.password = hash
        try {
          // const existcompany: any = await Company.findOne({ 'title': req.body.company.title });
          // if (existcompany) {
          //   return res.json({ error: true, message: 'Company already exists' })
          // }
          const existUnregisteredUser = await User.findOne({ email });
          const existuser: any = await User.findOne({ email });
          if (existuser) {
            return res.json({ error: true, message: 'Email already Exists, Please use another Email.' })
          }
          else if (existUnregisteredUser) {
            const companyDetail = await Company.create(req.body.company);
            user['company_id'] = Types.ObjectId(companyDetail._id);
            await existUnregisteredUser.update({ ...user });
            return res.json({ error: false, message: 'User Registered Successfully' })
          }
          else {
             /*  ----------------------------------     */
             const verifyUrl = randomBytes(20).toString('hex');
             const cipher = createCipher(ALGORITHM, SECRET);
             const url = cipher.update(`${Date.now()}_${verifyUrl}`, 'utf8', 'hex') + cipher.final('hex');
             /*  -----------------------------------     */
             
            user.verify_url = url;
            const companyDetail = await Company.create(req.body.company);
            user['company_id'] = Types.ObjectId(companyDetail._id);
          await User.create(user, (err, response) => {

            const details = {
              name: user.name,
              email: user.email,
              password: req.body.password,
              verify_url:url,
              id:response._id
            };
            const msg = {
              to: user.email,
              from: {
                email: 'notification@starkflow.co',
                name: 'StarkFlow Support'
              },
              subject: 'Thanks for Signing Up as Client!!',
              html: Register.generateRegisterTemplate(details),
            };

            SourceableMailer.sendCustomMail(msg);
            return res.json({ error: false, message: 'User Created Successfully' })
          });
          }
        }
        catch (e) {
          return res.json({ error: true, message: e })
        }
      }
    });
  }

  static async CandidateSignUpbackup(req: Request, res: Response) {

    const { email } = req.body;
    const user = {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      designation: req.body.designation
    }
    console.log('user', req.body);
    try {
      const existUnregisteredUser = await User.findOne({ email, unregistered_role: 'candidate' });
      const existuser: any = await User.findOne({ email, role: 'candidate' });
      if (existuser) {
        return res.json({ error: true, message: 'Email already Exists, Please use another Email.' })
      }
      else if (existUnregisteredUser) {
        await existUnregisteredUser.update({ ...user });
        return res.json({ error: false, message: 'User Created Successfully' })
      }
      else {
        await User.create(user);
        return res.json({ error: false, message: 'User Created Successfully' })
      }
    }
    catch (e) {
      return res.json({ error: true, message: e })
    }
  }

  static async CandidateSignUp(req: Request, res: Response) {

    const { email } = req.body;
    const user:any = {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      password: req.body.password,
      admin_approve: true,
      email_approve: false,
      // designation: req.body.designation
    }
    // console.log('CandidateSignUp', req.body);
    bcrypt.hash(user.password, 10, async (err, hash) => {
      if (hash) {
        user.password = hash
        try {
          const existuser: any = await User.findOne({ email });
          // console.log('existuser:::::::', existuser);
          if (existuser) {
            return res.json({ error: true, message: 'Email already Exists, Please use another Email.' })
          }
          else {
            // console.log('SignUp[]::::',user);
            // await User.create(user);
              /*  ----------------------------------     */
              const verifyUrl = randomBytes(20).toString('hex');
              const cipher = createCipher(ALGORITHM, SECRET);
              const url = cipher.update(`${Date.now()}_${verifyUrl}`, 'utf8', 'hex') + cipher.final('hex');
              const verify_url = `https://qa.starkflow.co/verify_account/${url}`;
              /*  -----------------------------------     */
              
            user.verify_url = url;
            await User.create(user, (err, response) => {
            const details = {
              name: user.name,
              email: user.email,
              password: req.body.password,
              verify_url:url,
              id:response._id
            };

            const msg = {
              to: user.email,
              from: {
                email: 'notification@starkflow.co',
                name: 'StarkFlow Support'
              },
              subject: 'Thanks for Signing Up as Candidate!!',
              html: Register.generateRegisterTemplate(details),
            };
            SourceableMailer.sendCustomMail(msg);
              return res.json({ error: false, message: 'User Registered Successfully' })
            });
          }
        }
        catch (e) {
          return res.json({ error: true, message: e })
        }
      }
    });
  }

  static async ClientLogin(req: Request, res: Response) {
    const { email, password, role } = req.body
    try {
      const user: any = await User.findOne({ email: new RegExp(`^${email}$`, 'i'), role });
      console.log('user', user);
      let hasOnboarding = true;
      if (!user) {
        return res.json({ error: true, status: 404, message: 'User not found.' });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ error: true, status: 401, message: 'Incorrect password.' });
      }
      if (user.email && user.name) {
        hasOnboarding = false;
      }
      if(user.email_approve == false){
        return res.json({ error: true, status: 401, message: 'Please verify your email first!!.' });
      }else if(user.email_approve == true){
        return res.json({
          error: false,
          message: `Welcome, ${user.name}`,
          data: await AuthController.userAndToken(user)
        });
      }
     

    }
    catch (e) {
      return res.json({ error: true, message: 'Log in unsucessful' })
    }
  }

  static async CandidateLogin(req: Request, res: Response) {
    const { email, password, role } = req.body
    try {
      const user: any = await User.findOne({ email: new RegExp(`^${email}$`, 'i'), role });
      console.log('user', user);
      let hasOnboarding = true;
      if (!user) {
        return res.json({ error: true, status: 404, message: 'User not found.' });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ error: true, status: 401, message: 'Incorrect password.' });
      }
      if (user.email && user.name) {
        hasOnboarding = false;
      }
      if(user.email_approve == false){
        return res.json({ error: true, status: 401, message: 'Please verify your email first!!.' });
      }else if(user.email_approve == true){
        return res.json({
          error: false,
          message: `Welcome, ${user.name}`,
          data: await AuthController.userAndToken(user)
        });
      }
     

    }
    catch (e) {
      return res.json({ error: true, message: 'Log in unsucessful' })
    }
  }

  static async clientGoogleSignIn(req: Request, res: Response) {
    const { email, role } = req.body
    try {
      const user: any = await User.findOne({ email: new RegExp(`^${email}$`, 'i'), role });
      console.log('user', user);
      let hasOnboarding = true;
      if (!user) {
        const user = {
          email: req.body.email,
          name: req.body.name,
          role: req.body.role,
          // password: req.body.password,
          admin_approve: false,
          email_approve: true,
        }

        console.log('user', req.body);
        try {
          const existuser: any = await User.findOne({ email, role: 'hr' });
          const existUnregisteredUser = await User.findOne({ email, unregistered_role: 'hr' });
          if (existuser) {
            return res.json({ error: true, message: 'Email already Exists, Please use another Email.' })
          }
          else if (existUnregisteredUser) {
            await existUnregisteredUser.update({ ...user });
            return res.json({ error: false, message: 'User Registered Successfully', data: { googleSignUp: true } })
          }
          else {
            await User.create(user);
            return res.json({ error: false, message: 'User Created Successfully', data: { googleSignUp: true } })
          }
        }
        catch (e) {
          return res.json({ error: true, message: e })
        }
        // return res.json({ error: true, status: 404, message: 'User not found.' });
      }
      else {
        if (user.email && user.name) {
          hasOnboarding = false;
        }
        return res.json({
          error: false,
          message: `Welcome, ${user.name}`,
          data: await AuthController.userAndToken(user)
        });
      }
    }
    catch (e) {
      return res.json({ error: true, message: 'Log in unsucessful' })
    }
  }

  async clientGoogleSignUp(req: Request, res: Response) {
    const { email } = req.body;
    const user = {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
      password: req.body.password,
      admin_approve: false,
      email_approve: false,
    }

    console.log('user', req.body);
    bcrypt.hash(user.password, 10, async (err, hash) => {
      if (hash) {
        user.password = hash
        try {
          const existuser: any = await User.findOne({ email });
          if (existuser) {
            return res.json({ error: true, message: 'Email already Exists, Please use another Email.' })
          } else {
            await User.create(user);
            return res.json({ error: false, message: 'User Created Successfully' })
          }
        }
        catch (e) {
          return res.json({ error: true, message: e })
        }
      }
    });

  }

  static async ForgotPassword(req: Request, res: Response) {
    const { email, role } = req.body
    try {
      const user: any = await User.findOne({ email, role });
      console.log('user::::::', user);
      if (!user || (user && !user.password)) {
        return res.json({ error: true, status: 404, message: 'User not found.' });
      }
      const resetToken = randomBytes(20).toString('hex');
      const cipher = createCipher(ALGORITHM, SECRET);
      const token = cipher.update(`${Date.now()}_${user._id}_${resetToken}`, 'utf8', 'hex') + cipher.final('hex');
      const reset_url = `https://qa.starkflow.co/reset/${token}`;
      await User.update({ _id: user._id }, {
        $set: {
          resetToken
        }
      });

      const details = {
        name: user.name,
        reset_url,
        url: 'https://qa.starkflow.co/login'
      };

      const msg = {
        to: user.email,
        from: {
          email: 'notification@starkflow.co',
          name: 'StarkFlow Support'
        },
        subject: 'You have requested for password reset!!',
        html: ResetPassword.generateResetLinkTemplate(details),
      };

      SourceableMailer.sendCustomMail(msg);

      return res.json({
        error: false,
        message: `Reset Password Link Sent Successfully`,
        data: {}
      });

    }
    catch (e) {
      return res.json({ error: true, message: `An error occured. ${e.message}` })
    }
  }

  static async checkResetPasswordToken(req: Request, res: Response) {
    const { token } = req.params;
    const decipher = createDecipher(ALGORITHM, SECRET);
    const decrypt = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
    const [expiry_time, _id, resetToken] = `${decrypt}`.split('_');

    if ((Date.now() - expiry_time * 1) > 3 * 60 * 60 * 1000) {
      return res.json({ error: true, status: 200, message: 'Token Expired' });
    }

    try {
      const user: any = await User.findOne({ _id: Types.ObjectId(_id), resetToken });

      if (!user) {
        return res.json({ error: true, status: 404, message: 'Invalid Token' });
      }

      return res.json({
        error: false,
        message: 'Valid Token',
        data: {}
      });

    }
    catch (e) {
      return res.json({ error: true, message: `An error occured. ${e.message}` })
    }
  }

  static async setPassword(req: Request, res: Response) {
    const { confirmpassword, password } = req.body;
    const { token } = req.params;
    const decipher = createDecipher(ALGORITHM, SECRET);
    const decrypt = decipher.update(token, 'hex', 'utf8') + decipher.final('utf8');
    const [, _id, resetToken] = `${decrypt}`.split('_');
    const newPassword = await bcrypt.hash(password, 10);

    if (password !== confirmpassword) {
      return res.json({ error: true, status: 404, message: "Passwords Don't Match" });
    }
    console.log('resetToken:::::', token);
    try {
      const user: any = await User.findOneAndUpdate({ _id: Types.ObjectId(_id), resetToken }, {
        $set: {
          password: newPassword
        },
        $unset: {
          resetToken: ''
        }
      });

      if (!user) {
        return res.json({ error: true, status: 404, message: 'Invalid Token' });
      }

      const details = {
        name: user.name
      };

      const msg = {
        to: user.email,
        from: {
          email: 'notification@starkflow.co',
          name: 'StarkFlow Support'
        },
        subject: 'Your password has been changed successfully!!',
        html: ResetPassword.generateResetCompleteTemplate(details),
      };

      SourceableMailer.sendCustomMail(msg);

      return res.json({
        error: false,
        message: 'Password Reset Successfully',
        data: {}
      });

    }
    catch (e) {
      return res.json({ error: true, message: `An error occured. ${e.message}` })
    }
  }

  static async getLinkedInAccessToken(req: Request, res: Response) {
    const { code, role } = req.body;
    if (!code) {
      return res.json({
        error: false,
        status: 500,
        message: 'Invalid Token'
      });
    }
    try {
      const origin = req.get('Origin');
      const LinkedInAccessToken: any = await LinkedInService.getAccessToken(code, origin, role);
      console.log('acessToken', LinkedInAccessToken.access_token);
      let UserDetails: any = await LinkedInService.getLinkedInUserDetails(LinkedInAccessToken.access_token);
      console.log('getUserDetails', UserDetails)
      UserDetails['emailAddress'] = await LinkedInService.getCompleteUserDetails(UserDetails.id, LinkedInAccessToken.access_token)
      return res.json({
        error: false,
        status: 200,
        data: UserDetails
      });
    } catch (e) {
      console.log('catch error: ', e);

      return res.json({
        error: false,
        status: 500,
        data: e
      });
    }
  }
  // Verify Account

  static async VerifyAccount(req: Request, res: Response) {
    const id = req.params.id;
    const { url } = req.params;
    const decipher = createDecipher(ALGORITHM, SECRET);
    const decrypt = decipher.update(url, 'hex', 'utf8') + decipher.final('utf8');
    const [,verify_url] = `${decrypt}`.split('_');
    const user: any = await User.findOneAndUpdate({ _id: Types.ObjectId(id) }, {
      $set: {
        email_approve: true
      }
    });
    if (!user) {
      return res.json({ error: true, status: 404, message: 'Invalid Link!!' });
    }
    else if(user.email_approve == true){
      return res.json({ error: true, status: 404, message: 'Already Verified!!' });
    }
    else{
      return res.redirect('https://qa.starkflow.co/login/candidate');
    }
  }

}
