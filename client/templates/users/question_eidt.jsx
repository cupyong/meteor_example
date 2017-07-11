/**
 * Created by root on 16-1-18.
 */
 ChangeTypeBtn = React.createClass({
    componentDidMount:function(){
        switch (this.props.type) {
            case 1:
                this.setState({text:"单选题"});
                break;
            case 2:
                this.setState({text:"多选题"});
                break;
            case 3:
                this.setState({text:"排序题"});
                break;
            case 4:
                this.setState({text:"填空题"});
                break;
            case 5:
                this.setState({text:"评分题"});
                break;
            default:
                return;
        }
    },
    getInitialState:function(){
        return {
            type:this.props.type,text:"",
        };
    },
    handlePullDown:function(e){
        if ($(e.currentTarget).children("b").text()=="切换为"){
            $(e.currentTarget).children("b").text(this.state.text);
        }else {
            $(e.currentTarget).children("b").text("切换为");
        }
        $(e.currentTarget).next().toggleClass("dn");
        $(e.currentTarget).children("i").toggleClass("icon-chevron-down");
        $(e.currentTarget).children("i").toggleClass("icon-chevron-up");
    },
    handleChange:function(type,e){
        $(e.currentTarget).parent().parent().toggleClass("dn");
        $(e.currentTarget).parent().parent().prev().children("i").toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
        var nowtype;
        var k;
        switch(type){
            case "single":
                nowtype="单选题";
                k=1;
                this.setState({nowtype:1});
                break;
            case "multi":
                nowtype="多选题";
                k=2;
                this.setState({nowtype:2});
                break;
            case "sort":
                nowtype="排序题";
                k=3;
                this.setState({nowtype:3});
                break;
            case "fill":
                k=4;
                nowtype="填空题";
                this.setState({nowtype:4});
                break;
            case "grade":
                k=5;
                nowtype="评分题";
                this.setState({nowtype:5});
                break;
        }
        this.props.callback(k);
        $(e.currentTarget).parent().parent().prev().children("b").text(nowtype);
    },
    render:function(){
        return(
            <div className="pulldown select-question">
                <a href="javascript:void(0);2" onTouchEnd={this.handlePullDown} className="current-question">
                    <b>{this.state.text}</b>
                    <i className="icon-pulldown icon-chevron-down"></i>
                </a>
                <ul className="dn">
                    <li><a href="javascript:void(0);3" onTouchEnd={this.handleChange.bind(this,"single")} >单选题</a></li>
                    <li><a href="javascript:void(0);4" onTouchEnd={this.handleChange.bind(this,"multi")} >多选题</a></li>
                    <li><a href="javascript:void(0);5" onTouchEnd={this.handleChange.bind(this,"sort")} >排序题</a></li>
                    <li><a href="javascript:void(0);6" onTouchEnd={this.handleChange.bind(this,"fill")} >填空题</a></li>
                    <li><a href="javascript:void(0);7" onTouchEnd={this.handleChange.bind(this,"grade")} >评分题</a></li>
                </ul>
            </div>
        );
    }
});
 EditQuestion = React.createClass({
    getInitialState:function(){
        console.log(this.props.number)

        var defaultState= {
            sum:2,
            type:this.props.type,
            title:"",
            others1:false,
            others2:false,
            unorder:false,
            controlsum:true,
            minsum:1,
            maxsum:2,
            controlwords:false,
            wordsum:1,
            onlynum:false,
            commontype:this.props.number,
            choices:["",""],
            fillnote:"",
        }
        if(this.props.number){
            var commonquestion = CommonQuestions.findOne({name:this.props.number})
            if(commonquestion){
                oneq =commonquestion;
                //设置cookie 用来取消时候返回题型选择
                setCookie('back',"ok")

            }else{
                oneq =Questions.findOne({_id:this.props.number})
            }
            //oneq = window.questions[this.props.number];

            console.log(oneq);
            var type=oneq.type
            var onlynum;
            var choices=[];
            if (type!==4){
                for (var i=0;i<oneq.options.length;i++){
                    choices.push(oneq.options[i].content);
                }
            }
            if (type==1){
                var other1=oneq.issue.other_option


                     defaultState.sum=oneq.options.length,
                    defaultState.type=type;
                    defaultState.title=oneq.title;
                    defaultState.others1=other1;
                    defaultState.unorder=oneq.issue.is_rand;
                    defaultState.choices=choices;

            }
            if (type==2){
                var other1=oneq.issue.other_option;
                var other2=oneq.issue.no_option;
                    defaultState.sum=oneq.options.length;
                    defaultState.type=type;
                    defaultState.title=oneq.title;
                    defaultState.others1=other1;
                    defaultState.others2=other2;
                    defaultState.unorder=oneq.issue.is_rand;
                    defaultState.minsum=oneq.issue.min_choice;
                    defaultState.maxsum=oneq.issue.max_choice;
                    defaultState.choices=choices;;
                    defaultState.controlsum=oneq.issue.choice_limit;


            }
            if (type==3){

                    defaultState.sum=oneq.options.length;
                    defaultState.type=type;
                    defaultState.title=oneq.title;
                    defaultState.unorder=oneq.issue.is_rand;
                    defaultState.choices=choices;
                    defaultState.minsum=oneq.issue.min_choice;
                    defaultState.maxsum=oneq.issue.max_choice;

            }
            if (type==4){
                    defaultState.type=type,
                    defaultState.title=oneq.title,
                    defaultState.controlwords=oneq.issue.is_limit,
                    defaultState.wordsum=oneq.issue.min_value,
                    defaultState.onlynum=oneq.issue.onlynum,
                    defaultState.fillnote=oneq.issue.placeholder,
                    defaultState.common=oneq.common,
                    defaultState.commontype=oneq.name

            }
            if (type==5){

                    defaultState.sum=oneq.options.length;
                    defaultState.type=type;
                    defaultState.title=oneq.title;
                    defaultState.unorder=oneq.issue.is_rand;
                    defaultState.choices=choices;

            }

        }else{
            //设置cookie 用来取消时候返回题型选择
            setCookie('back',"ok")
        }

        return defaultState
    },
   addOneChoice:function(){
        var nowsum= this.state.sum+1;
        this.setState({sum:nowsum,maxsum:nowsum});
    },
    callBackState:function(num){
        this.setState({sum:num,maxsum:num});
    },
    cleartext:function(e){
        $(e.currentTarget).prev().text("");
    },
    changeType:function(newtype){
        this.setState({type:newtype});
    },
    setback:function(choices){
        this.state.choices=choices;
    },
    setbackfill:function(str){
        this.state.fillnote=str;
    },
    changecolor:function(){
        var fa = this;
        $(ReactDOM.findDOMNode(fa.refs.title)).html('');
        setTimeout(function(){
           $(ReactDOM.findDOMNode(fa.refs.title)).removeClass("q-name-input")
           $(ReactDOM.findDOMNode(fa.refs.title)).addClass("q-name-input-red")
       },200)
        setTimeout(function(){
            $(ReactDOM.findDOMNode(fa.refs.title)).addClass("q-name-input")
            $(ReactDOM.findDOMNode(fa.refs.title)).removeClass("q-name-input-red")
        },400)
        setTimeout(function(){
            $(ReactDOM.findDOMNode(fa.refs.title)).removeClass("q-name-input")
            $(ReactDOM.findDOMNode(fa.refs.title)).addClass("q-name-input-red")
        },600)
    },
    changecolorOption:function(i){
         var fa = this;
         setTimeout(function(){
             $($(".o-name").find("span")[i]).removeClass("o-name-input")
             $($(".o-name").find("span")[i]).addClass("o-name-input-red")
         },200)
         setTimeout(function(){
             $($(".o-name").find("span")[i]).addClass("o-name-input")
             $($(".o-name").find("span")[i]).removeClass("o-name-input-red")
         },400)
         setTimeout(function(){
             $($(".o-name").find("span")[i]).removeClass("o-name-input")
             $($(".o-name").find("span")[i]).addClass("o-name-input-red")
         },600)
     },
    handlesubmit:function(){
        console.log(111);
        if (this.state.title==""){
            //ReactDOM.findDOMNode(this.refs.titlebox).style.background="gray";
            this.changecolor();
            return;
        }
        var fa=this;
        var type1;
        var type2;
        switch (this.state.type){
            case 1:
                type1 = 0;
                type2 = 0;
                break;
            case 2:
                type1 = 0;
                type2 = 6;
                break;
            case 3:
                type1 = 12;
                type2 = null;
                break;
            case 4:
                type1 = 2;
                type2 = null;
                break;
            case 5:
                type1 = 17;
                type2 = null;
                break;
        }
        console.log("onlyenum: ",this.state.onlynum);
        if (this.state.onlynum) type1=3;
        var hasother = false;
        var othercontent = null;
        console.log("others1:",this.state.others1,"others2:",this.state.others2);
        if (this.state.others1){
            hasother=true;
            othercontent="其他（请填写）：";
        };
        if (this.state.others2){
            hasother=true;
            othercontent="以上都不是";
        };

        var options =[];
        for(var i=0;i<this.state.choices.length;i++){
            var contenttext = this.state.choices[i].replace(/<[^>]+>/g,"").replace(/&nbsp;/g,"");
            //if(contenttext.length==0){
            //    fa.changecolorOption(i);
            //    return;
            //}
            if(this.state.choices[i]){
                var contenttext = this.state.choices[i].replace(/<[^>]+>/g,"").replace(/&nbsp;/g,"");
                contenttext=contenttext.length>0?contenttext:"请输入选项名称";
                options.push({key:(i+1),content:contenttext})
            }else{
                options.push({key:(i+1),content:"请输入选项名称"})
            }

        }

        var params={
             questionnaire_id:this.props.questionaire._id,
             title:this.state.title,
             type:this.state.type,
             options:options,
             question_type:type1,
             common:false,
             commontype:"",
             issue:{
                choice_limit:this.state.controlsum,
                other_option:this.state.others1,
                no_option:this.state.others2,
                placeholder:this.state.fillnote,
                min_value:this.state.wordsum,
                min_choice:this.state.minsum,
                max_choice:this.state.maxsum,
                is_rand:this.state.unorder,
                is_limit:this.state.controlwords,
                onlynum:this.state.onlynum,
            }
        }

        if(this.props.number){

            var commonquestion=CommonQuestions.findOne({name:this.props.number});
            if(commonquestion){
                //对比options title 如过相同那么就是common问题
                var common=false
                var commontype="";
                if(commonquestion.title==params.title&&commonquestion.type==params.type&&commonquestion.options==params.options){
                     common=true
                     commontype= this.props.number
                }
                params.common=true
                params.commontype=this.props.number
                Meteor.call("createQuestion",params,function(error , id){
                    //fa.props.setnow(1);
                    //Router.go('myquestionlist',
                    //    {
                    //        _id: fa.props.questionaire._id
                    //    });
                    //Session.set("questionnaire",1)
                    setCookie('back','');
                    Router.go('publishquestionnaire',
                        {
                            _id: fa.props.questionaire._id
                        },{ query: "id=" + encodeURIComponent(id) });
                });
            }else{
                Meteor.call("updateQuestion",this.props.number,params,function(error , id){
                     setCookie('back','');
                     Router.go('publishquestionnaire',
                        {
                            _id: fa.props.questionaire._id
                        },{ query: "id=" + encodeURIComponent(fa.props.number) });
                })

            }

        }else{

            Meteor.call("createQuestion",params,function(error , id){
                setCookie('back','');
                //fa.props.setnow(1);
                //Router.go('myquestionlist',
                //    {
                //        _id: fa.props.questionaire._id
                //    });
                //Session.set("questionnaire",1)
                Router.go('publishquestionnaire',
                    {
                        _id: fa.props.questionaire._id
                    },{ query: "id=" + encodeURIComponent(id) });

            });
        }




        //var params={
        //    "content":{"text":this.state.title},
        //    "note":this.state.fillnote,
        //    "is_required":true,
        //    "question_type":type1,
        //    "issue":{
        //        "choice_num_per_row":null,
        //        "option_type":type2,
        //        "min_value":this.state.wordsum,
        //        "min_choice":this.state.minsum,
        //        "max_choice":this.state.maxsum,
        //        "items":[],
        //        "other_item":{
        //            "has_other_item":hasother,
        //            "content":{"text":othercontent, "image":null, "video":null, "audio":null}
        //        },
        //        "is_rand":this.state.unorder,
        //        "is_limit":this.state.controlwords,
        //    }
        //}



        //for (var i=0;i<this.state.choices.length;i++){
        //    params.issue.items.push({
        //        "content":{"text":this.state.choices[i], "image":null, "audio":null, "video":null, "id":null}
        //    })
        //}
        //if (this.props.number>=0){
        //    $.putJSON('/villi/questions/'+window.questions[this.props.number]._id, params,function(data){
        //        if(data.success){
        //            window.questionaire = data.value.survey;
        //            window.questions = data.value.questions;
        //            fa.props.setnow(1);
        //        }
        //    })
        //}else{
        //    console.log(params);
        //
        //    //$.postJSON('/villi/questions', params,function(data){
        //    //    if(data.success){
        //    //        window.questionaire = data.value.survey;
        //    //        window.questions = data.value.questions;
        //    //        fa.props.setnow(1);
        //    //    }
        //    //})
        //}
    },
    componentDidUpdate:function(){
    },
    handlecancel:function(){
        if (this.props.normal == true){
            console.log("delete");
            var fa=this;
            //$.deleteJSON('/villi/questions/'+ window.questions[this.props.number]._id, {}, function(data){
            //    window.questionaire = data.value.survey;
            //    window.questions = data.value.questions;
            //    fa.props.setnow(1);
            //});
        }else{
            //Router.go('myquestionlist',
            //    {
            //        _id: this.props.questionaire._id
            //    });
            //Session.set("questionnaire",1)
            Router.go('publishquestionnaire',
                {
                    _id: this.props.questionaire._id
                });

        }
    },
    setbackopt:function(arg1,arg2){
        console.log("setbackopt",arg1,arg2);
        switch (arg1){
            case "others1":
                this.state.others1=arg2;
                break;
            case "others2":
                this.state.others2=arg2;
                break;
            case "unorder":
                this.state.unorder=!this.state.unorder;
                break;
            case "controlsum":
                this.state.controlsum=!this.state.controlsum;
                break;
            case "minsum":
                this.state.minsum=arg2;
                break;
            case "maxsum":
                this.state.maxsum=arg2;
                break;
            case "controlwords":
                this.state.controlwords=!this.state.controlwords;
                break;
            case "wordsum":
                this.state.wordsum=arg2;
                console.log(this.state.wordsum);
                break;
            case "onlynum":
                this.state.onlynum=!this.state.onlynum;
                break;
        }
    },
    getTitle:function(){
       this.state.title=ReactDOM.findDOMNode(this.refs.title).innerHTML.replace(/<[^>]+>/g,"").replace(/&nbsp;/g,"");
    },
     setFoucus:function(e){
         $(e.currentTarget).next().removeClass("dn")
     },
     setblur:function(e){
         $(e.currentTarget).next().addClass("dn")
     },
    render:function(){
        var fa = this;
        return(
            <div className="container">
                <div className="edit">
                    <div className="edit-content">
                        <ChangeTypeBtn type={this.state.type} callback={this.changeType}/>
                        <div className="option">
                            <div ref="titlebox" className="q-name">
                                <span ref="title" className="q-name-input" onInput={this.getTitle}
                                      contentEditable={true}
                                      placeholder="请输入问题"
                                      onFocus={this.setFoucus}
                                      onBlur={this.setblur}
                                >{this.state.title}</span>
                                <a href="javascript:void(0);8" onClick={this.cleartext} className="cancel dn"><i className="icon icon-times-circle"></i></a>
                            </div>
                            <EditChoices setback={this.setback}  number={this.state.commontype} placeholder={this.state.fillnote} setbackfill={this.setbackfill} choices={this.state.choices} sum={this.state.sum} type={this.state.type} setnow={this.callBackState}/>
                            {
                                (function(){
                                    if (fa.state.type!==4){
                                        return (
                                            <a href="javascript:void(0);9" onTouchEnd={fa.addOneChoice} className="add-option"><i className="icon icon-plus-circle"></i>增加一个新选项</a>
                                        );
                                    }
                                })()
                            }
                            <Options controlSum={this.state.controlsum} setback={this.setbackopt} number={this.state.commontype} questionstate={this.state} sum={this.state.sum} type={this.state.type}/>
                        </div>
                    </div>
                </div>
                <div className="bottom-option">
                    <div className="shadow"></div>
                    <a onTouchEnd={this.handlesubmit} className="submit r">确定</a>
                    <a onTouchEnd={this.handlecancel} className="cancel l">取消</a>
                </div>
            </div>
        )
    }
});
 Options = React.createClass({
    handleOption:function(){
       var fa=this;
        switch (this.props.type){
            case 1:
                return(
                    <div className="more-option">
                        <SpecialChoice questionstate={this.props.questionstate} setback={fa.props.setback} type={1} />
                        <DisOrder setback={fa.props.setback} questionstate={this.props.questionstate} />
                    </div>
                );
                break;
            case 2:
                return(
                    <div className="more-option">
                        <SpecialChoice questionstate={this.props.questionstate} setback={fa.props.setback} type={2} />
                        <ControlSum  controlSum={this.props.controlSum} questionstate={this.props.questionstate} setback={this.props.setback} max={fa.props.sum}/>
                        <DisOrder questionstate={this.props.questionstate} setback={fa.props.setback} />
                    </div>
                );
                break;
            case 5:
                return(
                    <div className="more-option">
                        <DisOrder questionstate={this.props.questionstate} setback={fa.props.setback} />
                    </div>
                );
                break;
            case 3:
                return(
                    <div className="more-option">
                        <DisOrder questionstate={this.props.questionstate} setback={fa.props.setback} />
                        <ControlSum  controlSum={this.props.controlSum} questionstate={this.props.questionstate} setback={this.props.setback} max={fa.props.sum}/>
                    </div>
                );
                break;
            case 4:
                console.log(fa.props.number)
                if(fa.props.number!='address'){
                    return(
                        <div className="more-option">
                            <ControlWords questionstate={this.props.questionstate} setback={fa.props.setback}/>
                            <OnlyNum questionstate={this.props.questionstate} setback={fa.props.setback} />
                        </div>
                    );
                }else{
                    return(
                        <div className="more-option">

                        </div>
                    );
                }
                break;
        }
    },
    render:function(){
        return (this.handleOption());
    }
});
 SpecialChoice = React.createClass({
    handleclick1:function(){
        console.log("done");
        if (this.props.type==2){
            //$(ReactDOM.findDOMNode(this.refs.other2)).removeAttr("checked");
            if (ReactDOM.findDOMNode(this.refs.other1).checked){
                this.props.setback("others1",true);
               // this.props.setback("others2",false);
            }else{
                this.props.setback("others1",false);
                //this.props.setback("others2",false);
            }
        }else{
            if (ReactDOM.findDOMNode(this.refs.other1).checked){
                this.props.setback("others1",true);
            }else{
                this.props.setback("others1",false);
            }
        }

    },
    handleclick2:function(e){
       // $(ReactDOM.findDOMNode(this.refs.other1)).removeAttr("checked");
        if (ReactDOM.findDOMNode(this.refs.other2).checked){
           // this.props.setback("others1",false);
            this.props.setback("others2",true);
        }else{
           // this.props.setback("others1",false);
            this.props.setback("others2",false);
        }
    },
    componentDidUpdate:function(){
        if (this.props.type==1){
            if (this.props.questionstate.others1==true){
                console.log("zhelia");
                $(ReactDOM.findDOMNode(this.refs.other1)).attr("checked",true);
            }
        }else{
            if (this.props.questionstate.others1==true){
                $(ReactDOM.findDOMNode(this.refs.other1)).attr("checked",true);
            }
            if (this.props.questionstate.others2==true){
                $(ReactDOM.findDOMNode(this.refs.other2)).attr("checked",true);
            }
        }
    },
    renderCheckbox:function(){
        if (this.props.type==1){
            return(
                <div className="column check clearfix">
                    <h3>添加特殊选项</h3>
					<span  className="input">
						<input onClick={this.handleclick1} ref="other1" type="checkbox" id="other"/>
						<label htmlFor="other">其他（请填写）</label>
					</span>
                </div>
            );
        }
        else{
            return(
                <div className="column check clearfix">
                    <h3>添加特殊选项</h3>
					<span  className="input">
						<input onClick={this.handleclick1} ref="other1" type="checkbox" id="other"/>
						<label htmlFor="other">其他（请填写）</label>
					</span>
					<span className="input">
						<input onClick={this.handleclick2} ref="other2" type="checkbox" id="not-all" />
						<label htmlFor="not-all">以上都不是</label>
					</span>
                </div>
            );
        }
    },
    render:function(){
        return(
            this.renderCheckbox()
        );
    }
});
 ControlSum = React.createClass({
    getInitialState:function(){
        console.log(111);
        return({canchange:false,controlSum:this.props.questionstate.controlsum||this.props.controlSum});
    },
     getName:function(){
          if(this.props.questionstate.type==2){
              return "限制可选数量";
          }else{
              return "限制排序数量";
          }
     },
    componentDidUpdate:function(){
        if(this.refs.max){
            ReactDOM.findDOMNode(this.refs.max).value=this.props.max;
        }
        this.state.controlSum=this.props.questionstate.controlsum;
        if(this.props.questionstate.controlsum==false){
            $(".least-most").hide();
        }
        if (this.props.questionstate.controlsum){
            this.state.canchange=false;
            if (!$(ReactDOM.findDOMNode(this.refs.controlsum)).children(".js-switch")[0].checked) {
                $(ReactDOM.findDOMNode(this.refs.controlsum)).children(".js-switch").click();

            }
            //if(this.refs.max){
            //    $("#least2").val(this.props.questionstate.minsum);
            //    $("#most").val(this.props.questionstate.maxsum);
            //}

        }else {
            if ($(ReactDOM.findDOMNode(this.refs.controlsum)).children(".js-switch")[0].checked) {
                $(ReactDOM.findDOMNode(this.refs.controlsum)).children(".js-switch").click();
            }
        }
        this.state.canchange=true;

    },
    componentDidMount:function(){
        this.state.canchange=true;
        var fa=this;
        var elems = Array.prototype.slice.call(ReactDOM.findDOMNode(this.refs.box).querySelectorAll('.js-switch'));
        if(elems.length > 0){
            elems.forEach(function(html) {
                var switchery = new Switchery(html);
            });
        }
        $(ReactDOM.findDOMNode(this.refs.controlsum)).children(".switchery").on("click",function(){
            if (fa.state.canchange){
                fa.props.setback("controlsum");

            }
            var flag = !fa.state.controlSum
            if(flag){
                $(".least-most").show();
            }
            fa.setState({controlSum:flag})
            if(fa.props.questionstate.maxsum==0){
                var length=$(".o-name-input").length;
                $("#most").val(length);
                fa.props.setback("maxsum",length);
            }
        });
    },
    getmin:function(e){
        var minsum=parseInt(e.currentTarget.value);
        this.props.setback("minsum",minsum);
    },
    getmax:function(e){
        var maxsum=parseInt(e.currentTarget.value);
        this.props.setback("maxsum",maxsum);
    },
    render:function(){
        var fa=this;
        return(
            <div ref="box" className="column">
                <p ref="controlsum" className="clearfix">
                    <span className="op-title l">{fa.getName()}</span>
                    <input type="checkbox" defaultChecked className="js-switch" />
                </p>
                {(function(){
                   if(fa.state.controlSum){
                      return  <p className="least-most mt3 mb2">
                          <label className="mr5" htmlFor="least">最少选择<input onChange={fa.getmin} type="text" name="least" min="1" id="least2" defaultValue="1"/>项</label>
                          <label htmlFor="most">最多选择<input  onChange={fa.getmax} key="most" ref="max" type="text" name="most" id="most" defaultValue={fa.props.questionstate.maxsum}/>项</label>
                      </p>
                   }
                })()}

            </div>
        );
    }
})
 ControlWords = React.createClass({
    getInitialState:function(){
        return({canchange:false});
    },
    getsum:function(e){
        var num = parseInt($(e.currentTarget).val());
        console.log(num);
        this.props.setback("wordsum",num);
    },
    componentDidMount:function(){
        this.state.canchange=true;
        var elems = Array.prototype.slice.call(ReactDOM.findDOMNode(this.refs.box).querySelectorAll('.js-switch'));
        if(elems.length > 0){
            elems.forEach(function(html) {
                var switchery = new Switchery(html);
            });
        }
        var fa=this;
        $(ReactDOM.findDOMNode(this.refs.controlwords)).children(".switchery").on("click",function(e){
            if (fa.state.canchange){
                fa.props.setback("controlwords");
                if (ReactDOM.findDOMNode(fa.refs.control).checked){
                    $(ReactDOM.findDOMNode(fa.refs.opt)).removeClass("dn");
                }else{
                    $(ReactDOM.findDOMNode(fa.refs.opt)).addClass("dn");
                }
            }
        });
    },
    componentDidUpdate:function(){
        $("#least").val(this.props.questionstate.wordsum);
        if (this.props.questionstate.controlwords){
            this.state.canchange=false;
            $(ReactDOM.findDOMNode(this.refs.opt)).removeClass("dn");
            if (!$(ReactDOM.findDOMNode(this.refs.controlwords)).children(".js-switch")[0].checked) {
                $(ReactDOM.findDOMNode(this.refs.controlwords)).children(".js-switch").click();

            }

        }
        this.state.canchange=true;
    },
    render:function(){
        return(
            <div ref="box" className="column">
                <p ref="controlwords" className="clearfix">
                    <span  className="op-title l">字数限制</span>
                    <input ref="control" type="checkbox" className="js-switch" />
                </p>
                <p ref="opt" className="least-most mt3 mb2 dn">
                    <label className="mr5" htmlFor="least">最少输入<input type="text" name="least" min="1" id="least" onChange={this.getsum} defaultValue="1"/>字</label>
                </p>
            </div>
        );
    }
})
 OnlyNum = React.createClass({
    getInitialState:function(){
        return({canchange:false});
    },
    componentDidMount:function(){
        this.state.canchange=true;
        var fa=this;
        var elems = Array.prototype.slice.call(ReactDOM.findDOMNode(this.refs.box).querySelectorAll('.js-switch'));
        if(elems.length > 0){
            elems.forEach(function(html) {
                var switchery = new Switchery(html);
            });
        }
        $(ReactDOM.findDOMNode(this.refs.onlynum)).children(".switchery").on("click",function(){
            if (fa.state.canchange)
                fa.props.setback("onlynum");
        });
    },
    componentDidUpdate:function(){
        console.log(this.props.questionstate);
        if (this.props.questionstate.onlynum){
            this.state.canchange=false;
            if (!$(ReactDOM.findDOMNode(this.refs.onlynum)).children(".js-switch")[0].checked)
            {
                $(ReactDOM.findDOMNode(this.refs.onlynum)).children(".js-switch").click();
            }
        }
        this.state.canchange=true;
    },
    render:function(){
       return(
            <div ref="box" className="column">
                <p ref="onlynum" className="clearfix">
                    <span className="op-title l">仅限输入数值</span>
                    <input type="checkbox" className="js-switch"  />
                </p>
            </div>
        );
    }
});
 DisOrder = React.createClass({
    getInitialState:function(){
        return({canchange:false,switchery:null});
    },
    componentDidMount:function(){
        if (this.props.questionstate.unorder==true){

            $(ReactDOM.findDOMNode(this.refs.disorder)).attr("checked",true);
        }
        this.state.canchange=true;
        var fa=this;
        var elems = Array.prototype.slice.call(ReactDOM.findDOMNode(this.refs.box).querySelectorAll('.js-switch'));
        if(elems.length > 0){
            elems.forEach(function(html) {
                var switchery = new Switchery(html);
                fa.state.switchery=switchery;
             });
        }

        $(ReactDOM.findDOMNode(this.refs.disorder)).children(".switchery").on("click",function(){
            if (fa.state.canchange)
                fa.props.setback("unorder");
        });

    },
    componentDidUpdate:function(){
        console.log(11);
       if (this.props.questionstate.unorder){
            this.state.canchange=false;

            if (!$(ReactDOM.findDOMNode(this.refs.disorder)).children(".js-switch")[0].checked){
                $(ReactDOM.findDOMNode(this.refs.disorder)).children(".js-switch").click();

                //$(this.state.switchery.switcher).trigger('click');
            }
           //$(ReactDOM.findDOMNode(this.refs.disorder)).children(".switchery").click();
        }
        this.state.canchange=true;
    },
    render:function(){
        var fa=this;
        return(
            <div ref="box" className="column last">
                <p ref="disorder" className="clearfix">
                    <span className="op-title l">选项乱序</span>
                    <input type="checkbox" className="js-switch" ref="unorder"/>
                </p>
            </div>
        );
    }
})
 EditChoices = React.createClass({
    getInitialState:function(){
        return{choices:this.props.choices}
    },
    input:function(i,e){
        console.log(111);
        this.state.choices[i]=$(e.currentTarget).text();
        this.props.setback(this.state.choices);
    },
    componentDidUpdate:function(){
        this.state.choices=this.props.choices;
    },
    inputfill:function(e){
        this.props.setbackfill($(e.currentTarget).text());
    },
    deletechoice:function(i,e){
        this.state.choices.splice(i,1);
        this.props.setnow(this.props.sum-1);
        if (this.props.sum-1==0) this.props.setnow(1);
    },
     setFoucus:function(e){
         $(e.currentTarget).next().removeClass("dn")
     },
     setblur:function(e){
         $(e.currentTarget).next().addClass("dn")
     },
    oneChoice:function(i){
        return(
            <div key={i} className="o-name">
                <span className="o-name-input" contentEditable={true}
                      onInput={this.input.bind(this,i)}
                      placeholder="请输入选项名称">{this.props.choices[i]}</span>
                <a href="javascript:void(0);1" onTouchEnd={this.deletechoice.bind(this,i)} className="cancel">
                    <i className="icon icon-times"></i></a>
            </div>
        )
    },
    fillarea:function(placeholder){
        return(
            <div className="o-name">
                <div onInput={this.inputfill} className="op-textarea" contentEditable={true} placeholder="请输入文本提示，没有可以不写">{placeholder}</div>
            </div>
        );
    },
    render:function(){
        var choices=[];
        if (this.props.type == 4){
            if(this.props.number!='address'){
                choices.push(this.fillarea(this.props.placeholder));
            }
        }else{
            this.state.choices.length=this.props.sum;
            for(var i = 0; i<this.props.sum;i++){
                choices.push(this.oneChoice(i));
            }
        }
        return (
            <div>
                {choices}
            </div>
        );
    }
});
