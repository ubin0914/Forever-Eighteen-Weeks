var subject_select;
var chapter_select;
var chapters = [0, 7, 7, 5, 6];
var passed = [0];
var userID;

function loading() {
    var newNode = document.createElement("div");
    newNode.id = "loading_hint";
    newNode.style = "color: white; position: absolute; right: 3vw; bottom: 3vh;";
    document.body.appendChild(newNode);
    get_server_link();
}
function get_server_link(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得伺服器</h1>";
    $.getJSON("get_server_link.php", function (data) {
        userID = parseInt(data[0].userID);
        get_account_data();
    });
}
function get_account_data(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得帳號資料</h1>";
    $.getJSON("get_account_data.php", function (data) {
        let item;
        for(item in data) if(data[item].userID == userID) break;
        passed[1] = parseInt(data[item].subject1_passed);
        passed[2] = parseInt(data[item].subject2_passed);
        passed[3] = parseInt(data[item].subject3_passed);
        passed[4] = parseInt(data[item].subject4_passed);
        preload();
    });
}
function preload(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 載入圖片資源</h1>";
    var preloadlist = [
        "images/background.png",
        "images/blank.png",
        "images/dark.png",
        "images/label.png",
        "images/return.png"];
    var preloadorder = [];
    var cnt = 0;
    for(var i=0; i < preloadlist.length; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = preloadlist[i];
    }
    for(var i=1; i <= 4; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/button" + i + ".png";
        for(var j=1; j <= chapters[i]; j++) {
            preloadorder[cnt] = new Image();
            preloadorder[cnt++].src = "images/button" + i + j + ".png";
        }
    }
    setTimeout(start, 3000);
}
function start(){
    document.body.removeChild(document.getElementById("loading_hint"));
    document.body.style = "background-color: white";
    var inner = '';
    inner += '<img class = fill style = "position: absolute; left: 0vw; top: 0vh;" src = "images/background.png">';
    inner += '<img style = "width: 30vw; height: 15vh; position: absolute; left: 0vw; top: 0vh;" src = "images/label.png">';
    inner += '<a href = "../HomePage/HomePage.html"><img class = return style = "width: 5vw; height: 9vh; position: absolute; left: 1vw; top: 1vh;" src = "images/return.png"></a>';
    inner += '<div id = buttonl1 class = unselecting onclick = "subject(1)" style = "width: 36vw; height: 16vh; position: absolute; left: 10vw; top: 18vh;"><img class = fill src = "images/button1.png"></div>';
    inner += '<div id = buttonl2 class = unselecting onclick = "subject(2)" style = "width: 36vw; height: 16vh; position: absolute; left: 10vw; top: 38vh;"><img class = fill src = "images/button2.png"></div>';
    inner += '<div id = buttonl3 class = unselecting onclick = "subject(3)" style = "width: 36vw; height: 16vh; position: absolute; left: 10vw; top: 58vh;"><img class = fill src = "images/button3.png"></div>';
    inner += '<div id = buttonl4 class = unselecting onclick = "subject(4)" style = "width: 36vw; height: 16vh; position: absolute; left: 10vw; top: 78vh;"><img class = fill src = "images/button4.png"></div>';
    inner += '<div id = buttonr1 onclick = "chapter(1)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 5vh;"></div>';
    inner += '<div id = buttonr2 onclick = "chapter(2)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 18vh;"></div>';
    inner += '<div id = buttonr3 onclick = "chapter(3)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 31vh;"></div>';
    inner += '<div id = buttonr4 onclick = "chapter(4)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 44vh;"></div>';
    inner += '<div id = buttonr5 onclick = "chapter(5)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 57vh;"></div>';
    inner += '<div id = buttonr6 onclick = "chapter(6)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 70vh;"></div>';
    inner += '<div id = buttonr7 onclick = "chapter(7)" style = "width: 30vw; height: 13vh; position: absolute; left: 60vw; top: 83vh;"></div>';
    document.body.innerHTML = inner;
}

function subject(s){
    subject_select = s;
    document.getElementById("buttonl1").setAttribute("class", "unselecting");
    document.getElementById("buttonl2").setAttribute("class", "unselecting");
    document.getElementById("buttonl3").setAttribute("class", "unselecting");
    document.getElementById("buttonl4").setAttribute("class", "unselecting");
    document.getElementById("buttonl" + s).setAttribute("class", "selecting");
    var i;
    for(i=1; i <= passed[s] + 1 &&  i <= chapters[s]; i++)
        document.getElementById("buttonr" + i).setAttribute("class", "unselecting");
    for(; i<=7; i++)
        document.getElementById("buttonr" + i).setAttribute("class", "unable");
    for(i=1; i<=chapters[s]; i++)
        document.getElementById("buttonr" + i).innerHTML = "<img class = fill src = 'images/button" + s + i + ".png'>";
    for(; i<=7; i++)
        document.getElementById("buttonr" + i).innerHTML = "<img class = fill src = 'images/blank.png'>";
}
function chapter(c){
    if(c > chapters[subject_select] || c > passed[subject_select] + 1) return;
    chapter_select = c;
    var obj = {};
    obj.stage = 10 + subject_select;
    obj.stage_level = chapter_select;
    document.body.innerHTML = "<img style = 'width: 100vw; height: 100vh; position: absolute; left: 0vw; top: 0vh;' src = 'images/dark.png'>";
    var newNode = document.createElement("div");
    newNode.id = "loading_hint";
    newNode.style = "color: white; position: absolute; right: 3vw; bottom: 3vh;";
    document.body.appendChild(newNode);
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 連線伺服器</h1>";
    $.post("update_server.php", obj, function(){
        window.location.href = "../battle/battle.html";
    });
}

window.addEventListener("load", loading, false);