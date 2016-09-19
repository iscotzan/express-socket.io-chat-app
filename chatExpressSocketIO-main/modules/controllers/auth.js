var express = require('express');
var router = express.Router();
module.exports = router;
var mailCtrl = require('./mail');
var crypto = require('crypto');
var appBaseUrl = 'http://127.0.0.1:8080';
var passwordHash = require('password-hash');


router.post('/register', function(req, res) {
    // req.body is a JSON object that will be populated into the insert
    // con.query('INSERT INTO users SET ?', [req.body], function(err, result) {
    var randomHash = crypto.randomBytes(20).toString('hex');
    var hashedPassword = passwordHash.generate(req.body.u_password);
    console.log(hashedPassword);

    var newUser = {
        u_email:req.body.u_email,
        u_password: hashedPassword,
        u_username:req.body.u_username,
        u_reg_hash: randomHash};
    con.query("INSERT INTO users SET ?" , newUser , function(err, result) {
        // should be translated to:
        // INSERT INTO users SET name="demo",email="demo@domain.com",password="1234"
        if (err) {
            //print the error to the consle
            console.error(err);
            //send false to the user
            res.send(JSON.stringify({
                success: false
            }));
        } else {
            //send confirmation mail
            mailCtrl.sendConfirmEmail(req.body.u_email, randomHash);
            //send success notice back to index.js
            res.send(JSON.stringify({
                id: result.insertId,
                success: true
            })
        )}
    });
});

router.post('/check', function(req, res) {
    res.json({
        success: typeof req.session.userData === 'Object'
    });
});


//this route will confirm email from the link included in the client's mail
router.get('/confirm_email/:user_email/:hash', function (req, res) {
    var email = req.params.user_email;
    var hash = req.params.hash;
    console.log(email);
    console.log(hash);

    //search for the clients email in the db and the hash provided by the links params
    con.query("SELECT u_email FROM users WHERE u_email=? AND u_reg_hash=?", [email, hash], function(err, result) {
        if (err) {
            //print the error to the console
            console.error(err);
        } else {
            console.log(result);
            //check if we found someone with this exact email and hash, if so,
            // send update query to db to mark client as confirmed.
            if(result.length > 0){
                //fields that will be updated are stored in this json object variable.
            var emailConfirmed = {u_reg_hash : 0, u_verified : '1'};
                console.log('so far so good');
                con.query("UPDATE users SET ? WHERE ?" , [emailConfirmed, {u_email:email}] , function(err, result) {

                    // should be translated to:
                    // INSERT INTO users SET name="demo",email="demo@domain.com",password="1234"
                    if (err) {
                        //print the error to the consle
                        console.error(err);
                        //send false to the user
                        res.send(JSON.stringify({
                            successVerified: false
                        }));
                    }else {
                        //send success notice back to index.js
                        console.log('user: ' + email + ' now verified');

                        // res.redirect(appBaseUrl + '/auth/verified');
                        res.redirect(appBaseUrl);
                    }
                });
            }
        }
    });

});

router.get('/verified', function(req, res) {
    //TODO: find a way to display verified message to client, explore done.js-connectFlash-jade-EJS

});

// /auth/checkEmail/email@something.com
router.get('/checkEmail/:u_email', function(req, res) {
    // console.log(req.params.u_email);

    var email = req.params.u_email;
    con.query("SELECT u_email FROM users WHERE u_email=?", email, function(err, result) {
        if (err) {
            //print the error to the console
            console.error(err);
        } else {
            res.json({
                exists: result.length > 0 ? true : false
            });
        }
    });

});

router.get('/checkUsername/:u_username', function(req, res) {
    // console.log(req.params.u_email);

    var u_username = req.params.u_username;
    con.query("SELECT u_username FROM users WHERE u_username=?", u_username, function(err, result) {
        if (err) {
            //print the error to the console
            console.error(err);
        } else {
            res.json({
                exists: result.length > 0 ? true : false
            });
        }
    });

});


