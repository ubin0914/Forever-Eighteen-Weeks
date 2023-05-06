function register(){
    var obj = {};
    obj.username = document.getElementById("username").value;
    obj.password = document.getElementById("password").value;
    if(obj.username && obj.password){
        $.post("create_user_table.php", obj, function(success){
            if(success)
                document.getElementById("hint").innerHTML = '<div style = "color: lime; font-size: 20px; position: absolute; right: 50vw; top: 60vh;"><b>Successed!</b></div>'
            else
                document.getElementById("hint").innerHTML = '<div style = "color: red; font-size: 20px; position: absolute; right: 47vw; top: 60vh;"><b>The Username is exist!</b></div>'
        })
    }
}