/**
 * Created by oopsdata1 on 16-2-2.
 */
Template.myquestionlogic.onRendered(function () {
    var questionnaireId=this.data.params.questionnaireId;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});



    ReactDOM.render(<Thismyquestionlogic questionaire={questionaire}
                                          number={this.data.params._id}/>,
        document.getElementById('wraper'));


});
Thismyquestionlogic = React.createClass({
    render:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <Logic questionaire={this.props.questionaire}  number={this.props.number}/>
                </div>
            </div>
        )
    }
});
