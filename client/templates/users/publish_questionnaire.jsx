

Template.publishquestionnaire.onRendered(function () {
    var questionaire={_id:null};
    if(this.data&&this.data.params&&this.data.params._id){
        var id= this.data.params;
        questionaire= Questionnaires.findOne(this.data.params._id)
    }
  // window.questionaire=questionaire;
    ReactDOM.render(<Questionaire questionaire={questionaire}  params={this.data.params}/>, document.getElementById('wraper'));
});



QuestionaireIndex = React.createClass({
    getInitialState:function(){
        return({tit:this.props.questionaire.title,desc:this.props.questionaire.describe});
    },
    handleSubmit:function(){
        var title = this.state.tit;
        var type = "header";
        if (title.length<=0) return;
        var desc = $(ReactDOM.findDOMNode(this.refs.desc)).text().trim();
        var fa = this;
        //$("header").transition({height:"5.5rem"},800,'ease');
        $("#survey-title").fadeOut(200);
        setTimeout(function(){$("header").addClass("threed");},200);

        $(".explain").fadeOut(800);

        var questionnaire={title:title,describe:desc}
        setTimeout(function(){
        if(fa.props.questionaire&&fa.props.questionaire._id!=null){
            Meteor.call("update_questionnaire",fa.props.questionaire._id,questionnaire,function(){
                fa.props.setQuestionaire(Questionnaires.findOne(fa.props.questionaire._id))
                $("header").removeClass("threed").addClass("threedback");
                fa.props.setnow(1)
            }) //Questionnaires.update({_id:fa.props.questionaire._id},{$set:questionnaire})
             }else{
                  var openId= getCookie('openId')
                    Meteor.call("create_questionnaire",{
                        create_time_sort:Date.now(),
                        create_time:moment().format('YYYY-MM-DD'),
                        openId:openId,
                        describe:questionnaire.describe,
                        title:questionnaire.title,
                        maxCount:20, //默认值
                        status:0,
                        publish_time:null,
                        money:0,
                        sort_questions:[],
                        level:0,
                        money:0,
                        allow:false,
                        share:0
                    },function(err,question){
                        //Router.go('publishquestionnaire', {_id: id})
                        fa.props.setQuestionaire(question)
                        $("header").removeClass("threed").addClass("threedback");
                        fa.props.setnow(1)
                    })
                }
        },800);
    },
    componentDidMount:function(){
        $(".explain").fadeIn(200);
        $(ReactDOM.findDOMNode(this.refs.title)).fadeIn(100);
    },
    getTitle:function(title){
        this.state.tit=title;
    },
    render:function(){
        return(
            <div className="title_desc">
                <IndexHeader tit={this.state.tit} callback={this.getTitle} />
                <div className="explain dn">
                    <div id="survey-explain" ref="desc" contentEditable={true}  placeholder="问卷说明,可以不填">{this.state.desc}</div>
                    <a href="javascript:void(0);" className="submit btn blue" onTouchEnd={this.handleSubmit}>开始编辑问题</a>
                </div>
            </div>
        );
    }
});

