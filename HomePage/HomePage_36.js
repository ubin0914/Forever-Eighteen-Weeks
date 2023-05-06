var username;
var uesrID;
var gold;
var full_energy_time;

function loading() {
    var newNode = document.createElement("div");
    newNode.id = "loading_hint";
    newNode.style = "color: white; position: absolute; right: 3vw; bottom: 3vh;";
    document.body.appendChild(newNode);
    document.getElementById("loading_hint").innerHTML = "<h1>Loading...</h1>";
    get_server_link();
}
function get_server_link(){
    $.getJSON("get_server_link.php", function (data) {
        userID = parseInt(data[0].userID);
        get_account_data();
    });
}
function get_account_data(){
    $.getJSON("get_account_data.php", function (data) {
        let item;
        for(item in data) if(data[item].userID == userID) break;
        username = data[item].username;
        gold = parseInt(data[item].gold);
        full_energy_time = parseInt(data[item].full_energy_time);
        preload();
        setTimeout(complete, 3000);
    });
}
function preload() {
    var preloadlist = [
        "images/background.png",
        "images/gold.png",
        "images/logout.png",
        "images/loc64.png",
        "images/loc21.png",
        "images/loc34.png",
        //"images/loc30.png",
        //"images/loc22.png"
    ];
    var preloadorder = [];
    var cnt = 0;
    for(var i=0; i < preloadlist.length; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = preloadlist[i];
    }
}
function complete() {
    document.body.removeChild(document.getElementById("loading_hint"));
    document.body.style = "background-color: white";
    document.getElementById("background").innerHTML = "<img class = background src = images/background.png>";
    var inner = "";
    inner += '<div style = "width: 4vw; height: 8vh; position: absolute; left: 45vw; top: 2.2vh;"><img class = fill src = "images/gold.png"></div>';
    inner += '<a href = "../UserPage/sign_in.html"><div style = "width: 5vw; height: 10vh; position: absolute; left: 94vw; top: 1.5vh;"><img class = fill src = "images/logout.png"></div></a>';
    inner += '<a href = "../major/major.html"><div style = "width: 11.25vw; height: 20.2vh; position: absolute; left: 18.9vw; top: 55.5vh;"><img id = loc64 class = fill src = "images/loc64.png"></div></a>';
    inner += '<a href = "../dorm/dorm.html"><div style = "width: 9.7vw; height: 14.65vh; position: absolute; left: 32.9vw; top: 17.65vh;"><img id = loc21 class = fill src = "images/loc21.png"></div></a>';
    inner += '<a href = ""><div style = "width: 4.55vw; height: 16vh; position: absolute; left: 70.23vw; top: 36.5vh;"><img id = loc34 class = fill src = "images/loc34.png"></div></a>';
    //inner += '<a href = "../poorRes/poorRes.html"><div style = "width: 8vw; height: 10vh; position: absolute; left: 20vw; top: 20vh;"><img id = loc30 class = fill src = "images/loc30.png"></div></a>';
    //inner += '<a href = "../richRes/richRes.html"><div style = "width: 8vw; height: 10vh; position: absolute; left: 30vw; top: 20vh;"><img id = loc22 class = fill src = "images/loc22.png"></div></a>';
    //inner += '<img id = loc36 class = "loc loc36" src = "images/loc36.png"></img>';
    inner += '<div style = "position: absolute; left: 12vw; top: 1.3vh; color: white;"><h1>' + username + '</h1></div>';
    inner += '<div style = "position: absolute; left: 30vw; top: 1.5vh;"><h1>' + padLeft('0' + userID, 4) + '</h1></div>';
    inner += '<div style = "position: absolute; left: 50vw; top: 1.5vh;"><h1>' + gold + '</h1></div>';
    document.body.innerHTML += inner;
}
function padLeft(str, lenght){
    if(str.length >= lenght)
    return str;
    else
    return padLeft("0" +str, lenght);
}

window.addEventListener("load", loading, false);