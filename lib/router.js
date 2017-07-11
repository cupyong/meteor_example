
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

//首页
Router.route('/', {
    name: 'homeindex',
    waitOn: function() {
      return [
         Meteor.subscribe("CommunityBody"),
         Meteor.subscribe("getAllUseranswer"),
        ];
    },

});

//问卷页面
Router.route('/questionnaire/:_id', {
    name: 'questionnairedetail',
    waitOn: function() {
        var openId= getCookie('openId')
        return [
            Meteor.subscribe("CommunityBody"),
            Meteor.subscribe("getAllUseranswer"),
            Meteor.subscribe("getAnswer",this.params._id),
            Meteor.subscribe("getAlluser"),
            Meteor.subscribe("questionlist",this.params._id),
            Meteor.subscribe('getanswerreds', this.params._id),
            Meteor.subscribe('ViewBody1', this.params._id),
];
    },
    data: function() {
        return {params:this.params}
    }
});



//推广中心
Router.route('/sharecenter',{
    waitOn: function() {
        var openId= getCookie('openId')
        return [
            Meteor.subscribe('getshareclick', openId),
            Meteor.subscribe('getcompleteclick', openId),
            Meteor.subscribe('Sharecenter'),
        ];
    },
    name:'sharecenter'
})

//分享页面
Router.route('/sharequestionnaire/:_id',{
    name: 'sharehtml',
    waitOn: function() {
        var openId= getCookie('openId')
        return [
            Meteor.subscribe("ViewBody1", this.params._id),
            Meteor.subscribe('getanswerreds', openId),
        ];
    },
    data: function() {
        return {params:this.params}
    }

})

//邀请好友关注
Router.route('/invitation',{
    name: 'invitation',
    waitOn: function() {
        var openId = getCookie('openId');
        return [
            Meteor.subscribe("qrcodes",openId)
        ];
    },
    data: function() {
        var openId = getCookie('openId');
        console.log(Qrcodes.findOne({openId:openId}));
        return Qrcodes.findOne({openId:openId});
    }
})

//我的问卷
    Router.route('/user/myquestionlist/',{
    name:'myquestionnaires',
    waitOn: function() {
        var openId= getCookie('openId')
        return [
            Meteor.subscribe('myquestionnaire',openId),
            Meteor.subscribe('publishquestion2',openId),
            Meteor.subscribe('getAllUseranswer'),

        ];
    },
})

//编辑发布问卷
Router.route('/user/publishquestionnaire/:_id?',{
    waitOn: function() {
        var openId= getCookie('openId')
        return [
            Meteor.subscribe('myquestionnaire',openId),
            Meteor.subscribe('publishquestion2',openId),
            Meteor.subscribe('commonquestion'),
        ];

    },
    name:'publishquestionnaire',
    data: function() {
       return {params:this.params}
    }
})

//问题列表
Router.route('/user/questionlist/:_id',{
    waitOn: function() {
            return [
                Meteor.subscribe('publishquestionnaire', this.params._id),
                Meteor.subscribe('ViewBody2', this.params._id),

            ];

    },
    name:'myquestionlist',
    data: function() {
        return {params:this.params}
    }
})
//预览列表
Router.route('/user/prewquestion/:_id',{
    waitOn: function() {
        return [
            Meteor.subscribe('publishquestionnaire', this.params._id),
            Meteor.subscribe('ViewBody2', this.params._id),
        ];
    },
    name:'myquestionprew',
    data: function() {
        return {params:this.params}
    }
})
//编辑问题
Router.route('/user/:questionnaireId/single/:type/:questionId?',{
    waitOn: function() {
        return [
            Meteor.subscribe('publishquestionnaire', this.params.questionnaireId),
            Meteor.subscribe('ViewBody2', this.params.questionnaireId),
            Meteor.subscribe('commonquestion'),
        ];
    },
    name:'mysinglequestion',
    data: function() {
        return {params:this.params}
    }
})
Router.route('/qrcode',{
    name: 'qrcode',

    data: function() {
        return {a:"111"}
    }
})
//test
Router.route('/test',{
    name: 'testaaaaa',

    data: function() {
        return {a:"111"}
    }
})
//test
Router.route('/test2',{
    name: 'test2',

    data: function() {
        return {a:"111"}
    }
})
//test
Router.route('/test3',{
    name: 'test3',

    data: function() {
        return {a:"111"}
    }
})

//绑定手机
Router.route('/user/bindphone',{
    name: 'bindphone',
})