IndexHeader = React.createClass({
    getTitle:function(){
        var title = $(ReactDOM.findDOMNode(this.refs.tit)).text().trim();
        this.props.callback(title);

    },
    render:function(){
        return(
            <header ref="head">
                <div id="survey-title">
                    <div className="survey-name" ref="tit" contentEditable={true} onInput={this.getTitle} placeholder="输入一个问卷名">{this.props.tit}</div>
                </div>
            </header>
        );
    }
});

 Questionaire = React.createClass({
    getInitialState:function(){
        if(this.props.questionaire&&this.props.questionaire._id){
            return {now:1,num:0,type:0,number: -1,normal:false,questionaire:this.props.questionaire,params:this.props.params};
        }else{
            return {now:0,num:0,type:0,number: -1,normal:false,questionaire:this.props.questionaire,params:this.props.params};
        }
       //if(!Session.get("questionnaire")||Session.get("questionnaire")==0){
       //    return {now:0,num:0,type:0,number: -1,normal:false,questionaire:this.props.questionaire};
       // }else{
       //    if(this.props.questionaire&&this.props.questionaire._id!=null){
       //        return {now:1,num:0,type:0,number: -1,normal:false,questionaire:this.props.questionaire};
       //    }else{
       //        return {now:0,num:0,type:0,number: -1,normal:false,questionaire:this.props.questionaire};
       //    }
       //
       //}
    },
    renderIndex:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <QuestionaireIndex setnow={this.callBackState} setQuestionaire={this.setQuestionaire} questionaire={this.state.questionaire}/>
                </div>
            </div>
        );
    },
    renderLogic:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <Logic questionaire={this.state.questionaire}  setnow={this.callBackState} number={this.state.number}/>
                </div>
            </div>
        );
    },
    renderPreview:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <EditedHeader questionaire={this.state.questionaire} setnow={this.callBackState} left="列表" right="发布"/>
                    <Preview  questionaire={this.state.questionaire} setnow={this.callBackState}/>
                </div>
            </div>
        );
    },
    renderList:function(){
        var fa=this;
        return(
            <div className="wraper-content">
                <div className="container">
                    <EditedHeader  questionaire={this.state.questionaire} setnow={this.callBackState} left={""} right={"预览"}/>
                    <QuestionaireList  params={this.props.params}  questionaire={this.state.questionaire}  num={this.state.num} setnow={this.callBackState}/>
                    <QuestionaireType setnow={this.callBackState} questionaire={this.state.questionaire}/>
                </div>

            </div>
        );
    },
    renderSortQuestions:function(){
        return(
            <div className="wraper-content">
                <SortQuestions  questionaire={this.state.questionaire} num={this.state.num} setnow={this.callBackState}/>
            </div>
        )
    },
    renderEnter:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <EnterOfQuestionaire questionaire={this.state.questionaire} setnow={this.callBackState}/>
                </div>
            </div>
        );
    },
    renderEdit:function(){
        return(
            <div className="wraper-content">
                <EditedHeader  questionaire={this.state.questionaire} setnow={this.callBackState} left={""} right={""}/>
                <EditQuestion questionaire={this.state.questionaire} type={this.state.type} normal={this.state.normal} number={this.state.number} setnow={this.callBackState}/>
            </div>
        );
    },
    renderPublish:function(){
        return(
            <div className="wraper-content">
                <div className="container">
                    <Publish  questionaire={this.state.questionaire} setnow={this.callBackState}/>
                </div>
            </div>
        );
    },
    callBackState:function(num,type,number,normal){
        this.setState({now: num,type: type,number: number,normal: normal});
    },
    setQuestionaire:function(questionnaire){

        this.setState({questionaire:questionnaire});
    } ,
    render:function(){
        now = this.state.now;
        switch(now){
            case 0://起始index页面
                return(
                    this.renderIndex()
                );
                break;
            case 1://问题列表页面
                return(
                    this.renderList()
                );
                break;
            case 2://编辑题目页面
                return(
                    this.renderEdit()
                );
                break;
            case 3://逻辑控制
                return(
                    this.renderLogic()
                );
                break;
            case 4://预览页面
                return(
                    this.renderPreview()
                );
            case 5://排序页面
                return(
                    this.renderSortQuestions()
                );
        }
    }
});
 EditedHeader = React.createClass({
    getInitialState:function(){
        if(this.props.othertitle){
            return {tit:this.props.othertitle}
        }else{
            return {tit:this.props.questionaire.title}
        }

    },
    preview:function(e){
        var fa=this;
        $(e.currentTarget).children("b").text("");
        $(e.currentTarget).children("i").addClass("fa fa-refresh fa-spin");
        var target =$(e.currentTarget)
        Router.go('myquestionprew', {_id: fa.props.questionaire._id})
        //setTimeout(function(){
        //    //fa.props.setnow(4);
        //    Router.go('myquestionprew', {_id: fa.props.questionaire._id});
        //    target.children("i").removeClass("fa fa-refresh fa-spin");
        //},500);
     },
    list:function(){
        //Session.set("questionnaire",1)
        Router.go('publishquestionnaire',
            {
                _id: this.props.questionaire._id
            });
    },
    backtoindex:function(){
        var fa=this;
        if (this.props.right=="预览"){
           $(".questionaire_list").css("margin-top","-15.5rem");
            $(".questionaire_list").removeClass("animated fadeInUp").addClass("animated fadeOutDown");
            $("header").css("height","21rem").addClass("threedgo");
            $(".title").fadeOut(100);
            $(ReactDOM.findDOMNode(this.refs.right)).fadeOut(100);
            setTimeout(function(){$("header").addClass("threedback");},100);
            setTimeout(function(){
                //Session.set("questionnaire",0)
                fa.props.setnow(0)
                //Router.go('publishquestionnaire',
                //    {
                //        _id: fa.props.questionaire._id
                //    });

            },700);
        }
    },
    componentDidMount:function(){
        if (this.props.right=="预览"){
            $(ReactDOM.findDOMNode(this.refs.title)).fadeIn(200);
            $(ReactDOM.findDOMNode(this.refs.right)).fadeIn(200);
        }
    },
    publish:function(e){
        var fa=this;
        $(e.currentTarget).children("b").text("");
        $(e.currentTarget).children("i").addClass("fa fa-refresh fa-spin");
        //查询如果问不存在问题那么就不允许发布
        var questions = Questions.find({questionnaire_id:this.props.questionaire._id}).fetch();
        if(questions.length<1){
            //您还没有添加问题
            alert('您还没有给问卷添加问题哦！');
            return;
        }

        Meteor.call("publish_questionnaire",this.props.questionaire._id,function(error , result){
           if(result){
               //用 Router.go 跳转会引起jssdk签名不正确
               window.location.href="/user/questionred/"+fa.props.questionaire._id
               //Router.go('myquestionred', {_id: fa.props.questionaire._id});
              //window.questionaire=null;
              //Router.go('myquestionnaires');
           }

        })

        //window.location="publish";
    },
    sendEmail:function(){
        $(".report").removeClass("dn");
    },
    render:function(){
        var fa=this;
        return(
            <header className="edited">
                <div id="survey-title">
                    {
                        (function(){
                            if (fa.props.left.length>0){
                                switch (fa.props.left){
                                    case "列表":
                                        return (<a href="javascript:void(0);" onTouchEnd={fa.list}  className="sbtn return l">列表</a>);
                                        break;
                                    case "编辑":
                                        return (<a href="javascript:void(0);"  className="sbtn return l">编辑</a>);
                                        break;
                                }
                            }
                        })()
                    }
                    <div className="survey-name">
                        {
                            (function(){
                                if (fa.props.right=="预览"){
                                    return (<h2 ref="title" className="title dn" onTouchEnd={fa.backtoindex}>{fa.state.tit}</h2>);
                                }else return(<h2 ref="title" className="title" onTouchEnd={fa.backtoindex}>{fa.state.tit}</h2>);
                            })()
                        }
                    </div>
                    {
                        (function(){
                            if (fa.props.right&&fa.props.right.length>0){
                                switch (fa.props.right){
                                    case "预览":
                                        return (<a  ref="right" href="javascript:void(0);" onTouchEnd={fa.preview} className="sbtn view r"><i></i><b>预览</b></a>);
                                        break;
                                    case "加载":
                                        return (	<a href="javascript:void(0);" className="sbtn view r"><i className="fa fa-refresh fa-spin"></i></a>);
                                        break;
                                    case "发布":
                                        return (	<a href="javascript:void(0);" onTouchEnd={fa.publish} className="sbtn view r"><i></i><b>发布</b></a>);
                                        break;
                                    case "导出":
                                        return (<a href="javascript:void(0);" onTouchEnd={fa.sendEmail} className="sbtn view r">导出</a>);
                                        break;
                                }
                            }
                        })()
                    }
                </div>
            </header>
        );
    }
});

