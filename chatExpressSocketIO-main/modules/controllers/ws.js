
exports = module.exports = function(io) {

var pseudoArray = ['admin']; //block the admin username (you can disable it)
var colorsArray = []; //allow choosing from default available colors


    var users = 0; //count the users

    // Handle the socket.io connections
    io.sockets.on('connection', function (socket) { // First connection
        users += 1; // Add 1 to the count
        reloadUsers(); // Send the count to all the users
        sendDisabledColorsArray();

        socket.on('image', function(data){
            if (pseudoSet(socket)) {
                var transmit = {
                    date: new Date().toISOString(),
                    pseudo: socket.nickname,
                    pseudoColor: socket.color,
                    message: data
                };
                socket.broadcast.emit('image', transmit);
                console.log("user " + transmit['pseudo'] + " said \"" + data + "\"");
            }
        });

        socket.on('newImage', function(newImage){
           //new image has been added to the server
            //get image link from db
            console.log('new image obj from the ws ctrl: ');
            var image_path = newImage[0].img_path;
            console.log(newImage[0]);
            //console.log(image_path);
            //we only need the /filename from the path
            var split_image_path = image_path.replace('.tmp\\uploads', '');
            //console.log(split_image_path);
            //insert image into var
            //prepare the transmit
            var transmit = {
                image_path: split_image_path,
                image_alt: newImage[0].img_originalname,
                date: new Date().toISOString(),
                pseudo: socket.nickname,
                pseudoColor: socket.color
            };
            socket.emit('image', transmit);
            socket.broadcast.emit('image', transmit);
        });

        socket.on('message', function (data) { // Broadcast the message to all
            if (pseudoSet(socket)) {
                var transmit = {
                    date: new Date().toISOString(),
                    pseudo: socket.nickname,
                    pseudoColor: socket.color,
                    message: data
                };

                socket.broadcast.emit('message', transmit);
                console.log("user " + transmit['pseudo'] + " said \"" + data + "\"");
            }
        });
        socket.on('setPseudo', function (nick, color, realUserName) { // Assign a name to the user
            if (pseudoArray.indexOf(nick) == -1) // Test if the name is already taken
            {
                pseudoArray.push(nick);
                colorsArray.push(color);
                socket.nickname = nick;
                socket.color = color;
                socket.emit('pseudoStatus', 'ok');
                console.log("user " + realUserName + " connected with the nickname " + nick);
            }
            else {
                socket.emit('pseudoStatus', 'error'); // Send the error
            }
        });
        socket.on('disconnect', function () { // Disconnection of the client
            socket.disconnect();
            users -= 1;
            reloadUsers();
            if (pseudoSet(socket)) {
                console.log("disconnect...");
                var pseudo;
                pseudo = socket.nickname;
                var index = pseudoArray.indexOf(pseudo);
                pseudo.slice(index - 1, 1);

                var pseudoColor;
                pseudoColor = socket.color;
                var colorIndex = colorsArray.indexOf(pseudoColor);
                pseudoColor.slice(colorIndex - 1, 1);

            }
        });
    });

    function sendDisabledColorsArray() {
        io.sockets.emit('disabledColors', colorsArray);
    }

    function reloadUsers() { // Send the count of the users to all
        io.sockets.emit('nbUsers', {"nb": users});
    }

    function pseudoSet(socket) { // Test if the user has a name
        var test;
        if (socket.nickname == null) test = false;
        else test = true;
        return test;
    }
};