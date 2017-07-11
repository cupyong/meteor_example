/**
 * Created by oopsdata1 on 16-1-20.
 */

Template.myquestionnaires.onRendered(function () {
    ReactDOM.render(<Myquestionnaires />, document.getElementById('wraper'));
});

Myquestionnaires = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        //订阅相关数据
        //var openId=Session.get('openId');
        var openId= getCookie('openId')
        const subHandles = [
            Meteor.subscribe("myquestionnaire",openId)
];
        const subsReady = _.all(subHandles, function (handle) {
            return handle.ready();
        });
        return {
            subsReady: subsReady,
        };
    },
    getInitialState:function(){
        return {now:0,id:null};
    },
    callBackState:function(num,id){
        this.setState({now: num,id:id});
    },

    listQuestionnaireList:function(){
    var fa=this;
        return(
            <div className="wraper-content">
                <MyquestionTop />
                <MyquestionnaireList  setnow={this.callBackState}/>
            </div>
        );
    },
    questionnaireMongy:function(id){
        var questionnaire = Questionnaires.findOne({_id:id});
        return(
            <QuestionMoney setnow={this.callBackState} questionnaire={questionnaire}/>
        );
    },
    questionnaireResult:function(id){
        var questionnaire = Questionnaires.findOne({_id:id});
        return(
        <div className="container">
            <EditedHeader questionaire={questionnaire} setnow={this.callBackState} left={""} />
            <QuestionnaireResult setnow={this.callBackState} questionnaire={questionnaire}/>
        </div>

        );
    },

    render:function(){
        now = this.state.now;
        switch(now){
            case 0:
              return(
                this.listQuestionnaireList()
               );
              break;
            case 1:
                return(
                    this.questionnaireMongy(this.state.id)
                );
                break;
            case 2:
                return(
                    this.questionnaireResult(this.state.id)
                );
                break;

        }
     }
 })

MyquestionTop=React.createClass({
   render:function(){
        return(
            <header className="edited my-suery">
                <div id="survey-title">
                    <div className="survey-name">
                        <h2 className="title">我的问卷</h2>
                    </div>
                </div>
            </header>
        );
    }

})
MyquestionnaireList=React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        //订阅相关数据
        var openId= getCookie('openId')
        //var openId=Session.get('openId');
        var openId=Session.get('openId');
        const subHandles = [
            Meteor.subscribe("myquestionnaire",openId),
            Meteor.subscribe("getAllUseranswer")
        ];
        const subsReady = _.all(subHandles, function (handle) {
            return handle.ready();
        });
        return {
            subsReady: subsReady,
        };
    },
    addQuestionnaires:function(){
        Router.go("publishquestionnaire")
    },
    render:function(){
        var openId= getCookie('openId')
        //var openId=Session.get('openId');
        var questionnairs = Questionnaires.find( {openId:openId,status:{$ne:-1}}).fetch();
        for(var i=0;i<questionnairs.length;i++){
            var useransewrs = Useranswers.find({questionnaire_id:questionnairs[i]._id,complete:true}).fetch()
            if(useransewrs){
                questionnairs[i].answerNum=useransewrs.length;
            }else{
                questionnairs[i].answerNum=0;
            }
        }

        var fa =this;
        if(questionnairs.length>0||getCookie("openId")==null){
            return(
                <div className="my-suery-list">
                    {
                        (function(){
                            var list=[];
                            for (var i=0;i<questionnairs.length;i++){
                                list.push(<MyquestionnaireSingle key={questionnairs[i]._id} setnow={fa.props.setnow} question={questionnairs[i]}/>)
                            }
                            return list;
                        })()
                    }
                    <a href="javascript:void(0);" className="btn add-quesiton" onClick={this.addQuestionnaires} ><i className="icon icon-plus"></i>创建一份问卷</a>
                </div>
            );
        }else {
            return(
                <div className="questionaire_list">
                    <div className="content">
                        <p className="empty_tip">
                            当前无问卷，快创建一份吧!
                        </p>
                        <a href="javascript:void(0);" className="btn add-quesiton" onClick={this.addQuestionnaires} ><i className="icon icon-plus"></i>创建一份问卷</a>
                    </div>
                </div>
            );
        }

    }
})

