/**
 * Created by oopsdata1 on 16-2-29.
 */
/**
 * Created by oopsdata1 on 16-2-18.
 */

//服务端Api

//输出jssdk参数
Router.route('/api/getjssdk', {
        where: 'server',
        name:'getjssdk'
    })
    .get(function () {

        var url=this.request.query.url;
        //var timestamp =new Date().getTime();
        timestamp = this.request.query.timestamp
        var jsapi_ticket = Tokens.findOne({_id:"jsapi_ticket"}).jsapi_ticket;
        var string1 = "jsapi_ticket="+jsapi_ticket+"&noncestr=wenjuanba&timestamp="+timestamp+"&url="+url;
        var signature =CryptoJS.SHA1(string1).toString()
        var json={
            url:url,
            timestamp:timestamp,
            jsapi_ticket:jsapi_ticket,
            signature:signature,
            noncestr:"wenjuanba"
        }

        this.response.end(JSON.stringify(json));
    })
//获取openId
Router.route('/api/getopenId', {
        where: 'server',
        name:'getopenId'
    })
    .get(function () {
        var code= this.request.query.code;
        var appid=weixinConfig.appID;
        var secret=weixinConfig.appsecret;
        var url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid
            +"&secret="+secret+"&code="+this.params.query.code+"&grant_type=authorization_code"
        var fa= this;
        HTTP.call('GET', url, null, function(err,result){
            var json = JSON.parse(result.content);
            if(Users.findOne({openId:json.openid})){

            }else{
                Users.insert({
                    openId:json.openid
                })
            }
            var token=json.access_token;
            var urlopenId="https://api.weixin.qq.com/sns/userinfo?access_token="+token
                +"&openid="+json.openid+"&lang=zh_CN";
            //HTTP.call('GET',urlopenId,null,function(err,result){
            //    console.log(err);
            //    console.log(result);
            //})



            var access_token=Tokens.findOne({_id:"access_token"})

            var urlthis = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token.access_token
                +"&openid="+json.openid+"&lang=zh_CN"
            console.log(urlthis);
            HTTP.call('GET',urlthis,null,function(err,result){
                console.log(err);
                console.log(result.data);
                if(result.data&&result.data.openid){
                    var jsondata =  result.data
                    jsondata.openId=json.openid;
                    if(Users.findOne({openId:json.openid})){

                      Users.update({openId:json.openid},{$set:jsondata})
                    }else{
                        Users.insert(jsondata)
                    }
                }

            })

            fa.response.end(json.openid);
        })


    })

//支付接口 用来回调的页面
Router.route('/api/jspay/pay',{
    where:'server',
    name:'jspay'
}).post(function(){
    var body=""
    this.request.on('data',Meteor.bindEnvironment(function(data){
        body += data;
        xml2js.parseString(body, Meteor.bindEnvironment(function(err, res) {
            var orderno= res.xml.out_trade_no;
            Paycallbacks.insert(res.xml);

            var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+orderno+"==========支付业务"
            Logs.insert({content:content,type:2})

            console.log(res.xml);
            if(res.xml.result_code=='SUCCESS'){
                console.log(orderno[0])
                var questionnaire
                //充值成功那么修改问卷中的money
                //为了保证正确性 必须先查询Payorders中的status是否改变 如果改变了那么说明money已经新增了
                var payorders = Payorders.findOne({out_trade_no:orderno[0]});
                if(payorders.status!=1){
                    var questionnaire = Questionnaires.findOne({_id:payorders.questionnaireid})
                    var addmoney = parseInt(res.xml.total_fee)
                    var money =parseFloat(((questionnaire.money*100+addmoney)/100).toFixed(2))
                    Questionnaires.update({_id:payorders.questionnaireid},{$set:{money:money}})
                }

                console.log(Payorders.findOne({out_trade_no:orderno[0]}));
                Payorders.update({out_trade_no:orderno[0]},{$set:{status:1}})
            }else{
                Payorders.update({out_trade_no:orderno[0]},{$set:{status:-1}})
            }

        }));
        console.log(body)
    }));
    this.response.end(JSON.stringify({a:2}));
})

