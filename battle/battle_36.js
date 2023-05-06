var clock_interval;
//常數
var our_birth_position = 1200;
var position_device = 13.7;
var guaranteed_damage = 1;
var limitted_damage = 50;
var knock_down_period = 100;
var knock_down_distance = 0.5;
var upgrade_cost = [0, 40, 60, 80, 150, 9999];
var interest = [0, 7, 9, 12, 16, 21];
var chapters = [0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 7, 7, 5, 6]; //level轉為buff用
var boss_pose_time = [0, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 200, 50, 20, 50];    //不同stage的bose
var evolution_cycle = 3000;
//設定值
var userID;
var stage;
var stage_level;
var our_member_character = [];//[0, 0, 0, 0, 0, 0, 0, 0, 0]; //我方塔都長一樣
var enemy_member_character = [];//[0, 1, 2, 3, 4];
var member_cost = [];//[0, 10, 20, 15, 0, 0, 0, 0, 0];
var member_CD = [];//[0, 100, 300, 200, 0, 0, 0, 0, 0];
var member_star = [];
var enemy_assign_member = [];//[0, 1, 2, 2, 1, 1];  //我就想保留 沒意義
var enemy_assign_timing = [];//[0, 100, 200, 400, 500, 800];
var orders;
var cycle_time;
var our_member = {};
    our_member.HP = [];//[1000, 1000, 100, 8000, 1, 1, 1, 1, 1, 1];
    our_member.RG = [];//[0, 100, 200, 75, 0, 0, 0, 0, 0];
    our_member.ATK = [];//[0, 10, 20, 80, 0, 0, 0, 0, 0];
    our_member.ACD = [];//[0, 80, 200, 300, 0, 0, 0, 0, 0];
    our_member.DF = [];//[0, 10, 0, 5, 0, 0, 0, 0, 0];
    our_member.KB = [];//[0, 2, 1, 4, 0, 0, 0, 0, 0];
    our_member.SCD = [];//[0, 4, 500, 200, 0, 0, 0, 0, 0];
    our_member.SATK = [];//[0, 40, 300, 10, 0, 0, 0, 0, 0];
    our_member.SACD = [];//[0, 60, 500, 30, 0, 0, 0, 0, 0];
    our_member.SDF = [];//[0, 30, 0, 5, 0, 0, 0, 0, 0];
    our_member.SCT = [];//[0, 3300, 1000, 1150, 0, 0, 0, 0, 0];    //skill cast time 技能施放時間
var enemy_member = {};
    enemy_member.HP = [];//[1000, 200, 100, 1, 1, 1, 1, 1, 1, 1];
    enemy_member.RG = [];//[500, 100, 200, 0, 0, 0, 0, 0, 0];
    enemy_member.ATK = [];//[10, 30, 20, 0, 0, 0, 0, 0, 0];
    enemy_member.ACD = [];//[300, 80, 200, 0, 0, 0, 0, 0, 0];
    enemy_member.DF = [];//[0, 10, 0, 0, 0, 0, 0, 0, 0];
    enemy_member.KB = [];//[0, 2, 1, 0, 0, 0, 0, 0, 0];
