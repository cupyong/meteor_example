/**
 * Created by oopsdata1 on 16-2-1.
 */

CommonQuestions= new Mongo.Collection('commonquestions');
Meteor.methods({
    //name 常见问题名称  questionnaireId 问卷
    addCommonQuestion:function(name,questionnaireId){
        check(name,String);
        check(questionnaireId,String);
        var commonquestion= CommonQuestions.findOne({name:name});
        delete commonquestion._id;
        commonquestion.questionnaire_id=questionnaireId;
        var question= Questions.findOne(Questions.insert(commonquestion))
        return question
    }
})
