import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { randomBytes } from 'crypto';
import  contact from '../models/contact';
const sgMail = require('@sendgrid/mail');

export default class ContactController {

  static async contactForm(req: Request, res: Response) {
    const {body} = req;
    const message = ContactController.checkValidation(body);
    if(message) {
      return res.json({ error: true, status: 500, message: message  });
    }
    
    const referenceId = randomBytes(11).toString('hex');

    body.referenceId = referenceId;
    try {
      await contact.create(body);
      ContactController.sendMail(body);
      return res.json({ error: false, status: 200, message: 'Sent Successfully' });
    }catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static checkValidation(req) {
    if(!req.name){
      return 'Name is required'
    }else if(!req.email){
      return 'Email is required'
    }else if(!req.phone){
      return 'Phone number is required'
    }else if(!req.message){
      return 'Message is required'
    }
  }

  private static generateTemplate(details){
    console.log('details' , details);
    return (
    "<!doctype html><html><head><meta name='viewport' content='width=device-width'><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'> <title>"+details.fromname+"via Starkflow.co</title>" +
      " <style>"+
        /* -------------------------------------
            INLINED WITH htmlemail.io/inline
        ------------------------------------- */
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
      " @media only screen and (max-width: 620px) {table[class=body] h1 {font-size: 28px !important;margin-bottom: 10px !important;}"+
        " table[class=body] p,table[class=body] ul,table[class=body] ol,table[class=body] td,table[class=body] span, table[class=body] a {font-size: 16px !important;}"+
        " table[class=body] .wrapper,table[class=body] .article { padding: 10px !important;}"+
          "table[class=body] .content {  padding: 0 !important; }"+
          "table[class=body] .container {padding: 0 !important;width: 100% !important;}"+
          "table[class=body] .main {border-left-width: 0 !important;border-radius: 0 !important;border-right-width: 0 !important;}"+
          "table[class=body] .btn table {width: 100% !important;}" +
        " table[class=body] .btn a { width: 100% !important;}" +
          "table[class=body] .img-responsive {height: auto !important;max-width: 100% !important;width: auto !important;}"+
        "}" +
        ".ExternalClass {width: 100%;}"+
        " .ExternalClass, .ExternalClass p,.ExternalClass span, .ExternalClass font,.ExternalClass td,  .ExternalClass div { line-height: 100%;}"+
          ".apple-link a {color: inherit !important;font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height: inherit !important;text-decoration: none !important;}"+
        ".btn-primary table td:hover {background-color: #fff ; color: #ea0866 !important;border-color: #ea0866 ; }"+
          ".btn-primary a:hover {background-color: #fff !important;border-color: #ea0866 ; color:#ea0866 !important;}"+
        "</style>" +
    " </head><body class='' style='background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;'>"+
        "<table border='0' cellpadding='0' cellspacing='0' class='body' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;'>"+
        " <tr>"+
            "<td style='font-family: sans-serif; font-size: 14px; vertical-align: top;'>&nbsp;</td>"+
            "<td class='container' style='font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;'>"+
            "  <div class='content' style='box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;'>"+

            "<span class='preheader' style='color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;'>"+ details.text  +"</span>" +
                "<table class='main' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;'>" +

                  "<tr>" +
                  " <td class='wrapper' style='font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;'>"+
                      "<table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;'>"+
                      " <tr>"+
                        " <td style='font-family: sans-serif; font-size: 14px; vertical-align: top;'>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'>Reference ID:"  + " " + details.referenceId +"</p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'>Message:"+ " " + details.message + "</p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'></p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'></p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'>Name:"+ " " + details.name + "</p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'>Email:"+ " " + details.email + "</p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'>Phone:"+ " " + details.phone + "</p>"+
                            "<p style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'></p>"+
                        " </td>"+
                      " </tr>" +
                      "</table>" +
                    "</td>" +
                  "</tr>" +
              "  </table>"+
              " <div class='footer' style='clear: both; Margin-top: 10px; text-align: center; width: 100%;'>" +
                " <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;'>" +
                  "  <tr>" +
                      "<td class='content-block' style='font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;'>" +
                        "<div class='apple-link' style='color: #999999; font-size: 12px; text-align: center;'> © 2020 Starkflow.co "+
                        "</div>" +
                        "</td>" +
                    "</tr>" +
                  "</table>" +
                "</div>"+
            " </div>"+
            "</td>"+
            "<td style='font-family: sans-serif; font-size: 14px; vertical-align: top;'>&nbsp;</td>"+
          "</tr>"+
        "</table>"+
      "</body>"+
    "</html>" );
  }

  static async sendMail(details) {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: 'contact@starkflow.co',
      from:{email: 'notification@starkflow.co',
      name:'StarkFlow Support'},
      subject: `Query: ${details.name} | ${details.phone} | ${details.email}`,
      html: this.generateTemplate(details),
    };
    
    await sgMail.send(msg);
  }
}