/**
 * Created by oopsdata1 on 16-3-11.
 */
//验证码等相关接口

//获取验证码
dySign = function (obj) {
    // 生成时间戳
    var time = new Date();
    var timestamp = time.getFullYear()  + "-" +
        ("0" + (time.getMonth() + 1)).slice(-2) + "-" +
        ("0" + time.getDate()).slice(-2) + ' '  +
        ("0" + time.getHours()).slice(-2)   + ":" +
        ("0" + time.getMinutes()).slice(-2) + ":" +
        ("0" + time.getSeconds()).slice(-2);
    obj.timestamp = timestamp;

    // 程序key
    obj.app_key = weixinConfig.dx_AppKey;

    // 参数数组
    var arr = [];
    // 循环添加参数项
    for(var p in obj){
        arr.push(p + obj[p]);
    }
    // 2、按首字母升序排列
    arr.sort();
    // 3、连接字符串
    var signStr =  arr.join('');
    var str = weixinConfig.dx_AppSecret + signStr + weixinConfig.dx_AppSecret;
    // console.log(msg);

    // 返回

    return CryptoJS.MD5(str).toString().toUpperCase();
}
sendSms=function(phone,code,templatename){
    var http =Npm.require('http');
    var qs = Npm.require('querystring');

    var obj = {
        format: 'json',
        method: 'alibaba.aliqin.fc.sms.num.send',
        v: '2.0',
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        partner_id: 'top-sdk-nodejs-20160418',
        rec_num: phone.toString(), //手机号多个以逗号间隔
        sign_method: 'md5',
        sms_type: 'normal',
        sms_param: '{"code":"'+code.toString()+'","product":"问卷吧"}',
        sms_free_sign_name: templatename,
        sms_template_code: weixinConfig.sms_setphone.code,
    }

    var sign = dySign(obj);
    console.log('签名：', sign);
    obj.sign = sign;
    obj.app_key = weixinConfig.dx_AppKey;
    var arr = [];
    for (var p in obj) {
        arr.push(p + '=' + obj[p]);
    }

    /**
     * 短信发送请求测试
     */

    var params = qs.stringify(obj);
    var options = {
        hostname: 'gw.api.taobao.com',
        port: 80,
        path: '/router/rest?' + params,
        method: 'GET'
    };



    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        // console.log(req.path);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('RESULT: ' + chunk);
        });
    });


    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });

// write data to request body
    req.write("执行完毕！");

    req.end();
}

Router.route('/api/getphonecode', {
        where: 'server',
        name:'getphonecode'
    })
    .get(function () {
       var fa = this;
       var phone =  this.request.query.phone;
       var vcode =getVerifyCode(4)
       sendSms(phone,vcode,weixinConfig.sms_setphone.name)
       var time = new Date().getTime();
       var stringSignTemp ="phone"+phone+"&code"+vcode+"&time="+time+"&sign=wenjuanba";
       console.log(stringSignTemp)
       var sign =CryptoJS.MD5(stringSignTemp).toString()
       var json ={
           code:0,
           vcode:vcode,
           time:time,
           sign:sign
       }
        fa.response.end(JSON.stringify(json));
     })


//验证接口并且绑定手机发送红包
Router.route('/api/bindphone', {
        where: 'server',
        name:'bindphoneserver'
    })
    .get(function () {

        var fa = this;
        var openId= this.request.query.openId;
        var phone =  this.request.query.phone;
        var code =this.request.query.code;
        var time =this.request.query.time;
        var sign =this.request.query.sign;


        console.log(openId)
        //第一步验证是否已经绑定了手机号码
        var user = Users.findOne({openid:openId})
        if(user.phone&&user.phone.length>10){
            fa.response.end(JSON.stringify({
                code:-1,
                msg:"该用户已经绑定手机了"
            }))
            return;
        }

       //第二步验证是否该手机已经被绑定
        var userphone = Users.findOne({phone:phone})
        if(userphone){
            fa.response.end(JSON.stringify({
                code:-2,
                msg:"该手机已经被被绑定了"
            }))
           return;
        }
        //第三步验证是否超过5分钟 5分钟验证码失效
        var nowtime =  new Date().getTime();

        if(nowtime-parseInt(time)>5*60*1000){
            //验证码失效
            fa.response.end(JSON.stringify({
                code:-3,
                msg:"验证码失效"
            }))

            return;
        }

        //第四步验证验证码是否正确
        var stringSignTemp ="phone"+phone+"&code"+code+"&time="+time+"&sign=wenjuanba";
        console.log(stringSignTemp)
        var signnow =CryptoJS.MD5(stringSignTemp).toString();
        if(signnow!=sign){
            fa.response.end(JSON.stringify({
                code:-1,
                msg:"验证码错误"
            }))
            return;
        }

       //第五步发送红包
        var money=100
        var xml= getRedXml(fa,money,openId,'',6,"问卷吧绑定手机",'绑定手机红包')

        var url="https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
        var option={content:xml};
        money= parseInt(money);
        sendRedToUser(xml,Meteor.bindEnvironment(function(err,data){
            if(!err){
                //绑定手机
                Users.update({openId:openId},{$set:{phone:phone,
                    bindphonetime_sort:Date.now(),
                    bindphonetime:moment().format('YYYY-MM-DD HH:mm:ss')}});
                var payorders = Payorders.findOne({mch_billno:data});
                Payorders.update({mch_billno:data},{$set:{status:1}})
                fa.response.end(JSON.stringify({
                    code:0,
                    msg:"绑定成功"
                }))
                return;
            }else{
                var payorders = Payorders.findOne({mch_billno:data});
                Payorders.update({mch_billno:data},{$set:{status:-1}})
                fa.response.end(JSON.stringify({
                    code:-1,
                    msg:"发送红包失败请重新绑定"
                }))
                return;

            }
        }))


    })


//获取验证码
Router.route('/api/getcsv', {
        where: 'server',
        name:'getcsv'
    })
    .get(function () {
        var fa = this;
        var phone =  this.request.query.phone;
        var vcode =getVerifyCode(4);
        var time = new Date().getTime();
        var stringSignTemp ="phone"+phone+"&code"+vcode+"&time="+time+"&sign=wenjuanba";
        console.log(stringSignTemp)
        var sign =CryptoJS.MD5(stringSignTemp).toString()
        var json ={
            code:0,
            vcode:vcode,
            time:time,
            sign:sign
        }
        fa.response.end(JSON.stringify(json));
    })

//短信验证码
getVerifyCode=function(codelength){
    var code="";
    for(var i=0;i<codelength;i++){
        code+=Math.floor(Math.random()*10);
    }
    return code;
}


//sendSms('13501238924','1234',weixinConfig.sms_setphone.code)









