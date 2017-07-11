/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.myquestionresult.onRendered(function () {
    var questionnaireId=this.data.params._id;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});
    ReactDOM.render(<Thismyquestionresult questionaire={questionaire} />, document.getElementById('wraper'));

});


Thismyquestionresult = React.createClass({
    render:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <EditedHeader questionaire={this.props.questionaire} left={""} right="导出"/>
                    <QuestionnaireResult questionnaire={this.props.questionaire}/>
                    <SendEmail questionnaire={this.props.questionaire}/>
                </div>
            </div>
        )
    }
});
