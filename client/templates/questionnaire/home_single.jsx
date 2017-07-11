/**
 * Created by oopsdata1 on 16-1-21.
 */
 EnterOfQuestionaire =React.createClass({

    render:function(){
        var noshow=true;
        var fa = this;
       return(
            <div className="container">
                {
                    (function(){
                        if(fa.props.questionnaire.describe.trim().length>0){
                            return  <SingleHeader  questionnaire={fa.props.questionnaire} setnow={fa.props.setnow}/>
                        }else{
                            return  <SingleHeader  showheight="true"  questionnaire={fa.props.questionnaire} setnow={fa.props.setnow}/>
                        }
                    })()
                }

                {
                    (function(){
                        if(fa.props.questionnaire.describe.trim().length>0){
                            return   <ViewExplain icon={true} word={fa.props.questionnaire.describe} setnow={fa.props.setnow}/>
                        }
                    })()
                }

                <Partake questionnaire={this.props.questionnaire} setnow={this.props.setnow}/>
            </div>
        );
    }
//
});
SingleHeader= React.createClass({

    componentDidMount:function(){
       if(this.props.showheight){
            $(ReactDOM.findDOMNode(this.refs.header)).attr("class","")
        }

    },
    render:function(){
        return(
            <header ref="header" className="edited answer">
            <div id="survey-title">
                <div className="survey-name">
                    <h2 className="title">{this.props.questionnaire.title}</h2>
                </div>
            </div>
        </header>)
    }
})

 Partake = React.createClass({
    mixins: [ReactMeteorData],
     getMeteorData() {
         //订阅相关数据
         const subHandles = [
            Meteor.subscribe("getUseranswer",this.props.questionnaire._id),
             Meteor.subscribe("getAlluser"),
         ];
         const subsReady = _.all(subHandles, function (handle) {
             return handle.ready();
         });
         return {
             subsReady: subsReady,
         };
    },
   person:function(useranswer){
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
                <span className="time">{useranswer.complete_time.split(' ')[0]}</span>
                {
                    (function(){
                        if(useranswer.red){
                            return ( <span className="money">￥<i>{useranswer.money}</i> 元</span>)
                        }
                    })()
                }

            </li>
        );
    },
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

     getButton:function(){
         var fa =this;
         var userAnswering = Useranswers.find({questionnaire_id:this.props.questionnaire._id,complete:false,type:"normal"}).fetch().length;
         var thisuseranswer = Useranswers.findOne({questionnaire_id:this.props.questionnaire._id,openId:getCookie('openId')});
         if(thisuseranswer){
             if(thisuseranswer.type=="delete"){
                 return  <a href="javascript:void(0);" onTouchEnd={fa.startAnswer}  className="btn blue">你的答案已过期重新答题</a>
             }else{
                 return  <a href="javascript:void(0);" onTouchEnd={fa.startAnswer}  className="btn blue">开始答题</a>
             }

         }else{
             if(userAnswering>this.props.questionnaire.maxCount){
                 return  <a href="javascript:void(0);"   className="btn blue">当前答题人数太多，请稍等</a>
             }else{
                 return  <a href="javascript:void(0);" onTouchEnd={fa.startAnswer}  className="btn blue">开始答题</a>
             }

         }
     },

    startAnswer:function(){
       // Router.go('answerquestionlist', {_id: this.props.questionnaire._id});
        //this.props.setnow(2,this.props.questionnaire._id)
        this.props.setnow(2)
    },
    render:function(){
        var fa=this;
        //var userRedAnswer=Useranswers.find({red:true,questionnaire_id:this.props.questionnaire._id}).fetch();
        var userRedAnswer = Answerreds.find({questionnaire_id:this.props.questionnaire._id},{sort:{time_sort:-1},limit:10}).fetch();
        var userAnswer= Useranswers.find({questionnaire_id:this.props.questionnaire._id,type:"normal"},{sort:{complete_time_sort:-1,limit:10}}).fetch();



        if(userRedAnswer.length>0){
            return(
                <div className="partake">
                    <h2>红包领取记录</h2>
                    <ul>
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
                    {
                        (function(){
                           return fa.getButton();

                        })()
                    }

                </div>
            );
        }else{
           return(
                <div className="partake">
                    <h2>最近参与</h2>
                    <ul>
                        {
                            (function(){
                                var people=[];
                                for (var i=0;i<userAnswer.length;i++){
                                    people.push(fa.person(userAnswer[i]));
                                }

                                return people;
                            })()
                        }
                    </ul>
                    {
                        (function(){
                            return fa.getButton();

                        })()
                    }
                </div>
            );
        }

    }
});