/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.myquestionprew.onRendered(function () {
    var questionnaireId=this.data.params._id;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});
    ReactDOM.render(<Thismyquestionprew questionaire={questionaire} />, document.getElementById('wraper'));

});


Thismyquestionprew = React.createClass({
    render:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <EditedHeader questionaire={this.props.questionaire}  left="列表" right="发布"/>
                    <Preview  questionaire={this.props.questionaire} />
                </div>
            </div>
        )
    }
});
