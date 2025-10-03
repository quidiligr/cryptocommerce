"use strict";
//const nodemailer = require('nodemailer');
//const smtpTransport = require('nodemailer-smtp-transport');
//const config = require('../common/config/config')
//const myutils =  require('../common/services/myutils.service')
const config = require('../config/config')
const monk = require('monk')
const db = monk(config.kMongoDb)
const emaillogsTable = db.get('emaillogs') 
const contactusTable = db.get('contactus') 

const nodemailer = require("nodemailer");
const util = require('util');


async function wrapedSendMail(mailOptions){
    console.log(`17: wrapedSendMail mailOptions= ${JSON.stringify(mailOptions,null,4)}`)
    return new Promise((resolve,reject)=>{
    //let transporter = nodemailer.createTransport({//settings});
    
    
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'cryptibuy2024@gmail.com',
    pass: 'lwbddhkktmzfhqpd', //'Cryptibuy2024!!!',
  },
});
transporter.verify().then(console.log).catch(console.error);
    /*
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cryptibuy2024@gmail.com',
              pass: 'Cryptibuy2024!!!',
            },
          });
          */

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("error is "+error);
            resolve(false); // or use rejcet(false) but then you will have to handle errors
            } 
        else {
            console.log('Email sent: ' + info.response);
            resolve(true);
            }
        });
    })
}
exports.send2 = async function(mailInfo){

  var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport ({
  host: 'mail.prsdoctors.com',
  //added in the /etc/localhosts
  //host: 'mail', 
  
  secureConnection: true,
  port: 587,
  //port: 25,
  auth: {
        user: '',
        pass: ''
  }
}));


  
  var mailOptions = {
    from: mailInfo.from, //'Admin <admin@sharecle.com>',
    to: mailInfo.to,//'rquidilig@gmail.com',
    subject: mailInfo.subject, //'This is a test ',
        text: mailInfo.text, //'Hello world ',
        html: mailInfo.html,//'<b>Hello world </b>',
        tls: {
            rejectUnauthorized: false
        },
    };
/*
transporter.sendMail(mailOptions, function(error, info){
  if(error){
     console.log(error);
     return {status:400}
  }else{
  console.log('Message sent: ' + info.response);
  return {status:200}
  }
});
*/
  var bc = util.promisify(transporter.sendMail)//util.promisify(req.files.photo.mv)
  let result = await transporter.sendMail(mailOptions)
  console.log(`send2() result= ${JSON.stringify(result)}`)
  if(result.error){
      console.log(`exports.send2() ${JSON.stringify(result.error)}`);
      return {statusCode:500}
   }else{
   //console.log('Message sent: ' + result.info.response);
   console.log('Message sent: ');
   return {statusCode:200}
   }
}



exports.send3 = async function(mailInfo){

    try{

    
    var mailOptions = {
      from: mailInfo.from, //'Admin <admin@sharecle.com>',
      to: mailInfo.to,//'rquidilig@gmail.com',
      subject: mailInfo.subject, //'This is a test ',
        //text: mailInfo.text, //'Hello world ',
        //html: mailInfo.html,//'<b>Hello world </b>',
        //tls: {
        //    rejectUnauthorized: false
        //},
      };

      if(mailInfo.body['text'] != null && mailInfo.body.text.length > 0){
          mailOptions.text = mailInfo.body.text
      }
      if(mailInfo.body['html'] != null && mailInfo.body.html.length > 0){
        mailOptions.html = mailInfo.body.html
    }
  /*
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
       console.log(error);
       return {status:400}
    }else{
    console.log('Message sent: ' + info.response);
    return {status:200}
    }
  });
  */
 /*
    var bc = util.promisify(transporter.sendMail)//util.promisify(req.files.photo.mv)
    let result = await transporter.sendMail(mailOptions)
    console.log(`send2() result= ${JSON.stringify(result)}`)
    if(result.error){
        console.log(`exports.send2() ${JSON.stringify(result.error)}`);
        return {statusCode:500}
     }else{
     //console.log('Message sent: ' + result.info.response);
     console.log('Message sent: ');
     return {statusCode:200}
     }
     */

/*
     transporter.sendMail({
        from: `"Cryptibuy" <cryptibuy2024@gmail.com>`, // sender address
        to: mailInfo.to, // list of receivers
        subject: mailInfo.subject, // Subject line
        text: mailInfo.text, // plain text body
        html: mailInfo.html, // html body
      }).then(info => {
        console.log({info});
      }).catch(console.error);
*/
//var bc = util.promisify(transporter.sendMail)
//let result = await bc.sendMail(mailOptions)
/*let result = await wrapedSendMail(mailOptions)
    console.log(`send3() result= ${JSON.stringify(result)}`)
    if(result.error){
        console.log(`exports.send3() ${JSON.stringify(result.error)}`);
        return {statusCode:500}
     }else{
     //console.log('Message sent: ' + result.info.response);
     console.log('Message sent: ');
     return {statusCode:200}
     }
*/
     let resp= await wrapedSendMail(mailOptions);
     
  // log or process resp;
  console.log(`184: sendMail3() resp= ${JSON.stringify(resp)}`)
   return {statusCode:200};

    }
    catch(ex){
      console.log(`116: send3() ex= ${ex.stack}`)
    }
    
    return {statusCode:500}
  }
  
exports.contactus = async function(contactus_info){
  let  ret = {statusCode: 200}
  if(contactus_info){
    if(contactus_info['email'] && 
    contactus_info['phone'] &&
    contactus_info['name']
    
    ){
      if(contactus_info.email.includes('@')){
        let existing = await contactusTable.find({email:contactus_info})
        if(existing){

        }
        else{
          await contactusTable.insert(contactus_info)
          ret = {statusCode: 200}
        }

      }
      
    }
  
  } 
  return ret
}