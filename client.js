
var allUsers = [];
var nick;
var name;

hideContent();
var ajaxRequest = function (options) {
    var url = options.url || '/';
    var method = options.method || 'GET';
    var callback = options.callback || function () { };
    var data = options.data || {};
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.status == 200 && xmlHttp.readyState === 4) {
            callback(xmlHttp.responseText);
        }
    };
};

(function () {
    var getData = function () {
        ajaxRequest({
            url: '/messages',
            method: 'GET',
            callback: function (msg) {
                console.log(msg)
                msg = JSON.parse(msg);
                document.getElementById('messages').innerHTML = '';
                document.getElementById('usersList').innerHTML = '';
                allUsers = [];
                msg.map(message => {
                    if (allUsers.length > 0) {
                        if (allUsers.filter(function (e) { return e.name === message.user.name; }).length === 0) { allUsers.push(message.user); }
                    }
                    else { allUsers.push(message.user); }
                    let text = message.text;
                    const userInText = text.match(new RegExp(/@(\S+)/g));
                    if (userInText && userInText[0] && userInText[0].substr(1, (userInText[0].length - 1)) === nick) {
                        addSelectedMessage(message.text, message.user.name);
                    } else { addMessage(message.text, message.user.name); }
                });
                allUsers.forEach(user => {
                    addUser(user.name, user.nick, "online")
                });
            }
        })
    }
    getData();
    setInterval(function () { getData(); }, 1000);
})()

function hideContent() {
    document.getElementsByClassName('container main-section')[0].style.visibility = 'hidden';
    document.getElementsByClassName('input-group searchbox')[0].style.visibility = 'hidden';
}

function userRegistered() {
    document.getElementsByClassName('container main-section')[0].style.visibility = 'visible';
    name = document.getElementById("username").value
    nick = document.getElementById("pass").value
    if (name === "" || nick === "") { document.getElementsByClassName('container main-section')[0].style.visibility = 'hidden'; } else {
        updateHeader(name, nick)
    }
}
function updateHeader(name, nick) {
    var userNameText = document.getElementById('currentUsreName');
    userNameText.innerHTML = name;

    var userNickText = document.getElementById('currentNick');
    userNickText.innerHTML = "@" + nick;

}
function createNode(element, className) {
    let node = document.createElement(element);
    node.className = className;
    return node;
}
function append(parent, el) {
    return parent.appendChild(el);
}
function createCirculeWITHlable() {
    let node = document.createElement('i');
    node.className = "fa fa-circle";
    node.setAttribute("aria-hidden", "true");
    return node
}
function addUser(username, nickName, isOnline) {
    const ul = document.getElementById('usersList'); currentUsreName
    let div1 = createNode('div', "chat-left-img");
    let userImage = createNode('img', "image");
    userImage.src = "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX28408818.jpg";
    append(div1, userImage);
    let div2 = createNode('div', "chat-left-detail");
    let name = createNode('p', "title class");
    name.innerHTML = username;
    let onlineSpan = createNode('span', "span class");
    onlineSpan.innerHTML = isOnline + "..."
    let nick = createNode('p', "title class");
    nick.innerHTML = '@' + nickName;
    append(onlineSpan, createCirculeWITHlable())
    append(onlineSpan, nick)
    append(div2, name);
    append(div2, onlineSpan);
    let listItem = createNode('li', "userItem");
    append(listItem, div1);
    append(listItem, div2);
    append(ul, listItem);
}

function addSelectedMessage(message, username) {
    var ulMessages = document.getElementById('messages');
    let div1 = createNode('div', "rightside-right-chat");
    let userNameSpan = createNode('span', "span class");
    userNameSpan.innerHTML = username + "..."
    append(userNameSpan, createCirculeWITHlable())
    let text = createNode('p', "message");
    text.innerHTML = message;
    append(div1, userNameSpan);
    append(div1, createNode('br', "br"))
    append(div1, createNode('br', "br"))
    append(div1, text);
    let listItem = createNode('li', "userItem");
    append(listItem, div1);
    append(ulMessages, listItem);
}


function addMessage(message, username) {
    var ulMessages = document.getElementById('messages');
    let div1 = createNode('div', "rightside-left-chat");
    let userNameSpan = createNode('span', "span class");
    userNameSpan.innerHTML = username + "..."
    append(userNameSpan, createCirculeWITHlable())
    let text = createNode('p', "message");
    text.innerHTML = message;
    append(div1, userNameSpan);
    append(div1, createNode('br', "br"))
    append(div1, createNode('br', "br"))
    append(div1, text);
    let listItem = createNode('li', "userItem");
    append(listItem, div1);
    append(ulMessages, listItem);
}

function sendChatMessage() {
    let text = document.getElementById("messageToSent")
    var data = {
        user: { nick: nick, name: name },
        text: text.value
    }
    text.value = '';

    ajaxRequest({
        method: "POST",
        url: '/messages',
        data: data
    })
}

