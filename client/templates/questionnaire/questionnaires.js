/**
 * Created by root on 16-1-4.
 */
Template.questionnaires_item.helpers({
    getAnswerNum: function(id) {

       var num =0;
        var question= Questions.findOne({questionnaire_id:id})
        if(question){
            var answers= Answers.find({question_id:question._id}).fetch()
            if(answers){
                num= answers.length;
            }else{
                num= 0;
            }
        }else{
            num= 0;
        }
        console.log(num)
        return num
    }
});

function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}