//微信统一下单接口
Router.route('/api/pay/unifiedorder',{
        where:'server',
        name:'unifiedorder'
    })
    .get(function(){
        var fa= this;
        var questionnaireid = this.request.query.questionnaireid;
        var questionnaire= Questionnaires.findOne({_id:questionnaireid});
        var ip= this.request.connection.remoteAddress;
        var openId =  this.request.query.openId;
        var money =  this.request.query.money;
        var timestamp = this.request.query.timestamp;
        var out_trade_no = moment().format('YYYYMMDDHHmmss')+(parseInt((Math.random()*1000))).toString();
        var list=[];
        list.push({key:"appid",value:weixinConfig.appID})
        list.push({key:"attach",value:"支付"})
        list.push({key:"body",value:questionnaire.title+"---充值支付"})
        list.push({key:"mch_id",value:weixinConfig.mch_id})
        list.push({key:"nonce_str",value:weixinConfig.nonce_str})
        list.push({key:"notify_url",value:weixinConfig.url+"api/jspay/pay"})
        list.push({key:"openid",value:openId})
        list.push({key:"out_trade_no",value:out_trade_no})
        list.push({key:"spbill_create_ip",value:ip})
        list.push({key:"total_fee",value:money})
        list.push({key:"trade_type",value:"JSAPI"})


        var orderjson ={
            appid:weixinConfig.appID,
            attach:"支付",
            body:questionnaire.title+"---充值支付",
            mch_id:weixinConfig.mch_id,
            nonce_str:weixinConfig.nonce_str,
            openid:openId,
            out_trade_no:out_trade_no,
            total_fee:money,
            trade_type:"JSAPI",
            questionnaireid:questionnaireid,
            type:1,
            status:0//-1表示支付失败   0 表示未支付  1表示支付成功
        }


        Payorders.insert(orderjson)


        var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+questionnaire._id+"==========下单业务"
        Logs.insert({content:content,type:1})


        var xml= getXMl(list);

        var url="https://api.mch.weixin.qq.com/pay/unifiedorder";
        var option={content:xml};
        console.log(option)
        HTTP.call("POST",url,option,function(err,result){
            var  content=result.content;
            xml2js.parseString(content, function(err, res) {
                console.log(res)
                var prepay_id= res.xml.prepay_id;
                var listpay=[];
                listpay.push({key:"appId",value:weixinConfig.appID})
                listpay.push({key:"nonceStr",value:weixinConfig.nonce_str})
                listpay.push({key:"package",value:"prepay_id="+prepay_id})
                listpay.push({key:"signType",value:'MD5'})
                listpay.push({key:"timeStamp",value:timestamp})
                var sign =getsign(listpay);
                var json={
                    package:"prepay_id="+prepay_id,
                    paySign:sign
                }
                console.log(json)
                console.log(listpay);
                fa.response.end(JSON.stringify(json));

            });
        })
    })

//test post
Router.route('/api/testpost', {
        where: 'server',
        name:'testpost'
    })
    .post(function () {
        var body=""
        this.request.on('data',function(data){
            body += data;
            console.log("body")
            console.log(body)
        });
        this.response.end(JSON.stringify({a:2}));
    });

//手动领取红包接口
Router.route('api/pay/redmoney',{
    where:'server',
    name:'redmoney'
}).get(function(){
    var fa= this;
    //根据用户计算有多少红包没有领取
    var openId =  this.request.query.openId;
    //查询
    var shareclick= Shareclicks.find({shareopenid:openId}).fetch();
    var sharecomplete = Sharecompletes.find({shareopenid:openId}).fetch();
    var sharemoney= Sharemoneys.find({openId:openId}).fetch();
    var allredmoney=shareclick.length*0.1+sharecomplete.length*0.1;
    var surplus=allredmoney;
    for(var i=0;i<sharemoney.length;i++){
        surplus-=sharemoney[i].money;
    }
    var money = surplus*100;
    if(money>=100){
        var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+openId+"==========手动红包业务"
        Logs.insert({content:content,type:3})

        money= parseInt(money);
        var xml= getRedXml(fa,money,openId,'',4)
        console.log(xml);
        var url="https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
        var option={content:xml};
        sendRedToUser(xml,Meteor.bindEnvironment(function(err,data){
            if(!err){
                var payorders = Payorders.findOne({mch_billno:data});
                Payorders.update({mch_billno:data},{$set:{status:1}})
                //添加红包记录
                Sharemoneys.insert({
                    openId:openId,
                    money:money/100,
                    time_sort:Date.now(),
                    time:moment().format('YYYY-MM-DD HH:mm:ss')
                })
                fa.response.end("ok");
            }else{
                var payorders = Payorders.findOne({mch_billno:data});
                Payorders.update({mch_billno:data},{$set:{status:-1}})
                fa.response.end("error");
            }
        }))
    }else{
        fa.response.end("金额不足");
    }

})


