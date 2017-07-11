/**
 * Created by root on 16-1-4.
 */
Questionnaires= new Mongo.Collection('questionnaires');
Questionnaires.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return true
    },

});


Meteor.methods({
    //创建问卷
    create_questionnaire:function(questionnaire) {

        check(questionnaire,Object);
        var id=  Questionnaires.insert(questionnaire)
        return Questionnaires.findOne(id)

   },
    //修改问卷
    update_questionnaire:function(id,questionnaireAttr){
        check(id,String);
        check(questionnaireAttr,Object);
        var questionnaire = Questionnaires.findOne(id);
        if(!questionnaire){
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');
        }
        Questionnaires.update({_id:id},{$set:questionnaireAttr})
        return Questionnaires.findOne(id)
    },
    //发布问卷
   publish_questionnaire:function(id){
       check(id,String);
       var questionnaire = Questionnaires.findOne(id);
       if(!questionnaire){
           throw new Meteor.Error('invalid-comment', 'You must comment on a post');
       }
       if(questionnaire.status>1){
           return false
       }else {
           Questionnaires.update({_id:id},{$set:{"status":1, publish_time_sort:Date.now(), publish_time:moment().format('YYYY-MM-DD')}})
           return true;
       }
   },
    //删除问卷
    delete_questionnaire:function(id){
        check(id,String);
        var questionnaire = Questionnaires.findOne(id);
        if(!questionnaire){
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');

        }
        Questionnaires.update({_id:id},{$set:{"status":-1}})
        return true;
    },
    //结束问卷
    stop_questionnaire:function(id){
        check(id,String);
        var questionnaire = Questionnaires.findOne(id);
        if(!questionnaire){
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');

        }
        Questionnaires.update({_id:id},{$set:{"status":2}})
    },

     //判断回收份数是否达到要求如果达到 那么就关闭问卷
     checkComplete_questionnaire:function(id){
         check(id,String);
         var questionnaires=Questionnaires.findOne({_id:id});
         var useransewrs = Useranswers.find({questionnaire_id:id,complete:true}).fetch()
         if(useransewrs){
             if(useransewrs.length>=questionnaires.maxCount){
                 Questionnaires.update({_id:id},{$set:{"status":2}})
                 //退还现金
                 var content =moment().format('YYYY-MM-DD HH:mm:ss')+"====="+questionnaires._id+"==========退款业务1"
                 Logs.insert({content:content,type:6.1})
                 HTTP.call('get','/api/back/money?openId='+questionnaires.openId+'&questionnaireid='+questionnaires._id,null,function(err,result){

                 })
             }
         }
     }


})

Meteor.methods({
    test : function(questionText){

        return questionText;
    }
});