MyquestionnaireSingle=React.createClass({
    edit:function(id){
        Router.go('publishquestionnaire', {_id: this.props.question._id});
    },
    money:function(id){
        //用 Router.go 跳转会引起jssdk签名不正确
        window.location.href="/user/questionred/"+this.props.question._id
        //Router.go('myquestionred', {_id: this.props.question._id});
        //this.props.setnow(1,this.props.question._id);
    },
    render:function(){
        return(
            <div className="my-suery">
                <span className="time">{this.props.question.create_time}</span>
                <div className="suery-option">
                    <h3 className="suery-title" name="questiontitle" >{this.props.question.title}</h3>

                    <div className="suery-option-content">
                        <div className="grey-column recycling">
                            <span>已回收<b><i>{this.props.question.answerNum}/</i>{this.props.question.maxCount}</b>份</span>
                            <a href="javascript:void(0);" onClick ={this.money}>修改</a>
                        </div>
                     <MyquestionSetMoney question ={this.props.question} setnow={this.props.setnow}/>
                    </div>
                  <MyquestionStatus status={this.props.question.status} question ={this.props.question}/>
                  <MyquestionnaireOp question ={this.props.question} setnow={this.props.setnow}/>
                </div>
            </div>
        );
    }
})

MyquestionSetMoney=React.createClass({
    money:function(id){
        //用 Router.go 跳转会引起jssdk签名不正确
       // window.location.href="/user/questionred/"+this.props.question._id+"?type=red"
        Router.go('myredrecord', {_id: this.props.question._id});
        //this.props.setnow(1,this.props.question._id);
    },
    render:function(){
        if(this.props.question.level==1||this.props.question.level==2){
            return(
                <div className="grey-column red">
                    <span>剩余红包<b>{this.props.question.money.toFixed(2)}</b>元</span>
                    <a href="javascript:void(0);"  onTouchEnd ={this.money}>查看记录</a>
                </div>
            )
        }else{
            return(
                <div className="grey-column red no-red">
               <a href="javascript:void(0);"  onClick ={this.money}>回收太慢，我要发红包 <i className="icon-chevron-right"></i></a>
               </div>
            )
        }
    }
})



MyquestionStatus=React.createClass({
    getInitialState:function(){
        return {questionnairesatus:this.props.status};
    },

    changeStatus:function(status,e){
        alert(status);
    },

    componentDidMount:function(){
        var fa=this;
        var elems = Array.prototype.slice.call(ReactDOM.findDOMNode(this.refs.option).querySelectorAll('.js-switch'));
        if(elems.length > 0){
            elems.forEach(function(html) {
                html.onchange=function(){
                   if(fa.state.questionnairesatus==0){ //发布
                      Questionnaires.update({_id:fa.props.question._id},{$set:{status:1}})
                      //fa.setState({questionnairesatus:1})

                   }
                   else if(fa.state.questionnairesatus==1){ //结束问卷
                        Questionnaires.update({_id:fa.props.question._id},{$set:{status:2}})
                        //退还现金
                        HTTP.call('get','/api/back/money?openId='+getCookie('openId')+'&questionnaireid='+fa.props.question._id,null,function(err,result){

                        })
                        //fa.setState({questionnairesatus:2})

                    }
                }
                var switchery = new Switchery(html);
            });
        }



    },
    render:function(){
       switch (this.state.questionnairesatus){
            case 0:
                return (
                    <div className="stop" ref="option">
                        <p className="clearfix">
                            <span className="op-title l" id="publishquestionnaire" >发布问卷</span>
                            <input type="checkbox" className="js-switch" onClick={this.changeStatus.bind(this,1)}/>
                        </p>
                    </div>
                )
                break
            case 1:
                return (
                    <div className="stop" ref="option">
                        <p className="clearfix">
                            <span className="op-title l" id="stopquestion" >结束问卷</span>
                            <input type="checkbox" className="js-switch" onClick={this.changeStatus.bind(this,2)}/>
                        </p>
                    </div>
                )
                break
            default:
                return(
                <div className="stop finished" ref="option">
                    <i className="icon-check-circle" ></i>回收完成
                </div>

           )
       }


    }
})

