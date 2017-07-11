/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.myquestionred.onRendered(function () {
    var questionnaireId=this.data.params._id;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});
    ReactDOM.render(<Thismyquestionred questionaire={questionaire} params = {this.data.params} />, document.getElementById('wraper'));

});


Thismyquestionred = React.createClass({
    render:function(){
        return(
            <QuestionMoney questionnaire={this.props.questionaire} params = {this.props.params} />
        )
    }
});
