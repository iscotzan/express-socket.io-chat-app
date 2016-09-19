/**
 * Created by Ori Iscovici on 9/1/2016.
 */

//Init variables & general settings

var messageContainer, submitButton;
var thisUserData = {};
var messageHistory = {};
var thisUserId;
var pseudoModalInitiated = false;
var pseudo = '';
var pseudoColor = 'springgreen';
var pseudoColorForOthers = '';
var baseChatAddress = 'localhost:8080';
var colorsSelction = [
    'blue',
    'pink',
    'red',
    'yellow',
    'dodgerblue',
    'orange',
    'brown',
    'green',
    'purple',
    '#0e90d2',
    '#1CA347',
    '#1f6377',
    '#5bc0de',
    'violet',
    'mediumvioletred',
    'tomato',
    'chartreuse'
];

var chatEntries = $('chatEntries');



// Init
$(function() {

    messageContainer = $('#messageInput');
    submitButton = $("#submit");
    bindButton();
    window.setInterval(time, 1000*10);
    $("#alertPseudoNick").hide();
    //
    $("#pseudoSubmit").click(function() {
        setPseudo();
    });
    $('#chatEntries').slimscroll({
        color: '#00f',
        size: '10px',
        height: '50px',
        start: 'bottom'
    });
    submitButton.click(function() {sentMessage();});
    // setHeight();
    messageContainer.keypress(function (e) {
        if (e.which == 13) {sentMessage();}});

    $('#modalPseudo').keypress(function(e){
       if (e.which == 13){setPseudo();}
    });

    //logoutbtn
    $('#logoutNavLink').on('click', function () {
        $.get('/auth/destroy_session').then(function(){
            disconnect();
        });
    });
    var image;

    $('#uploadForm').submit(function() {
        //submitImage();
        image = $('#imageFile').get(0).files[0];
        console.log(image);
        //addImage(image, "Me", pseudoColor, new Date().toISOString(), true);
        $("#status").empty().text("File is uploading...");
        $(this).ajaxSubmit({

            error: function(xhr) {
                status('Error: ' + xhr.status);
                console.log(xhr.status)
            },

            success: function(response) {
                if (response == 'Error uploading file.'){
                    $("#status").empty().text('file is too big | Max 1mb');
                    console.log('file too big or problematic, mission aborted');
                    }else{
                    console.log(response);
                    $("#status").empty().text(response);
                    $('#imageFile').empty();
                        $.get('/chat/getNewImage', function(response){
                            console.log(response);
                            var imagePath = response[0].img_path;
                            var originalName = response[0].img_originalname;
                            var u_id = response[0].u_id;
                            var creation_date = response[0].img_create_date;
                            var f_u_nickname = response[0].f_u_nickname;
                            var f_u_color = response[0].f_u_color;
                            var newImage = {
                                imagePath: imagePath,
                                originalName: originalName,
                                u_id:u_id,
                                create_date:creation_date,
                                f_u_nickname: f_u_nickname,
                                f_u_color: f_u_color
                            };
                            console.log(newImage);
                        }).then(function (newImage) {
                        socket.emit('newImage', newImage);
                    });
                }
            }
        });
        //Very important line, it disable the page refresh.
        return false;
    });

    //scroll down reassurance
    setTimeout(function(){ scrollDown(); }, 250);

});

//Socket.io
var socket = io.connect();
socket.on('connect', function() {
    console.log('connected');
        // $.when(populateUserData()).done(function () {
        //     console.log(thisUserData);
        //     $('#modalPseudo').modal('show');
        // });
    // console.log(thisUserData);
    // console.log(thisUserData.u_username);
    // console.log('now modal pseudo is shown');
    // $('#modalPseudo').modal('show');

    getUserData();    // getUserData();
    getMessageHistory();
});
socket.on('nbUsers', function(msg) {
    $("#nbUsers").html(msg.nb);
});
socket.on('disabledColors', function(colorsArr){
    // console.log(colorsArr);
});
socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo'], data['pseudoColor'] , new Date().toISOString(), false);
});
socket.on('image', function (data) {
    var self = data['pseudo'] == pseudo;
    console.log('on image script: ');
    console.log(data);
    console.log(data['image_path']);
    if (self){
    addImage(data['image_path'],data['image_alt'], 'Me', pseudoColor , new Date().toISOString(), self);
    }else {
    addImage(data['image_path'],data['image_alt'], data['pseudo'], data['pseudoColor'] , new Date().toISOString(), self);
    }
});

//Help functions

function sentMessage() {
    if (messageContainer.val() != "")
    {
        if (pseudo == "")
        {
            console.log('now pseudo modal is shown');
            $('#modalPseudo').modal('show');

        }
        else
        {
            socket.emit('message', messageContainer.val());
            addMessage(messageContainer.val(), "Me", pseudoColor, new Date().toISOString(), true);
            postNewMessage(messageContainer.val(), pseudo);
            messageContainer.val('');
            submitButton.button('loading');

        }
    }
}

function addImage(image_path, image_alt, pseudo, userColor, date, self){
    var chatBox = $('#chatEntries');
    var classDiv = 'row message';
    if(self) classDiv = "row message self";
    else classDiv = "row message";
    var imageClasses = 'chatImage chatThumb img-responsive';
    if(self) imageClasses = 'chatImage chatThumb img-responsive pull-right';
    else imageClasses = 'chatImage chatThumb img-responsive';

    chatBox.append('<div class="'+classDiv+'">' +
        '<p class="infos"><span class="pseudo" style="color:' + userColor + ';">'+pseudo+'</span>,' +
        ' <time class="date" title="'+date+'">'+date+'</time></p>' +
        '<img src="../'+image_path+'" class="'+imageClasses+'" onClick=toggleImageClass(event) alt="'+image_alt+'">' +
        '</div>');
        //' <time class="date" title="'+date+'">'+date+'</time></p><p class="chatImage">' + image + '</p></div>');
    time();
    scrollDown();
}

