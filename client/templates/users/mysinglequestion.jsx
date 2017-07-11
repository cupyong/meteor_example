/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.mysinglequestion.onRendered(function () {
    var questionnaireId=this.data.params.questionnaireId;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});



    ReactDOM.render(<Thismysinglequestion questionaire={questionaire}
                                          type={parseInt(this.data.params.type)}
                                          number={this.data.params.questionId}/>,
        document.getElementById('wraper'));

});

Thismysinglequestion = React.createClass({
    render:function(){
       return(
            <div className="wraper-content">
                <EditedHeader  questionaire={this.props.questionaire}  left={""} right={""}/>
                <EditQuestion  questionaire={this.props.questionaire} type={this.props.type}  number={this.props.number} />
            </div>
        )
    }
});
