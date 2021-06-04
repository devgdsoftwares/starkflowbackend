
export default class Register {

    static generateRegisterTemplate(details: any) {
        console.log('details', details);
        function myFunction() {
            document.getElementById("demo").innerHTML = "Hello World";
          }
        return (
            `<html>

            <head></head>
            
            <body>
                <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
                    cellspacing="0" cellpadding="0" border="0" align="center">
            
                    <tbody>
                        <tr>
                            <td valign="middle" height="40" align="center" style="text-align:center;padding:20px;background-color:#6200ed;">
                                <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank">
                   <img src="https://qa.starkflow.co/assets/email-banner.png" class="w-100" alt="" />
                   <h1 style="margin:0px;"><span style="color: #fff;">Welcome to Starkflow!</span></h1>
                                        </a>
                            </td>
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
                                            <td class="m_-9138196761631881432em_side" width="50">&nbsp;</td>
                                            <td valign="top" align="center">
                                                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td class="m_-9138196761631881432em_h40" height="50">&nbsp;</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family:Helvetica-light,sans-serif;font-size:16px;line-height:25px;color:#414252"
                                                                valign="top" align="left">Hi ${details.name},<br>Thanks for signing up!!<br>Please click on below link or button to verify your account. <br><br>
                                                                <table border='0' cellpadding='0' cellspacing='0' class='btn btn-primary' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;'>
                                                                    <tbody> 
                                                                        <tr> 
                                                                        <td align='center' style='font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;'>
                                                                            <table border='0' cellpadding='0' cellspacing='0' style='border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;'> 
                                                                            <tbody> 
                                                                                <tr> 
                                                                                <td style='font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #6200EE; border-radius: 5px; text-align: center;'> <a href='https://qa.starkflow.co/api/verify_account/${details.verify_url}/${details.id}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #6200EE; border: solid 1px #6200EE; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #6200EE;'>Confirm Email</a> </td> 
                                                                                </tr>
                                                                            </tbody>
                                                                            </table>
                                                                        </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <br>
                                                                <b style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400">Thanks,<br>Starkflow</b><br><br>
                                                                <p style="margin-top:0!important">If you believe that you're not the intended user or you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
                                                                        style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                        target="_blank">contact@starkflow.co</a></p>
                                                                <br>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td class="m_-9138196761631881432em_side" width="50">&nbsp;</td>
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
                                            <td style="font-size:1px;line-height:1px" class="m_-9138196761631881432em_h30" height="16">&nbsp;</td>
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