Router.route('/api/pay/red',{
        where:'server',
        name:'sendred'
    })
    .get(function(){
        var questionnaireid=this.request.query.questionnaireid// 问卷id
        //查询是否是红包问卷
        var question= Questionnaires.findOne({_id:questionnaireid})
        var useranswer = Useranswers.find({questionnaire_id:questionnaireid,complete:true}).fetch();

        var fa= this;
        if(question.level==0){  //普通问卷
            fa.response.end("ok");
        }else{
            var ip= this.request.connection.remoteAddress;
            var openId =  this.request.query.openId;
            var money=0;
            //计算金额
           if(question.level==1){ //固定红包
                //计算金额
                money = question.singlemoney*100;
               if(isNaN(money)){
                   money=100;
               }
                console.log("singlemoney"+money)
                //money=parseInt(question.money/(question.maxCount-useranswer.length+1)*100);
                if(money<100&&question.money>=1){
                    money=100
                }
                console.log("1:"+money)
            }
            if(question.level==2){//随机红包
                //计算金额
                var peoplecount=question.maxCount-useranswer.length+1
                var minmoney = 100; //

                var subsmoney = question.money*100-minmoney*peoplecount;
                if(subsmoney<=0){
                    money = minmoney;
                }else{
                    var randommoney=0;
                    //计算随机数
                    //随机大小 在 0——subsmoney中间（分成（qpeoplecount）份）
                    var redrandommoney=[];
                    for(var i=0;i<peoplecount;i++){
                        if(i==peoplecount-1){
                            redrandommoney.push(subsmoney)
                        }else{
                            var randomnum = parseFloat((Math.random()*subsmoney))
                            redrandommoney.push(randomnum)
                            subsmoney-=randomnum;
                        }
                    }
                    console.log(redrandommoney);
                    if(peoplecount==1){
                        randommoney= subsmoney
                    }else{
                        randommoney= redrandommoney[parseInt(Math.random()*peoplecount)];
                    }
                    if(minmoney<100&&question.money>=1){
                        money=100
                    }else{
                        money=minmoney+randommoney;
                    }
                }
            }


            if(money<100){
                console.log("余额不足")
                fa.response.end("余额不足");
            }else{

                var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+openId+"========="+questionnaireid+"==========回答问卷红包业务"
                Logs.insert({content:content,type:4})

                money = parseInt(money);
                var xml= getRedXml(fa,money,openId,questionnaireid,2,"问卷吧",question.title)
                console.log(xml);
                sendRedToUser(xml,Meteor.bindEnvironment(function(err,data){
                    if(!err){
                        var payorders = Payorders.findOne({mch_billno:data});
                        Payorders.update({mch_billno:data},{$set:{status:1}})

                        //修改余额
                        var subsmoney= question.money-money/100
                        Questionnaires.update({_id:questionnaireid},{$set:{money:subsmoney}})
                        console.log("subsmoney:"+subsmoney)
                        //添加红包记录
                        var answerred ={
                            openId:openId,
                            questionnaire_id:questionnaireid,
                            money:money/100,
                            time:moment().format('YYYY-MM-DD HH:mm:ss'),
                            time_sort:Date.now()
                        }
                        Answerreds.insert(answerred)
                        var resultjson={
                            openId:openId,
                            questionnaire_id:questionnaireid,
                            money:money/100,
                        }
                        checkquestionnairecomplete(questionnaireid)
                        fa.response.end(JSON.stringify(resultjson));
                    }else{
                        var payorders = Payorders.findOne({mch_billno:data});
                        Payorders.update({mch_billno:data},{$set:{status:-1}})
                        var resultjson={
                            error:true
                        }
                        checkquestionnairecomplete(questionnaireid)
                        fa.response.end(JSON.stringify(resultjson));
                    }
                }))

            }
        }
    })




