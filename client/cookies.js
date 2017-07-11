/**
 * Created by oopsdata1 on 16-2-17.
 */
//设置cookie
setCookie=function(cname, cvalue){
    var d = new Date();
    d.setTime(d.getTime() + (5*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
getCookie=function(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

//清除cookie
clearCookie = function(name){
    var cvalue=""
    var d = new Date();
    d.setTime(d.getTime() + (-1*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + cvalue + "; " + expires;
}
