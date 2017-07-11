/**
 * Created by oopsdata1 on 16-2-5.
 */
//微信
init_weixin=function(cb){
    require.config({
        paths : {
            "mychat" : ["https://res.wx.qq.com/open/js/jweixin-1.0.0"]
        }
    })
    require(["mychat"],function(wx){
       var url=encodeURIComponent(window.location.href);
       var timestamp =new Date().getTime();
        HTTP.call("get","/api/getjssdk?url="+url+"&timestamp="+timestamp,null,function(err,result){
            var json =JSON.parse(result.content)
            var jsapi_ticket = json.jsapi_ticket;
            var signature =json.signature
            wx.config({
                debug: false,
                appId: weixinClint.appID,
                timestamp: timestamp,
                nonceStr: 'wenjuanba',
                signature: signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'chooseWXPay'
                ]
            });
            cb(wx);
        })
    })}


getweixinUrl=function(path){
   var url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinClint.url+path)+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
   return url;
}

//init_weixin(function(wx){
//   wx.ready(function () {
//   })
//});

