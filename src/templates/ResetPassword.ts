
export default class ResetPassword {

    static generateResetLinkTemplate(details:any) {
        console.log('details', details);
        return (
            `<html>

            <head></head>
            
            <body>
                <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
                    cellspacing="0" cellpadding="0" border="0" align="center">
            
                    <tbody>
                        <tr>
                            <td valign="middle" height="40" align="center"
                                style="text-align:center;padding:20px;background-color:#6200ed;">
                                <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank">
                                    <img src="https://qa.starkflow.co/assets/email-banner.png" class="w-100" alt="" />
                                    <h1 style="margin:0px;"><span style="color: #fff;">Welcome to Starkflow!</span></h1>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img
                                    src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
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
                                                                <p style="margin-top:0!important">Hello ${details.name}</p>
                                                                <p style="margin-top:0!important">You requested a password update.
                                                                    Click the link below to set your new password:</p>
                                                                <b><a href=${details.reset_url} style="color:#6200EE;text-decoration:none;outline:none;border:0"
                                                                        target="_blank">Set
                                                                        a new password</a></b>
                                                                <br>
                                                                <br>
                                                                <b style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400">Thanks,<br>Starkflow</b><br><br>
                                                                <p style="margin-top:0!important">If you did not request this, or
                                                                    believe you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
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
                            <td style="font-size:0px;line-height:0px;border-collapse:collapse" height="" bgcolor="#DEE0E5"><img src="https://ci4.googleusercontent.com/proxy/sd_c2jy_0XQk_WquR6JT9AlCissMywk1ANzE3WS90cdIXKamU2p5FQOHwGEnLjgMayMz8a9sVPLHKGIDGlN8P41_e6GZCh93fmX6pEp-keTc0g=s0-d-e1-ft#http://assets.hired.com/email/images/0_global/global_spacer.gif"
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

    static generateResetCompleteTemplate(details:any) {
        console.log('details', details);
        return (
            `<html>

            <head></head>
            
            <body>
                <table style="table-layout:fixed;border:1px solid #afb8c2" class="m_-9138196761631881432em_main_table" width="640"
                    cellspacing="0" cellpadding="0" border="0" align="center">
            
                    <tbody>
                        <tr>
                            <td valign="middle" height="40" align="center"
                                style="text-align:center;padding:20px;background-color:#6200ed;">
                                <a href="https://qa.starkflow.co" style="text-decoration:none" target="_blank">
                                    <img src="https://qa.starkflow.co/assets/email-banner.png" class="w-100" alt="" />
                                    <h1 style="margin:0px;"><span style="color: #fff;">Welcome to Starkflow!</span></h1>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-size:0px;line-height:0px" height="1" bgcolor="#DEE0E5"><img
                                    src="https://ci6.googleusercontent.com/proxy/6WtRZ1XUjRjAAQvh5O4oCJ_euGIgMxHZMb08C8q7urW_9HZ_TzRnyHPdeLWTXGmpSOniK5vjMpiyr8lBv7jgL9XQbbb5IgSi=s0-d-e1-ft#http://assets.hired.com/email/images/basic/spacer.gif"
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
                                                                <p style="margin-top:0!important">Hello ${details.name}</p>
                                                                <p style="margin-top:0!important">We wanted to let you know that your Starkflow password was changed.</p>
                                                                <br>
                                                                <p style="margin-top:0!important">Please do not reply to this email with your password. We will never ask for your password, and we strongly discourage you from sharing it with anyone.</p>
                                                                <br>
                                                                <br><b style="width:30px;border-collapse:collapse;font-family:'Helvetica Neue','Arial','sans-serif'!important;font-weight:400">Thanks,<br>Starkflow</b><br><br>
                                                                <p style="margin-top:0!important">If you believe you’ve received this in error, please contact <a href="mailto:contact@starkflow.co"
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