var gain_gold;
var gain_potion;
var gain_fragments;
//非單位變數
var timer = 0;
var delay_remain = 0;
var money = 0;
var interest_lv = 1;
var assign_our_next = 0;
var enemy_order = 1;
var member_CD_remain = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var our_forward_position,                           enemy_forward_position;
var our_forward_unit,                               enemy_forward_unit;
var videoID = [0, 0, 0, 0, 0, 0, 0];    //第幾個角色的影片計數
var the_world = 0;
var legend_of_mermaid = 0;  //七彩的微風
var character_casting = [0, 0, 0, 0, 0, 0, 0]   //角色技能施放中
var video_cover = 0;
var evolution_level = 1;
//單位變數
var our_unit_num = 0,                               enemy_unit_num = 0;
var our_unit_member = [0],                          enemy_unit_member = [0];
var our_unit_position = [our_birth_position],       enemy_unit_position = [0];
var our_unit_position_next = [our_birth_position],  enemy_unit_position_next = [0];
var our_unit_HP = [1000],                           enemy_unit_HP = [1000];
var our_unit_HP_next = [1000],                      enemy_unit_HP_next = [1000];
var our_unit_ACD = [0],                             enemy_unit_ACD = [0];       //不需要被取值 不需要next
var our_unit_top = [0],                             enemy_unit_top = [0];
var our_unit_state = [0],                           enemy_unit_state = [0];
var our_unit_state_next = [0],                      enemy_unit_state_next = [0];
var our_unit_state_remain = [0],                    enemy_unit_state_remain = [0];
var our_unit_pose_remain = [0],                     enemy_unit_pose_remain = [0];
var our_unit_skill_SCD = [0];
var our_unit_skill_ready = [0];

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
        stage = parseInt(data[0].stage);
        stage_level = parseInt(data[0].stage_level);
        get_account_data();
    });
}
function get_account_data(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得帳號資料</h1>";
    $.getJSON("get_account_data.php", function (data) {
        let item;
        for(item in data) if(data[item].userID == userID) break;
        our_member_character[0] = 0;
        our_member_character[1] = parseInt(data[item].team_member1);
        our_member_character[2] = parseInt(data[item].team_member2);
        our_member_character[3] = parseInt(data[item].team_member3);
        our_member_character[4] = parseInt(data[item].team_member4);
        our_member_character[5] = parseInt(data[item].team_member5);
        our_member_character[6] = parseInt(data[item].team_member6);
        our_member_character[7] = parseInt(data[item].team_member7);
        our_member_character[8] = parseInt(data[item].team_member8);
        get_our_value();
    });
}
function get_our_value(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得角色數據</h1>";
    $.getJSON("get_our_value.php", function (data) {
        var charlist = [];
        for(let i in our_member_character) charlist[i] = our_member_character[i];
        charlist.sort(function (a, b) {return a - b;});
        let item, cnt = 0;
        for (item in data) {
            if (item == charlist[cnt]){
                let i = -1;
                while(charlist[cnt] != our_member_character[++i]);
                let place = i;
                member_cost[place] = parseInt(data[item].COST);
                member_CD[place] = parseInt(data[item].BUYCD);
                member_star[place] = parseInt(data[item].STAR);
                our_member.HP[place] = parseInt(data[item].HP);
                our_member.RG[place] = parseInt(data[item].RG);
                our_member.ATK[place] = parseInt(data[item].ATK);
                our_member.ACD[place] = parseInt(data[item].ACD);
                our_member.DF[place] = parseInt(data[item].DF);
                our_member.KB[place] = parseInt(data[item].KB);
                our_member.SCD[place] = parseInt(data[item].SCD);
                our_member.SATK[place] = parseInt(data[item].SATK);
                our_member.SACD[place] = parseInt(data[item].SACD);
                our_member.SDF[place] = parseInt(data[item].SDF);
                our_member.SCT[place] = parseInt(data[item].SCT);
                cnt++;
            }
        }
        get_stage_arrangement();
    });
}
function get_stage_arrangement(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得關卡資訊</h1>";
    $.getJSON("get_stage_arrangement.php", function (data) {
        enemy_member_character[0] = stage;
        enemy_member_character[1] = parseInt(data[stage].member1);
        enemy_member_character[2] = parseInt(data[stage].member2);
        enemy_member_character[3] = parseInt(data[stage].member3);
        enemy_member_character[4] = parseInt(data[stage].member4);
        enemy_assign_member = JSON.parse(data[stage].member_order);
        enemy_assign_timing = JSON.parse(data[stage].timing_order);
        orders = parseInt(data[stage].orders);
        cycle_time = parseInt(data[stage].cycle_time);
        get_enemy_value();
    });
}
function get_enemy_value(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得敵方數值</h1>";
    $.getJSON("get_enemy_value.php", function (data) {
        var charlist = [];
        for(let i in enemy_member_character) charlist[i] = enemy_member_character[i];
        charlist.sort(function (a, b) {return a - b;});
        let item, cnt = 0;
        for (item in data) {
            if (item == charlist[cnt]){
                let i = -1;
                while(charlist[cnt] != enemy_member_character[++i]);
                let place = i;
                enemy_member.HP[place] = parseInt(data[item].HP * (1 + (stage_level - 1) / (chapters[stage] - 1) * 2));
                enemy_member.RG[place] = parseInt(data[item].RG);
                enemy_member.ATK[place] = parseInt(data[item].ATK * (1 + (stage_level - 1) / (chapters[stage] - 1) * 2));
                enemy_member.ACD[place] = parseInt(data[item].ACD / (1 + (stage_level - 1) / (chapters[stage] - 1) * 2));
                enemy_member.DF[place] = parseInt(data[item].DF * (1 + (stage_level - 1) / (chapters[stage] - 1) * 2));
                enemy_member.KB[place] = parseInt(data[item].KB);
                cnt++;
            }
        }
        get_gain_chart();
    });
}
function get_gain_chart(){
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 取得戰利品數值</h1>";
    $.getJSON("get_gain_chart.php", function (data) {
        gain_gold = Math.round(parseInt(data[stage].gold) * Math.pow(parseInt(data[stage].gold_addition), stage_level - 1));
        gain_potion = Math.round(parseInt(data[stage].potion) * Math.pow(parseInt(data[stage].potion_addition), stage_level - 1));
        gain_fragments = Math.round(parseInt(data[stage].fragments) * Math.pow(parseInt(data[stage].fragments_addition), stage_level - 1));
        preload();
        setTimeout(start, 3000);
    });
}
function preload() {
    document.getElementById("loading_hint").innerHTML = "<h1>Loading... 載入影音資源</h1>";
    var preloadlist = [
        "images/defeat.png",
        "images/enemy_angel.png",
        "images/escape.png",
        "images/escape_window.png",
        "images/interest_upgrader.png",
        "images/our_angel.png",
        "images/quit.png",
        "images/quit_hover.png",
        "images/return.png",
        "images/return_hover.png",
        "images/victory.png",
        "images/主塔.png",
        "images/our_ch1_attacking.gif",
        "images/enemy_ch1_attacking.gif",
        "images/background" + stage + ".png",
        "images/money.png",
        "images/leave.png"];
    var preloadorder = [];
    var cnt = 0;
    for(var i=0; i < preloadlist.length; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = preloadlist[i];
    }
    for(var i=0; i <= 8; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/assign_ch" + our_member_character[i] + ".png";
    }
    for(var i=0; i <= 8; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/our_ch" + our_member_character[i] + ".png";
    }
    for(var i=1; i <= 8; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/our_ch" + our_member_character[i] + "_attacking.png";
    }
    for(var i=0; i <= 4; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/enemy_ch" + enemy_member_character[i] + ".png";
    }
    for(var i=0; i <= 4; i++) {
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/enemy_ch" + enemy_member_character[i] + "_attacking.png";
    }
    for(var i=1; i <= 8; i++) {
        if(our_member_character[i] > 8) continue;
        preloadorder[cnt] = new Image();
        preloadorder[cnt++].src = "images/skill_button_ch" + our_member_character[i] + ".png";
    }
    for(var i=1; i <= 8; i++){
        if(our_member_character[i] > 8) continue;
        preloadorder[cnt] = document.createElement("div");
        preloadorder[cnt++].innerHTML = '<div style = "visibility: none;"><video src = "https://ubin0914.github.io/ubin/skill_video' + our_member_character[i] + '.mp4"></video></div>';
    }
}
function start() {
    document.body.removeChild(document.getElementById("loading_hint"));
    var newNode = document.createElement("img");
    newNode.id = "background";
    newNode.style = "opacity: 0.8; position: absolute; left: 0vw; top: 0vh; z-index = 0;";
    newNode.style.width = "100vw";
    newNode.style.height = "100vh";
    newNode.src = "images/background" + stage + ".png";
    document.body.appendChild(newNode);
    document.body.style = "background-color: white";
    posited();
    for(var i=1; i<=8; i++){
        (function(i){ document.getElementById("member" + i).addEventListener("click", function(){ if(money >= member_cost[i] && !member_CD_remain[i]) assign_our_next = i; }, false); })(i);
    }
    document.getElementById("upgrader").addEventListener("click", function(){ if(interest_lv < 5 && money >= upgrade_cost[interest_lv]){ money -= upgrade_cost[interest_lv]; interest_lv++; } }, false);
    document.getElementById("escaper").addEventListener("click", escape, false);
    clock_interval = window.setInterval( function(){ if(!delay_remain) clock(); else delay_remain--; }, 10 );
}
function posited() {
    var newNode = document.createElement("div");
    newNode.id = "our_unit0";
    newNode.style = "width:7vw; height:34vh; position: absolute; left: 93vw; top: 25vh; z-index: 2;";
    newNode.innerHTML = "<img id = member" + i + " class = fill src = 'images/主塔.png'>";
    document.body.appendChild(newNode);
    for(var i = 1; i <= 8; i++){
        document.getElementById("whole").innerHTML += "<div class = 'member_frame" + member_star[i] + "' style = 'width:9vw; height:21vh; position: absolute; left: " + (i * 10 + 5) + "vw; top: 66vh; z-index: 2;'><img id = member" + i + " class = fill src = 'images/assign_ch" + our_member_character[i] + ".png'></div>"
    }
    for(var i = 1; i <= 8; i++){
        document.getElementById("whole").innerHTML += "<div style = 'background-color: darkgray; width: 80vw; height: 2.5vw; position: absolute; left: 15vw; top: 92.5vh;'></div><h1 style = 'position: absolute; left: " + (i * 10 + 8) + "vw; top: 90vh; z-index: 2;'>$" + member_cost[i] + "</h1>";
    }
    document.getElementById("money").innerHTML = "</div><h2>$</h2>";
    document.getElementById("money").setAttribute("style", "position: absolute; left: 1.3vw; top: 0vh; z-index: 2;");
    document.getElementById("whole").innerHTML += "<div style = 'width:5vw; height:9vh; position: absolute; left: 0vw; top: 0vh; z-index: 1;'><img class = fill src = 'images/money.png'></div>"
    document.getElementById("whole").innerHTML += "<div id = upgrader style = 'position: absolute; left: 1vw; top: 72vh; width:13.5vw; height:24vh; z-index: 2;'><img class = fill src = 'images/interest_upgrader.png'><h1 id = interest_lv style = 'position: absolute; left: 4.8vw; top: 6vh; z-index: 2;'></h1><h1 id = upgrade_cost style = 'position: absolute; left: 4.8vw; top: 13vh; z-index: 2;'></h1></div>"
    document.getElementById("whole").innerHTML += "<div id = escaper style = 'width:6.3vw; height:11.2vh; position: absolute; left: 93vw; top: 2vh; z-index: 2;'><img class = fill src = 'images/escape.png'></div>"
    document.getElementById("whole").innerHTML += "<div style = 'width:15.4vw; height:2vh; position: absolute; left: 0.8vw; top: 19.8vh; z-index: 2; background-color: gray;'></div>"
    document.getElementById("whole").innerHTML += "<div id = boss_blood_bar style = 'width:15vw; height:1.5vh; position: absolute; left: 1vw; top: 20vh; z-index: 2; background-color: white;'></div>"
    document.getElementById("whole").innerHTML += "<div style = 'width:15.4vw; height:2vh; position: absolute; right: 0.8vw; top: 19.8vh; z-index: 2; background-color: gray;'></div>"
    document.getElementById("whole").innerHTML += "<div id = tower_blood_bar style = 'width:15vw; height:1.5vh; position: absolute; right: 1vw; top: 20vh; z-index: 2; background-color: white;'></div>"
    //BOSS
    var newNode = document.createElement("div");
    newNode.setAttribute("id", "enemy_unit0");
    newNode.setAttribute("style", "width: 18vw; height: 32vh; position: absolute; left: 0vw; top: 25vh; z-index: 2");
    newNode.innerHTML = "<img class = fill src = 'images/enemy_ch" + stage + ".png'>";
    document.body.appendChild(newNode);
    enemy_unit_member[enemy_unit_num] = 0;
    enemy_unit_HP[0] = enemy_member.HP[0];
    enemy_unit_HP_next[0] = enemy_member.HP[0];
    enemy_unit_ACD[0] = enemy_member.ACD[0] * (1 + (evolution_level - 1) / 4);
    enemy_unit_pose_remain[0] = 0;
}
function clock() {
    //var d = new Date().getTime(); //壓力測試
    display();
    assign_unit();
    calculate();
    update();
    video_controll();   //一次只能暫停一支影片 避免衝突
    //console.log(new Date().getTime() - d); //最高幀率
}
function display() {
    document.getElementById("money").innerHTML = "<h2>$" + Math.round(money) + "</h2>";
    for(var i = 1, count = 0/*技能鈕*/; i <= our_unit_num; i++){
        if(our_unit_state[i] == 4)
            if(our_unit_state_remain[i] > 100)
                document.getElementById("our_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + ((our_unit_position[i] - (our_unit_state_remain[i] - 100) * knock_down_distance) / position_device - 4.5) + "vw; top: " + (our_unit_top[i] - height_at(our_unit_state_remain[i] - 100)) + "vh; z-index: " + parseInt(our_unit_top[i] * 10) + ";");
            else {
                document.getElementById("our_unit" + i).innerHTML = "<img class = fill src = 'images/our_angel.png'>";
                document.getElementById("our_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + (our_unit_position[i] / position_device - 4.5 + angelX_at(100 - our_unit_state_remain[i])) + "vw; top: " + (our_unit_state_remain[i] / 3) + "vh; z-index: " + parseInt(our_unit_top[i] * 10) + ";");
            }
        if(!our_unit_HP[i]) continue;   //以下為生存時
        if(our_unit_pose_remain[i] == 50 || our_unit_pose_remain[i] == 20 && our_member_character[our_unit_member[i]] == 3)   //圖片選擇
            if(our_member_character[our_unit_member[i]] == 1)
                document.getElementById("our_unit" + i).innerHTML = "<img class = fill src = 'images/our_ch1_attacking.gif'>";
            else
                document.getElementById("our_unit" + i).innerHTML = "<img class = fill src = 'images/our_ch" + our_member_character[our_unit_member[i]] + "_attacking.png'>";
        else if(our_unit_pose_remain[i] == 1)
            document.getElementById("our_unit" + i).innerHTML = "<img class = fill src = 'images/our_ch" + our_member_character[our_unit_member[i]] + ".png'>";
        if(our_unit_pose_remain[i]) our_unit_pose_remain[i]--;
        if(!our_unit_state[i] || our_unit_state[i] == 2)    //設定位置等style
            document.getElementById("our_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + ((our_unit_position[i]) / position_device - 4.5) + "vw; top: " + our_unit_top[i] + "vh; z-index: " + parseInt(our_unit_top[i] * 10) + ";");
        else if(our_unit_state[i] == 1)
            document.getElementById("our_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + ((our_unit_position[i] - our_unit_state_remain[i] * knock_down_distance) / position_device - 4.5) + "vw; top: " + (our_unit_top[i] - height_at(our_unit_state_remain[i])) + "vh; z-index: " + parseInt(our_unit_top[i] * 10) + ";");
        //技能欄
        if(our_unit_skill_ready[i]){
            document.getElementById("our_skill_button" + i).setAttribute("style", "width:6.75vw; height:12vh; position: absolute; left: " + ((++count) * 8 + 5) + "vw; top: 5vh; z-index: 2");
            //if(i == 3) console.log(our_member_character[our_unit_member[i]]);
            if(!our_unit_state[i] && !character_casting[our_member_character[our_unit_member[i]]])
                document.getElementById("our_skill_button" + i).setAttribute("class", "affordable");
            else
                document.getElementById("our_skill_button" + i).setAttribute("class", "unaffordable");
        }
    }
    //BOSS
    if(enemy_unit_pose_remain[0] == boss_pose_time[stage])
        document.getElementById("enemy_unit0").innerHTML = "<img class = fill src = 'images/enemy_ch" + stage + "_attacking.png'>";
    else if(enemy_unit_pose_remain[0] == 1)
        document.getElementById("enemy_unit0").innerHTML = "<img class = fill src = 'images/enemy_ch" + stage + ".png'>";
    if(enemy_unit_pose_remain[0]) enemy_unit_pose_remain[0]--;
    if(the_world)
        document.getElementById("enemy_unit0").setAttribute("class", "time_pausing");
    else
        document.getElementById("enemy_unit0").setAttribute("class", "");
    //
    for(var i = 1; i <= enemy_unit_num; i++){
        if(enemy_unit_state[i] == 4)
            if(enemy_unit_state_remain[i] > 100)
                document.getElementById("enemy_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + ((enemy_unit_position[i] + (enemy_unit_state_remain[i] - 100) * knock_down_distance) / position_device + 4.5) + "vw; top: " + (enemy_unit_top[i] - height_at(enemy_unit_state_remain[i] - 100)) + "vh; z-index: " + parseInt(enemy_unit_top[i] * 10) + ";");
            else {
                document.getElementById("enemy_unit" + i).innerHTML = "<img class = fill src = 'images/enemy_angel.png'>";
                document.getElementById("enemy_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + (enemy_unit_position[i] / position_device + 4.5 + angelX_at(100 - enemy_unit_state_remain[i])) + "vw; top: " + (enemy_unit_state_remain[i] / 3) + "vh; z-index: " + parseInt(enemy_unit_top[i] * 10) + ";");
            }
        if(!enemy_unit_HP[i]) continue;
        if(enemy_unit_pose_remain[i] == 50)
            if(enemy_member_character[enemy_unit_member[i]] == 1)
                document.getElementById("enemy_unit" + i).innerHTML = "<img class = fill src = 'images/enemy_ch1_attacking.gif'>";
            else
                document.getElementById("enemy_unit" + i).innerHTML = "<img class = fill src = 'images/enemy_ch" + enemy_member_character[enemy_unit_member[i]] + "_attacking.png'>";
        else if(enemy_unit_pose_remain[i] == 1)
            document.getElementById("enemy_unit" + i).innerHTML = "<img class = fill src = 'images/enemy_ch" + enemy_member_character[enemy_unit_member[i]] + ".png'>";
        if(enemy_unit_pose_remain[i]) enemy_unit_pose_remain[i]--;
        if(the_world)
            document.getElementById("enemy_unit" + i).setAttribute("class", "time_pausing");
        else
            document.getElementById("enemy_unit" + i).setAttribute("class", "");
        if(!enemy_unit_state[i])
            document.getElementById("enemy_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + ((enemy_unit_position[i]) / position_device + 4.5) + "vw; top: " + enemy_unit_top[i] + "vh; z-index: " + parseInt(enemy_unit_top[i] * 10) + ";");
        else if(enemy_unit_state[i] == 1)
            document.getElementById("enemy_unit" + i).setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + ((enemy_unit_position[i] + enemy_unit_state_remain[i] * knock_down_distance) / position_device + 4.5) + "vw; top: " + (enemy_unit_top[i] - height_at(enemy_unit_state_remain[i])) + "vh; z-index: " + parseInt(enemy_unit_top[i] * 10) + ";");
    }
    //
    document.getElementById("CDprogress").innerHTML = "";
    for(var mem = 1; mem <= 8; mem++){
        if(money < member_cost[mem])
            document.getElementById("member" + mem).setAttribute("class", "unaffordable fill");
        else if(member_CD_remain[mem])
            document.getElementById("member" + mem).setAttribute("class", "cool_down fill");
        else
            document.getElementById("member" + mem).setAttribute("class", "affordable fill");
        if(member_CD_remain[mem])
            document.getElementById("CDprogress").innerHTML += "<span style = 'position: absolute; left: " + (mem * 10 + 5) + "vw; top: 88.3vh; width: " + (member_CD_remain[mem] / member_CD[mem] * 9) + "vw; height: 1.5vh; background-color: white; z-index: 2;'></span>";
    }
    if(interest_lv == 5)
        document.getElementById("upgrader").setAttribute("class", "");
    else if(money < upgrade_cost[interest_lv])
        document.getElementById("upgrader").setAttribute("class", "unaffordable");
    else
        document.getElementById("upgrader").setAttribute("class", "affordable");
    document.getElementById("interest_lv").innerHTML = "Lv " + interest_lv;
    if(interest_lv != 5)
        document.getElementById("upgrade_cost").innerHTML = "$" + upgrade_cost[interest_lv];
    else
        document.getElementById("upgrade_cost").innerHTML = "";
    document.getElementById("boss_blood_bar").setAttribute("style", "width:" + (enemy_unit_HP[0] / enemy_member.HP[0] * 15) + "vw; height:1.5vh; position: absolute; left: 1vw; top: 20vh; z-index: 2; background-color: white;");
    document.getElementById("tower_blood_bar").setAttribute("style", "width:" + (our_unit_HP[0] / our_member.HP[0] * 15) + "vw; height:1.5vh; position: absolute; right: 1vw; top: 20vh; z-index: 2; background-color: white;");
}
function assign_unit() {
    if(assign_our_next) {
        assign_our(assign_our_next);
        assign_our_next = 0;
    }
    if(timer % cycle_time == enemy_assign_timing[enemy_order]){
        assign_enemy(enemy_assign_member[enemy_order++]);
        if(enemy_order == orders + 1) enemy_order = 1;
    }
}
function calculate() {
    //console.log(our_unit_ACD[1]);
    for(var i = 1; i <= our_unit_num; i++){
        if(our_unit_state[i] == 4) dead_knock_down(1, i);
        if(!our_unit_HP[i]) continue;
        if(!our_unit_state[i]){
            SCD_checkpoint(2, i, 1);
            SCD_checkpoint(8, i, 1);
            if(our_unit_position[i] - enemy_forward_position > our_member.RG[our_unit_member[i]]) our_unit_position_next[i] = our_unit_position[i] - 1;
            else if(!our_unit_ACD[i]){
                var damage = our_member.ATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[enemy_forward_unit]] * (1 + (evolution_level - 1) / 4);
                if(damage < guaranteed_damage) damage = guaranteed_damage;
                enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(damage);
                our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
                our_unit_pose_remain[i] = 50;
                SCD_checkpoint(1, i, 1);
                SCD_checkpoint(5, i, 1);
                SCD_checkpoint(3, i, damage);
                SCD_checkpoint(7, i, damage);
            }
            if(our_unit_ACD[i]) our_unit_ACD[i]--;
        }
        else if(our_unit_state[i] == 1) non_active(1, i);
        else if(our_unit_state[i] == 2) skill_casting(1, i);
    }
    //BOSS 攻擊
    if(our_forward_position <= enemy_member.RG[0] && !enemy_unit_ACD[0] && !the_world && our_forward_unit){
        var damage = enemy_member.ATK[0] * (1 + (evolution_level - 1) / 4) - (our_unit_state[our_forward_unit] == 2 ? our_member.SDF[our_unit_member[our_forward_unit]] : our_member.DF[our_unit_member[our_forward_unit]]);
        if(damage < guaranteed_damage) damage = guaranteed_damage;
        if(legend_of_mermaid && damage > limitted_damage) damage = limitted_damage;
        SCD_checkpoint(4, our_forward_unit, damage);
        SCD_checkpoint(6, our_forward_unit, 1);
        our_unit_HP_next[our_forward_unit] -= Math.floor(damage);
        enemy_unit_ACD[0] = enemy_member.ACD[0] * (1 + (evolution_level - 1) / 4);
        enemy_unit_pose_remain[0] = boss_pose_time[stage];
    }
    if(enemy_unit_ACD[0]) enemy_unit_ACD[0]--;
    //
    for(var i = 1; i <= enemy_unit_num; i++){
        if(enemy_unit_state[i] == 4) dead_knock_down(0, i);
        if(!enemy_unit_HP[i]) continue;
        if(!enemy_unit_state[i] && !the_world){
            if(our_forward_position - enemy_unit_position[i] > enemy_member.RG[enemy_unit_member[i]]) enemy_unit_position_next[i] = enemy_unit_position[i] + 1;
            else if(!enemy_unit_ACD[i]){
                var damage = enemy_member.ATK[enemy_unit_member[i]] * (1 + (evolution_level - 1) / 4) - (our_unit_state[our_forward_unit] == 2 ? our_member.SDF[our_unit_member[our_forward_unit]] : our_member.DF[our_unit_member[our_forward_unit]]);
                if(damage < guaranteed_damage) damage = guaranteed_damage;
                if(legend_of_mermaid && damage > limitted_damage) damage = limitted_damage;
                //console.log(damage);
                SCD_checkpoint(4, our_forward_unit, damage);
                SCD_checkpoint(6, our_forward_unit, 1);
                our_unit_HP_next[our_forward_unit] -= Math.floor(damage);
                enemy_unit_ACD[i] = enemy_member.ACD[enemy_unit_member[i]] * (1 + (evolution_level - 1) / 4);
                enemy_unit_pose_remain[i] = 50;
            }
            if(enemy_unit_ACD[i]) enemy_unit_ACD[i]--;
        }
        else if(enemy_unit_state[i] == 1) non_active(0, i);
    }
    //結算擊退 生命量度變化瞬間(死亡不算)
    for(var i = 1; i <= our_unit_num; i++){
        if(!our_unit_HP[i] || our_unit_HP_next[i] <= 0) continue;
        if((our_unit_state_next[i] == 0 || our_unit_state_next[i] == 2) && Math.floor((our_unit_HP_next[i] - 1) / our_member.HP[our_unit_member[i]] * our_member.KB[our_unit_member[i]]) != Math.floor((our_unit_HP[i] - 1) / our_member.HP[our_unit_member[i]] * our_member.KB[our_unit_member[i]])){
            if(our_unit_state_next[i] == 2 && character_casting[our_member_character[our_unit_member[i]]]) {
                character_casting[our_member_character[our_unit_member[i]]] = 0;
                document.body.removeChild(document.getElementById("skill_video" + our_member_character[our_unit_member[i]] + videoID[our_member_character[our_unit_member[i]]]));
                if(our_member_character[our_unit_member[i]] == 8) legend_of_mermaid = 0;
            }
            our_unit_state_next[i] = 1;
            our_unit_position_next[i] += knock_down_distance * knock_down_period;
        }
    }
    for(var i = 1; i <= enemy_unit_num; i++){
        if(!enemy_unit_HP[i] || enemy_unit_HP_next[i] <= 0 || the_world) continue;
        if(enemy_unit_state_next[i] == 0 && Math.floor((enemy_unit_HP_next[i] - 1) / enemy_member.HP[enemy_unit_member[i]] * enemy_member.KB[enemy_unit_member[i]]) != Math.floor((enemy_unit_HP[i] - 1) / enemy_member.HP[enemy_unit_member[i]] * enemy_member.KB[enemy_unit_member[i]])){
            enemy_unit_state_next[i] = 1;
            enemy_unit_position_next[i] -= knock_down_distance * knock_down_period;
        }
    }
    //結算死亡 死亡瞬間
    for(var i = 1; i <= our_unit_num; i++){
        if(our_unit_HP[i] && our_unit_HP_next[i] <= 0){
            if(our_unit_state[i] == 2 && character_casting[our_member_character[our_unit_member[i]]]){  //死亡斷招 (待優化)
                character_casting[our_member_character[our_unit_member[i]]] = 0;
                document.body.removeChild(document.getElementById("skill_video" + our_member_character[our_unit_member[i]] + videoID[our_member_character[our_unit_member[i]]]));
                if(our_member_character[our_unit_member[i]] == 8) legend_of_mermaid = 0;
            }
            our_unit_HP_next[i] = 0;
            our_unit_HP[i] = 0; //預先更新 反正這個單位沒戲了
            our_unit_state_next[i] = 4;
            our_unit_state[i] = 4; //因HP歸零 要承擔更新工作
            our_unit_state_remain[i] = knock_down_period + 100;
            our_unit_position_next[i] += knock_down_distance * knock_down_period;
            our_unit_position[i] = our_unit_position_next[i];
            if(our_unit_skill_ready[i]){
                our_unit_skill_ready[i] = 0;
                document.body.removeChild(document.getElementById("our_skill_button" + i));
            }
        }
    }
    for(var i = 1; i <= enemy_unit_num; i++){
        if(enemy_unit_HP[i] && enemy_unit_HP_next[i] <= 0 && !the_world){
            enemy_unit_HP_next[i] = 0;
            enemy_unit_HP[i] = 0;
            enemy_unit_state_next[i] = 4;
            enemy_unit_state[i] = 4;
            enemy_unit_state_remain[i] = knock_down_period + 100;
            enemy_unit_position_next[i] -= knock_down_distance * knock_down_period;
            enemy_unit_position[i] = enemy_unit_position_next[i];
        }
    }
    if(enemy_unit_HP_next[0] <= 0 && our_unit_HP_next[0] > 0){  //pass優先 雖然不太可能同時啦
        game_pass();
    }
    else if(our_unit_HP_next[0] <= 0){
        game_over();
    }
}
function update() { //只更新存活的 state變化判斷也寫在這 除了狀態4
    our_forward_position = our_birth_position;
    our_forward_unit = 0;
    enemy_forward_position = 0;
    enemy_forward_unit = 0;
    our_unit_HP[0] = our_unit_HP_next[0];
    enemy_unit_HP[0] = enemy_unit_HP_next[0];
    for(var i = 1; i <= our_unit_num; i++){
        if(!our_unit_HP[i]) continue;
        our_unit_HP[i] = our_unit_HP_next[i];
        our_unit_position[i] = our_unit_position_next[i];
        if(our_unit_position[i] < our_forward_position) {
            our_forward_position = our_unit_position[i];
            our_forward_unit = i;
        }
        //控制state、next、remain
        if(our_unit_state[i] == our_unit_state_next[i]){    //無主動變化狀態
            if(our_unit_state[i]) our_unit_state_remain[i]--;
            if(!our_unit_state_remain[i]) our_unit_state[i] = our_unit_state_next[i] = 0;   //狀態消除
        }
        else{   //有主動變化狀態
            if(!our_unit_state[i]){ //無狀態轉為有狀態
                our_unit_state[i] = our_unit_state_next[i];
                if(our_unit_state[i] == 1) our_unit_state_remain[i] = knock_down_period;
                else if(our_unit_state[i] == 2) our_unit_state_remain[i] = our_member.SCT[our_unit_member[i]];
            }
            else if(our_unit_state[i] == 2 && our_unit_state_next[i] == 1){ //被斷招
                our_unit_state[i] = 1;
                our_unit_state_remain[i] = knock_down_period;
            }
        }
    }
    for(var i = 1; i <= enemy_unit_num; i++){
        if(!enemy_unit_HP[i]) continue;
        if(!the_world) enemy_unit_HP[i] = enemy_unit_HP_next[i];
        enemy_unit_position[i] = enemy_unit_position_next[i];
        if(enemy_unit_position[i] > enemy_forward_position) {
            enemy_forward_position = enemy_unit_position[i];    //最前位置需要隨時計算
            enemy_forward_unit = i;
        }
        if(the_world) continue;
        if(enemy_unit_state[i] == enemy_unit_state_next[i]){
            if(enemy_unit_state[i]) enemy_unit_state_remain[i]--;
            if(!enemy_unit_state_remain[i]) enemy_unit_state[i] = enemy_unit_state_next[i] = 0;
        }
        else{
            if(!enemy_unit_state[i]){
                enemy_unit_state[i] = enemy_unit_state_next[i];
                if(enemy_unit_state[i] == 1) enemy_unit_state_remain[i] = knock_down_period;
            }
        }
    }
    if(!the_world) timer++;
    evolution_level = Math.floor(timer / evolution_cycle) + 1;
    money += interest[interest_lv] / 100;
    for(var i = 1; i <= 8; i++){
        if(member_CD_remain[i]) member_CD_remain[i]--;
    }
}
function assign_our(mem) {
    var newNode = document.createElement("div");
    newNode.setAttribute("id", "our_unit" + (++our_unit_num));
    our_unit_top[our_unit_num] = Math.random() * 10 + 30;
    newNode.setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + (our_birth_position / position_device - 4.5) + "vw; top: " + our_unit_top[our_unit_num] + "vh;");
    newNode.innerHTML = "<img class = fill src = 'images/our_ch" + our_member_character[mem] + ".png'>";
    document.body.appendChild(newNode);
    our_unit_member[our_unit_num] = mem;
    money -= member_cost[mem];
    member_CD_remain[mem] = member_CD[mem];
    our_unit_HP[our_unit_num] = our_member.HP[mem];
    our_unit_HP_next[our_unit_num] = our_member.HP[mem];
    our_unit_position[our_unit_num] = our_birth_position;
    our_unit_position_next[our_unit_num] = our_birth_position;
    our_unit_ACD[our_unit_num] = our_member.ACD[mem];
    our_unit_state[our_unit_num] = 0;
    our_unit_state_next[our_unit_num] = 0;
    our_unit_state_remain[our_unit_num] = 0;
    our_unit_pose_remain[our_unit_num] = 0;
    our_unit_skill_SCD[our_unit_num] = our_member.SCD[mem];
    our_unit_skill_ready[our_unit_num] = 0;
}
function assign_enemy(mem) {
    var newNode = document.createElement("div");
    newNode.setAttribute("id", "enemy_unit" + (++enemy_unit_num));
    enemy_unit_top[enemy_unit_num] = Math.random() * 10 + 30;
    newNode.setAttribute("style", "width: 13.5vw; height: 24vh; position: absolute; left: " + 4.5 + "vw; top: " + enemy_unit_top[enemy_unit_num] + "vh;");
    newNode.innerHTML = "<img class = fill src = 'images/enemy_ch" + enemy_member_character[mem] + ".png'>";
    document.body.appendChild(newNode);
    enemy_unit_member[enemy_unit_num] = mem;
    enemy_unit_HP[enemy_unit_num] = enemy_member.HP[mem];
    enemy_unit_HP_next[enemy_unit_num] = enemy_member.HP[mem];
    enemy_unit_position[enemy_unit_num] = 0;
    enemy_unit_position_next[enemy_unit_num] = 0;
    enemy_unit_ACD[enemy_unit_num] = enemy_member.ACD[mem] * (1 + (evolution_level - 1) / 4);
    enemy_unit_state[enemy_unit_num] = 0;
    enemy_unit_state_next[enemy_unit_num] = 0;
    enemy_unit_state_remain[enemy_unit_num] = 0;
    enemy_unit_pose_remain[enemy_unit_num] = 0;
}
function SCD_checkpoint(ch, i, down) {
    if(our_member_character[our_unit_member[i]] == ch && our_unit_skill_SCD[i]) {
        our_unit_skill_SCD[i] -= down;
        if(our_unit_skill_SCD[i] <= 0) {
            our_unit_skill_SCD[i] = 0;
            our_unit_skill_ready[i] = 1;
            var newNode = document.createElement("div");
            newNode.setAttribute("id", "our_skill_button" + i);
            newNode.setAttribute("style", "width:6.75vw; height:12vh; position: absolute; left: 13vw; top: 5vh; z-index: 2");  //暫不初始定位
            newNode.innerHTML = "<img class = 'fill' src = 'images/skill_button_ch" + our_member_character[our_unit_member[i]] + ".png'>";
            document.body.appendChild(newNode);
            (function(i){ document.getElementById("our_skill_button" + i).addEventListener("click", function(){skill_trigger(i);}, false); })(i);
        }
    }
}
function skill_trigger(i) {  //clock之外的函式
    if(our_unit_state[i] || character_casting[our_member_character[our_unit_member[i]]]) return;
    our_unit_state_next[i] = 2;
    our_unit_skill_ready[i] = 0;
    document.body.removeChild(document.getElementById("our_skill_button" + i));
}
function escape(){
    delay_remain = 1000000;
    var newNode = document.createElement("div");
    newNode.setAttribute("id", "escape_window");
    newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.9; z-index: 1001;");
    newNode.innerHTML = "<img class = fill src = 'images/escape_window.png'></img>"
    document.body.appendChild(newNode);
    var newNode = document.createElement("div");
    newNode.setAttribute("id", "escape_quit");
    newNode.setAttribute("style", "width:15vw; height:15vh; position: absolute; left: 31vw; top: 48vh; opacity: 0.9; z-index: 1002;");
    newNode.setAttribute("onclick", "escape_quit()");
    newNode.innerHTML = "<img class = fill onmouseover = 'escape_quit_mouseover(this)' onmouseout = 'escape_quit_mouseout(this)' src = 'images/quit.png'></img>"
    document.getElementById("escape_window").appendChild(newNode);
    var newNode = document.createElement("div");
    newNode.setAttribute("id", "escape_return");
    newNode.setAttribute("style", "width:15vw; height:15vh; position: absolute; left: 51vw; top: 48vh; opacity: 0.9; z-index: 1002;");
    newNode.setAttribute("onclick", "escape_return()");
    newNode.innerHTML = "<img class = fill onmouseover = 'escape_return_mouseover(this)' onmouseout = 'escape_return_mouseout(this)' src = 'images/return.png'></img>"
    document.getElementById("escape_window").appendChild(newNode);
    for(var i=1; i<=8; i++){
        if(character_casting[i] == 1){
            document.getElementById("controll_video" + i + videoID[i]).pause();
        }
    }
}
function escape_quit(){
    window.location.href = "../HomePage/HomePage.html";
}
function escape_return(){
    document.getElementById("escape_window").removeChild(document.getElementById("escape_quit"));
    document.getElementById("escape_window").removeChild(document.getElementById("escape_return"));
    document.body.removeChild(document.getElementById("escape_window"));
    delay_remain = 0;
    for(var i=1; i<=8; i++){
        if(character_casting[i] == 1){
            document.getElementById("controll_video" + i + videoID[i]).play();
        }
    }
}
function escape_quit_mouseover(e){e.src = "images/quit_hover.png";}
function escape_quit_mouseout(e){e.src = "images/quit.png";}
function escape_return_mouseover(e){e.src = "images/return_hover.png";}
function escape_return_mouseout(e){e.src = "images/return.png";}
function height_at(x) {
    if(!x)          return 0;
    else if(x > 30) return (x-65) * (x-65) / 1125 * -5 + 5;
    else            return (x-15) * (x-15) / 225 * -2 + 2;
}
function angelX_at(y) {
    return Math.sin(y / 25 * Math.PI);
}
function non_active(side, i) {
    if(side){
        SCD_checkpoint(2, i, 1);
        SCD_checkpoint(8, i, 1);
    }
}
function skill_casting(side, i) {
    if(side){
        if(!our_unit_state_remain[i]) window.alert("remain和state不同步幹");
        if(our_member_character[our_unit_member[i]] == 1) {
            skill_casting_kirito(i);
            video_playing_kirito(i);
        }
        else if(our_member_character[our_unit_member[i]] == 2) {
            SCD_checkpoint(2, i, 1);
            skill_casting_megumin(i);
            video_playing_megumin(i);
        }
        else if(our_member_character[our_unit_member[i]] == 3) {
            skill_casting_dio(i);
            video_playing_dio(i);
        }
        else if(our_member_character[our_unit_member[i]] == 4) {
            skill_casting_tanjiro(i);
            video_playing_tanjiro(i);
        }
        else if(our_member_character[our_unit_member[i]] == 5) {
            skill_casting_saber(i);
            video_playing_saber(i);
        }
        else if(our_member_character[our_unit_member[i]] == 6) {
            skill_casting_mash(i);
            video_playing_mash(i);
        }
        else if(our_member_character[our_unit_member[i]] == 7) {
            skill_casting_goro(i);
            video_playing_goro(i);
        }
        else if(our_member_character[our_unit_member[i]] == 8) {
            SCD_checkpoint(8, i, 1);
            skill_casting_rucia(i);
            video_playing_rucia(i);
        }
    }
}
function dead_knock_down(side, i) {
    if(side){
        our_unit_state_remain[i]--;
        if(!our_unit_state_remain[i]){
            our_unit_state_next[i] = 0;
            our_unit_state[i] = 0;
            document.body.removeChild(document.getElementById("our_unit" + i));
        }
    }
    else{
        enemy_unit_state_remain[i]--;
        if(!enemy_unit_state_remain[i]){
            enemy_unit_state_next[i] = 0;
            enemy_unit_state[i] = 0;
            document.body.removeChild(document.getElementById("enemy_unit" + i));
        }
    }
}
function skill_casting_kirito(i) {
    if(our_unit_state_remain[i] == 3300) {
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        our_unit_ACD[i] = 0;
        character_casting[1] = 1;
    }
    else if(200 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1550){
        if(our_unit_position[i] - enemy_forward_position > our_member.RG[our_unit_member[i]]) our_unit_position_next[i] = our_unit_position[i] - 2;
        else if(!our_unit_ACD[i]){
            var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[enemy_forward_unit]] * (1 + (evolution_level - 1) / 4);
            if(damage < guaranteed_damage) damage = guaranteed_damage;
            enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(2 * damage);   //雙刀
            our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
            our_unit_pose_remain[i] = 50;
        }
        if(our_unit_ACD[i]) our_unit_ACD[i]--;
    }
    else if(our_unit_state_remain[i] == 1) {
        our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
    }
}
function video_playing_kirito(i) {
    //console.log(i + " " + our_unit_state_remain[1]);
    if(our_unit_state_remain[i] == 3300){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video1" + ++videoID[1]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video1" + videoID[1] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video1.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 350;
        video_cover = 1;
    }
    else if(our_unit_state_remain[i] > 3200){
        document.getElementById("skill_video1" + videoID[1]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 3200) / 200) + "; z-index: 1000;");
    }
    else if(1550 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1650){
        document.getElementById("skill_video1" + videoID[1]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (1650 - our_unit_state_remain[i]) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] == 1550){
        document.getElementById("skill_video1" + videoID[1]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        delay_remain = 450;
        video_cover = 1;
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video1" + videoID[1]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[1]){
        character_casting[1] = 0;
        document.body.removeChild(document.getElementById("skill_video1" + videoID[1]));
    }
    else{
        document.getElementById("skill_video1" + videoID[1]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_megumin(i) {
    if(our_unit_state_remain[i] == 1800){
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        character_casting[2] = 1;
    }
    else if(our_unit_state_remain[i] == 340){
        for(var j = 1; j <= enemy_unit_num; j++){
            if(!enemy_unit_HP[j]) continue;
            var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[j]] * (1 + (evolution_level - 1) / 4);
            if(damage < guaranteed_damage) damage = guaranteed_damage;
            enemy_unit_HP_next[j] -= Math.floor(damage);
        }
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 1)
        our_unit_HP_next[i] = 0;
}
function video_playing_megumin(i) {
    if(our_unit_state_remain[i] == 1800){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video2" + ++videoID[2]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video2" + videoID[2] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video2.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 350;
        video_cover = 2;
    }
    else if(our_unit_state_remain[i] > 1700){
        document.getElementById("skill_video2" + videoID[2]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 1700) / 200) + "; z-index: 1000;");
    }
    else if(730 < our_unit_state_remain[i] && our_unit_state_remain[i] < 830){
        document.getElementById("skill_video2" + videoID[2]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (830 - our_unit_state_remain[i]) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] == 730){
        document.getElementById("skill_video2" + videoID[2]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        delay_remain = 350;
        video_cover = 2;
    }
    else if(630 < our_unit_state_remain[i] && our_unit_state_remain[i] < 730){
        document.getElementById("skill_video2" + videoID[2]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 630) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video2" + videoID[2]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[2]){
        character_casting[2] = 0;
        document.body.removeChild(document.getElementById("skill_video2" + videoID[2]));
    }
    else{
        document.getElementById("skill_video2" + videoID[2]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_dio(i) {
    if(our_unit_state_remain[i] == 1150) {
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        our_unit_ACD[i] = 0;
        character_casting[3] = 1;
        the_world = 1;
    }
    else if(150 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1150){
        if(our_unit_position[i] - enemy_forward_position > our_member.RG[our_unit_member[i]]) our_unit_position_next[i] = our_unit_position[i] - 1;
        else if(!our_unit_ACD[i]){
            var damage = our_member.SATK[our_unit_member[i]];
            if(damage < guaranteed_damage) damage = guaranteed_damage;
            enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(damage);
            our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
            our_unit_pose_remain[i] = 20;
        }
        if(our_unit_ACD[i]) our_unit_ACD[i]--;
    }
    else if(our_unit_state_remain[i] == 1) {
        our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
        the_world = 0;
    }
}
function video_playing_dio(i) {
    if(our_unit_state_remain[i] == 1150){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video3" + ++videoID[3]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video3" + videoID[3] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video3.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 320;
        video_cover = 3;
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video3" + videoID[3]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[3]){
        character_casting[3] = 0;
        document.body.removeChild(document.getElementById("skill_video3" + videoID[3]));
    }
    else{
        document.getElementById("skill_video3" + videoID[3]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_tanjiro(i) {
    if(our_unit_state_remain[i] == 2500){
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        character_casting[4] = 1;
    }
    else if(our_unit_state_remain[i] > 700){
        if(our_unit_position[i] - enemy_forward_position > our_member.RG[our_unit_member[i]]) our_unit_position_next[i] = our_unit_position[i] - 2;
        else if(!our_unit_ACD[i]){
            var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[enemy_forward_unit]] * (1 + (evolution_level - 1) / 4);
            if(damage < guaranteed_damage) damage = guaranteed_damage;
            enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(damage);
            our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
            our_unit_pose_remain[i] = 50;
        }
        if(our_unit_ACD[i]) our_unit_ACD[i]--;
        our_unit_HP_next[i] -= 1;
    }
    else if(our_unit_state_remain[i] == 600){
        var damage = (enemy_forward_unit ? 99999 : 1000);
        enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(damage);
        our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 1)
        our_unit_HP_next[i] = 0;
}
function video_playing_tanjiro(i) {
    if(our_unit_state_remain[i] == 2500){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video4" + ++videoID[4]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video4" + videoID[4] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video4.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 600;
        video_cover = 4;
    }
    else if(our_unit_state_remain[i] > 2400){
        document.getElementById("skill_video4" + videoID[4]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 2400) / 200) + "; z-index: 1000;");
    }
    else if(900 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1000){
        document.getElementById("skill_video4" + videoID[4]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (1000 - our_unit_state_remain[i]) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] == 900){
        document.getElementById("skill_video4" + videoID[4]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        delay_remain = 800;
        video_cover = 4;
    }
    else if(800 < our_unit_state_remain[i] && our_unit_state_remain[i] < 900){
        document.getElementById("skill_video4" + videoID[4]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 800) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video4" + videoID[4]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[4]){
        character_casting[4] = 0;
        document.body.removeChild(document.getElementById("skill_video4" + videoID[4]));
    }
    else{
        document.getElementById("skill_video4" + videoID[4]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_saber(i) {
    if(our_unit_state_remain[i] == 2500){
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        character_casting[5] = 1;
    }
    else if(200 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1200){
        if(!our_unit_ACD[i]){
            for(var j = 1; j <= enemy_unit_num; j++){
                if(!enemy_unit_HP[j]) continue;
                var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[j]] * (1 + (evolution_level - 1) / 4);
                if(damage < guaranteed_damage) damage = guaranteed_damage;
                enemy_unit_HP_next[j] -= Math.floor(damage);
            }
            our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
            our_unit_pose_remain[i] = 50;
        }
        if(our_unit_ACD[i]) our_unit_ACD[i]--;
    }
    else if(our_unit_state_remain[i] == 1) {
        our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
    }
}
function video_playing_saber(i) {
    if(our_unit_state_remain[i] == 2500){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video5" + ++videoID[5]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video5" + videoID[5] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video5.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 150;
        video_cover = 5;
    }
    else if(our_unit_state_remain[i] > 2400){
        document.getElementById("skill_video5" + videoID[5]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 2400) / 200) + "; z-index: 1000;");
    }
    else if(1350 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1450){
        document.getElementById("skill_video5" + videoID[5]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (1450 - our_unit_state_remain[i]) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] == 1350){
        document.getElementById("skill_video5" + videoID[5]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        delay_remain = 450;
        video_cover = 5;
    }
    else if(1250 < our_unit_state_remain[i] && our_unit_state_remain[i] < 1350){
        document.getElementById("skill_video5" + videoID[5]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 1250) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video5" + videoID[5]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[5]){
        character_casting[5] = 0;
        document.body.removeChild(document.getElementById("skill_video5" + videoID[5]));
    }
    else{
        document.getElementById("skill_video5" + videoID[5]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_mash(i) {
    if(our_unit_state_remain[i] == 2150) {
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        our_unit_ACD[i] = 0;
        character_casting[6] = 1;
    }
    else if(200 < our_unit_state_remain[i] && our_unit_state_remain[i] < 2150){
        if(!our_unit_ACD[i]){
            var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[enemy_forward_unit]] * (1 + (evolution_level - 1) / 4);
            if(damage < guaranteed_damage) damage = guaranteed_damage;
            enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(damage);
            our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
            our_unit_pose_remain[i] = 50;
        }
        if(our_unit_ACD[i]) our_unit_ACD[i]--;
    }
    else if(our_unit_state_remain[i] == 1) {
        our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
    }
}
function video_playing_mash(i) {
    if(our_unit_state_remain[i] == 2150){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video6" + ++videoID[6]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video6" + videoID[6] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video6.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 150;
        video_cover = 6;
    }
    else if(our_unit_state_remain[i] > 2050){
        document.getElementById("skill_video6" + videoID[6]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 2050) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video6" + videoID[6]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[6]){
        character_casting[6] = 0;
        document.body.removeChild(document.getElementById("skill_video6" + videoID[6]));
    }
    else{
        document.getElementById("skill_video6" + videoID[6]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_goro(i) {
    if(our_unit_state_remain[i] == 1400){
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        character_casting[7] = 1;
    }
    else if(our_unit_state_remain[i] == 1130){
        for(var i = 1; i <= enemy_unit_num; i++){
            if(!enemy_unit_HP[i] || enemy_unit_HP_next[i] <= 0 || the_world) continue;
            enemy_unit_state_next[i] = 1;
            enemy_unit_position_next[i] -= knock_down_distance * knock_down_period;
        }
    }
    var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[0]] * (1 + (evolution_level - 1) / 4);
    if(damage < guaranteed_damage) damage = guaranteed_damage;
    else if(our_unit_state_remain[i] == 855){
        enemy_unit_HP_next[0] -= Math.floor(damage);
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 795){
        enemy_unit_HP_next[0] += Math.floor(damage);
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 770){
        enemy_unit_HP_next[0] -= Math.floor(damage);
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 710){
        enemy_unit_HP_next[0] += Math.floor(damage);
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 685){
        enemy_unit_HP_next[0] -= Math.floor(damage);
        our_unit_pose_remain[i] = 50;
    }
    else if(our_unit_state_remain[i] == 1) {
        our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
    }
}
function video_playing_goro(i) {
    if(our_unit_state_remain[i] == 1400){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video7" + ++videoID[7]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video7" + videoID[7] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video7.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 200;
        video_cover = 7;
    }
    else if(our_unit_state_remain[i] > 1300){
        document.getElementById("skill_video7" + videoID[7]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 1300) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video7" + videoID[7]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[7]){
        character_casting[7] = 0;
        document.body.removeChild(document.getElementById("skill_video7" + videoID[7]));
    }
    else{
        document.getElementById("skill_video7" + videoID[7]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}
function skill_casting_rucia(i) {
    if(our_unit_state_remain[i] == 3100) {
        our_unit_skill_SCD[i] = our_member.SCD[our_unit_member[i]];
        our_unit_ACD[i] = 0;
        character_casting[8] = 1;
        legend_of_mermaid = 1;
    }
    else if(200 < our_unit_state_remain[i] && our_unit_state_remain[i] < 3100){
        if(our_unit_position[i] - enemy_forward_position > our_member.RG[our_unit_member[i]]) our_unit_position_next[i] = our_unit_position[i] - 1;
        else if(!our_unit_ACD[i]){
            var damage = our_member.SATK[our_unit_member[i]] - enemy_member.DF[enemy_unit_member[enemy_forward_unit]] * (1 + (evolution_level - 1) / 4);
            if(damage < guaranteed_damage) damage = guaranteed_damage;
            enemy_unit_HP_next[enemy_forward_unit] -= Math.floor(damage);
            our_unit_ACD[i] = our_member.SACD[our_unit_member[i]];
            our_unit_pose_remain[i] = 50;
        }
        if(our_unit_ACD[i]) our_unit_ACD[i]--;
    }
    else if(our_unit_state_remain[i] == 1) {
        our_unit_ACD[i] = our_member.ACD[our_unit_member[i]];
        legend_of_mermaid = 0;
    }
}
function video_playing_rucia(i) {
    if(our_unit_state_remain[i] == 3100){
        var newNode = document.createElement("div");
        newNode.setAttribute("id", "skill_video8" + ++videoID[8]);
        newNode.setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 1; z-index: 1000;");
        newNode.innerHTML = "<video id = 'controll_video8" + videoID[8] + "' class = fill autoplay src = 'https://ubin0914.github.io/ubin/skill_video8.mp4'></video>"
        document.body.appendChild(newNode);
        delay_remain = 150;
        video_cover = 8;
    }
    else if(our_unit_state_remain[i] > 3000){
        document.getElementById("skill_video8" + videoID[8]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (0.5 + (our_unit_state_remain[i] - 3000) / 200) + "; z-index: 1000;");
    }
    else if(our_unit_state_remain[i] != 1 && our_unit_state_remain[i] < 200){
        document.getElementById("skill_video8" + videoID[8]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: " + (our_unit_state_remain[i]) / 400) + "; z-index: 1;";
    }
    else if(our_unit_state_remain[i] == 1 && character_casting[8]){
        character_casting[8] = 0;
        document.body.removeChild(document.getElementById("skill_video8" + videoID[8]));
    }
    else{
        document.getElementById("skill_video8" + videoID[8]).setAttribute("style", "width:100vw; height:100vh; position: absolute; left: 0vw; top: 0vh; opacity: 0.5; z-index: 1;");
    }
}

function video_controll(){
    if(video_cover > 0){  //此時為準備開始delay_remain的瞬間(暫停除外)
        for(var i=1; i<=8; i++){
            if(character_casting[i] == 1 && video_cover != i){
                document.getElementById("controll_video" + i + videoID[i]).pause();
            }
        }
        video_cover = -1;
    }
    else if(video_cover == -1){ //此時為delay_remain剛變為0的瞬間(暫停除外)
        for(var i=1; i<=8; i++){
            if(character_casting[i] == 1){
                document.getElementById("controll_video" + i + videoID[i]).play();
            }
        }
        video_cover = 0;
    }
}
function game_pass() {
    clearInterval(clock_interval);
    document.body.removeChild(document.getElementById("enemy_unit0"));
    document.getElementById("whole").removeChild(document.getElementById("boss_blood_bar"));
    document.getElementById("ending").innerHTML = "<div style = 'width:70vw; height:80vh; position: absolute; left: 15vw; top: 5vh; z-index: 1003;'><img class = fill src = 'images/victory.png'></div><div style = 'position: absolute; left: 38vw; top: 56vh; z-index: 1004;'><h1>&ensp;&ensp;&ensp;&ensp;&ensp;金 幣:&ensp;&ensp;" + gain_gold + "<br>經 驗 藥 水:&ensp;&ensp;" + gain_potion + "<br>&ensp;&ensp;&ensp;&ensp;&ensp;碎 片:&ensp;&ensp;" + gain_fragments + "<h1></div>"
    var obj = {}
    obj.userID = userID;
    obj.stage = stage;
    obj.stage_level = stage_level;
    obj.gain_gold = gain_gold;
    obj.gain_potion = gain_potion;
    obj.gain_fragments = gain_fragments;
    $.post("update_account_data.php", obj, function(){
        document.getElementById("whole").innerHTML += "<a href = '../HomePage/HomePage.html'><div class = affordable style = 'width:20vw; height:10vh; position: absolute; left: 40vw; top: 85vh; z-index: 1004;'><img class = fill src = 'images/leave.png'></div></a>";
    });
}
function game_over() {
    clearInterval(clock_interval);
    document.body.removeChild(document.getElementById("our_unit0"));
    document.getElementById("whole").removeChild(document.getElementById("tower_blood_bar"));
    document.getElementById("ending").innerHTML = "<div style = 'width:50vw; height:50vh; position: absolute; left: 25vw; top: 5vh; z-index: 1003;'><img class = fill src = 'images/defeat.png'></div>"
    document.getElementById("whole").innerHTML += "<a href = '../HomePage/HomePage.html'><div class = affordable style = 'width:20vw; height:10vh; position: absolute; left: 40vw; top: 85vh; z-index: 1004;'><img class = fill src = 'images/leave.png'></div></a>";
}

window.addEventListener("load", loading, false);
//破千行紀錄啦!!!!!!!!!