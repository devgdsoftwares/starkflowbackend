import * as cron from "cron";
import Job from "../models/Job";
import User from "../models/User";
import SourceableMailer from "../mailers/sourceableMailer";
//will run every day at 12:00 AM
class Cron{
    static checkJobExpiry(){
        let task = new cron.CronJob(
            "0 0 0 * * *",
            () => {
                console.log('on tick',new Date());
                    
                Job.updateMany({"expiry_date": {$lte: new Date()}}, {"$set":{"archived": true}}, {"multi": true}, (err, writeResult) => {});
            },
            () => {
              console.log("error!!");
            },
            true,
            "Europe/Madrid",
            {},
            false
          );
          
          task.start();
    }
    static checkUserExpiry(){
        let task = new cron.CronJob(
            "0 0 0 * * *",
            () => {
                console.log('on tick user',new Date());
                let expiry = new Date(new Date().setDate(new Date().getDate()-30));   
                User.updateMany({"last_logged_in": {$lte: expiry}}, {"$set":{"onboarding": true}}, {"multi": true}, (err, writeResult) => {});
            },
            () => {
              console.log("error!!");
            },
            true,
            "Europe/Madrid",
            {},
            false
          );
          
          task.start();
    }
    static sendCustomMail(){
      let task = new cron.CronJob(
          "*/5 * * * *",
          () => {
              console.log('on tick',new Date());
                  
              SourceableMailer.customMail();
          },
          () => {
            console.log("error!!");
          },
          true,
          "Asia/Kolkata",
          {},
          false
        );
        
        task.start();
    }
    static sendMail(user){
      if(user.onboarding===true){
      let task = new cron.CronJob(
          "0 0 */3 * *",
          () => {
              console.log('on tick',new Date());
                  
              // SourceableMailer.UnregisterMail(user);
          },
          () => {
            console.log("error!!");
          },
          true,
          "Asia/Kolkata",
          {},
          false
        );
        
        task.start();}
       
      
    }
  
}

export default Cron;