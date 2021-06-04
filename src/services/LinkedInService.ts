import * as Request from 'request';
import * as qs from 'querystringify';

export default class LinkedInService {

  static getAccessToken(code: String, origin: String, role: String) {
    console.log('reaached linkedin getaccesstoken code block',code);
    
    // let client_secret = process.env.LINKEDIN_CLIENT_SECRET;
    // let client_id = process.env.LINKEDIN_CLIENT_ID;
    // if (origin && origin.match('localhost')) {
    //   console.log(`Origin is present and using GH DEV credentials: ${origin}`);
    const client_id = process.env.LINKEDIN_CLIENT_ID;
    const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
    
    // }
    const body = {
      grant_type: "authorization_code",
      code: code,
      // redirect_uri: `http://localhost:4200/linkedInLogin/callback?role=${role}`,
      redirect_uri: `https://qa.starkflow.co/linkedInLogin/callback?role=${role}`,
      client_id: client_id,
      client_secret: client_secret
    }
    console.log('bodyresponse', body);
    return new Promise((resolve, reject) => {
      Request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://www.linkedin.com/oauth/v2/accessToken',
        body: qs.stringify(body)
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        const res = response.toJSON();
        if (res.statusCode > 399) {
          return reject(res.body.error || res.body);
        }
        return resolve(JSON.parse(body));
      });
    });
  }
  static set(getvalue, title) {
    console.log('getvalue', getvalue);
    
    if (title != 'profilePicture') {
      const key = Object.keys(getvalue[title].localized);
      return getvalue[title].localized[key[0]];
    } else {
      return getvalue[title] ? getvalue[title]['displayImage~']['elements'][0]['identifiers'][0]['identifier'] || '' : '';
    }

  }
  static async getLinkedInUserDetails(accessToken) {
    console.log('reaached linkedin getlinkedinuserdetails code block', accessToken);
    
    const fields = '(id,firstName,emailAddress,lastName,maidenName,profilePicture(displayImage~:playableStreams))';
    return new Promise((resolve, reject) => {
      Request.get({
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        url: `https://api.linkedin.com/v2/me?projection=${fields}`,
        json: true
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        const res = response.toJSON();
        console.log('response from linkedinnnnnnnnnn ', res);
        
        if (res.statusCode > 399) {
          return reject(res.body.error || res.body);
        }
        const data = {
          id: body.id,
          name: LinkedInService.set(body, 'firstName')+' '+LinkedInService.set(body, 'lastName'),
          firstName: LinkedInService.set(body, 'firstName'),
          lastName: LinkedInService.set(body, 'lastName'),
          avatar: LinkedInService.set(body, 'profilePicture')
        }
        return resolve(data);
      });
    });
  }
  static async getCompleteUserDetails(id, accessToken) {
    console.log('reaached linkedin getCompleteUserDetails code block', accessToken);
    return new Promise((resolve, reject) => {
      Request.get({
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        url: `https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`,
        json: true
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        const res = response.toJSON();
        if (res.statusCode > 399) {
          return reject(res.body.error || res.body);
        }
        const emailAddress = body.elements[0]['handle~']['emailAddress'] || '';
        return resolve(emailAddress);
      });
    });
  }

}

