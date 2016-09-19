/**
 * Created by Ori Iscovici on 9/4/2016.
 */




$('#setNewPass').on('click', function (){
    var newPassword = $('#newPassword').val();
    console.log(newPassword);
    var jsonObj = {'new_pass': newPassword};
    jsonAjax('/auth/setNewPass','POST',jsonObj, function (result){
        console.log(result);
        if (result.success == true){
            //password changed successfully{
            window.location = 'http://localhost:8080?c';
//                 toastr.success('Your new password is set', 'Success!');
//                 newPassword = "";
//                    $('#loginNavLink').removeClass('hidden').addClass('hvr-pulse-grow');

        }else
        {
            //refresh page, please try again
//                location.reload();
            //display some error message to retry
            window.location = 'http://localhost:8080?nope';
            //error will be displayed upon arrival
        }
    });
});


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




//function to extract url params with javascript only
function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
// gup('q', 'hxxp://example.com/?q=abc')

  
console.log('reset password script is alive');
// $("input[type=password]").keyup(function(){
//     var ucase = new RegExp("[A-Z]+");
//     var lcase = new RegExp("[a-z]+");
//     var num = new RegExp("[0-9]+");
//
//     if($("#password1").val().length >= 6){
//         $("#8char").removeClass("glyphicon-remove");
//         $("#8char").addClass("glyphicon-ok");
//         $("#8char").css("color","#00A41E");
//     }else{
//         $("#8char").removeClass("glyphicon-ok");
//         $("#8char").addClass("glyphicon-remove");
//         $("#8char").css("color","#FF0004");
//     }
//
//     if(ucase.test($("#password1").val())){
//         $("#ucase").removeClass("glyphicon-remove");
//         $("#ucase").addClass("glyphicon-ok");
//         $("#ucase").css("color","#00A41E");
//     }else{
//         $("#ucase").removeClass("glyphicon-ok");
//         $("#ucase").addClass("glyphicon-remove");
//         $("#ucase").css("color","#FF0004");
//     }
//
//     if(lcase.test($("#password1").val())){
//         $("#lcase").removeClass("glyphicon-remove");
//         $("#lcase").addClass("glyphicon-ok");
//         $("#lcase").css("color","#00A41E");
//     }else{
//         $("#lcase").removeClass("glyphicon-ok");
//         $("#lcase").addClass("glyphicon-remove");
//         $("#lcase").css("color","#FF0004");
//     }
//
//     if(num.test($("#password1").val())){
//         $("#num").removeClass("glyphicon-remove");
//         $("#num").addClass("glyphicon-ok");
//         $("#num").css("color","#00A41E");
//     }else{
//         $("#num").removeClass("glyphicon-ok");
//         $("#num").addClass("glyphicon-remove");
//         $("#num").css("color","#FF0004");
//     }
//
//     if($("#password1").val() == $("#password2").val()){
//         $("#pwmatch").removeClass("glyphicon-remove");
//         $("#pwmatch").addClass("glyphicon-ok");
//         $("#pwmatch").css("color","#00A41E");
//     }else{
//         $("#pwmatch").removeClass("glyphicon-ok");
//         $("#pwmatch").addClass("glyphicon-remove");
//         $("#pwmatch").css("color","#FF0004");
//     }
// });