router.post('/login', function(req, res) {
    res.type('application/json; charset=UTF-8');
    //for convenient
    var data = req.body;
    var pass = data.u_password;
    console.log(data);
    // con.query("SELECT * FROM users WHERE u_email=? AND u_password=?", [data.u_email, data.u_password], function(err, result) {
    con.query("SELECT * FROM users WHERE u_email=?", [data.u_email], function(err, result) {
        // should be translated to:
        // INSERT INTO users SET name="demo",email="demo@domain.com",password="1234"
        if (err) {
            //print the error to the consle
            console.error(err);
        }
        var answer = false;
        //record had returned - and password matches - so user is logged in
        if (result.length == 1 && passwordHash.verify(pass, result[0].u_password)) {
            // console.log(passwordHash.verify(pass, result[0].u_password)); // true
            answer = true;
            //create the property userData in the session and store the user object into it
            req.session.userData = result[0]; //get the first user record
        } else { // login failed
            answer = false;
        }
        res.json({
            success: answer,
            rememberMe: data.rememberMe
        });
    });
});

router.get('/destroy_session', function (req, res) {
   req.session.destroy();
});

router.get('/reset_password/:u_email', function(req, res) {
// console.log(req.params.u_email);
var email = req.params.u_email;
    con.query("SELECT u_email FROM users WHERE u_email=?", email, function(err, result) {
        if (err) {
            //print the error to the console
            console.error(err);
        } else {
            if (result.length > 0){
                //email exists, we can send a confirm-reset email and notify user
                var randomHash = crypto.randomBytes(20).toString('hex');
                mailCtrl.sendResetPasswordEmail(email, randomHash);
                var updateHash = {u_reg_hash : randomHash};
                // console.log('so far so good');
                con.query("UPDATE users SET ? WHERE ?" , [updateHash, {u_email:email}] , function(err, result) {
                    if (err) {
                        //print the error to the consle
                        console.error(err);
                        //send false to the user
                        res.send(JSON.stringify({
                            successUpdateHash: false
                        }));
                    }else {
                        //all ready for user to go and check his email-notify
                        res.send({
                             success:true});
                    }
                });
            }else{
                //email doesn't exist, alert user
            }
        }
    });

});



router.post('/setNewPass', function (req, res) {
   // console.log(req);
    //new password is hashed before updating
    var newPass =  passwordHash.generate(req.body.new_pass);
    // console.log(req.session);
    console.log(req.session.resetData);
    if(req.session.resetData == undefined){
        console.log('reset data undefined');
        res.json({success:'noData'});
    }else{
            console.log('we got session reset data');
            var client_email = req.session.resetData.u_email;
            var client_hash = req.session.resetData.u_hash;
            // console.log(newPass);
            // console.log(client_email + ' : ' + client_hash);

        //search for the clients email in the db and the hash provided by the links params
        con.query("SELECT u_email FROM users WHERE u_email=? AND u_reg_hash=?", [client_email, client_hash], function(err, result) {
            if (err) {
                //print the error to the console
                console.error(err);
            } else {
                console.log(result);
                //check if we found someone with this exact email and hash, if so, set the new password ok.
                if(result.length > 0){
                    //user found - move is allowed, change password
                    var newRandHash = passwordHash.generate(client_hash);
                    var changeContent = {u_password: newPass, u_reg_hash: newRandHash};
                    con.query("UPDATE users SET ? WHERE ?" , [changeContent, {u_email:client_email}] ,function(err, result) {
                        if (err) {
                            //print the error to the consle
                            console.error(err);
                            //send false to the user
                            res.send(JSON.stringify({
                                success: false
                            }));
                        }else {
                            //send success notice back to reset_password script
                            console.log('user: ' + client_email + ' now changed password');
                            req.session.resetData = undefined;
                            // res.redirect(appBaseUrl + '/auth/verified');
                            res.json({success: true});
                        }
                    });
                   }
            }
        });
    }
    //send success token to reset password script and from there, redirect to login page
});

//this route will confirm email from the link included in the client's mail
router.get('/confirm_reset_email/:user_email/:hash', function (req, res) {
    var email = req.params.user_email;
    var hash = req.params.hash;
    console.log(email);
    console.log(hash);

    //search for the clients email in the db and the hash provided by the links params
    con.query("SELECT u_email FROM users WHERE u_email=? AND u_reg_hash=?", [email, hash], function(err, result) {
        if (err) {
            //print the error to the console
            console.error(err);
        } else {
            console.log(result);
            //check if we found someone with this exact email and hash, if so,
            // send update query to db to mark client as confirmed.
            if(result.length > 0){
                //email is true, redirect to change password page
                req.session.resetData = {'u_email': email, 'u_hash':hash};
                res.render(BASE_PATH + '/views/pages/reset_password.ejs', {resetPage: true});
            }else{
                res.redirect(appBaseUrl);
            }
        }
    });
});
