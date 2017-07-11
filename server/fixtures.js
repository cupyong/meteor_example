

//服务端相关的配置文件
//console.log(process.env)

//调研家


weixinConfig={
    appID:"wxdec30aa5914743f0",//微信
    appsecret:"0ada869e7688e5f4eaef8850164366b7",//微信
    token:"garden",//微信
    mch_id:"1247504701" ,//微信商户号
    nonce_str:"wenjuanba",//微信
    key:"192006250b4c09247ec02edce69f6a2d",//微信
    url:"http://v.wenjuanba.com/",
    PFX:"/home/oliver/wj8/villi/cert/apiclient_cert.p12",//微信
    email_user:"postmaster@wenjuanba.com.cn",
    email_password:"Abca123098",
    email_smtp:"smtpdm.aliyun.com",
    email_port:25,
    dx_AppKey:"23352028",
    dx_AppSecret:"7ef867fbe8ffa1b8eaa6bf743c83450c",
    alidayuUrl:'http://gw.api.taobao.com/router/rest',
    sms_setphone:{
        name:"问卷吧",
        code:"SMS_7900140",
    }
}
if(process.env.METEOR_ENV==="production"){
    weixinConfig.url='http://v.wenjuanba.com/';
    weixinConfig.PFX="/home/oliver/wj8/villi/cert/apiclient_cert.p12";

}else{
    weixinConfig.url='http://localhost:3000/';
    weixinConfig.PFX="/home/oopsdata1/cert/apiclient_cert.p12";
}

//问卷吧

//weixinConfig={
//    appID:"wx16343cb2c71e4c90",//微信公众号
//    appsecret:"5f2c6fddb3824d439c7be9d177d209f5",//微信公众号
//    token:"wenjuanba2015wecharts",//微信公众号
//    mch_id:"1241798002" ,//微信商户号
//    nonce_str:"wenjuanba",//微信（自定义设置）
//    key:"huangdonghonggaoyuzhenqiyang2016",//微信（商户密钥）
//    url:"http://v.wenjuanba.com/",
//    PFX:"/home/oliver/wj8/villi/cert_wj8/apiclient_cert.p12",//微信
//    dx_AppKey:"23348025",
//    dx_AppSecret:"06087751bbe018a86c016a0ab706e0f9",
//    alidayuUrl:'http://gw.api.taobao.com/router/rest',
//    email_user:"postmaster@wenjuanba.com.cn",
//    email_password:"Abca123098",
//    email_smtp:"smtpdm.aliyun.com",
//    email_port:25,
//    sms_setphone:{
//        name:"问卷吧",
//        code:"SMS_7735498",
//    }
//}
//
//
//if(process.env.METEOR_ENV==="production"){
//    weixinConfig.url='http://v.wenjuanba.com/';
//    weixinConfig.PFX="/home/oliver/wj8/villi/cert_wj8/apiclient_cert.p12";
//
//}else{
//    weixinConfig.url='http://localhost:3000/';
//    weixinConfig.PFX="/home/oopsdata1/cert/apiclient_cert.p12";
//}
console.log(weixinConfig);
if (Users.find().count() === 0) {
    Users.insert({
        openId:"123",
        name:"asdasd0",
        headUrl:"http://www",
        sex:0
    })
}
//插入常见性别问题
if(CommonQuestions.find({name:"sex"}).count()===0){
    CommonQuestions.insert({
        name:'sex',
        type:1,
        common:true,
        title:'您的性别',
        must:false,
        options:[ //选项
            {
                key:1,
                content:"男",
                link:null,//问题跳转的id
            },
            {
                key:2,
                content:"女",
                link:null,//问题跳转的id
            }
        ],
        issue:{
            is_rand:false,
            other_option:false
        }
    })
}
//插入常见年龄问题
if(CommonQuestions.find({name:"age"}).count()===0){
    CommonQuestions.insert({
        name:'age',
        type:1,
        common:true,
        title:'您的年龄段',
        must:false,
        options:[ //选项
            {
                key:1,
                content:"20岁以下",
                link:null,//问题跳转的id
            },
            {
                key:2,
                content:"20~30岁",
                link:null,//问题跳转的id
            }
            ,
            {
                key:3,
                content:"30~40岁",
                link:null,//问题跳转的id
            }
            ,
            {
                key:4,
                content:"40~50岁",
                link:null,//问题跳转的id
            }
            ,
            {
                key:5,
                content:"50岁以上",
                link:null,//问题跳转的id
            }
        ],
        issue:{
            is_rand:false,
            other_option:false
        }
    })
}
//插入所在地问题
if(CommonQuestions.find({name:"address"}).count()===0){
    CommonQuestions.insert({
        name:'address',
        type:4,
        title:'您的所在地',
        must:false,
        common:true,
        issue:{
            placeholder:'输入您的所在地',
            other_option:false,
            onlynum:false,
        }
    })
}
//插入phone问题
if(CommonQuestions.find({name:"phone"}).count()===0){
    CommonQuestions.insert({
        name:'phone',
        type:4,
        title:'您的电话',
        must:false,
        common:true,
        issue:{
            placeholder:'输入您的电话',
            other_option:false,
            onlynum:false,
        }
    })
}

