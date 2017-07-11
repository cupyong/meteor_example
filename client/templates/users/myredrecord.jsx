/**
 * Created by oopsdata1 on 16-4-12.
 */
Template.myredrecord.onRendered(function () {
    var questionnaireId=this.data.params._id;
    var questionaire=Questionnaires.findOne({_id:questionnaireId});

    ReactDOM.render(<MyredRecord  questionaire={questionaire}/>, document.getElementById('wraper'));
});

MyredRecord = React.createClass({
   render:function(){
          return(
            <div className="wraper-content">
                <div className="container">
                    <EditedHeader othertitle="领取记录" questionaire={this.props.questionaire} left={""} right={""}/>
                    <Record questionaire={this.props.questionaire}/>
                </div>
            </div>
        );

    }
});

 Record = React.createClass({
    render:function(){
        return(
            <div className="record-wrap">
                <RecordList questionaire={this.props.questionaire}/>
                <AddMoney questionaire={this.props.questionaire}/>
            </div>
        );
    }
});
 RecordList = React.createClass({
    redperson:function(useranswer){
         var user= Users.findOne({openId:useranswer.openId})
         var username = "";
         if(user&&user.nickname){
             username= user.nickname
         }
         return(
             <li>
        <span className="head">
            {
                (function(){
                    if(user&&user.headimgurl){
                        return (  <img src={user.headimgurl}/>)
                    }else{
                        return (  <img src='/image/villi/headimg.jpg'/>)
                    }
                })()
            }

        </span>
                 <span className="name">{username}</span>
                 <span className="time">{useranswer.time.split(' ')[0]}</span>
                 <span className="money">￥<i>{useranswer.money}</i> 元</span>

             </li>
         );
     },
    render:function(){
        var fa=this;
        var userRedAnswer = Answerreds.find({questionnaire_id:this.props.questionaire._id},{sort:{time_sort:-1}}).fetch();
        return(
            <ul className="record">
                {
                    (function(){
                        var people=[];
                        for (var i=0;i<userRedAnswer.length;i++){
                            people.push(fa.redperson(userRedAnswer[i]));
                        }
                        return people;
                    })()
                }
             </ul>
        );
    }
});
 AddMoney = React.createClass({
    money:function(){
         //用 Router.go 跳转会引起jssdk签名不正确
          window.location.href="/user/questionred/"+this.props.questionaire._id+"?type=red"

         //this.props.setnow(1,this.props.question._id);
     },
    render:function(){
        return(
            <div className="add-red">
                <div className="shadow"></div>
                <a href="javascript:void(0);" onClick={this.money} className="btn red">增加红包金额</a>
            </div>
        );
    }
});