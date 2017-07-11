/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.myquestionlist.onRendered(function () {
   var questionnaireId=this.data.params._id;
   var questionaire=Questionnaires.findOne({_id:questionnaireId});

   ReactDOM.render(<Thismyquestionlist questionaire={questionaire} />, document.getElementById('wraper'));

});


Thismyquestionlist = React.createClass({
    getInitialState:function(){
        return ({now:1});
    },
    setnow:function(num){
        this.setState({now: num});
    },
    render:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <EditedHeader  questionaire={this.props.questionaire} left={""} right={"预览"}/>
                    <QuestionaireList questionaire={this.props.questionaire} questionId = {this.props.questionId} setnow={this.setnow}/>
                    <QuestionaireType questionaire={this.props.questionaire}/>
                </div>
            </div>
        )
    }
});