//插入身份证问题
if(CommonQuestions.find({name:"idcard"}).count()===0){
    CommonQuestions.insert({
        name:'idcard',
        type:4,
        title:'您的身份证',
        must:false,
        common:true,
        issue:{
            placeholder:'输入您的身份证',
            other_option:false,
            onlynum:false,
        }
    })
}

//插入职业问题
if(CommonQuestions.find({name:"profession"}).count()===0){
    CommonQuestions.insert({
        name:'profession',
        type:4,
        title:'您的职业',
        must:false,
        common:true,
        issue:{
            placeholder:'输入您的职业',
            other_option:false,
            onlynum:false,
        }
    })
}

//插入收入问题
if(CommonQuestions.find({name:"income"}).count()===0){
    CommonQuestions.insert({
        name:'income',
        type:1,
        title:'您的收入水平',
        common:true,
        must:false,
        options:[ //选项
            {
                key:1,
                content:"1000以下",
                link:null,//问题跳转的id
            },
            {
                key:2,
                content:"1000~3000",
                link:null,//问题跳转的id
            }
            ,
            {
                key:3,
                content:"3000~5000",
                link:null,//问题跳转的id
            }
            ,
            {
                key:4,
                content:"5000~10000",
                link:null,//问题跳转的id
            }
            ,
            {
                key:5,
                content:"10000～20000",
                link:null,//问题跳转的id
            }
            ,
            {
                key:6,
                content:"20000以上",
                link:null,//问题跳转的id
            }
        ],
        issue:{
            is_rand:false,
            other_option:false
        }
    })
}
//插入婚姻状况问题
if(CommonQuestions.find({name:"marriage"}).count()===0){
    CommonQuestions.insert({
        name:'marriage',
        type:1,
        title:'您的婚姻状况',
        must:false,
        common:true,
        options:[ //选项
            {
                key:1,
                content:"单身",
                link:null,//问题跳转的id
            },
            {
                key:2,
                content:"已婚",
                link:null,//问题跳转的id
            },
            {
                key:3,
                content:"离异",
                link:null,//问题跳转的id
            },
            {
                key:4,
                content:"丧偶",
                link:null,//问题跳转的id
            }
        ],
        issue:{
            is_rand:false,
            other_option:false
        }
    })
}