checkquestionnairecomplete=function (id){
    var questionnaires=Questionnaires.findOne({_id:id});
    var useransewrs = Useranswers.find({questionnaire_id:id,complete:true}).fetch()
    if(useransewrs){
        if(useransewrs.length>=questionnaires.maxCount){
            Questionnaires.update({_id:id},{$set:{"status":2}})
            //退还现金
            if(questionnaires.money>0){
                var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+questionnaires._id+"==========退款业务1"
                Logs.insert({content:content,type:6.1})
                HTTP.call('get', weixinConfig.url+'/api/back/money?openId='+questionnaires.openId+'&questionnaireid='+questionnaires._id,null)
            }
        }
    }
}





//发放红包
sendRedToUser=function(xml,cb){
    var SEND_REDPACK_URL = "https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
    //var PFX = '/home/oopsdata1/cert/apiclient_cert.p12';
    var fs =Npm.require('fs');

    request({
            url: SEND_REDPACK_URL,
            method: 'POST',
            body: xml,
            agentOptions: {
                pfx: fs.readFileSync(weixinConfig.PFX),
                passphrase:  weixinConfig.mch_id
            }
        },
        function(err, response, body){
            console.log(body);
            xml2js.parseString(body, function(err, res) {
                console.log(res)
                var mch_billno= res.xml.mch_billno;
                if(res.xml&&res.xml.return_code=='SUCCESS'){
                    //修改payorder状态
                    console.log(mch_billno[0])
                    cb(null,mch_billno[0])
                }else {
                   cb('error',mch_billno[0])
                }
            });
        });
}



//问卷结束后退还现金
Router.route('/api/back/money',{
        where:'server',
        name:'backmoney'
    })
    .get(function(){
        var fa= this;
        var questionnaireid=this.request.query.questionnaireid// 问卷id
        //查询是否是红包问卷
        var question= Questionnaires.findOne({_id:questionnaireid})

        if(!question){
              //问卷不存在
            fa.response.end("error");
            return;
        }

        var ip= this.request.connection.remoteAddress;
        var openId =  this.request.query.openId;

        if(question.status!=2){
            //问卷未结束
            fa.response.end("error");
            return;
        }

        if(question.level==0){  //普通问卷
            fa.response.end("ok");
        }else{
            var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+questionnaireid+"==========退款业务2"
            Logs.insert({content:content,type:6})


            var ip= this.request.connection.remoteAddress;
            var openId =  this.request.query.openId;
            //计算退款金额
            var money=question.money*100;
            var out_trade_no = moment().format('YYYYMMDDHHmmss')+(parseInt((Math.random()*1000))).toString();
            var list=[];
            list.push({key:"mch_appid",value:weixinConfig.appID})
            list.push({key:"mchid",value:weixinConfig.mch_id})
            list.push({key:"nonce_str",value:weixinConfig.nonce_str})
            list.push({key:"partner_trade_no",value:out_trade_no})
            list.push({key:"openid",value:openId})
            list.push({key:"check_name",value:"NO_CHECK"})
            list.push({key:"amount",value:money})
            list.push({key:"desc",value:"余额退款"})
            list.push({key:"spbill_create_ip",value:ip})
            var xml = getXMl(list);

             var payjson={
                 mch_appid:weixinConfig.appID,
                 mchid:weixinConfig.mch_id,
                 nonce_str:weixinConfig.nonce_str,
                 partner_trade_no:out_trade_no,
                 openid:openId,
                 check_name:'NO_CHECK',
                 amount:money,
                 desc:'余额退款',
                 questionnaireid:questionnaireid,
                 type:3,
             }



            sendMoneyToUser(xml,Meteor.bindEnvironment(function(err,data){
                if(!err){
                    //退款成功后清除money
                    Questionnaires.update({_id:questionnaireid},{$set:{money:0}});
                    Payorders.insert(payjson)
                    fa.response.end("ok");
                }else{
                    fa.response.end("error");
                }
            }))

        }
    })

