function login(){
    var obj = {};
    obj.username = document.getElementById("username").value;
    obj.password = document.getElementById("password").value;
    $.post("update_server.php", obj, function(id){
        if(id == -1){
            document.body.innerHTML += '<div style = "color: red; font-size: 20px; position: absolute; right: 41.5vw; top: 60vh;"><b>username or password is incorrect!</b></div>'
        }
        else
            window.location.href = "../HomePage/HomePage.html";
    })
}