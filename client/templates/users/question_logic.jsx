/**
 * Created by oopsdata1 on 16-1-19.
 */
 Logic = React.createClass({
    getInitialState:function(){
        var question=Questions.findOne({_id:this.props.number})
        var choices=[];
        var show=true
        for (var i= 0;i<question.options.length;i++){
            if(question.options[i].link!=null&&question.options[i].link){
                if(question.options[i].link!="stop"){
                    choices.push(findChoiceById(this.props.number,question.options[i].link,this.props.questionaire._id));
                }else{
                    show=false;
                    choices.push("stop");
                }

            }else{
                choices.push(-1);
            }
        }
        return ({links:choices,question:question,show:show});
    },
    handlesubmit:function(){
        var question_id=this.props.number;
        var logics=[];
        var rule_type=0;
        var answer_id;
        var questions=get_question_list(this.props.questionaire._id)
        var options=this.state.question.options;
        for (var i=0; i<this.state.links.length;i++){
            //answer_id=this.state.question.options.key;
            //content=this.state.question.options.key
            var linknum=-1;
            if(this.state.links[i]=="stop"){
                options[i].link="stop"
            }else{
                if(this.state.links[i]!=-1){
                    linknum = parseInt(this.state.links[i])-1;
                }

                if (linknum!=-1){

                    options[i].link=questions[linknum]._id
                    //
                    //if (this.state.links[i]==999){
                    //    rule_type=0;
                    //    result=null;
                    //}else {
                    //    rule_type=1;
                    //    result=[this.state.question[this.state.links[i]]._id];
                    //}
                    //logics.push({
                    //    logic:{
                    //        rule_type:rule_type,
                    //        conditions:{
                    //            question_id:question_id,
                    //            answer:[answer_id],
                    //            fuzzy:false
                    //        },
                    //        result:result,
                    //    }
                    //});
                }else{
                    options[i].link=null
                }
            }

        }
        var fa=this;
        Meteor.call("updateQuestionAttribute",this.props.number,{options:options},function(error , result){

            if (error)
                return throwError(error.reason);
            if(result){
                //Router.go('myquestionlist',
                //    {
                //        _id: fa.props.questionaire._id
                //    });
                //Session.set("questionnaire",1)
                Router.go('publishquestionnaire',
                    {
                        _id: fa.props.questionaire._id
                    },{ query: "id=" + encodeURIComponent(fa.props.number) });

            }
        });
        //$.postJSON('/villi/questionaires/add_logic', logics, function(data){
        //    if(data.success){
        //        window.questionaire = data.value.survey;
        //        window.questions = data.value.questions;
        //        fa.props.setnow(1);
        //    }
        //});
        //console.log(logics);
    },
    handlecancel:function(){
        //Router.go('myquestionlist',
        //    {
        //        _id: this.props.questionaire._id
        //    });
        //Session.set("questionnaire",1)
        Router.go('publishquestionnaire',
            {
                _id: this.props.questionaire._id
            });
    },
    setLink:function(arg1,arg2){
        var choices=this.state.links;
        choices[arg1]=arg2;
        this.setState({links:choices});
    },
    setShow:function(arg1){
       this.setState({show:arg1});
    },
    render:function(){
        return(
            <div className="container">
                <LogicHeader />
                <LogicBody  questionaire={this.props.questionaire} number={this.props.number} show={this.state.show} setShow={this.setShow} links={this.state.links} setLink={this.setLink} question={this.state.question}/>
                <div className="bottom-option">
                    <div className="shadow"></div>
                    <a onTouchEnd={this.handlesubmit} className="submit r">确定</a>
                    <a onTouchEnd={this.handlecancel} className="cancel l">取消</a>
                </div>
            </div>
        );
    }
});
 LogicHeader = React.createClass({
    render:function(){
        return(
            <header className="edited logic">
                <div id="survey-title">
                    <div className="survey-name">
                        <h2 className="title">如果用户选择了</h2>
                    </div>
                </div>
            </header>
        );
    }
});
 LogicBody = React.createClass({
    getInitialState:function(){
        return({show:this.props.show,Cnumber:-1,question:this.props.question});
    },
    toggleBot:function(a){
        if (this.state.Cnumber>-1){
            if (!a)
                this.props.setLink(this.state.Cnumber,"stop");
            else {
                this.props.setLink(this.state.Cnumber,-1);
            }
        }

        this.props.setShow(a);
    },
    getQnum:function(num){
        if (this.state.Cnumber>-1 && num>-1){
            this.props.setLink(this.state.Cnumber,num)
        }
        if (num==-1) this.props.setLink(this.state.Cnumber,num);
    },
    getCnum:function(num){
        this.setState({Cnumber:num})
    },
    render:function(){
        var fa=this;
        return(
            <div className="edit logic">
                <div className="edit-content">
                    <LogicBodyTop questionaire={fa.props.questionaire} questionaire={fa.props.questionaire}question={this.state.question} number={this.props.number} show={this.state.show} links={this.props.links} callback={this.getCnum} Cnumber={this.state.Cnumber} Qnumber={this.state.Qnumber}/>
                    <LogicBodyMid  questionaire={fa.props.questionaire} show ={fa.props.show} callback={this.toggleBot}/>
                    {(function(){
                        if (fa.props.show)
                            return(<LogicBodyBot questionaire={fa.props.questionaire} number={fa.props.number} callback={fa.getQnum}/>)
                    })()}
                </div>
            </div>
        );
    }
});
 LogicBodyTop = React.createClass({
    handleTouch:function(e){
        var fa=this;
        var num = parseInt($(e.currentTarget).children("label").text());
        if (this.props.links[num]=="stop"){
            //清空下方active
            $(".q-name").each(function(){
                $(this).removeClass("active");
                $(this).children("i").removeClass("icon-check-circle");
            });
        }else{
            $(".q-name").each(function(){
                if (parseInt($(this).children("b").text())==fa.props.links[num]){
                    $(this).addClass("active");
                    $(this).children("i").addClass("icon-check-circle");
                }else {
                    $(this).children("i").removeClass("icon-check-circle");
                    $(this).removeClass("active");
                }
            });
        }
        this.props.callback(num);
    },
    renderChoice:function(i){
        //var ii=i;
        //i++;
        //if (i<10) i="0"+i;
        //i=""+i;
        //var idstring="#a"+i;
        return(
            <li className="logicchoice" onTouchEnd={this.handleTouch}>
                <label className="dn">{i}</label>
        <span className="input logic-option">
          <input type="radio" name="option" id={this.props.question.options[i].key}/>
          <label htmlFor={this.props.question.options[i].key}>{this.props.question.options[i].content}</label>
          <span><i></i><b></b></span>
        </span>
            </li>
        );

    },
    componentDidMount:function(){
        var i = 0;
        var fa=this;
        $(".logicchoice").each(function(){
            if (fa.props.links[i]!=-1){
               $(this).children("span").children("span").children("i").addClass("icon-arrow-right");
                if (fa.props.links[i]=="stop"){
                    $(this).children("span").children("span").children("b").text("");
                    $(this).children("span").children("span").removeClass("logic-jump").addClass("logic-stop");
                }else{
                    $(this).children("span").children("span").children("b").text(fa.props.links[i]);
                    $(this).children("span").children("span").removeClass("logic-stop").addClass("logic-jump");
                }
            } else{
                $(this).children("span").children("span").children("b").text("");
                $(this).children("span").children("span").children("i").removeClass("icon-arrow-right");
                $(this).children("span").children("span").removeClass("logic-jump").removeClass("logic-stop");
            }
            i++;
        });

    },
    componentDidUpdate:function(){
        var i = 0;
        var fa=this;
        $(".logicchoice").each(function(){
            if (fa.props.links[i]>-1){
                console.log(fa.props.links[i],i);
                $(this).children("span").children("span").children("i").addClass("icon-arrow-right");
                if (fa.props.links[i]=="stop"){
                    $(this).children("span").children("span").children("b").text("");
                    $(this).children("span").children("span").removeClass("logic-jump").addClass("logic-stop");
                }else{
                    $(this).children("span").children("span").children("b").text(fa.props.links[i]);
                    $(this).children("span").children("span").removeClass("logic-stop").addClass("logic-jump");
                }
            } else{
                $(this).children("span").children("span").children("b").text("");
                $(this).children("span").children("span").children("i").removeClass("icon-arrow-right");
                $(this).children("span").children("span").removeClass("logic-jump").removeClass("logic-stop");
            }
            i++;
        });


        // var now;
        // var fa=this;
        // $("li>label").each(function(){
        //   if (parseInt($(this).text())==fa.props.Cnumber){
        //     now=$(this).parent();
        //   }
        // });
        // if (this.props.iflink){
        //   $(now).children("span").children("span").removeClass("logic-stop").addClass("logic-jump");
        //   $(now).children("span").children("span").children("b").text(this.props.Qnumber);
        //   $(now).children("span").children("span").children("i").addClass("icon-arrow-right");
        // }else if (!this.props.show){
        //   $(now).children("span").children("span").removeClass("logic-jump").addClass("logic-stop");
        //   $(now).children("span").children("span").children("b").text("");
        //   $(now).children("span").children("span").children("i").addClass("icon-arrow-right");
        // }else{
        //   if ($(now).children("span").children("span").hasClass("logic-stop")){
        //   }else{
        //     $(now).children("span").children("span").children("b").text("");
        //     $(now).children("span").children("span").children("i").removeClass("icon-arrow-right");
        //   }
        // }
    },
    render:function(){
        var fa=this;
        return(
            <div className="top">
                <div className="op-list-content">
                    <ul ref="list">
                        {
                            (function(){
                                var Cs=[]
                                for (var i = 0; i< fa.props.question.options.length;i++)
                                    Cs.push(fa.renderChoice(i));
                                return Cs;
                            })()
                        }
                    </ul>
                </div>
            </div>
        );
    }
});
 LogicBodyMid = React.createClass({
    pullDown:function(e){
        $(ReactDOM.findDOMNode(this.refs.pull)).toggleClass("dn");
        $(ReactDOM.findDOMNode(this.refs.icon)).toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
    },
    end:function(){
        $(ReactDOM.findDOMNode(this.refs.pull)).toggleClass("dn");
        $(ReactDOM.findDOMNode(this.refs.text)).text("则终止答题");
        $(ReactDOM.findDOMNode(this.refs.midbox)).addClass("red");
        this.props.callback(false);
    },
    Goto:function(){
        $(ReactDOM.findDOMNode(this.refs.pull)).toggleClass("dn");
        $(ReactDOM.findDOMNode(this.refs.text)).text("则跳到问题");
        $(ReactDOM.findDOMNode(this.refs.midbox)).removeClass("red");
        //this.
        this.props.callback(true);
    },
     componentDidMount:function(){
        if(!this.props.show){
            $(ReactDOM.findDOMNode(this.refs.pull)).addClass("dn");
            $(ReactDOM.findDOMNode(this.refs.text)).text("则终止答题");
            $(ReactDOM.findDOMNode(this.refs.midbox)).addClass("red");
        }
     },
    render:function(){
        return(
            <div className="middle">
                <div className="pulldown select-logic">
                    <a href="javascript:void(0);" ref="midbox" className="current-question" onTouchEnd={this.pullDown}>
                        <b ref="text">则跳到问题</b>
                        <i ref="icon" className="icon-pulldown icon-chevron-down"></i>
                    </a>
                    <ul ref="pull" className="dn">
                        <li><a href="javascript:void(0);" onTouchEnd={this.Goto}>则跳到问题</a></li>
                        <li><a className="red" href="javascript:void(0);" onTouchEnd={this.end}>则终止答题</a></li>
                    </ul>
                </div>
            </div>
        );

    }
});
 LogicBodyBot = React.createClass({
    active:function(e){
        if ($(e.currentTarget).hasClass("active")){
            $(e.currentTarget).removeClass("active");
            $(e.currentTarget).children("i").removeClass("icon-check-circle");
            this.props.callback(-1);
        }else{
            $(e.currentTarget).parent().children(".q-name").each(function(){
                $(this).children("i").removeClass("icon-check-circle");
                $(this).removeClass("active");
            });
            $(e.currentTarget).addClass("active");
            $(e.currentTarget).children("i").addClass("icon-check-circle");

            this.props.callback($(e.currentTarget).children("b").text());
        }
    },
    renderQ:function(i,question){
        i++;
        if (i<10) i="0"+i;
        return(
            <a href="javascript:void(0);" onTouchEnd={this.active} className="q-name" id={question._id}>
                <b>{i}</b>
                <span className="title">{question.title}</span>
                <i></i>
            </a>
        );
    },
    render:function(){
        var fa=this;
        return(
            <div className="bottom">
                {
                    (function(){
                        var Qs=[]
                        var flag= false;
                        var questions=get_question_list(fa.props.questionaire._id)
                        for (var i = 0; i< questions.length;i++){
                            if(flag){
                                Qs.push(fa.renderQ(i,questions[i]))
                            }
                            if(questions[i]._id ==fa.props.number)flag=true;
                        }
                       return Qs;
                    })()
                }
            </div>
        );
    }
});