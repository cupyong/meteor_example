//环境变量设置
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(weixinConfig.email_user)
    + ':' + encodeURIComponent(weixinConfig.email_password) + '@'
    + encodeURIComponent(weixinConfig.email_smtp) + ':'+weixinConfig.email_port;


//首页
Meteor.publish('CommunityBody', function() {
   console.log(1)
    console.log(Questionnaires.find({status:1,level: { $in: [ 1, 2 ] },money:{$gte:1}}))
    return Questionnaires.find({status:1,level: { $in: [ 1, 2 ] },money:{$gte:1}});
});

//推广中心
Meteor.publish('Sharecenter', function() {
    return Questionnaires.find({status: { $in: [ 1, 2 ] }});
});

//单个问题查询
Meteor.publish('ViewBody1', function(id) {
    check(id,String);

    return Questionnaires.find({_id:id});
});

Meteor.publish('ViewBody2', function(id) {
    check(id,String);
    return Questions.find({questionnaire_id:id});
});

Meteor.publish("publishquestion2", function (openId) {
    check(openId, String);
    var list =[]
    var  questionnaires = Questionnaires.find({openId:openId})

    for(var i=0;i<questionnaires.fetch().length;i++){
        list.push(questionnaires.fetch()[i]._id)
    }
    return Questions.find({questionnaire_id : { $in : list}})

});

Meteor.publish("publishquestionnaire",function(id){
    check(id,String);
    return Questionnaires.find({_id:id});
})

Meteor.publish("getAnswer",function(id){
    check(id,String);
    return Answers.find({questionnaire_id:id});
})


Meteor.publish("getUseranswer",function(id){
    check(id,String);
    return Useranswers.find({questionnaire_id:id});
})

Meteor.publish("getAllUseranswer",function(){
   return Useranswers.find({});
})



Meteor.publish('myquestionnaire', function(openId) {
     check(openId,String);
    return Questionnaires.find( {openId:openId,status:{$ne:-1}});
});



Meteor.publish("commonquestion",function(){
    return CommonQuestions.find({});
})

Meteor.publish('questionnaires', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Questionnaires.find({}, options);
});

Meteor.publish('singleQuestionnaire', function(id) {
  check(id, String);
  return Questionnaires.find(id);
});

Meteor.publish('getAlluser', function() {
    return Users.find({});
});
Meteor.publish('Tokens', function() {
   return Tokens.find({});
});

Meteor.publish('getUserSelf', function(openId) {
    check(openId, String);
    return Users.find({openId:openId});
});

Meteor.publish('questionlist', function(id) {
   check(id, String);
   return Questions.find({questionnaire_id:id});
});

//红包相关

Meteor.publish('Questionnairesall', function() {
    return Questionnaires.find({});
});

Meteor.publish('getshareclick',function(openId){
    check(openId, String);
   return Shareclicks.find({shareopenid:openId})
})

Meteor.publish('getcompleteclick',function(openId){
    check(openId, String);
    return Sharecompletes.find({shareopenid:openId})
})

Meteor.publish('getsharemoney',function(openId){
    check(openId, String);
    return Sharemoneys.find({openId:openId})
})

Meteor.publish('getanswerreds',function(id){
    check(id, String);
    return Answerreds.find({questionnaire_id:id})
})

Meteor.publish('qrcodes',function(openId){
    check(openId, String);
    return Qrcodes.find({openId:openId})
})


Meteor.publish('baidu',function(){
    console.log("baidu.com")
    var url="http://www.baidu.com"
    HTTP.call('GET', url, null, function(err,result){
        console.log(result);
        return result;
    })
})

Meteor.publish('getOpenIdbyCode',function(code){
    var appid=weixinConfig.appID;
    var secret=weixinConfig.appsecret;
    var url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+appid
        +"&secret="+secret+"&code="+code+"&grant_type=authorization_code"
    HTTP.call('GET', url, null, function(err,result){
        console.log(result.openid);
    })

})

