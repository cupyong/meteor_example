/**
 * Created by root on 16-1-18.
 */

findChoiceById=function(questionId,id,questionaireId){
    var questionlist =get_question_list(questionaireId);
    var number=questionlist.length-1;
    for(var i=0;i<questionlist.length;i++){
        if(questionId==questionlist[i]._id){
            number =i;
        }
        if(id==questionlist[i]._id){
            if(number<i){
                return (i+1)>9?(i+1):"0"+(i+1)
            }else{
                return -1;
            }

        }
    }
    return -1;
},
 ShowSingle = React.createClass({
    getInitialState:function(){
        return ({logic:false});
    },
    show:function(e){
        var fa = $(e.currentTarget).parent()[0];
        $(e.currentTarget).parent().parent().children(".op-edited").each(function(){
            if (fa!==this) $(this).removeClass("show");
        });
        $(e.currentTarget).parent().toggleClass("show");
    },
     selectButton:function(e){
         ($(e.currentTarget).find("input").click())
     },

    render:function(){
        var fa = this;
        var code;
        if(this.props.number+1<10){
            code="0"+(this.props.number+1);
        }else{
            code =this.props.number+1;
        }

        return(
            <div className="op-edited" id={this.props.question._id} >
                <div className="q-name" onClick={this.show}>
                    <b>{code}</b>
                    <span className="title">{this.props.question.title}</span>
                </div>
                <div className="op-edited-bottom">
                    <Controls setnow={this.props.setnow} question={this.props.question} type={1} num={5} number={this.props.number}/>
                    <div className="op-list-content">
                        <ul>
                            {
                                (function(){
                                    var choices=[];
                                    for (var i=0;i<fa.props.question.options.length;i++){
                                        if (fa.props.question.options[i].link&&fa.props.question.options[i].link!=null){
                                            if(fa.props.question.options[i].link=="stop"){
                                                var class_name1="logic-stop";
                                                var class_name2="icon-arrow-right";
                                                var jumpnum ="";
                                            }else{
                                                var num =findChoiceById(fa.props.question._id,fa.props.question.options[i].link,fa.props.questionaire._id)
                                                if(num==-1){
                                                    var class_name1="";
                                                    var class_name2="";
                                                    var jumpnum="";
                                                }else{
                                                    var class_name1="logic-jump";
                                                    var class_name2="icon-arrow-right";
                                                    var jumpnum =num
                                                }

                                            }
                                        }else{
                                            var class_name1="";
                                            var class_name2="";
                                            var jumpnum="";
                                        }

                                        var ii = i+1;
                                        var ids="id"+fa.props.number+"id"+ii;
                                        choices.push(
                                            <li >
                          <span className="input logic-option" onClick={fa.selectButton}>
                          <input type="radio" name={fa.props.question._id} key={fa.props.question.options[i].key} />
                          <label htmlFor={ids}>{fa.props.question.options[i].content}</label>
                          <span className={class_name1}><i className={class_name2}></i><b>{jumpnum}</b></span>
                          </span>
                                            </li>
                                        );
                                    }
                                    if ( fa.props.question.issue.other_option){
                                        var otherids="id"+fa.props.number;
                                        choices.push(
                                            <OtherChoice key={otherids} number={fa.props.question._id} question={fa.props.question} />
                                        );
                                    }
                                    return choices;
                                })()
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
 ShowMulti = React.createClass({
    handlecheckcommon:function(e){
       if (e.currentTarget.checked){

            var name =$(e.currentTarget).attr("name");
            $("input[name='"+name+"'][data-key=noall]").removeAttr("checked");
        }
    },
    show:function(e){
        var fa = $(e.currentTarget).parent()[0];
        $(e.currentTarget).parent().parent().children(".op-edited").each(function(){
            if (fa!==this) $(this).removeClass("show");
        });
        $(e.currentTarget).parent().toggleClass("show");
    },
    findChoiceById:function(arg){
        //for (var i= 0; i<window.questionaire.logic.length;i++){
        //    if (arg==window.questionaire.logic[i].option_id) return i;
        //}
        //return -1;
    },
    selectButton:function(e){
       ($(e.currentTarget).find("input").click())
    },
    render:function(){
        var code;
        if(this.props.number+1<10){
            code="0"+(this.props.number+1);
        }else{
            code =this.props.number+1;
        }
        var fa=this;
        return(
            <div className="op-edited" id={this.props.question._id}>
                <div className="q-name" onClick={this.show}>
                    <b>{code}</b>
                    <span className="title">{this.props.question.title}</span>
                </div>
                <div className="op-edited-bottom">
                    <Controls setnow={this.props.setnow} question={this.props.question} type={2} num={5} number={this.props.number} />
                    <div className="op-list-content">
                        <ul>
                            {
                                (function(){
                                    var choices=[];
                                    for (var i=0;i<fa.props.question.options.length;i++){
                                        var class_name1="";
                                        var class_name2="";
                                        var jumpnum="";
                                        var ii = i+1;
                                        var ids="id"+fa.props.number+"id"+ii;
                                        choices.push(
                                            <li>
                         <span className="input logic-option" onClick={fa.selectButton}>
                          <input type="checkbox" name={fa.props.question._id} key={fa.props.question.options[i].key}  onClick={fa.handlecheckcommon}/>
                          <label htmlFor={fa.props.question.options[i].key}>{fa.props.question.options[i].content}</label>
                          <span className={class_name1}><i className={class_name2}></i><b>{jumpnum}</b></span>
                          </span>
                                            </li>
                                        );
                                    }
                                    if ( fa.props.question.issue.no_option){

                                        var otherids="id"+fa.props.number+"nochoice";
                                        choices.push(
                                            <NoChoice key={otherids} number={fa.props.question._id} question={fa.props.question} />
                                        );
                                    }

                                    if ( fa.props.question.issue.other_option){
                                        var otherids="id"+fa.props.number+"other";
                                        choices.push(
                                            <OtherChoice key={otherids} number={fa.props.question._id} question={fa.props.question} />
                                        );
                                    }

                                    return choices;
                                })()
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
 ShowFill = React.createClass({
    show:function(e){
        var fa = $(e.currentTarget).parent()[0];
        $(e.currentTarget).parent().parent().children(".op-edited").each(function(){
            if (fa!==this) $(this).removeClass("show");
        });
        $(e.currentTarget).parent().toggleClass("show");
    },
    render:function(){
        var code;
        if(this.props.number+1<10){
            code="0"+(this.props.number+1);
        }else{
            code =this.props.number+1;
        }
        return(
            <div className="op-edited" id={this.props.question._id}>
                <div className="q-name" onClick={this.show}>
                    <b>{code}</b>
                    <span className="title">{this.props.question.title}</span>
                </div>
                <div className="op-edited-bottom">
                    <Controls setnow={this.props.setnow} question={this.props.question} type={4} num={4} number={this.props.number} />
                    <div className="op-list-content">
                        <div className="op-textarea" contentEditable={true} placeholder={this.props.question.issue.placeholder}></div>
                    </div>
                </div>
            </div>
        );
    }
});
 ShowGrade = React.createClass({
    show:function(e){
        var fa = $(e.currentTarget).parent()[0];
        $(e.currentTarget).parent().parent().children(".op-edited").each(function(){
            if (fa!==this) $(this).removeClass("show");
        });
        $(e.currentTarget).parent().toggleClass("show");
    },
    handleStar:function(num,e){
        $(e.currentTarget).parent().children("span").children("b").text(num);
        var count = 0;
        $(e.currentTarget).parent().children("a").each(function(){
            count++;
            if (count > num)
                $(this).removeClass("active");
            else $(this).addClass("active");
        });
    },
    gradeChoices:function(){
        var fa = this;
        var choices=[];
        for (var i=0; i<fa.props.question.options.length;i++){
            choices.push(
                <dt>{fa.props.question.options[i].content}</dt>
            );
            choices.push(
                <dd>
                    <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,1)} className="icon icon-star "></a>
                    <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,2)} className="icon icon-star "></a>
                    <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,3)} className="icon icon-star "></a>
                    <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,4)} className="icon icon-star"></a>
                    <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,5)}className="icon icon-star"></a>
                    <span className="score"><b>0</b>分</span>
                </dd>
            );
        }
        return choices;
    },
    render:function(){
        var code;
        if(this.props.number+1<10){
            code="0"+(this.props.number+1);
        }else{
            code =this.props.number+1;
        }
        return(
            <div className="op-edited" id={this.props.question._id}>
                <div className="q-name" onClick={this.show}>
                    <b>{code}</b>
                    <span className="title">{this.props.question.title}</span>
                </div>
                <div className="op-edited-bottom">
                    <Controls setnow={this.props.setnow} question={this.props.question} type={5} num={4} number={this.props.number} />
                    <div className="op-list-content">
                        <dl className="star-content">
                            {this.gradeChoices()}
                        </dl>
                    </div>
                </div>
            </div>
        );
    }
});
 ShowSort = React.createClass({
    show:function(e){
        var fa = $(e.currentTarget).parent()[0];
        $(e.currentTarget).parent().parent().children(".op-edited").each(function(){
            if (fa!==this) $(this).removeClass("show");
        });
        $(e.currentTarget).parent().toggleClass("show");
    },
    getInitialState:function(){
        return  {num:this.props.num,count: 0}
    },
    SortChoices:function(){
        var choices=[];
        for (var i = 0; i < this.props.question.options.length; i++)
        {
            choices.push(
                <li onTouchEnd={this.handleSort}><i className="num"></i><span className="op-name">{this.props.question.options[i].content}</span></li>
            );
        }
        return(
            <ul className="sort">
                {choices}
            </ul>
        );
    },
    handleSort:function(e){

        if ($(e.currentTarget).children("i").text()==""){
            this.state.count++;
            if (this.state.count<=3){
                if (this.state.count==1){
                    $(e.currentTarget).children("i").addClass("one").text(1);
                }
                if (this.state.count==2){
                    $(e.currentTarget).children("i").addClass("two").text(2);
                }
                if (this.state.count==3){
                    $(e.currentTarget).children("i").addClass("three").text(3);
                }
            }else{
                $(e.currentTarget).children("i").text(this.state.count);
            }
        }else{
            var num = parseInt($(e.currentTarget).children("i").text());
            if (num<=3){
                if (num==1) $(e.currentTarget).children("i").removeClass("one");
                if (num==2) $(e.currentTarget).children("i").removeClass("two");
                if (num==3) $(e.currentTarget).children("i").removeClass("three");
                $(e.currentTarget).parent().children("li").each(function(){
                    var nownum = parseInt($(this).children("i").text())
                    if ($(this).children("i").text()!=="" && nownum>num){
                        $(this).children("i").text(nownum-1);
                        if (nownum-1 == 1){
                            $(this).children("i").removeClass("two").addClass("one");
                        }else if (nownum-1==2){
                            $(this).children("i").removeClass("three").addClass("two");
                        }else if (nownum-1==3){
                            $(this).children("i").addClass("three");
                        }
                    }
                });
                $(e.currentTarget).children("i").text("");
                this.state.count--;

            }else{
                var num = parseInt($(e.currentTarget).children("i").text());
                $(e.currentTarget).parent().children("li").each(function(){
                    var nownum = parseInt($(this).children("i").text())
                    if ($(this).children("i").text()!=="" && nownum>num){
                        $(this).children("i").text(nownum-1);
                    }
                });
                $(e.currentTarget).children("i").text("");
                this.state.count--;
            }
        }
    },
    render:function(){
        var code;
        if(this.props.number+1<10){
            code="0"+(this.props.number+1);
        }else{
            code =this.props.number+1;
        }
        return(
            <div className="op-edited" id={this.props.question._id}>
                <div className="q-name" onClick={this.show}>
                    <b>{code}</b>
                    <span className="title">{this.props.question.title}</span>
                </div>
                <div className="op-edited-bottom">
                    <Controls setnow={this.props.setnow} question={this.props.question} type={3} num={4} number={this.props.number} />
                    <div className="op-list-content">
                        {this.SortChoices()}
                    </div>
                </div>
            </div>
        );
    }
});

 Controls = React.createClass({
    edit:function(){
        Router.go('mysinglequestion',
            {questionnaireId: this.props.question.questionnaire_id,
             questionId:this.props.question._id,
             type:this.props.type });
        //this.props.setnow(2,this.props.type,this.props.question._id,false)
    },
    copy:function(e){
        $(ReactDOM.findDOMNode(this.refs.delbottom)).hide()
        $(ReactDOM.findDOMNode(this.refs.copybottom)).show()
        $(e.currentTarget).parent().parent().animate({bottom:"-6.3rem"},"slow");


    },
    copydata:function(e){
       var fa=this;
        var target = $(e.currentTarget);
        Meteor.call("copyQuestion",this.props.question._id,function(error , result){
            if (result){
                fa.props.setnow(1);
                target.parent().parent().addClass("setOverflow")
                target.parent().parent().addClass("optionall op-copyself")
                $(".op-edited:last").addClass("show")
                $(".op-edited:last").addClass("setOverflow")
                $(".op-edited:last").addClass("optionall op-copyitem")
                $("html,body").animate({scrollTop:$(".op-edited:last").offset().top},1000)
                setTimeout(function(){
                    target.parent().parent().removeClass("setOverflow")
                    target.parent().parent().removeClass("optionall op-copyself")
                    target.parent().parent().parent().removeClass("show")
                    $(".op-edited").removeClass("setOverflow")
                    $(".op-edited").removeClass("optionall op-copyitem")
                    target.prev().prev().prev().css("bottom","0rem")

                },1000);
            }

        });
    },
    sortq:function(){
        Router.go('myquestionsort', {_id: this.props.question.questionnaire_id});

    },
     cancel:function(e){

         $(e.currentTarget).prev().animate({bottom:"0rem"},"slow");

     },
    trash:function(e){
        $(ReactDOM.findDOMNode(this.refs.delbottom)).show()
        $(ReactDOM.findDOMNode(this.refs.copybottom)).hide()
        $(e.currentTarget).parent().parent().animate({bottom:"-6.3rem"},"slow");

        //$.deleteJSON('/villi/questions/'+ this.props.question._id, {}, function(data){
        //    window.questionaire = data.value.survey;
        //    window.questions = data.value.questions;
        //    fa.props.setnow(1);
        //});
    },
     delete:function(e){
         var fa=this;
         $(e.currentTarget).parent().parent().parent().addClass("setOverflow")
         $(e.currentTarget).parent().parent().parent().addClass("optionall op-delete")
         setTimeout(function(){
             $(".op-edited").removeClass("setOverflow show")
             $(".op-edited").removeClass("optionall op-delete")
             fa.props.setnow(1);
          },1000);

         Meteor.call("deleteQuestion",this.props.question._id,function(error , result){
            //if (result){
            //     fa.props.setnow(1);
            // }
          });
     },
    logic:function(){
        Router.go('myquestionlogic', {questionnaireId:this.props.question.questionnaire_id,
            _id:this.props.question._id});

        //this.props.setnow(3,this.props.type,this.props.question._id);
    },
    render:function(){
        var fa = this;
        if (this.props.type==1)
            return(
                <div className="op-icons">
                <ul className="fn-column">
                    <li><a href="javascript:void(0);" onClick={this.edit}><i className="icon icon-pencil"></i></a></li>
                    <li><a href="javascript:void(0);" onClick={this.copy}><i className="icon icon-copy"></i></a></li>
                    <li><a href="javascript:void(0);" onClick={this.logic}><i className="icon icon-logicalcontrol"></i></a></li>
                    <li><a href="javascript:void(0);" onClick={this.sortq}><i className="fa fa-sort"></i></a></li>
                    <li><a className="norightborder" onClick={this.trash} href="javascript:void(0);"><i className="icon icon-trash"></i></a></li>
                </ul>
                    <a href="javascript:void(0);" onClick={this.cancel} className="dbtn cancel l">取消</a>
                    <a  ref="delbottom" style={{display:"none"}} href="javascript:void(0);" className="dbtn submit r" onClick={this.delete}>确认删除</a>
                    <a  ref="copybottom" href="javascript:void(0);" className="dbtn submit r" onClick={this.copydata}>确认复制</a>
                </div>
            );else return(
            <div className="op-icons">
            <ul className="fn-column four">
                <li><a href="javascript:void(0);" onClick={this.edit}><i className="icon icon-pencil"></i></a></li>
                <li><a href="javascript:void(0);" onClick={this.copy}><i className="icon icon-copy"></i></a></li>
                <li><a href="javascript:void(0);" onClick={this.sortq}><i className="fa fa-sort"></i></a></li>
                <li><a className="norightborder" onClick={this.trash} href="javascript:void(0);"><i className="icon icon-trash"></i></a></li>
            </ul>
                <a href="javascript:void(0);" onClick={this.cancel} className="dbtn cancel l">取消</a>
                <a ref="delbottom" style={{display:"none"}} href="javascript:void(0);" className="dbtn submit r" onClick={this.delete}>确认删除</a>
                <a ref="copybottom" href="javascript:void(0);" className="dbtn submit r" onClick={this.copydata}>确认复制</a>
            </div>

        );
    }
});
 OtherChoice = React.createClass({
     componentDidMount:function(){
         //如果存在答案那么就绑定答案
         if(this.props.answer){

             if(this.props.answer.answer.other_select){
                 $(ReactDOM.findDOMNode(this.refs.radio)).attr("checked","checked");
                 $(ReactDOM.findDOMNode(this.refs.input)).removeClass("dn");
                 $(ReactDOM.findDOMNode(this.refs.input)).val(this.props.answer.answer.other_option)

             }
         }
     },
     selectButton:function(e){
        ($(e.currentTarget).find("input").click())
         e.stopPropagation();
     },
     othercheck:function(e){
       ($(e.currentTarget).parent().find("input").click())

     },
    handlecheck:function(e){
        $(ReactDOM.findDOMNode(this.refs.input)).removeClass("dn")
        if (e.currentTarget.checked)
            $(ReactDOM.findDOMNode(this.refs.input)).removeClass("dn");
        else $(ReactDOM.findDOMNode(this.refs.input)).addClass("dn");
    },
    render:function(){

        var otherids="otherid"+this.props.number;
        if(this.props.question.type==1){
            return(
                <li style={{height:"auto"}}>
        <span className="input"  onClick={this.selectButton}>
          <input onClick={this.handlecheck} type="radio" ref="radio" name={this.props.question._id} data-key="other" />
          <label >其他（请填写）：</label>
          <input ref="input" className="op-list-input dn" placeholder="请填写" type="text" />
        </span>
                </li>
            );
        }else{
            return(
                <li style={{height:"auto"}}>
        <span className="input" >
          <input onClick={this.handlecheck} type="checkbox" ref="radio"  name={this.props.question._id}   data-key="other"/>
          <label onClick={this.othercheck}>其他（请填写）：</label>
          <input ref="input" className="op-list-input dn" placeholder="请填写" type="text" />
        </span>
                </li>
            );
        }

    }
});
NoChoice = React.createClass({
    componentDidMount:function(){
        //如果存在答案那么就绑定答案
        if(this.props.answer){

            if(this.props.answer.answer.no_option){
                $(ReactDOM.findDOMNode(this.refs.radio)).attr("checked","checked");
            }
        }
    },
    selectButton:function(e){
        ($(e.currentTarget).parent().find("input").click())
    },
    handlecheck:function(e){
        if (e.currentTarget.checked){

           var name =$(e.currentTarget).attr("name");
            $("input[name='"+name+"'][data-key!=noall]").removeAttr("checked");
        }
    },
    render:function(){

        var otherids="otherid"+this.props.number;
        if(this.props.question.type==1){
            return(
                <li>
        <span className="input" >
          <input onClick={this.handlecheck} type="radio" ref="radio" data-key="noall"  name={this.props.question._id}  />
          <label onClick={this.selectButton}>以上都不是</label>

        </span>
                </li>
            );
        }else{
            return(
                <li>
        <span className="input" >
          <input onClick={this.handlecheck} type="checkbox"  ref="radio" data-key="noall" name={this.props.question._id}  />
          <label  onClick={this.selectButton}>以上都不是</label>

        </span>
                </li>
            );
        }

    }
});