//付款
sendMoneyToUser=function(xml,cb){
    var SEND_REDPACK_URL = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
    //var PFX = '/home/oopsdata1/cert/apiclient_cert.p12';
    var fs =Npm.require('fs');

    request({
            url: SEND_REDPACK_URL,
            method: 'POST',
            body: xml,
            agentOptions: {
                pfx: fs.readFileSync(weixinConfig.PFX),
                passphrase: weixinConfig.mch_id
            }
        },
        function(err, response, body){
             xml2js.parseString(body, function(err, res) {
                console.log(res)
                if(res.xml&&res.xml.return_code=='SUCCESS'&&res.xml.result_code=='SUCCESS'){
                    cb(null,"ok")
                }else{
                    cb('error',res.xml.return_msg)
                }

            });
        });
}



//用于商户对已发放的红包进行查询红包的具体信息
//根据订单类型 questionId 获取订单信息

Router.route('api/findredpay',{
    where:'server',
    name:'findredpay'
}).get(function(){
    var fa = this;
    var type = parseInt(this.request.query.type);
    var questionnaireId = this.request.query.questionnaireId;
    var openId = this.request.query.openId;
    var beopenid =  this.request.query.beopenid;
    var mch_billno=""
    if(type==2){
        var payorder=  Payorders.findOne({questionnaire_id:questionnaireId,type:type});
        mch_billno = payorder.mch_billno; //订单信息
    }else{
        var payorder=  Payorders.findOne({re_openid:openId,type: parseInt(type)});
        mch_billno = payorder.mch_billno; //订单信息
    }


    var list=[];
    list.push({key:"nonce_str",value:weixinConfig.nonce_str})
    list.push({key:"mch_billno",value:mch_billno})
    list.push({key:"mch_id",value:weixinConfig.mch_id})
    list.push({key:"appid",value:weixinConfig.appID})
    list.push({key:"bill_type",value:"MCHT"})
    var xml = getXMl(list);
    var SEND_REDPACK_URL = "https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo";
    //var PFX = '/home/oopsdata1/cert/apiclient_cert.p12';
    var fs =Npm.require('fs');

    request({
            url: SEND_REDPACK_URL,
            method: 'POST',
            body: xml,
            agentOptions: {
                pfx: fs.readFileSync(weixinConfig.PFX),
                passphrase: weixinConfig.mch_id
            }
        },
        Meteor.bindEnvironment(function(err, response, body){
           xml2js.parseString(body, Meteor.bindEnvironment(function(err, res) {
                if(res.xml&&res.xml.status){
                    if(type==6){ //用户绑定
                        Users.update({openId:openId},{$set:{redstatus:res.xml.status[0]}})
                    }
                    if(type==5){ //用户邀请
                        Invitations.update({openId:openId,beopenid:beopenid},{$set:{status:res.xml.status[0]}})
                    }
                    if(type==2){ //回答问题
                       Answerreds.update({openId:openId,questionnaire_id:questionnaireId},{$set:{status:res.xml.status[0]}})
                    }
                    fa.response.end(res.xml.status[0])
                }else{
                    fa.response.end("")
                }

            }));

        }));

})






getRedXml=function(fa,money,openId,questionnaireid,type,title,content,beopenId){
    var title=title||"问卷吧";
    var content=content||"红包"
    var ip= fa.request.connection.remoteAddress||"127.0.0.1";
    var out_trade_no = moment().format('YYYYMMDDHHmmss')+(parseInt((Math.random()*1000))).toString();
    var list=[];
    list.push({key:"mch_billno",value:out_trade_no})
    list.push({key:"mch_id",value:weixinConfig.mch_id})
    list.push({key:"wxappid",value:weixinConfig.appID})
    list.push({key:"send_name",value:title})
    list.push({key:"re_openid",value:openId})
    list.push({key:"total_amount",value:money})
    list.push({key:"total_num",value:1})
    list.push({key:"wishing",value:content})
    list.push({key:"client_ip",value:ip})
    list.push({key:"act_name",value:content})
    list.push({key:"remark",value:content})
    list.push({key:"nonce_str",value:weixinConfig.nonce_str})
    var xml = getXMl(list);

    var payjson={
        questionnaire_id:questionnaireid,
        mch_billno:out_trade_no,
        mch_id:weixinConfig.mch_id,
        wxappid:weixinConfig.appID,
        send_name:title,
        re_openid:openId,
        total_amount:money,
        total_num:1,
        wishing:content,
        act_name:content,
        remark:content,
        nonce_str:weixinConfig.nonce_str,
        type:type,
        status:0,
        beopenId:beopenId
    }
    Payorders.insert(payjson)
    return xml;

}