//问题排序
Router.route('/user/questionsort/:_id',{
    waitOn: function() {
        return [
            Meteor.subscribe('publishquestionnaire', this.params._id),
            Meteor.subscribe('ViewBody2', this.params._id),
        ];
    },
    name:'myquestionsort',
    data: function() {
        return {params:this.params}
    }
})
//逻辑控制
Router.route('/user/:questionnaireId/logic/:_id',{
    waitOn: function() {
        return [
            Meteor.subscribe('publishquestionnaire', this.params.questionnaireId),
            Meteor.subscribe('ViewBody2', this.params.questionnaireId),
        ];
    },
    name:'myquestionlogic',
    data: function() {
        return {params:this.params}
    }
})

//问卷结果
Router.route('/user/questionresult/:_id',{
    waitOn: function() {
        return [
            Meteor.subscribe('publishquestionnaire', this.params._id),
            Meteor.subscribe('ViewBody2', this.params._id),
            Meteor.subscribe("getAnswer",this.params._id)
        ];
    },
    name:'myquestionresult',
    data: function() {
        return {params:this.params}
    }
})
Router.route('/user/questionred/:_id',{
    waitOn: function() {
        return [
            Meteor.subscribe('publishquestionnaire', this.params._id),
            Meteor.subscribe('getUseranswer', this.params._id)
         ];
    },
    name:'myquestionred',
    data: function() {
        return {params:this.params}
    }
})

//我的红包
Router.route('/user/myred',{
    name:'myred',
    waitOn: function() {
        var openId= getCookie('openId')
        return [
            Meteor.subscribe('getshareclick', openId),
            Meteor.subscribe('getcompleteclick', openId),
            Meteor.subscribe('getsharemoney', openId),
            Meteor.subscribe('getanswerreds', openId),
            Meteor.subscribe('Questionnairesall'),
            Meteor.subscribe('getUserSelf',openId),
        ];
    },
})

//我的红包记录
Router.route('/user/myredrecord/:_id',{
    name:'myredrecord',
    waitOn: function() {
       return [
           Meteor.subscribe('getanswerreds', this.params._id),
           Meteor.subscribe('ViewBody1', this.params._id),
       ];
    },
    data: function() {
        return {params:this.params}
    }
})


//opentest true为测试 false为线上版本
opentest=false   ;
//微信接口
function weixinAuth(){
   var router=this;
    if(opentest==true){
        setCookie('openId','oIXvZsshG6mjZhWc8eEIodIjubCM');
        //setCookie('openId','oIXvZsshG6mjZhWc8eEIodIjubCM');//zeng
       //setCookie('openId','oIXvZsoX8Os_cOzIik3WEBc4G2VA');//gao
        if(this.originalUrl.indexOf('invitation')>1){  //邀请关注必须先生成二维码图片
            if(getCookie('qrcode')&&getCookie('qrcode').length>0){
                router.next();
            }
            else{
                HTTP.call("get","/api/getqrcodeurl?openId="+getCookie('openId'),null,function(err,result){
                    setCookie('qrcode',"qrcode");
                    window.location.href=router.originalUrl;
                })
            }
        }else {
            router.next();
        }
        console.log(getCookie('openId'));
    }else {
       if(!getCookie('openId')){
          if(this.params.query.code){
             var url="/api/getopenId?code="+this.params.query.code;
                if(!getCookie('openId')){
                    HTTP.call('GET', url, null, function(err,result){
                        if(result.content&&result.content.length>10){
                            setCookie('openId',result.content);
                            window.location.href=router.originalUrl;
                        }
                    })
                }
             }else {
              var origin = window.location.origin;
              var location=origin+this.originalUrl.replace(origin,"");
              var url ="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+weixinClint.appID+"&redirect_uri="+location+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
              window.location.href =url;
          }
        }else{
           if(this.originalUrl.indexOf('invitation')>1){  //邀请关注必须先生成二维码图片
               if(getCookie('qrcode')){
                   router.next();
               }
               else{
                   HTTP.call("get","/api/getqrcodeurl?openId="+getCookie('openId'),null,function(err,result){
                       setCookie('qrcode',"qrcode");
                       window.location.href=router.originalUrl;
                   })
               }
           }else {
               router.next();
           }
           router.next();
        }
    }
}

Router.onBeforeAction(weixinAuth,{except: ['api','getopenId','getjssdk','jspay','unifiedorder','sendred','redmoney','setmenu','backmoney',
    'getqrcodeurl','bindphoneserver','getphonecode','findredpay']});





