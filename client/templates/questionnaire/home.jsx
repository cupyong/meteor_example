/**
 * Created by oopsdata1 on 16-1-21.
 */
Template.homeindex.onRendered(function () {
   ReactDOM.render(<HomeIndex />, document.getElementById('wraper'));
});
HomeIndex = React.createClass({

    getInitialState:function(){
        return {now:0,id:null};
    },
    callBackState:function(num,id){
        console.log("setnow");
        this.setState({now: num,id: id});
    },
    renderCommunity:function(){
        return(
            <div className="wraper-content">
                <Community setnow={this.callBackState}/>
            </div>
        );
    },
    renderEnter:function(){
        var questionnaire = Questionnaires.findOne({_id:this.state.id})
        return(
           <div className="wraper-content">
                <div className="container">
                    <EnterOfQuestionaire setnow={this.callBackState} questionnaire={questionnaire}/>
                </div>
            </div>
        );
    },
    renderResult:function(){
        var questionnaire = Questionnaires.findOne({_id:this.state.id})
        return(
           <Red setnow={this.callBackState} questionnaire={questionnaire}/>
        );
    },
    renderLookResult:function(){
        var questionnaire = Questionnaires.findOne({_id:this.state.id})
        return(
        <div className="wraper-content">
            <div className="container">
                <SingleHeader  questionnaire={questionnaire} setnow={this.props.setnow}/>
                <QuestionnaireResult setnow={this.callBackState} questionnaire={questionnaire}/>
            </div>
        </div>

        );

    },
    answerQuestion:function(){
        var questionnaire = Questionnaires.findOne({_id:this.state.id})
         return(
            <SingleQuestionnaire setnow={this.callBackState} questionnaire={questionnaire}/>
        )

    },


    render:function(){
       switch(this.state.now){
            case 0://调研社区
                return(
                    this.renderCommunity()
                );
                break;
           case 1://答题页面
               return(
                   this.renderEnter()
               );
           case 2://开始答题
               return(
                   this.answerQuestion()
               );
               break;
           case 4: //问卷结果
               return(
                   this.renderResult()
               );
           case 5: //查看结果
               return(
                   this.renderLookResult()
               );
               break;
        }
    }
})