getXMl=function(list){
    list.push({key:"sign",value:getsign(list)})
    var newlist =[];
    for(var i=0;i<list.length;i++){
        newlist.push("<"+list[i].key+">"+list[i].value+"</"+list[i].key+">")
    }
    return "<xml>"+newlist.join('')+ "</xml>";
}



getsign=function(list){
    list = _.sortBy(list, 'key');//按key排序
    var newlist =[];
    for(var i=0;i<list.length;i++){
        newlist.push(list[i].key+"="+list[i].value)
    }
    var stringA=newlist.join('&')
    var stringSignTemp = stringA+"&key="+weixinConfig.key;
    var sign = CryptoJS.MD5(stringSignTemp).toString().toUpperCase()
    return sign;
}


//生成带参数的二维码

Router.route('/api/getqrcodeurl', {
        where: 'server',
        name:'getqrcodeurl'
    })
    .get(function () {
        //查询是否存在
        var fa =this;
        var openId = this.request.query.openId;
        var qrcode= Qrcodes.findOne({openId:openId});
        var scene_id=""
        if(qrcode){
            scene_id=qrcode.scene_id
        }else{
            scene_id = Qrcodes.find({}).fetch().length+1;
        }

        var json ={
            "action_name": "QR_LIMIT_SCENE",
            "action_info": {
                "scene": {
                    "scene_id": scene_id
                }
            }
        }

        var token = Tokens.findOne({_id:"access_token"})

        var option={content:JSON.stringify(json)};

        var flag= true;
        var resultjosn;
        var url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token="+token.access_token;
        while (flag){
            resultjosn = HTTP.call("POST",url,option);
            console.log(resultjosn);
            if(resultjosn.data.errcode=="40001"){
                getToken()
            }else{
                flag= false;
                if(qrcode){
                    //更新
                    Qrcodes.update({openId:openId},{$set:{ticket:resultjosn.data.ticket,url:resultjosn.data.url}})
                }else{
                    Qrcodes.insert({
                        openId:openId,
                        ticket:resultjosn.data.ticket,
                        url:resultjosn.data.url,
                        scene_id:scene_id
                    })
                }
            }
        }
        fa.response.end(resultjosn.data.url);
    })


