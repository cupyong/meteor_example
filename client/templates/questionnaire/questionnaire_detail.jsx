/**
 * Created by oopsdata1 on 16-2-1.
 */
Template.questionnairedetail.onRendered(function () {
    var questionnaireId=this.data.params._id;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});


    //如果是从分享页面进入的
    if(this.data.params.query&&this.data.params.query.shareopenid){
        var  shareclick={
            shareopenid:this.data.params.query.shareopenid,
            clickopenId:getCookie('openId'),
            questionnaire_id:questionnaireId,//问卷
         }
        Meteor.call("create_shareclick",shareclick);
    }
    ReactDOM.render(<Thisquestionnairedetail questionaire={questionaire} />, document.getElementById('wraper'));

});
function addUrlPara(name, value) {
    var currentUrl = window.location.href.split('#')[0];
    if (/\?/g.test(currentUrl)) {
        if (/name=[-\w]{4,25}/g.test(currentUrl)) {
            currentUrl = currentUrl.replace(/name=[-\w]{4,25}/g, name + "=" + value);
        } else {
            currentUrl += "&" + name + "=" + value;
        }
    } else {
        currentUrl += "?" + name + "=" + value;
    }
    if (window.location.href.split('#')[1]) {
       return currentUrl + '#' + window.location.href.split('#')[1];
    } else {
        return currentUrl;
    }
}



Thisquestionnairedetail = React.createClass({
    getInitialState:function(){
        return {now:1,money:0};
    },
    callBackState:function(num,money){
        if(money){
            this.setState({now: num,money:money});
        }else{
            this.setState({now: num});
        }

    },
    renderCommunity:function(){
        return(
            <div className="wraper-content">
                <Community setnow={this.callBackState}/>
            </div>
        );
    },
    renderEnter:function(){
        //var questionnaire = Questionnaires.findOne({_id:this.state.id})
       return(
            <div className="wraper-content">
                <div className="container">
                    <EnterOfQuestionaire setnow={this.callBackState} questionnaire={this.props.questionaire}/>
                </div>
            </div>
        );
    },
    renderResult:function(){
      return(
      <div className="wraper-content">
          <div className="container">
              <SingleHeader  questionnaire={this.props.questionaire} setnow={this.props.setnow}/>
              <Red setnow={this.callBackState} questionnaire={this.props.questionaire} money={this.state.money}/>
          </div>
      </div>

        );
    },
    renderShare:function(){
        return(
            <Share setnow={this.callBackState} questionnaire={this.props.questionaire}/>
        );
    },
    renderLookResult:function(){

       return(
            <div className="wraper-content">
                <div className="container">
                    <SingleHeader  questionnaire={this.props.questionaire} setnow={this.props.setnow}/>
                    <QuestionnaireResult setnow={this.callBackState} questionnaire={this.props.questionaire}/>
                </div>
            </div>

        );

    },
    answerQuestion:function(){
       return(
            <SingleQuestionnaire setnow={this.callBackState} questionnaire={this.props.questionaire}/>
        )

    },
    componentDidMount:function(){
      var fs = this;
      var answerred=Answerreds.findOne({openId:getCookie("openId"),questionnaire_id:fs.props.questionaire._id});
      var money=1.00;
      if(answerred){
          money= answerred.money;
      }
      var desc ="";
      var questionnaire= Questionnaires.findOne({_id:fs.props.questionaire._id});
      if(questionnaire&&(questionnaire.level==1||questionnaire.level==2)){
          desc="回答问卷我获得了"+money+"元红包"
       }

      var url=window.location.origin+"/questionnaire/"+fs.props.questionaire._id+"?shareopenid="+getCookie('openId');
      init_weixin(function(wx){
           wx.ready(function () {
               wx.onMenuShareTimeline({
                    title: fs.props.questionaire.title, // 分享标题
                    link: url,
                    desc:desc,
                    imgUrl: '/image/villi/wj8.jpg', // 分享图标
                    success: function () {
                        alert('分享成功');
                        if(openId==questionaire.openId){
                            Questionnaires.update({_id:questionnaireId},{$set:{share:1}})
                        }
                        Router.go("sharecenter")
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                 wx.onMenuShareAppMessage({
                     title: fs.props.questionaire.title, // 分享标题
                     link: url,
                     desc:desc,
                     imgUrl: '/image/villi/wj8.jpg', // 分享图标
                     success: function () {
                         alert('分享成功');
                         if(openId==questionaire.openId){
                             Questionnaires.update({_id:questionnaireId},{$set:{share:1}})
                         }
                         Router.go("sharecenter")
                         // 用户确认分享后执行的回调函数
                     },
                     cancel: function () {
                         // 用户取消分享后执行的回调函数
                     }
                 });
            })
      });
    },
    render:function(){

        switch(this.state.now){
            //case 0://调研社区
            //    return(
            //        this.renderCommunity()
            //    );
            //    break;
            case 1://答题页面
                return(
                    this.renderEnter()
                );
                break;
            case 2://开始答题
                return(
                    this.answerQuestion()
                );
                break;
            case 4: //问卷结果
                return(
                    this.renderResult()
                );
                break;
            case 5: //查看结果
                return(
                    this.renderLookResult()
                );
                break;
            case 6://红包
                return(
                    this.renderShare()
                );
                break;
        }
    }





    //render:function(){
    //    console.log(this.props.questionaire)
    //    return(
    //        <div className="wraper-content">
    //            <div className="container">
    //                <SingleHeader  questionnaire={this.props.questionaire} />
    //                <ViewExplain icon={true}  word={this.props.questionaire.describe} />
    //                <Partake num={6} questionnaire={this.props.questionaire}/>
    //            </div>
    //        </div>
    //    )
    //}
});