//微信相关
//定时获取token
 getToken=function(){
    //Tokens.remove({_id:"access_token"})
    //Tokens.remove({_id:"jsapi_ticket"})
    var url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+
        weixinConfig.appID+"&secret="+weixinConfig.appsecret;

    var getTokenjsonp  = HTTP.call('get',url,null)

     console.log(getTokenjsonp)
     var token = getTokenjsonp.data.access_token;
     if(Tokens.find({_id:"access_token"}).count()>0){
         Tokens.update({
                 _id:"access_token"
             },{
                 "access_token":token,
                 "time":moment().format('YYYY-MM-DD HH:mm:ss'),
                 "time_sort":Date.now()
             }
         )
     }else{
         Tokens.insert({
             _id:"access_token",
             "access_token":token,
             "time":moment().format('YYYY-MM-DD HH:mm:ss'),
             "time_sort":Date.now()
         })
     }
     var jsurl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token
         +"&type=jsapi"
     var getJsToken = HTTP.call('get',jsurl,null);

     if(Tokens.find({_id:"jsapi_ticket"}).count()>0){
         Tokens.update({
                 _id:"jsapi_ticket"
             },{
                 "jsapi_ticket":getJsToken.data.ticket,
                 "time_sort":Date.now(),
                 "time":moment().format('YYYY-MM-DD HH:mm:ss')
             }
         )
     }else{
         Tokens.insert({
             _id:"jsapi_ticket",
             "jsapi_ticket":getJsToken.data.ticket,
             "time":moment().format('YYYY-MM-DD HH:mm:ss'),
             "time_sort":Date.now()
         })
     }



    //HTTP.call('get',url,null,function(err,result){
    //    var json = JSON.parse(result.content);
    //    var token=json.access_token;
    //    console.log(json)
    //
    //    if(Tokens.find({_id:"access_token"}).count()>0){
    //        Tokens.update({
    //                _id:"access_token"
    //            },{
    //                "access_token":token,
    //                "time":moment().format('YYYY-MM-DD HH:mm:ss'),
    //                "time_sort":Date.now()
    //            }
    //        )
    //    }else{
    //        Tokens.insert({
    //            _id:"access_token",
    //            "access_token":token,
    //            "time":moment().format('YYYY-MM-DD HH:mm:ss'),
    //            "time_sort":Date.now()
    //        })
    //    }
    //
    //    var jsurl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token
    //        +"&type=jsapi"
    //    HTTP.call('get',jsurl,null,function(err,result){
    //
    //        var jsjson = JSON.parse(result.content);
    //        console.log(jsjson)
    //        if(Tokens.find({_id:"jsapi_ticket"}).count()>0){
    //            Tokens.update({
    //                    _id:"jsapi_ticket"
    //                },{
    //                "jsapi_ticket":jsjson.ticket,
    //                "time_sort":Date.now(),
    //                "time":moment().format('YYYY-MM-DD HH:mm:ss')
    //                }
    //            )
    //        }else{
    //            Tokens.insert({
    //                _id:"jsapi_ticket",
    //                "jsapi_ticket":jsjson.ticket,
    //                "time":moment().format('YYYY-MM-DD HH:mm:ss'),
    //                "time_sort":Date.now()
    //            })
    //        }
    //   })
    //
    //})
}
//getToken();
//setInterval(function() {
//    getToken();
//}, 7000*1000);

if(process.env.METEOR_ENV==="production"){
    getToken();
    setInterval(function() {
        getToken();
    }, 7000*1000);
}


//监测是否超过12小时未答题的
checkUseranswers =function(){
   var useranswers = Useranswers.find({complete:false}).fetch();
   for(var i=0;i<useranswers.length;i++){
       var useranswer =useranswers[i];
        var now =new Date().getTime();

        console.log(now-useranswer.complete_time_sort>12*3600*1000)
        if(now-useranswer.complete_time_sort>12*3600*1000){
            console.log(12*3600*1000)
            Useranswers.update({_id:useranswers[i]._id},{$set:{type:"delete"}})
            //清除答案
            var openId =useranswer.openId;
            var questionnaire_id = useranswer.questionnaire_id;
            Answers.remove({openId:openId,questionnaire_id:questionnaire_id})
        }

    }
}
checkUseranswers();
setInterval(function() {
    checkUseranswers();
}, 1800*1000);