//提供微信接口
Router.route('/api/weixin', {
        where: 'server',
        name:'api'
    })
    .get(function () {
        var echoString= this.request.query.echostr;
        var signature= this.request.query.signature;
        var timestamp= this.request.query.timestamp;
        var nonce= this.request.query.nonce;
        if(echoString){
            if(auth(signature,timestamp,nonce)){
                console.log(echoString+"secuss")
                this.response.end(echoString)
            }
        }else{
            this.response.end("error")
        }
    })
    .post(function () {
        var body=""
        var fa =this;
        this.request.on('data',Meteor.bindEnvironment(function(data){
            body += data;
            console.log(body)
            xml2js.parseString(body, Meteor.bindEnvironment(function(err, res) {
                //console.log(res)
                var openId=res.xml.FromUserName[0];

                var createqrcodeurl=weixinConfig.url+ "api/getqrcodeurl?openId="+openId;
                HTTP.call('GET',url,function(err,result){

                })
                Meteor.call("useractionInsert",res);
                //UserAction.insert(res)
                //用户是否关注如果关注就新增该用户
                if(res.xml&&res.xml.Event&&res.xml.Event=="subscribe"){
                    //查询是否存在wxnamefindOne({where:{_id:access_token}})
                    var access_token=Tokens.findOne({_id:"access_token"})


                    var url ="https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token.access_token+"&openid="+openId+"&lang=zh_CN"
                    HTTP.call('GET',url,null,Meteor.bindEnvironment(function(err,result){
                        var json = JSON.parse(result.content);
                        var user=  Users.findOne({openId:json.openid})
                        if(user){
                             Users.update({openId:json.openid},{$set:json})
                        }else {
                           json.openId=json.openid
                           Users.insert(json);
                        }
                        //新增用户关注 如果是扫二维码进入的 那么就发送一元红包
                        if(res.xml.Ticket&&(!user||(user&&user.nickname))){
                            var ticket = res.xml.Ticket;
                            var qrcode=  Qrcodes.findOne({ticket:ticket[0]})

                            if(qrcode){
                                //发送一元红包
                                var money=100
                                var xml= getRedXml(fa,money,qrcode.openId,'',5,"问卷吧",'推广红包',json.openid)
                                //console.log(xml);
                                var url="https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
                                var option={content:xml};
                                money= parseInt(money);
                                sendRedToUser(xml,Meteor.bindEnvironment(function(err,data){
                                    if(!err){
                                        Invitations.insert({
                                            openId:qrcode.openId,
                                            money:1,
                                            beopenid:json.openid,
                                            time_sort:Date.now(),
                                            time:moment().format('YYYY-MM-DD HH:mm:ss')
                                        })
                                        var payorders = Payorders.findOne({mch_billno:data});
                                        Payorders.update({mch_billno:data},{$set:{status:1}})

                                    }else{
                                        var payorders = Payorders.findOne({mch_billno:data});
                                        Payorders.update({mch_billno:data},{$set:{status:-1}})

                                    }
                                }))
                            }
                        }
                    }))
                      var reply="<xml>"+
                        " <ToUserName><![CDATA["+openId+"]]></ToUserName>"+
                        " <FromUserName><![CDATA["+res.xml.ToUserName+"]]></FromUserName>"+
                        "<CreateTime>"+new Date().getTime()+"</CreateTime>"+
                        " <MsgType><![CDATA[text]]></MsgType>"+
                        " <Content><![CDATA[欢迎您关注问卷吧]]></Content>"+
                        " </xml>";
                    fa.response.end(reply);
                }
            }));
        }));


    });


function  auth(signature,timestamp,nonce){
    var token = weixinConfig.token;
    return CheckSignature(token,signature,timestamp,nonce)

}

function CheckSignature(token,signature,timestamp,nonce){
    var array = [token,timestamp,nonce];
    array.sort();
    var  tmpStr =array.join('')
    tmpStr = CryptoJS.SHA1(tmpStr).toString();

    tmpStr = tmpStr.toUpperCase();
    if (tmpStr == signature.toUpperCase())
    {
        console.log(true)
        return true;
    }
    else
    {

        return false;
    }
}


Router.route('/api/weixintest', function () {
    if(this.request.method=="POST"){
        var body=""
        this.request.on('data',function(data){

            body += data;
            console.log(body)

        });
    }

    this.response.end('hi from the server\n');
}, {where: 'server'});



Router.route('/api/setmenu', {
        where: 'server',
        name:'setmenu'
    })
    .get(function () {
        var fa= this;
        var token= Tokens.findOne({_id:"access_token"}).access_token;
        var url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+token;
        var bodyjosn ={
            "button": [
                {
                    "type": "view",
                    "name": "创建问卷",
                    "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url+"user/publishquestionnaire/")+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                },
                {
                    "name": "获取红包",
                     "sub_button":[
                         {
                             "type": "view",
                             "name": "参与调研",
                             "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url)+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                         },
                         {
                             "type": "view",
                             "name": "推广问卷",
                             "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url+"sharecenter/")+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                         },
                         {
                             "type": "view",
                             "name": "邀请好友",
                             "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url+"invitation/")+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                         },
                     ]

                },
                {
                    "name": "用户中心",
                    "sub_button": [
                        {
                            "type": "view",
                            "name": "我的问卷",
                            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url+"user/myquestionlist/")+"/&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                        }, {
                            "type": "view",
                            "name": "我的红包",
                            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url+"user/myred/")+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                        },
                        {
                            "type": "view",
                            "name": "绑定手机",
                            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdec30aa5914743f0&redirect_uri="+encodeURIComponent(weixinConfig.url+"user/bindphone/")+"&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect"
                        }
                        ]
                }
            ]
        }
        var option={content:JSON.stringify(bodyjosn)};
         HTTP.call("POST",url,option,function(err,result){
            var  content=result.content;
            fa.response.end(content);
        })
    })