function addMessage(msg, pseudo, userColor, date, self) {
    var chatBox = $('#chatEntries');
    var classDiv = 'row message';
    if(self) classDiv = "row message self";
    else classDiv = "row message";
    chatBox.append('<div class="'+classDiv+'">' +
        '<p class="infos"><span class="pseudo" style="color:' + userColor + ';">'+pseudo+'</span>,' +
        ' <time class="date" title="'+date+'">'+date+'</time></p><p>' + msg + '</p></div>');
    time();
    scrollDown();

}

function postNewMessage(message, nickname) {
    // console.log(message);
    // console.log(nickname);
    var jsonObj = {'m_content':message, 'm_u_id':thisUserId, 'm_u_nickname': nickname, 'u_current_color_4_others': pseudoColorForOthers};
    jsonAjax('/chat/newMessage', 'POST', jsonObj, function (response) {
        console.log('success post chat_message update');
        console.log(response);
    })

}

function bindButton() {
    submitButton.button('loading');
    messageContainer.on('input', function() {
        if (messageContainer.val() == "") submitButton.button('loading');
        else submitButton.button('reset');
    });
}
function setPseudo() {
    var pseudoNickInput = $('#pseudoNickInput');
    // // let user select color:
    // // var selectedColor = $("#colors-menu option:selected" ).text();
    var selectedColor = randomlySelectColor();
    if (pseudoNickInput.val() != "")
    {
        socket.emit('setPseudo', pseudoNickInput.val(), selectedColor, thisUserData.u_username);
        socket.on('pseudoStatus', function(data){
            console.log(pseudoNickInput.val());
            console.log(selectedColor);
            console.log(data);
            if(data == "ok" || pseudoNickInput.val() == pseudo)
            {
                $('#modalPseudo').modal('hide');
                $("#alertPseudoNick").hide();
                pseudo = pseudoNickInput.val();
                $('#messageInput').focus();//set focus on the chat's input for convenience
                $('#u_color4others').val(selectedColor);
                $('#u_pseudo').val(pseudo);
                // pseudoColor = selectedColor; //User Self color is determined at the settings at the top of this page
                pseudoColorForOthers = selectedColor;
            }else{
                $("#alertPseudoNick").slideDown();
            }
        })
    }
}
function time() {
    $("time").each(function(){
        $(this).text($.timeago($(this).attr('title')));
    });
}
function setHeight() {
    var slimScrollContainer = $(".slimScrollDiv");
    slimScrollContainer.height('603');
    slimScrollContainer.css('overflow', 'visible')
}

function randomlySelectColor() {
    return colorsSelction[Math.floor(Math.random() * colorsSelction.length)];
}

function getUserData() {
    $.get('/chat/userSessionData', function (res) {
         console.log(res);
        thisUserData = res;
        thisUserId = thisUserData.u_id;
        //getUserData should be called at least once upon new connection
        //then if the pseudoModalInitiated flag is still false,
        // we'll give the user a chance to choose a different nickname than his username.
        if (pseudoModalInitiated == false){
            document.getElementById("pseudoNickInput").value = thisUserData.u_username;
            pseudo = thisUserData.u_username;

            //show pseudo modal on entrance or -
            //$('#modalPseudo').modal('show'); ||

            //allow changing nickname but give the username as a default on entry
            $("#pseudoSubmit").trigger('click');
            pseudoModalInitiated = true;
        }
    })
}

function populateChatWithMessageHistory(){
    for (var i = 0; i < messageHistory.length; i++){
        var historicMessage = messageHistory[i];
       //check if it's an image or text
        if (historicMessage.m_u_id != null){
            //text message
            var self_message, nickname, colorToShow;
            if (historicMessage.m_u_id != thisUserId){
                self_message = false;
                nickname = historicMessage.m_u_nickname;
                colorToShow = historicMessage.u_current_color_4_others;
            }else{
                self_message = true;
                nickname = 'Me';
                colorToShow = 'springgreen';
            }
            addMessage(historicMessage.m_content, nickname, colorToShow, historicMessage.m_datetime, self_message)
        }else{
            //image message
            var self = historicMessage.f_u_id == thisUserId;
            if (self){
                addImage('/' + historicMessage.img_filename,historicMessage.img_originalname, 'Me', pseudoColor , historicMessage.img_create_date, self);
            }else {
                addImage('/' + historicMessage.img_filename,historicMessage.img_originalname, historicMessage.f_u_nickname, historicMessage.f_u_color , historicMessage.img_create_date, self);
            }
        }
        }

}

function scrollDown(){
    var chatBox = $('#chatEntries');
    var entriesDiv = document.getElementById("chatEntries");
    chatBox.scrollTop(chatBox.prop("scrollHeight"));
    chatBox.slimscroll({
        color: '#00f',
        size: '10px',
        height: '50px',
        start: 'bottom'
    });
    //chatBox.scrollTop = chatBox.scrollHeight;

}

function getMessageHistory() {
    $.get('/chat/getMessageHistory', function (res) {
        messageHistory = res;
        console.log(messageHistory);
        populateChatWithMessageHistory();
    });
}


function disconnect(){
    socket.emit('disconnect');
    window.location.href = baseChatAddress;
}

function toggleImageClass(event){
    var image = $(event.target);
    console.log(event.target);
    if (image.hasClass('chatThumb')){
        image.removeClass('chatThumb').addClass('chatThumbEnlarged');
        console.log('enlarging image');
    }else{
        image.removeClass('chatThumbEnlarged').addClass('chatThumb');
        console.log('thumbifying image');
    }
}

function submitImage(){

}

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

//