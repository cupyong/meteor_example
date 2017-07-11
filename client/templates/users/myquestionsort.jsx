/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.myquestionsort.onRendered(function () {
    var questionnaireId=this.data.params._id;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});
    ReactDOM.render(<Thismyquestionsort questionaire={questionaire} />, document.getElementById('wraper'));

});

Thismyquestionsort = React.createClass({
   render:function(){
        return(
            <div className="wraper-content">
                <SortQuestions  questionaire={this.props.questionaire} setnow={this.callBackState}/>
            </div>
        )
    }
});
