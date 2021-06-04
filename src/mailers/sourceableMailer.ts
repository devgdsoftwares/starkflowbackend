import { map } from 'lodash';
import Mailer from './Mailer';
import User from '../models/User';
import Profile from '../templates/Profile';
const sgMail = require('@sendgrid/mail');
const host_environment = process.env.ENV_HOST

class SourceableMailer extends Mailer {
othername;
  constructor(toEmail: string) {
    super(toEmail);
  }
  private static generateTemplate(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.toname},</p>
                                                          <p style="margin-top:0!important">${details.fromname} sent you a message on Starkflow</p>
                                                          <p style="margin-top:0!important"><i>${details.text}</i></p>
                                                          <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='https://qa.starkflow.co/candidates/${details.fromId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Profile</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

  private static generateTemplateWithJob(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.toname}</p>
                                                          <p style="margin-top:0!important">${details.fromname} sent you a message on Starkflow</p>
                                                          <p style="margin-top:0!important"><i>${details.text}</i></p>
                                                          <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='${host_environment}${details.jobTitle}/${details.jobId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Job</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

  static async customMail() {
      console.log('custom mail check date',new Date());
      
    const SENDGRID_API_KEY = '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';
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
        to: ['anvita@starkflow.co', 'anvitaaps23@gmail.com','abhishek@starkflow.co'],
        from:{email: 'notification@starkflow.co',
        name:'StarkFlow Support'},
        subject: 'via Starkflow.co',
        template_id: 'd-57df34622cbc47ad9013cccc651ba867',
      };
    // await sgMail.send(msg);
    sgMail.send(msg).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
  }
  static async UnregisterMail(user){
    const SENDGRID_API_KEY = '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';
    sgMail.setApiKey(SENDGRID_API_KEY);
    const details = {
        unsubscribe: `https://qa.starkflow.co/${user._id}/unsubscribe`
      };
      
    const msg = {
      to:  user.email,
      from:{email: 'notification@starkflow.co',
      name:'StarkFlow Support'},
      subject:'via Starkflow.co',
      html: await Profile.fillform(user.name),
    };
    console.log('reached senggrid sendmail function');
    
    // await sgMail.send(msg);
    sgMail.send(msg).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
  }
  static async sendMail(details) {
      console.log('details',details);
      
    const SENDGRID_API_KEY = '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';
    sgMail.setApiKey(SENDGRID_API_KEY);
    details['unsubscribe'] ='https://qa.starkflow.co/'+details.toId+'/unsubscribe';
    let msg;
    if (details.fromRole == 'hr' && details.jobId) {
        msg = {
            to:  details.to,
            from:{email: 'notification@starkflow.co',
            name:'StarkFlow Support'},
            subject: details.fromname+' '+'via Starkflow.co',
            html: await this.generateTemplateWithJob(details),
          };
    }
    else if (!details.fromRole){
        msg = {
            to: details.to,
            from:{email: 'notification@starkflow.co',
            name:'StarkFlow Support'},
            subject: details.fromname+' '+'via Starkflow.co',
            html: details.fromresume ? await this.generateTemplateToClientFromUnregisteredUser(details) : await this.generateTemplateToClientFromUnregisteredUserWithoutResume(details),
          };
    }
    else {
        msg = {
            to:  details.to,
            from:{email: 'notification@starkflow.co',
            name:'StarkFlow Support'},
            subject: details.fromname+' '+'via Starkflow.co',
            html: await this.generateTemplate(details),
          };
    }
    console.log('reached senggrid sendmail function');
    
    // await sgMail.send(msg);
    sgMail.send(msg).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
  }

  static async sendMailToUnregisteredUser(details) {
    console.log('details',details);
    
    const SENDGRID_API_KEY = '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';
    sgMail.setApiKey(SENDGRID_API_KEY);
    details['unsubscribe'] ='https://qa.starkflow.co/'+details.toId+'/unsubscribe';
    let msg;
    if (!details.jobId) {
        msg = {
            to:  details.from,
            from:{email: 'notification@starkflow.co',
            name:'StarkFlow Support'},
            subject: 'Contacted to '+details.toname+' '+'via Starkflow.co',
            html: await this.generateTemplateUnregisteredChatLinkForClient(details),
        };
    }
    else {
        msg = {
            to:  details.from,
            from:{email: 'notification@starkflow.co',
            name:'StarkFlow Support'},
            subject: 'Applied for '+details.jobTitle+' '+'via Starkflow.co',
            html: await this.generateTemplateUnregisteredChatLink(details),
        };
    }
    
    console.log('reached senggrid sendmail function');
    
    // await sgMail.send(msg);
    sgMail.send(msg).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
}


  static async fetchUserDetails(details , req) {
    const todata = await User.findById(details.to);
    const sendDetails = {
      toname : todata.name ,
      to  : todata.email , 
      from : req.user.email,
      fromname : req.user.name,
      text : details.text,
      toId : todata._id,
    }
    this.sendMail(sendDetails);
  }

  static async sendCustomMail(msg) {console.log('api key:',process.env.SENDGRID_API_KEY)
    const SENDGRID_API_KEY = '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'
    sgMail.setApiKey(SENDGRID_API_KEY)
    
    await sgMail.send(msg);
  }

  static async sendMailStatus(details) {
    console.log('details to send',details);
    const SENDGRID_API_KEY = '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';
    sgMail.setApiKey(SENDGRID_API_KEY);
    details['unsubscribe'] ='https://qa.starkflow.co/'+details.toId+'/unsubscribe'
    const msg = {
      to:  details.to,
      from:{email: 'notification@starkflow.co',
      name:'StarkFlow Support'},
      subject: details.fromname+' '+'via Starkflow.co',
      html: details.rejectionreason ? await this.generateTemplateChangeStatusRejected(details) : await this.generateTemplateChangeStatusHired(details),
    };
    console.log('reached senggrid sendmail function');
    
    // await sgMail.send(msg);
    await sgMail.send(msg).then(() => {
        console.log('Message sent')
    }).catch((error) => {
        console.log(error.response.body)
        // console.log(error.response.body.errors[0].message)
    })
  }

  private static generateTemplateChangeStatusHired(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.toname}</p>
                                                          <p style="margin-top:0!important">Your profile has been <span style="color: green"><strong>${details.status}</strong></span> by ${details.fromname} for the profile of ${details.jobTitle} at ${details.companyTitle}</p>
                                                         
                                                          <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='${host_environment}${details.jobTitle}/${details.companyTitle}/${details.jobId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Job</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

  private static generateTemplateChangeStatusRejected(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.toname}</p>
                                                          <p style="margin-top:0!important">Your profile has been <span style="color: red"><strong>${details.status}</strong></span> by ${details.fromname} for the profile of ${details.jobTitle}, due to ${details.rejectionreason} at ${details.companyTitle}</p>
                                                         
                                                          <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='${host_environment}${details.jobTitle}/${details.companyTitle}/${details.jobId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Job</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

  private static generateTemplateUnregisteredChatLink(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.fromname},</p>
                                                          <p style="margin-top:0!important">You've successfully applied for the job ${details.jobTitle} on Starkflow</p>
                                                          
                                                          <table border='0' cellpadding='0' cellspacing='2' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='4' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='${host_environment}${details.jobTitle}/${details.jobId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Job</a> </td> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='https://qa.starkflow.co/unregistered/chat/${details.jobId}/${details.fromId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>Chat with client</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

  private static generateTemplateUnregisteredChatLinkForClient(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.fromname},</p>
                                                         
                                                          <table border='0' cellpadding='0' cellspacing='2' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='4' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='https://qa.starkflow.co/candidates/${details.toId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Candidate</a> </td> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='http://qa.starkflow.co/unregistered/client/chat/${details.toId}/${details.fromId}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>Chat with Candidate</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
    );
  }

  private static generateTemplateToClientFromUnregisteredUser(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.toname},</p>
                                                          <p style="margin-top:0!important">${details.fromname} sent you a message on Starkflow</p>
                                                          <p style="margin-top:0!important"><i>${details.text}</i></p>
                                                          <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                          <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='${details.fromresume}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>View Resume</a> </td> 
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

  private static generateTemplateToClientFromUnregisteredUserWithoutResume(details){
    console.log('details' , details);
    return (
      `<html>

      <head></head>
      
      <body>
          <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
              cellspacing="0" cellpadding="0" border="0" align="center">
      
              <tbody>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td valign="middle" height="40" align="center">
                          <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank"><img src="https://qa.starkflow.co/assets/new-icons/starkflowLogo.png"
                                  alt="" style="display:block;max-width:100px;font-family:Helvetica-light,sans-serif;font-size:20px;line-height:22px;font-weight:bold;color:#e82f3a;text-align:center"
                                  class="CToWUd" width="130" height="30" border="0"></a>
                      </td>
                  </tr>
                  <tr>
                      <td style="font-size:1px;line-height:1px" height="17" bgcolor="#ffffff">&nbsp;</td>
                  </tr>
                  <tr>
                      <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
                              alt="" style="display:block" class="CToWUd" width="1" height="1" border="0">
                      </td>
                  </tr>
      
      
                  <tr>
                      <td valign="top" align="center">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td style="font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400;border-collapse:collapse"
                                          align="center">
                                          <table class="m_570368416267291607w320" style="border-collapse:collapse!important;margin:0 auto"
                                              width="95%" cellspacing="0" cellpadding="0">
                                              <tbody>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                      <td style="font-family:'Arial','sans-serif'!important;font-weight:400;font-size:16px;line-height:22px;border-collapse:collapse"
                                                          align="left">
                                                          <p style="margin-top:0!important">Hello ${details.toname},</p>
                                                          <p style="margin-top:0!important">${details.fromname} sent you a message on Starkflow</p>
                                                          <p style="margin-top:0!important"><i>${details.text}</i></p>
                                                          <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                              <tbody> 
                                                                <tr> 
                                                                  <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                      <tbody> 
                                                                        <tr> 
                                                                        
                                                                        </tr>
                                                                      </tbody>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </tbody>
                                                            </table>
                                                            <br>
                                                            <br>
                                                            <p style="margin-top:0!important">If you 
                                                                believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                    style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                    target="_blank">contact@starkflow.co</a></p>
                                                      </td>
                                                      <td style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"></td>
                                                  </tr>
                                                  <tr>
                                                      <td style="border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400"
                                                          height="20px"></td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
      
      
                  <tr>
                      <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="1" bgcolor="#DEE0E5"><img
                              src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
                              alt="" style="display:block;outline:none!important;border:0" class="CToWUd" width="1" height="1"
                              border="0"></td>
                  </tr>
                  <tr>
                      <td style="border-collapse:collapse" valign="top" bgcolor="#ffffff" align="center">
                          <table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
                              <tbody>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_ftrlink" style="font-family:Helvetica-light,sans-serif;font-size:15px;line-height:20px;color:#9d9d9d"
                                          valign="top" align="center">
                                          © 2020 Starkflow.co
                                          <br>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="25">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="font-family:Helvetica-light,sans-serif;font-size:11px;line-height:15px;color:#9d9d9d"
                                          valign="top" align="center">
      
                                          You’re receiving this email because you’ve signed up for Starkflow. If you
                                          don’t want to
                                          <br class="m_-9138196761631881432em_hide"> receive emails like these
                                          anymore, you can
                                          <span style="text-decoration:underline">
      
                                              <a href=${details.unsubscribe} class="m_-9138196761631881432untracked" style="text-decoration:underline;color:#57576e"
                                                  target="_blank">unsubscribe.</a>
      
      
                                          </span>
                                      </td>
                                  </tr>
      
                                  <tr>
                                      <td class="m_-9138196761631881432em_h30" height="50">&nbsp;</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
      
      </html>`
 );
  }

}
export default SourceableMailer;