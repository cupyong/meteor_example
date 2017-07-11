/**
 * Created by root on 16-1-18.
 */
get_question_list=function(id){
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

 QuestionaireList = React.createClass({

    addQuestions:function(){
        $(".questionaire_list").addClass("hide");
        $(".add-question-option").removeClass("animated fadeOutDown").removeClass("dn");
        //$(".questions").css("bottom","0px");
        $(".questions").addClass("questionbottom");
        var commonquestion=getCookie(this.props.questionaire._id);
        if(commonquestion=='up'){
            $('.common-content').show();
            $('.changyong i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
            $('.changyong').removeClass('border');
            setTimeout(function(){
                $(".questions").removeClass("questionbottom");
                //$(".questions").css("bottom","53%");
                $('ul.questions').removeClass('off');
                $('.common-content').addClass('show');
            },53);
        }else{
            setTimeout(function(){
                $(".questions").removeClass("questionbottom");
                //$(".questions").css("bottom","53%");
             },53);
        }

     },
    componentDidMount:function(){
      if(this.props.params.query.id){
        $("#"+this.props.params.query.id).addClass("show");
        var fa =this;
        setTimeout(function(){
            $("html,body").animate({scrollTop:$("#"+fa.props.params.query.id).offset().top-150},1000)
        },100)
      }
      $(".questionaire_list").removeClass("animated fadeOutUp").addClass("animated fadeInUp").removeClass("dn");

      //当选择问题取消时候就回到重新选择问题状态
      var  back = getCookie('back');
      if(back=='ok'){
           this.addQuestions()
           setCookie('back','');
      }
    },
    render:function(){
        var fa=this;
        var questions = get_question_list(this.props.questionaire._id)
        if(questions.length > 0){
           return(
                 <div className="questionaire_list dn">
                    <div className="content">
                        {
                            (function(){
                                var list=[];
                                for (var i=0;i<questions.length;i++){
                                     if(questions[i].type==1){

                                         list.push(<ShowSingle  questionaire={fa.props.questionaire} key={questions[i]._id} setnow={fa.props.setnow} number={i} question={questions[i]}/>);
                                     }
                                    if(questions[i].type==2){
                                        list.push(<ShowMulti  questionaire={fa.props.questionaire} key={questions[i]._id} setnow={fa.props.setnow} number={i} question={questions[i]}/>);
                                    }
                                    if(questions[i].type==3){
                                        list.push(<ShowSort questionaire={fa.props.questionaire} key={questions[i]._id} setnow={fa.props.setnow} number={i} question={questions[i]}/>);
                                    }
                                    if(questions[i].type==4){
                                        list.push(<ShowFill questionaire={fa.props.questionaire} key={questions[i]._id} setnow={fa.props.setnow} number={i} question={questions[i]}/>);
                                    }
                                    if(questions[i].type==5){
                                        list.push(<ShowGrade questionaire={fa.props.questionaire}  key={questions[i]._id} setnow={fa.props.setnow} number={i} question={questions[i]}/>);
                                    }
                                }
                                return list;
                            })()
                        }
                        <a href="javascript:void(0);" className="btn add-quesiton" onTouchEnd={this.addQuestions} ><i className="icon icon-plus"></i>添加一道问题</a>
                    </div>
                </div>
            );
        }else{
            return(
                <div className="questionaire_list dn">
                    <div className="content">
                        <p className="empty_tip">
                            空空如也，快来添加一道问题吧!
                        </p>
                        <a href="javascript:void(0);" className="btn add-quesiton" onClick={this.addQuestions} ><i className="icon icon-plus"></i>添加一道问题</a>
                    </div>
                </div>
            );
        }
    }
})