MyquestionnaireOp=React.createClass({
    edit:function(){
        //Session.set("questionnaire",1)
        Router.go('publishquestionnaire',
            {
                _id: this.props.question._id
            });
      //Router.go('myquestionlist', {_id: this.props.question._id});
    },
    delete:function(e){
       var fa=this;
       Questionnaires.update({_id:this.props.question._id},{$set:{"status":-1}})
        $(e.currentTarget).parent().parent().parent().addClass("setOverflow")
        $(e.currentTarget).parent().parent().parent().addClass("optionall op-delete")
        setTimeout(function(){
            $(".op-icons-list").css("bottom","0rem");
            $(".my-suery").removeClass("setOverflow")
            $(".my-suery").removeClass("optionall op-delete")
            fa.props.setnow(0);
        },1000);
     },
    copydata:function(e){
        var target = $(e.currentTarget);
        var fa=this;
        var questionoo={};//对应对应关系
       //第一步复制问题标题和内容等基本内容
        var questionnaire = Questionnaires.findOne({_id:this.props.question._id})
        var id = Questionnaires.insert({
            create_time_sort:Date.now(),
            create_time:moment().format('YYYY-MM-DD'),
            openId:questionnaire.openId,
            describe:questionnaire.describe,
            title:questionnaire.title,
            maxCount:questionnaire.maxCount,
            status:0,
            publish_time:null,
            sort_questions:[],
            level:0,
            money:0,
            allow:questionnaire.allow,
            share:0
        })
       //第二步复制问题
        var questions= Questions.find({questionnaire_id:this.props.question._id}).fetch();
        for(var i=0;i<questions.length;i++){
            var question = questions[i]
            var oldid=question._id;
            delete question._id;
            question.questionnaire_id=id;
            var newid= Questions.insert(question)
            questionoo[oldid]=newid;
        }

        //第三步修改排序
       if(questionnaire.sort_questions.length>0){
             var new_sort_questions=[];
             for(var i=0;i<questionnaire.sort_questions.length;i++){
                 new_sort_questions.push(questionoo[questionnaire.sort_questions[i]])
             }
            Questionnaires.update({_id:id},{$set:{sort_questions:new_sort_questions}})
         }
        //第四步根据问题Id修改问题的逻辑控制
        var copyquestions = Questions.find({questionnaire_id:id}).fetch();
        for(var i=0;i<copyquestions.length;i++){
            var newquestion=copyquestions[i]
            delete newquestion._id;
            var flag= false;
            if(copyquestions[i].options){
                for(var j=0;j<copyquestions[i].options.length;j++){
                    if(copyquestions[i].options[j].link&&copyquestions[i].options[j].link!=null){
                        flag=true
                        newquestion.options[j].link=questionoo[copyquestions[i].options[j].link];
                    }
                }

            }
            if(flag){
                Questions.update({_id:id},newquestion)
            }
        }
        fa.props.setnow(0);
        $(".my-suery:last").addClass("setOverflow")
        $(".my-sueryd:last").addClass("optionall op-copynaireitem")
        $("html,body").animate({scrollTop:$(".my-suery:last").offset().top},1000)
        setTimeout(function(){
            $(".my-sueryd:last").removeClass("setOverflow")
            $(".my-sueryd:last").removeClass("optionall op-copynaireitem")
            target.prev().prev().prev().css("bottom","0rem")

        },1000);

    },

    copy:function(e){
        $(ReactDOM.findDOMNode(this.refs.delbottom)).hide()
        $(ReactDOM.findDOMNode(this.refs.copybottom)).show()
        $(e.currentTarget).parent().parent().animate({bottom:"-5rem"},"slow");
    },

    del:function(e){
        $(ReactDOM.findDOMNode(this.refs.delbottom)).show()
        $(ReactDOM.findDOMNode(this.refs.copybottom)).hide()
        $(e.currentTarget).parent().parent().animate({bottom:"-5rem"},"slow");
    },
    cancel:function(e){
        $(e.currentTarget).prev().animate({bottom:"0rem"},"slow");
    },
    showResult:function(){
        Router.go('myquestionresult', {_id: this.props.question._id});
       //this.props.setnow(2,this.props.question._id);
    },
    share:function(){
        //用 Router.go 跳转会引起jssdk签名不正确
        window.location.href=getweixinUrl("sharequestionnaire/"+this.props.question._id)
       // window.location.href="/sharequestionnaire/"+this.props.question._id
        //Router.go('questionnairedetail', {_id: this.props.questionnaire._id});
        //this.props.setnow(1,this.props.questionnaire._id)
    },
    render:function(){
        return(
            <div className="op-icons">
                <ul className="op-icons-list">
                    <li><a href="javascript:void(0);" onClick={this.share}><i className="icon-share-square-o"></i></a></li>
                    <li><a href="javascript:void(0);" onClick={this.showResult}><i className="icon-pie-chart"></i></a></li>
                    <li><a href="javascript:void(0);" onClick={this.copy}><i className="icon-copy"></i></a></li>
                    <li><a href="javascript:void(0);" onClick={this.edit}><i className="icon-pencil"></i></a></li>
                    <li><a style={{border:"none"}} href="javascript:void(0);" onClick={this.del}><i className="icon-trash"></i></a></li>
                </ul>
                <a href="javascript:void(0);" onClick={this.cancel} className="dbtn cancel l">取消</a>
                <a  ref="delbottom"  style={{display:"none"}} href="javascript:void(0);" className="dbtn submit r" onClick={this.delete}>确认删除</a>
                <a  ref="copybottom" href="javascript:void(0);" className="dbtn submit r" onClick={this.copydata}>确认复制</a>
            </div>
        )
    }
})

