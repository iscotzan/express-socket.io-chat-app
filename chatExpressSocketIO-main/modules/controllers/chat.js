var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dest = './.tmp/uploads';
        console.log(dest);
        callback(null, dest);

    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }

});
var limits = {fileSize: 1048576};
var upload = multer({ storage : storage, limits : limits}).single('userPhoto');


router.post('/photo',function(req,res){
    upload(req,res,function(err) {

        if(err) {
            return res.end("Error uploading file.");
        }else {
        console.log('/photo req body: ');
        console.log(req.body);
        var path = req.file.path;
        var originalName = req.file.originalname;
        var fileName = req.file.filename;
        var fileSize = req.file.size;
        var f_u_id = req.session.userData.u_id;
        var f_u_nickname = req.body.u_pseudo;
        var f_u_color = req.body.u_color4others;


        var fileDbData = {
            f_u_id: f_u_id,
            f_u_nickname: f_u_nickname,
            f_u_color: f_u_color,
            img_filename: fileName,
            img_originalname: originalName,
            img_path: path,
            filesize: fileSize,
            img_banned: '0'
        };
        //console.log(req.files.filename);
        //also, update database with filepath
        con.query("INSERT INTO files SET ?", fileDbData, function(err, result) {
            if (err) {
                //print the error to the console
                console.error(err);
            } else {
                var updateHistory = {img_fk:result.insertId, type: 'image'};
                con.query("INSERT INTO history SET ?", updateHistory, function(err, result) {
                    //
                    //    res.json({
                    //    id: result.insertId,
                    //    success: true
                    //});
                    if (err) {
                        //print the error to the consle
                        console.error(err);
                        //send false to the user
                        res.send(JSON.stringify({
                            success: false
                        }));
                    } else {
                        //success
                        //res.json({
                        //    id: result.insertId,
                        //    success: true
                        //});
                    }
                });
            }
        });

        res.end("File is uploaded");
        //res.json({
        //    success: true
        //});
        }
    });
});

router.get('/getNewImage', function (req, res) {
    con.query("SELECT * FROM files ORDER BY img_id DESC LIMIT 1", function(err, result) {
        if (err) {
            //print the error to the consle
            console.error(err);
        } else {
            res.send(result);
        }
    });
});

// serve the chat file to logged in users
router.get('/chat', function(req, res) {
    //if the user is not logged in do not serve the file
    if (!req.session.userData && false) {
        //res.json({
        //    success: false,
        //    error: 'not logged in'
        //});
        res.render(BASE_PATH + '/views/index.ejs');
    } else {
        // router.u_username = req.session.userData.u_email;
        if (req.session.userData.rememberMe != false){
            //session now knows that user is to be redirected to chat automatically.
            req.session.userData.rememberMe = true;
        }
        res.render(BASE_PATH + '/views/pages/chat.ejs', {resetPage: false});
    }
});

router.post('/chatNoRemember', function(req, res){
   console.log(req.body);
    if (!req.session.userData && false) {
        res.render(BASE_PATH + '/views/index.ejs');
    } else {
        // router.u_username = req.session.userData.u_email;
        var username = req.session.userData.u_username;
        console.log(username);
        //req.session.userData = {};
        req.session.userData.u_username = username;
        req.session.userData.rememberMe = false;
        console.log(req.session.userData);
        res.json({
            success: true
        });
    }
});

router.get('/userSessionData', function (req, res) {
    var data = req.session.userData;
    // if (data.u_password != 'undefined'){
     data.u_password = null;
    // }
    //if (data.rememberMe == false){
    //    console.log('but why like this')
    //}
    console.log(data);
    res.send(data);
    // return data;
});

router.get('/getMessageHistory', function (req, res) {
    //define how much history of messages do we want to get from the db
    //TODO: image messages also need to have a m_id or joined by date to get joined by this query and pulled as history.


    //SELECT history.history_id, chat_messages.*, files.*
    //FROM history
    //LEFT JOIN chat_messages
    //ON history.m_fk = chat_messages.m_id
    //LEFT JOIN files
    //ON history.img_fk = files.img_id

    var historyLimit = 50;
    con.query(
        "SELECT * FROM " +
        "(SELECT history.history_id, chat_messages.*, files.*" +
        " FROM history" +
        " LEFT JOIN chat_messages" +
        " ON history.m_fk = chat_messages.m_id" +
        " LEFT JOIN files" +
        " ON history.img_fk = files.img_id" +
        " ORDER BY history.history_id DESC LIMIT "
        +historyLimit+ ")" +
        "sub ORDER BY history_id ASC", function(err, result) {
        //con.query("SELECT * FROM (SELECT * FROM chat_messages ORDER BY m_id DESC LIMIT "
        //+historyLimit+ ")sub ORDER BY m_id ASC", function(err, result) {
        if (err) {
            //print the error to the consle
            console.error(err);
        } else {
            res.send(result);
        }
    });
});


router.post('/newMessage', function (req, res) {
    // req.body is a JSON object that will be populated into the insert
    // console.log(req.body);
    con.query("INSERT INTO chat_messages SET ?", req.body, function(err, result) {

        if (err) {
            //print the error to the consle
            console.error(err);
            //send false to the user
            res.send(JSON.stringify({
                success: false
            }));
        } else {
                var updateHistory = {m_fk:result.insertId, type: 'text'};
            con.query("INSERT INTO history SET ?", updateHistory, function(err, result) {
                //
                //    res.json({
                //    id: result.insertId,
                //    success: true
                //});
                if (err) {
                    //print the error to the consle
                    console.error(err);
                    //send false to the user
                    res.send(JSON.stringify({
                        success: false
                    }));
                } else {
                    //success
                    res.json({
                            id: result.insertId,
                            success: true
                        });
                }
            });
        }
    });
});


module.exports = router;
