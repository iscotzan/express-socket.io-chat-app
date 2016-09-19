$(document).ready(function() {
    $('#login-form-link').click(function(e) {
        setTimeout(function() { $('#u_email').get(0).focus();}, 200);
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        setTimeout(function() {  $('#username').get(0).focus();}, 200);
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $('#login-submit').click(function(e) {
        login();
    });

    $('#login-form').keypress(function (e) {
        if (e.which == 13) {
            login();
        }
    });

    $('#register-submit').click(function(e) {
        register();
    });

    $('#register-form').keypress(function (e) {
        if (e.which == 13) {
            register();
        }
    });



    $('#sendResetPassEmail').on('click', function () {
        var emailInput = $('#resetEmailInput');

        if (emailInput.hasClass('inputError')) {
            console.log('will not send reset email because of class inputError');
            toastr.warning('Please correct the email address you\'ve provided before trying to submit again');
        } else {
            jsonAjax('auth/reset_password/' + emailInput.val(), 'GET', null, function (res) {
                console.log(res);

                if (res.success == true) {
                    console.log('go check your email');
                    toastr.success('Go Check Your Email', 'Success!');

                    $('#modalResetPassword').modal('hide');
                }
            });
        }
    });

    //check if email exists to notify user for picking a unique email
    var emailToReg = $('#emailreg');
        emailToReg.on('change', function() {
        //user haven't provided an email
            if (emailToReg.val() != '') {
                console.log(emailToReg.val());
                jsonAjax('auth/checkEmail/' + emailToReg.val(), 'GET', null, function (res) {
                    console.log(res);
                    if (res.exists) {
                        emailToReg.addClass('inputError');
                        console.log('Email exists');
                        toastr.options.closeButton = true;
                        toastr.warning('This email is already occupied, please choose another one.')
                    }
                });
            }
    });

    //check if email exists to notify user if the details he entered were incorrect preventing useless server requests
    var emailToResetPass = $('#resetEmailInput');
    emailToResetPass.on('change', function() {
        //user haven't provided an email
        if (emailToResetPass.val() != '') {
            console.log(emailToResetPass.val());
            jsonAjax('auth/checkEmail/' + emailToResetPass.val(), 'GET', null, function (res) {
                console.log(res);
                if (!res.exists) {
                    emailToResetPass.addClass('inputError');
                    console.log('Email does not exist in our db');
                    toastr.options.closeButton = true;
                    toastr.warning('This email is a no speaking english to us. we don\'t recognize it');


                }else{
                    emailToResetPass.removeClass('inputError');
                }
            });
        }
    });

    var usernameToReg = $('#username');
    usernameToReg.on('change', function() {
        //user haven't provided an email
        if (usernameToReg.val() != '') {
            console.log(usernameToReg.val());
            jsonAjax('auth/checkUsername/' + usernameToReg.val(), 'GET', null, function (res) {
                console.log(res);
                if (res.exists) {
                    usernameToReg.addClass('inputError');
                    console.log('Username exists');
                    toastr.warning('This username is already occupied, sorry, please choose another one.')

                }
            });
        }
    });


    function register(){
        //TODO: validate the form
        //create a json object from the form
        var jsonObj = formToJson('#register-form');
        //send the json object to the server
        jsonAjax("/auth/register", "POST", jsonObj, function(res) {
            //on success show the login form
            console.log(res);
            //if (res.success == true){
            $('#login-form-link').click();
                toastr.success('The chat awaits your email confirmation :)', 'Success!');
            //}
        });
    }



function login(){
    //TODO: validate the form
    //create a json object from the form
    var jsonObj = formToJson('#login-form');
    var remeber = $('#remember').is(':checked');
    var loginObj = {u_email:jsonObj.u_log_email, u_password:jsonObj.u_log_password, rememberMe:remeber};
    console.log(loginObj);
    //send the json object to the server
    jsonAjax("/auth/login", "POST", loginObj, function(res) {
        if (res.success) {
            //login is success redirect to chat
            if (res.rememberMe == true){
                console.log('you will be remembered yay');
                location.href = "/chat/chat";
            }else{
                console.log('you will be forgotten :(');
                jsonAjax('/chat/chatNoRemember', "POST", {rememberMe:false}, function(result){
                    if (result.success){
                        location.href = "/chat/chat";
                    }
                });
            }
        } else {
            //TODO: add login failed message
            toastr.warning('Email or Password are incorrect', 'Login failed');
        }
    });
}
});
function formToJson(formSelector) {
    var data = {};
    $(formSelector).serializeArray().map(function(x) {
        data[x.name] = x.value;
    });
    return data;
}
/**
 * json ajax wrapper. this function is a jquery ajax quicky
 */
function jsonAjax(url, method, jsonObj, successCB) {
    $.ajax({
        type: method,
        url: url,
        data: jsonObj ? JSON.stringify(jsonObj) : null,
        contentType: "application/json; charset=UTF-8",
        datatype: "json",
        success: successCB,
        error: function() {

        }
    });
}


//this section is for after resetting the password, determines what happened there -
// and displays an according message to the user.

$( document ).ready(function() {
    var referrer = document.referrer;
    if(referrer.split("_email")[0] == 'http://127.0.0.1:8080/auth/confirm_reset' && window.location.search == '?c'
        ||
        referrer.split("_email")[0] == 'http://localhost:8080/auth/confirm_reset' && window.location.search == '?c'
    ){
        toastr.success('Your new password is set', 'Success!');
        console.log('came from reset password page after success');
    }else if(referrer.split("_email")[0] == 'http://127.0.0.1:8080/auth/confirm_reset' && window.location.search == '?nope'
        ||
        referrer.split("_email")[0] == 'http://localhost:8080/auth/confirm_reset' && window.location.search == '?nope'
    ){
        toastr.error('Inconceivable! please re-send a reset-password email to try again', 'Oops');
        console.log('came from reset password page after error');
    }
    //    console.log(referrer.split("_email")[0]);
    //}
});