var get_question_list_server=function(id){
    var questionlist=[];
    var questions = Questions.find({questionnaire_id: id}).fetch();
    var num=questions.length;
    var questionnaire = Questionnaires.findOne({_id:id})
    if(questionnaire.sort_questions){
        for(var i=0;i<questions.length;i++){

            var index=  _.indexOf(questionnaire.sort_questions,questions[i]._id);
            if(index==-1){
                questions[i].sortnum=num++;
            }else{
                questions[i].sortnum=index;
            }


        }
        questions=_.sortBy(questions, function(item){return item.sortnum});
    }
    for(var i=0;i<questions.length;i++){
        questionlist.push(questions[i])
        questionlist[i].index=(i+1)
    }
    return questionlist;
}


Meteor.methods({
   sendEmail: function (to,subject, text,questionId) {
        check([to, subject, text,questionId], [String]);
        //根据questionId查询
        var questionnaire = Questionnaires.findOne({_id:questionId})

        var questionlist = get_question_list_server(questionId)
       //console.log(questionlist)
        //根据问题查询答案
        //查询答案
        var answers = Answers.find({questionnaire_id:questionId}).fetch();
       //按照openId分组
       var resultlist= new Array();
       var answerGroup= _.groupBy(answers,"openId");
       for(var item in answerGroup){
           //console.log(item);//openId
           var answer = answerGroup[item]
           //console.log(answer)
           var result={};
           for(var i=0;i<questionlist.length;i++){
               //查询对应答案
               var title = questionlist[i].title;
               var thisanswer = _.find(answer,function(a){
                   return a.question_id==questionlist[i]._id;
               })
               if(thisanswer){
                    //判断问题类型
                   var answercontent="";
                   switch (questionlist[i].type){
                       case 1:
                           var key = thisanswer.answer.key;
                           var keyvalue = _.find(questionlist[i].options,function(a){
                               return a.key==key;
                           })
                           if(keyvalue){
                               answercontent =keyvalue.content;
                           }
                       break;
                       case 2:
                           var keys = thisanswer.answer.keys;
                           var contents=[];
                           console.log(keys)
                           for(var m=0;m<keys.length;m++){
                               var keyvalue = _.find(questionlist[i].options,function(a){
                                   return a.key==keys[m];
                               })
                               if(keyvalue){
                                   contents.push(keyvalue.content)
                               }
                           }
                           answercontent=contents.join('||');
                           break;
                       case 3:
                           var orders = thisanswer.answer.orders;
                           var contents=[];
                           for(var m=0;m<orders.length;m++){
                             var keyvalue = _.find(questionlist[i].options,function(a){
                                  return a.key==orders[m];
                               })
                               if(keyvalue){
                                   contents.push("【"+(m+1)+"】"+keyvalue.content)
                               }
                           }
                           answercontent=contents.join('||');
                           break;
                       case 4:
                           var answercontent = thisanswer.answer.content;
                           break;
                       case 5:
                           var score = thisanswer.answer.score;
                           var contents=[];
                           for(var scoreitem in score){
                               var keyvalue = _.find(questionlist[i].options,function(a){
                                   return a.key.toString()==scoreitem;
                               })
                               if(keyvalue){
                                   contents.push(keyvalue.content+"==="+score[scoreitem]+"分");
                               }
                           }
                          answercontent=contents.join('||');
                           break;
                    }
                 result[title]=answercontent;
               }else{
                   result[title]="";
               }
           }
           resultlist.push(result)
       }
       console.log(resultlist)

        var csv = Papa.unparse(resultlist);
        var email = {
            from:    weixinConfig.email_user,
            to:      to,
            subject: subject,
            text:   "<<"+questionnaire.title+">>调查结果",
            attachmentOptions: [
                // Each attachment conforms to mailcomposer's specs.
                {
                    fileName: "<<"+questionnaire.title+">>调查结果.csv",
                    contents: csv,

                }
            ],
        };

        EmailAtt.send(email);
        return true;
    },

    getQrcode:function(openId){
        check(openId,String);

        //查询是否存在
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

        var url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token="+token.access_token;
        HTTP.call("POST",url,option,Meteor.bindEnvironment(function(err,result){
            var json = JSON.parse(result.content);
            if(qrcode){
                //更新
                Qrcodes.update({openId:openId},{$set:{ticket:json.ticket,url:json.url}})
             }else{
                Qrcodes.insert({
                    openId:openId,
                    ticket:json.ticket,
                    url:json.url,
                    scene_id:scene_id
                })
            }
            console.log(json.url);
            return json.url;
        }))
    }
});




