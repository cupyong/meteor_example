/**
 * Created by root on 15-12-31.
 */
//问卷调查
Questions = new Mongo.Collection('questions');
Questions.allow({
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
    createQuestion:function(question){
        check(question,Object);
        var id = Questions.insert(question)
        return id;
    },
    updateQuestion:function(id,question){
        check(question,Object);
        check(id,String);
        var questionFlag=Questions.findOne({_id:id})
        if(questionFlag.type!=question.type){
            //如果 题型修改了 那么删除该题目的答案
            Answers.remove({question_id:id})
        }
        question.questionnaire_id= questionFlag.questionnaire_id
        Questions.update({_id:id},question)
        return question.questionnaire_id;
    },
    updateQuestionAttribute:function(id,attributes){
        check(attributes,Object);
        check(id,String);
        Questions.update({_id:id},{$set:attributes})
        return id;
    },
    copyQuestion:function(id){
        check(id,String);
        var question = Questions.findOne({_id:id})
        delete question._id;
        if(question.options&&question.options.length>0){
            for(var i=0;i<question.options.length;i++){
                question.options[i].link=null;
            }
        }
        Questions.insert(question)
        return true;
    },
    deleteQuestion:function(id){
        check(id,String);
        Questions.remove({_id:id})
        return true;
    },
    getQuestionList:function(id){
        check(id,String);
        var questionlist=[];
        var questions = Questions.find({questionnaire_id: id}).fetch();
        var num=questions.length;

        if(this.sort_questions){
            for(var i=0;i<questions.length;i++){

                var index=  _.indexOf(this.sort_questions,questions[i]._id);
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
})



