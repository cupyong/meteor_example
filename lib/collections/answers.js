/**
 * Created by root on 16-1-5.
 */
Answers= new Mongo.Collection('answers');

Answers.allow({
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
    addAnswer:function(answer){
        check(answer,Object);
       var id= Answers.insert(answer);
        return Answers.findOne({_id:id});
    },

    answerQuestion:function(answer,last){
        check(answer,Object);
        //var openId=Session.get('openId');
        var openId= getCookie('openId')
        //查询用户是否回答过该题目
       var find= Answers.findOne({question_id:answer.question_id,openId:openId})
        if(find){
            return {code:-1,msg:"您已回答过该题目了"}
        }else {
            answer.openId=openId;
            answer.createTime=moment().format('YYYY-MM-DD HH-mm-ss')
            answer.createTime_sort=Date.now();
            Answers.insert(answers);
            //同时useranswer表
            var question= Questions.findOne({_id:answer.question_id});
            var questionnaire=Questionaire.findOne({_id:question.questionnaire_id});

           var useranswer= Useranswers.findOne({questionnaire_id:question.questionnaire_id});
           var thisuseranswer={
               type:"normal",
               openId:openId,
               complete:complete,
               questionnaire_id:question.questionnaire_id,
               question_id:answer.question_id,
               complete_time:moment().format('YYYY-MM-DD HH-mm-ss'),
               complete_time_sort:Date.now(),
           }
            var complete=false;
            if(last){
               complete=true
            }
            if(openId){
                if(useranswer){
                    Useranswers.update({_id:useranswer._id},thisuseranswer)

                }else{
                    Useranswers.insert(thisuseranswer)
                }
            }
           var result={};

            //查询下个问题
            //第一步 查询是否有逻辑控制
            if(answer.type==1){ //单选题才有逻辑控制

                for (var i=0;i<question.options.length;i++){
                    if(question.options[i].key=answer.answer.key){
                        if(question.options[i].link=="stop"){ //回答完毕
                            result={code:0,msg:"回答完毕"}
                        }else if(question.options[i].link!=null&&question.options[i].link){
                            result={code:1,id:question.options[i].link}
                        }
                    }
                }

            }
            if(result.code){
                return result;
            }
            //第二步 查询是否有排序控制
            if(questionnaire.sort_questions){
                var index= _.indexOf(questionnaire.sort_questions,question._id);
                if(index>-1&&index!=questionnaire.sort_questions.length){
                    result={code:1,id:questionnaire.sort_questions[index+1]}
                }

            }
            if(result.code){
                return result;
            }
            //第三步 没有逻辑控制和排序 按照默认的排序返回答案
            var questions = Questions.find({questionnaire_id: id}).fetch();
            var sort=[];
            for(var i=0;i<questions.length;i++){
                sort.push(questions[i]._id);
            }
            var index= _.indexOf(questionnaire.sort_questions,question._id);
            if(index>-1&&index!=questionnaire.sort_questions.length){
                result={code:1,id:questionnaire.sort_questions[index+1]}
            }else{
                result={code:0,msg:"回答完毕"}
            }

     }
},
    //
    //useranswer:{
    //    _id:"objectId",
    //    openId:"openId",
    //    complete:ture,//false
    //    questionnaire_id:questionnaire_id//回答的问卷
    //    question_id:question_id//最后一个完成回答的题目
    //    complete_time:complete_time //最后答题的时间
    //
    //}

    //answerQuestion:function(answers){
    //    check(answers,Array);
    //    var openId=Session.get('openId');
    //    //查询该用户是否回答过
    //   var answer= Answers.findOne({question_id:answers[0].question_id,openId:openId})
    //    console.log(answer);
    //    if(answer){
    //        return {code:-1,msg:"您已经回答过该问卷了"}
    //    }else {
    //        for(var i=0;i<answers.length;i++){
    //           var question = Questions.findOne(answers[i].question_id);
    //            if(question){
    //                answers[i].openId=openId;
    //                Answers.insert(answers[i])
    //            }
    //        }
    //        return {code:0}
    //    }
    //}
})