/**
 * Created by Ori Iscovici on 9/3/2016.
 */
//load the module

var exports = module.exports = {};
var nodemailer = require('nodemailer');
var constants = require('./../config/constants.js');
//create the transport
var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configEmail.username,
        pass: configEmail.password
    },
    tls: { rejectUnauthorized: false }
});

exports.sendConfirmEmail = function (clientEmailAddress, randomHash) {


var options = {
    from: configEmail.username,
    to: clientEmailAddress,
    // to: 'alon.wrk@gmail.com',
    subject: 'Hello Hello! Welcome to chew the rag',
    text: "this is plain text body",
    html: "<h1 style='color: dodgerblue; box-shadow: 1px 1px 3px black'>Confirm your email below</h1>" +
    "\n <p>Thanks Bye, chew the rag crew</p>" +
    "\n <p>" +
    // "<a href="127.0.0.1:8080/auth/confirm_email/' + clientEmailAddress + '/' + randomHash + '">Confirm</a> " +
    "<a href='http://127.0.0.1:8080/auth/confirm_email/" + clientEmailAddress +"/"+ randomHash +"'>Confirm</a>"


};
      console.log('send confirm email hello');
        transport.sendMail(options, function(err, info){
            if (err){
                console.log(err);
            }else {
                console.log(info);
            }

        });

    };

exports.sendResetPasswordEmail = function (clientEmailAddress, randomHash) {


    var options = {
        from: configEmail.username,
        to: clientEmailAddress,
        // to: 'alon.wrk@gmail.com',
        subject: 'Confirm request to reset your password',
        text: "this is plain text body",
        html: "<h1 style='color: dodgerblue; box-shadow: 1px 1px 3px black'>Confirm by clicking the link below</h1>" +
        "\n <p>Thanks Bye, chew the rag crew</p>" +
        "\n <p>" +
        // "<a href="127.0.0.1:8080/auth/confirm_email/' + clientEmailAddress + '/' + randomHash + '">Confirm</a> " +
        "<a href='http://127.0.0.1:8080/auth/confirm_reset_email/" + clientEmailAddress +"/"+ randomHash +"'>Please take me to reset my password</a>"


    };
    console.log('send reset password email hello');
    transport.sendMail(options, function(err, info){
        if (err){
            console.log(err);
        }else {
            console.log(info);
        }

    });

};
