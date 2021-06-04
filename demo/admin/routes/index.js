var express = require('express');
var router = express.Router();
var path = require('path');
var ResumeParser = require('resume-parser');


router.get('/',(req, res, next)=>{
	res.render('index.html');
});

router.post('/',(req, res, next)=>{
    var { name, mv, data } = req.files.files;
    
    mv(path.join(__dirname,'../../files',name), (err)=>{
        if(err) {
            return res.json({
                error: true,
                message: 'Error in uploading file'
            });
        }
        ResumeParser
        .parseResumeFile(path.join(__dirname,'../../files',name), path.join(__dirname,'../../files/compiled')) // input file, output dir
        .then(file => {
            console.log("Yay! " + file);
            fs.readFile(path.join(__dirname,'../../files/compiled',`${name}.json`),'utf8',(err, data)=>{
                if(err) {
                    return res.json({
                        error: true,
                        message: 'Error Occured'
                    });
                }
                res.json({ 
                    error: false,
                    message:"Results",
                    data: JSON.parse(data)
                });
                fs.unlink(path.join(__dirname,'../../files',name),(err)=>{
                    if(err) {
                        console.log(`Error Occured in deleting ${name}`);
                    }
                    fs.unlink(path.join(__dirname,'../../files/compiled',`${name}.json`),(err)=>{
                        if(err) {
                            console.log(`Error Occured in deleting ${name}.json`);
                        }
                    });
                });
            });
        })
        .catch(error => {
            console.error(error);
        });
    });
});

module.exports = router;