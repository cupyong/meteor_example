/**
 * Created by oopsdata1 on 16-1-21.
 */

Community = React.createClass({
   render:function(){
      return(
            <div className="community">
            <header className="edited answer">
            <div id="survey-title">
            <div className="survey-name" onClick={this.test}>
            <h2 ref="title" className="title">调研社区</h2>
            </div>
            </div>
            </header>
            <CommunityBody setnow={this.props.setnow}/>
            </div>
        );
    }
});
 CommunityBody = React.createClass({
   mixins: [ReactMeteorData],
   getMeteorData() {
       //订阅相关数据
       const subHandles = [
           Meteor.subscribe("CommunityBody"),
           Meteor.subscribe("getAllUseranswer"),
           Meteor.subscribe("Tokens")
       ];
       const subsReady = _.all(subHandles, function (handle) {
           return handle.ready();
       });
       return {
           subsReady: subsReady,
       };
   },

   render:function(){

        var fa= this;
        //查询是红包问卷并且金额要大于等于1元才可以
        var questionnaires=Questionnaires.find({status:1,level: { $in: [ 1, 2 ] },money:{$gte:1}},{sort:{publish_time_sort: -1}}).fetch();

        for(var i=0;i<questionnaires.length;i++){

           var useransewrs = Useranswers.find({questionnaire_id:questionnaires[i]._id,complete:true}).fetch()
           if(useransewrs){
               questionnaires[i].answerNum=useransewrs.length;
           }else{
               questionnaires[i].answerNum=0;
           }
       }
      return(
            <ul className="survey-list">
            {
             (function(){
                var questions=[];
                for (var i=0; i<questionnaires.length;i++){
                    questions.push(
                  <CommunitySingle questionnaire={questionnaires[i]} setnow={fa.props.setnow}/>
                );
                }
                return questions;
            })()
    }
        </ul>
        );
    }
});

CommunitySingle=React.createClass({
    single:function(){
        //用 Router.go 跳转会引起jssdk签名不正确
        window.location.href="questionnaire/"+this.props.questionnaire._id
       //Router.go('questionnairedetail', {_id: this.props.questionnaire._id});
       //this.props.setnow(1,this.props.questionnaire._id)
    },
    render:function(){
        var fa= this;

        return(
            <li>
                <a href="javascript:void(0);" className="survey-name" onTouchEnd={this.single}>{this.props.questionnaire.title}</a>
                <span className="time">{this.props.questionnaire.publish_time} </span>
                <span className="collect">已收集 <i>{this.props.questionnaire.answerNum}</i> / {this.props.questionnaire.maxCount} 份</span>
            </li>
        );
    }
})