/**
 * Created by oopsdata1 on 16-1-19.
 */

AreaList=React.createClass({
    getInitialState:function(){
      return {
            bindquestionId:this.props.questionId,
            level:0,
            province:0,
            city:0,
        }
    },
    showaddressbyquestionId:function(questionId){
        this.setState({address:true,level:0,bindquestionId:questionId})
    },
    showaddress:function(){
        this.setState({address:true,level:0})
    },
    setCity:function(province,event){
        this.setState({address:true,level:1,province:province})
    },
    setAddress:function(city,event){
        this.setState({address:true,level:2,city:city})
    },
    selectAddress:function(area,event){
        var province=eval(proStr);
        var city=eval(province[this.state.province].ITEMS);
        var areas=eval(city[this.state.city].ITEMS)
        this.props.selectAddress(province[this.state.province].NAME+city[this.state.city].NAME+areas[area].NAME)
        // this.setState({address:false,addressvalue:province[this.state.province].NAME+city[this.state.city].NAME+areas[area].NAME})
        //console.log(province[this.state.province].NAME+city[this.state.city].NAME+areas[area].NAME)
    },
    render:function(){
        var fa = this;
        switch(this.state.level){
            case 0:
                return(
                    <div className="container">
                        <div  className="dqld_div" >
                            <ul>
                                {
                                    (function(){
                                        var province=eval(proStr);
                                        var newStr=new Array();
                                        for(var i=0,psize=province.length;i<psize;i++){
                                            newStr.push(<li onClick={fa.setCity.bind(this,i)}>{province[i].NAME}</li>);
                                        }
                                        return newStr;
                                    })()
                                }
                            </ul>
                        </div>
                    </div>
                );
                break;
            case 1:
                var listyle1={backgroundColor:"#808080"};
                var listyle2={paddingLeft:"20px"};
                var province=eval(proStr);
                return(
                    <div className="container">
                        <div  className="dqld_div" >
                            <ul>
                                <li onClick={fa.showaddress} style={listyle1}>{province[fa.state.province].NAME}</li>
                                {
                                    (function(){
                                        var city=eval(province[fa.state.province].ITEMS);
                                        var newStr=new Array();
                                        for(var j=0,csize=city.length;j<csize;j++){
                                            newStr.push(<li onClick={fa.setAddress.bind(this,j)} style={listyle2}>{city[j].NAME}</li>);
                                        }
                                        return newStr;
                                    })()
                                }
                            </ul>
                        </div>
                    </div>
                );
                break;
            case 2:
                var listyle1={backgroundColor:"#999999"};
                var listyle2={backgroundColor:"#ccc",paddingLeft:"10px"};
                var listyle3={paddingLeft:"25px"};
                var province=eval(proStr);
                var city=eval(province[fa.state.province].ITEMS);
                var area=eval(city[fa.state.city].ITEMS)
                return(
                    <div className="container">
                        <div  className="dqld_div" >
                            <ul>
                                <li onClick={fa.showaddress} style={listyle1}>{province[fa.state.province].NAME}</li>
                                <li onClick={fa.showaddress} style={listyle2}>{city[fa.state.city].NAME}</li>
                                {
                                    (function(){

                                        var city=eval(province[fa.state.province].ITEMS);
                                        var newStr=new Array();
                                        for(var j=0,asize=area.length;j<asize;j++){
                                            newStr.push(<li onClick={fa.selectAddress.bind(this,j)} style={listyle3}>{area[j].NAME}</li>);
                                        }
                                        return newStr;
                                    })()
                                }
                            </ul>
                        </div>
                    </div>
                );
                break;
        }
    }


})

 Preview = React.createClass({
     getInitialState:function(){
         var questions = get_question_list(this.props.questionaire._id)
         return {
                 address:false,
                 addressvalue:"",
                 bindquestionId:'',
                 questions:questions,
                 questionaire:this.props.questionaire,
                 title:this.props.questionaire.title,
                 num:questions.length,
                 questions:questions,
                 description:this.props.questionaire.describe
                }
     },
    componentDidMount:function(){
        $(".view-explain").addClass("animated flipInX").removeClass("dn");
        $(".answer").addClass("animated slideInUp").removeClass("dn");
    },
    showaddressbyquestionId:function(questionId){
       this.setState({address:true,bindquestionId:questionId})
     },
     selectAddress:function(address){
         this.setState({address:false,addressvalue:address})
     },

    render:function(){
        var noshow=true;
        var fa = this;
        if(this.state.address==false){
            return(
                <div className="container">
                    {
                        (function(){
                            if(fa.state.description.trim().length>0){
                                return   <ViewExplain icon={false} word={fa.state.description}/>
                            }
                        })()
                    }
                    <ViewBody  bindquestionId ={this.state.bindquestionId}
                               addressvalue ={this.state.addressvalue}
                               showaddress={this.showaddressbyquestionId}
                               questions={this.state.questions}
                               questionaire={this.state.questionaire}
                               noshow={noshow}/>
                </div>
            );
        }else{
            return(
          <AreaList bindquestionId={this.state.bindquestionId} selectAddress={this.selectAddress}/>)
       }

    }
});

 ViewBody = React.createClass({
     mixins: [ReactMeteorData],
     getMeteorData() {
         //订阅相关数据
         const subHandles = [
             Meteor.subscribe("ViewBody1",this.props.questionaire._id),
             Meteor.subscribe("ViewBody2",this.props.questionaire._id)
         ];
         const subsReady = _.all(subHandles, function (handle) {
             return handle.ready();
         });
         return {
             subsReady: subsReady,
         };
     },
     getInitialState:function(){
         var questions = get_question_list(this.props.questionaire._id)
         return {title:this.props.questionaire.title,num:questions.length,questions:questions,description:this.props.questionaire.describe}
     },
    render:function(){
        var fa=this;
        return(
            <div className="content answer ">
            {
            (function(){
                var list=[];
                for (var i=0;i<fa.state.num;i++){
                    if (fa.state.questions[i].type==1)
                        list.push(<ViewSinglePrev number={i} question={fa.state.questions[i]} code={i+1} noshow={fa.props.noshow}/>);
                    if (fa.state.questions[i].type==2)
                        list.push(<ViewMulti number={i} code={i+1}  question={fa.state.questions[i]} noshow={fa.props.noshow}/>);
                    if (fa.state.questions[i].type==3)
                        list.push(<ViewSort number={i}  code={i+1} question={fa.state.questions[i]} noshow={fa.props.noshow}/>);
                    if (fa.state.questions[i].type==4)
                        list.push(<ViewFill number={i}  code={i+1} question={fa.state.questions[i]} noshow={fa.props.noshow}
                                    addressvalue ={fa.props.addressvalue}
                                            bindquestionId={fa.props.bindquestionId}
                                            showaddress={fa.props.showaddress}/>);
                    if (fa.state.questions[i].type==5)
                        list.push(<ViewGrade number={i}  code={i+1} question={fa.state.questions[i]} noshow={fa.props.noshow}/>);

                }
                return list;
            })()
    }
        </div>
        );
    }
});

ViewSinglePrev = React.createClass({
    componentDidMount:function(){
        //如果存在答案那么就绑定答案
        if(this.props.answer){

            if(this.props.answer.answer.key){
                $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.key+"]").attr("checked","checked")
            }
            //$("input[name="+this.props.question._id+"]").attr("disabled","disabled");
        }

    },
    selectButton:function(e){
        ($(e.currentTarget).find("input").click())
    },
    componentDidUpdate:function(){
        if(this.props.answer){

            if(this.props.answer.answer.key){
                $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.key+"]").attr("checked","checked")
            }
            //$("input[name="+this.props.question._id+"]").attr("disabled","disabled");
        }
    },
    render:function(){
        var fa=this;
        var code;
        if(this.props.code<10){
            code="0"+(this.props.code);
        }
        return(
            <div className="op-edited show">
                <div className="q-name-content">
                    <div className="q-name">
                        <b>{code}</b>
                        <span className="title">{this.props.question.title} <span className="error-txt dn ">此题为必答题</span></span>
                    </div>
                </div>
                <div className="op-edited-bottom">
                    <div className="op-list-content">
                        <ul>
                            {
                                (function(){
                                    var choices=[];
                                    var options=fa.props.question.options;
                                    if(fa.props.question.issue.is_rand){
                                        options=_.shuffle(options)
                                    }

                                    for (var i=0;i<options.length;i++){
                                        if (options[i].link&&options[i].link!=null){
                                            if(fa.props.question.options[i].link=="stop"){
                                                var class_name1="logic-stop";
                                                var class_name2="icon-arrow-right";
                                                var jumpnum ="";
                                            }else{
                                                var num =findChoiceById(fa.props.question._id,options[i].link,fa.props.question.questionnaire_id)
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


                    //                    choices.push(
                    //                        <li>
                    //<span className="input" onClick={fa.selectButton}>
                    //    <input type="radio" name={fa.props.question._id} data-key={options[i].key} />
                    //    <label htmlFor={options[i].key}>{options[i].content}</label>
                    //     <span className="logic-jump"><i className="icon-arrow-right"></i><b>11</b></span>
                    //</span>
                    //                        </li>
                    //                    );
                                    }
                                    if ( fa.props.question.issue.other_option){
                                        var otherids="id"+fa.props.number;
                                        choices.push(
                                            <OtherChoice number={fa.props.question._id} question={fa.props.question} answer={fa.props.answer}/>
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


 ViewSingle = React.createClass({
    componentDidMount:function(){
        //如果存在答案那么就绑定答案
       if(this.props.answer){

            if(this.props.answer.answer.key){
                $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.key+"]").attr("checked","checked")
            }
            //$("input[name="+this.props.question._id+"]").attr("disabled","disabled");
        }
    },
     selectButton:function(e){
         ($(e.currentTarget).find("input").click())
     },
     componentDidUpdate:function(){
         if(this.props.answer){

             if(this.props.answer.answer.key){
                 $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.key+"]").attr("checked","checked")
             }
             //$("input[name="+this.props.question._id+"]").attr("disabled","disabled");
         }
     },
    render:function(){
        var fa=this;
        var code;
        if(this.props.code<10){
            code="0"+(this.props.code);
        }
        return(
            <div className="op-edited show">
            <div className="q-name-content">
            <div className="q-name">
            <b>{code}</b>
        <span className="title">{this.props.question.title}

         <span className="error-txt dn ">此题为必答题</span></span>
        </div>
        </div>
        <div className="op-edited-bottom">
            <div className="op-list-content">
            <ul>
            {
            (function(){
                var choices=[];
                var options=fa.props.question.options;
                if(fa.props.question.issue.is_rand){
                    options=_.shuffle(options)
                }

                for (var i=0;i<options.length;i++){

                    choices.push(
                    <li>
                    <span className="input" onClick={fa.selectButton}>
                        <input type="radio" name={fa.props.question._id} data-key={options[i].key} />
                        <label htmlFor={options[i].key}>{options[i].content}</label>
                   </span>
                    </li>
                );
                }
                if ( fa.props.question.issue.other_option){
                    var otherids="id"+fa.props.number;
                    choices.push(
                        <OtherChoice number={fa.props.question._id} question={fa.props.question} answer={fa.props.answer}/>
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
 ViewMulti = React.createClass({
     componentDidMount:function(){
         //如果存在答案那么就绑定答案
         if(this.props.answer){
           if(this.props.answer.answer.keys){
                 for(var i=0;i<this.props.answer.answer.keys.length;i++){
                     $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.keys[i]+"]").attr("checked","checked")
                 }
             }
            // $("input[name="+this.props.question._id+"]").attr("disabled","disabled");
         }
     },

     componentDidUpdate:function(){
          if(this.props.answer){
             if(this.props.answer.answer.keys){
                 for(var i=0;i<this.props.answer.answer.keys.length;i++){
                     $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.keys[i]+"]").attr("checked","checked")
                 }
             }
             //$("input[name="+this.props.question._id+"]").attr("disabled","disabled");
         }
     },
    mustdo:function(){

        if (this.props.noshow!=true&&this.props.question.must)
            return(
                <h1 className="error-must">此题为必答题</h1>
        );
    },
    limit:function(){
        if (this.props.noshow!=true&&this.props.question.issue){
            return(<span className="error-txt">（至少选择2项）</span>);
        }
    },
     handlecheckcommon:function(e){
         if (e.currentTarget.checked){

             var name =$(e.currentTarget).attr("name");
             $("input[name='"+name+"'][data-key=noall]").removeAttr("checked");
         }
     },
    //selectButton:function(e){
    //     console.log(1111);
    //     ($(e.currentTarget).parent().find("input").click())
    // },
    render:function(){
        var fa=this;
        var code;
        if(this.props.code<10){
            code="0"+(this.props.code);
        }
        return(
            <div className="op-edited show ">
            <div className="q-name-content">
            <div className="q-name">
            <b>{code}</b>
        <span className="title">{this.props.question.title}
            <ShowCondition question={this.props.question}/>
            <span className="error-txt dn ">此题为必答题</span>
           </span>
        </div>
        </div>
        <div className="op-edited-bottom">
            <div className="op-list-content">
            <ul>
            {
            (function(){
                var choices=[];
                var options=fa.props.question.options;
                if(fa.props.question.issue.is_rand){
                    options=_.shuffle(options)
                }
                for (var i=0;i<options.length;i++){
                    var ii = i+1;
                    var ids="id"+fa.props.number+"id"+ii;
                    choices.push(
                    <li>
                    <span className="input" >
                        <input type="checkbox" name={fa.props.question._id} id={ids}  data-key={options[i].key} onClick={fa.handlecheckcommon}/>
                        <label htmlFor={ids} >{options[i].content}</label>
                    </span>
                    </li>
                );
                }
                if ( fa.props.question.issue.other_option){
                    var otherids="id"+fa.props.number;
                    choices.push(
                        <OtherChoice number={fa.props.question._id} question={fa.props.question} answer={fa.props.answer}/>
                    );
                }
                if ( fa.props.question.issue.no_option){
                    var otherids="id"+fa.props.number;
                    choices.push(
                        <NoChoice key={otherids} number={fa.props.question._id} question={fa.props.question} answer={fa.props.answer}/>
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
 ViewGrade = React.createClass({
    componentDidMount:function() {
        //如果存在答案那么就绑定答案
         if (this.props.answer) {
            if (this.props.answer.answer.score) {

                for (var item in this.props.answer.answer.score) {
                    $(ReactDOM.findDOMNode(this.refs[item])).find("b").html(this.props.answer.answer.score[item])
                    var num= this.props.answer.answer.score[item]
                    var count = 0;this.props.answer.answer.score[item]
                    $(ReactDOM.findDOMNode(this.refs[item])).parent().children("a").each(function(){
                        count++;
                        if (count > num)
                            $(this).removeClass("active");
                        else $(this).addClass("active");
                    });
                }
            }
        }

    },
     componentDidUpdate:function(){
         if (this.props.answer) {
             if (this.props.answer.answer.score) {

                 for (var item in this.props.answer.answer.score) {
                     $(ReactDOM.findDOMNode(this.refs[item])).find("b").html(this.props.answer.answer.score[item])
                     var num= this.props.answer.answer.score[item]
                     var count = 0;this.props.answer.answer.score[item]
                     $(ReactDOM.findDOMNode(this.refs[item])).parent().children("a").each(function(){
                         count++;
                         if (count > num)
                             $(this).removeClass("active");
                         else $(this).addClass("active");
                     });
                 }
             }
         }
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
        var choices=[];
        var fa=this;
        var options=fa.props.question.options;
        if(fa.props.question.issue.is_rand){
            options=_.shuffle(options)
        }
        for (var i=0; i<options.length;i++){
            choices.push(
            <dt>{options[i].content}</dt>
        );
            choices.push(
            <dd>
            <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,1)} className="icon icon-star "></a>
                <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,2)} className="icon icon-star "></a>
                <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,3)} className="icon icon-star "></a>
                <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,4)} className="icon icon-star"></a>
                <a href="javascript:void(0);" onTouchEnd={this.handleStar.bind(this,5)}className="icon icon-star"></a>
                <span className="score" ref={this.props.question.options[i].key} data-key={this.props.question.options[i].key}><b>0</b>分</span>
             </dd>
        );
        }
        return choices;
    },
    render:function(){
        var code;
        if(this.props.code<10){
            code="0"+(this.props.code);
        }
        return(
            <div className="op-edited show">
            <div className="q-name-content">
            <div className="q-name">
            <b>{code}</b>
           <span className="title">{this.props.question.title} <span className="error-txt dn ">此题为必答题</span></span>
        </div>
        </div>
        <div className="op-edited-bottom">
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
 ViewSort = React.createClass({
     componentDidMount:function(){
         //如果存在答案那么就绑定答案
         if(this.props.answer){
             if(this.props.answer.answer.keys){
                 for(var i=0;i<this.props.answer.answer.keys.length;i++){
                     $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.keys[i]+"]").attr("checked","checked")
                 }
             }
         }
     },
     componentDidUpdate:function(){
         //如果存在答案那么就绑定答案
        if(this.props.answer){
             if(this.props.answer.answer.keys){
                 for(var i=0;i<this.props.answer.answer.keys.length;i++){
                     $("input[name="+this.props.question._id+"][data-key="+this.props.answer.answer.keys[i]+"]").attr("checked","checked")
                 }
             }
         }
     },
    getInitialState:function(){
        var count=0;
        if(this.props.answer){

           var  orders= this.props.answer.answer.orders;
            var counts=[];
            for(var item in orders){
                counts.push(orders[item]);
            }
            count=_.max(counts);
        }
        return  {num:this.props.question.options.length,count: count}
    },
    SortChoices:function(){
        var choices=[];
        var fa =this;
        var options=fa.props.question.options;
        console.log(fa.props.question.issue.is_rand)
        if(fa.props.question.issue.is_rand){
            options=_.shuffle(options)
        }
        for (var i = 0; i < options.length; i++)
        {
            if(this.props.answer){
                var order=this.props.answer.answer.orders;
                var thiskey=options[i].key;
                var indexnum= _.indexOf(order,thiskey);
                if(indexnum==-1){
                    choices.push(
                        <li onTouchEnd={this.handleSort}>
                            <i className="num"  data-key={options[i].key} name={this.props.question._id}></i>
                            <span className="op-name">{options[i].content}</span>
                        </li>
                    )
                }else {
                    var classname="num";
                    var num=indexnum+1;
                    switch (indexnum){
                        case 0:
                            classname="num one";
                            break;
                        case 1:
                            classname="num two";
                            break;
                        case 2:
                            classname="num three";
                            break;
                    }
                    choices.push(
                        <li onTouchEnd={this.handleSort}>
                            <i className={classname} data-key={options[i].key} name={this.props.question._id}>{num}</i>
                            <span className="op-name">{options[i].content}</span>
                        </li>
                    )
                }

            }else{
                choices.push(
                    <li onTouchEnd={this.handleSort}>
                        <i className="num" data-key={options[i].key} name={this.props.question._id}></i>
                        <span className="op-name">{options[i].content}</span>
                    </li>
                )
            }


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
        if(this.props.code<10){
            code="0"+(this.props.code);
        }
        return(
            <div className="op-edited show">
            <div className="q-name-content">
            <div className="q-name">
            <b>{code}</b>
             <span className="title">{this.props.question.title}
                 <ShowCondition question={this.props.question}/>
                 <span className="error-txt dn ">此题为必答题</span></span>
        </div>
        </div>
        <div className="op-edited-bottom">
            <div className="op-list-content">
            {this.SortChoices()}
        </div>
        </div>
        </div>
        );
    }
});
 ViewFill = React.createClass({
     componentDidMount:function(){
        if(this.props.answer){

             if(this.props.answer.answer.content){
                 $(ReactDOM.findDOMNode(this.refs.content)).html(this.props.answer.answer.content)
             }
             if(this.props.answer.answer.content){
                 $(ReactDOM.findDOMNode(this.refs.address)).val(this.props.answer.answer.content)
             }
             //$(ReactDOM.findDOMNode(this.refs.content)).attr("disabled","disabled");
         }

     },
     componentDidUpdate:function(){
         //如果存在答案那么就绑定答案
         if(this.props.answer){
             if(this.props.answer.answer.content){
                 $(ReactDOM.findDOMNode(this.refs.content)).html(this.props.answer.answer.content)
             }
             if(this.props.answer.answer.content){
                 $(ReactDOM.findDOMNode(this.refs.address)).val(this.props.answer.answer.content)
             }
             //$(ReactDOM.findDOMNode(this.refs.content)).attr("disabled","disabled");
         }else{
             $(ReactDOM.findDOMNode(this.refs.content)).html("");
         }
     },
     showaddressbyquestionId:function(){
         this.props.showaddress(this.props.question._id)
     },

     render:function(){
        var code;
        if(this.props.code<10){
            code="0"+(this.props.code);
        }
        if(this.props.question.commontype=='address'){
            var addressvalue='';
            if(this.props.question._id==this.props.bindquestionId){
                addressvalue=this.props.addressvalue
            }
            return(
                <div className="op-edited show">
                    <div className="q-name-content">
                        <div className="q-name">
                            <b>{code}</b>

                            <span className="title">{this.props.question.title}
                                <ShowCondition question={this.props.question}/>
                                <span className="error-txt dn ">此题为必答题</span></span>
                        </div>
                    </div>
                    <div className="op-edited-bottom">
                        <div className="address_input">
                            <input className="address_input1"  ref="address" value={addressvalue} type="text" placeholder="省市区" id="shengshi" onClick={this.showaddressbyquestionId} readOnly="readonly"/>
                        </div>
                    </div>
                </div>
            );
        }else if(this.props.question.common==true&&this.props.question.commontype=='phone'){
            return(
                <div className="op-edited show">
                    <div className="q-name-content">
                        <div className="q-name">
                            <b>{code}</b>
                            <span className="title">{this.props.question.title} <span className="error-txt dn ">此题为必答题</span></span>
                        </div>
                    </div>
                    <div className="op-edited-bottom">
                        <div className="address_input">
                            <input className="address_input1"  ref="phone"   type="tel" id="phone" />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="op-edited show">
                    <div className="q-name-content">
                        <div className="q-name">
                            <b>{code}</b>
                            <span className="title">{this.props.question.title} <span className="error-txt dn ">此题为必答题</span></span>
                        </div>
                    </div>
                    <div className="op-edited-bottom">
                        <div className="op-list-content">
                            <div className="op-textarea" ref="content" contentEditable={true} placeholder={this.props.question.issue.placeholder}></div>
                        </div>
                    </div>
                </div>
            );
        }

    }
});

ShowCondition=React.createClass({
    render:function(){
       var condition="";
       switch (this.props.question.type){
           case 2:
               if(this.props.question.issue&&this.props.question.issue.choice_limit){
                   condition ="  (最少选择("+ this.props.question.issue.min_choice+")项;最多选择("+
                       this.props.question.issue.max_choice+")项)  "
               }
               break;
           case 3:
               if(this.props.question.issue&&this.props.question.issue.choice_limit){
                   condition ="  (最少排序("+ this.props.question.issue.min_choice+")项;最多排序("+
                       this.props.question.issue.max_choice+")项)  "
               }
               break;
           case 4:
               var list=[];
               if(this.props.question.issue.onlynum){
                   list.push('只能输入数字');
               }
               if(this.props.question.issue.is_limit){
                   list.push('至少输入('+this.props.question.issue.min_value+")个字");
               }
               condition ="   ("+list.join(";")+")"
               break;
       }
       return(
           <span className="condition">{condition}</span>
        );
    }
})


 ViewExplain = React.createClass({
    getInitialState:function(){
        return(
        {
            iconup:false,
            icondown:true,
            minheight:10,
        }
        );
    },
     componentDidMount:function(){
         var titleheight=$(".survey-name").height()
         var minheight = titleheight*3;
         var height=$(ReactDOM.findDOMNode(this.refs.explain)).height()
         if(height>minheight){
             $(ReactDOM.findDOMNode(this.refs.content)).css("height","15rem");
             $(ReactDOM.findDOMNode(this.refs.content)).css("overflow","hidden");
             $(ReactDOM.findDOMNode(this.refs.content)).css("display","block");
             this.setState({iconup:false,icondown:true,minheight:minheight+"px",maxheight:height+"px"})
         }
         if(height<=minheight){
             this.setState({iconup:false,icondown:false})
             $(ReactDOM.findDOMNode(this.refs.explain)).removeClass("answer")
         }
         // var height=$(ReactDOM.findDOMNode(this.refs.explain)).height()
         // if(height>300){
         //     this.setState({iconup:false,icondown:true})
         // }
         //$(ReactDOM.findDOMNode(this.refs.explain)).css("height","300px")

     },
     addheight:function(){
         $(ReactDOM.findDOMNode(this.refs.content)).animate({height:this.state.maxheight},1000);
         this.setState({iconup:true,icondown:false})
     },
     subheight:function(){
         $(ReactDOM.findDOMNode(this.refs.content)).animate({height:this.state.minheight},1000);
         this.setState({iconup:false,icondown:true})
     },
    render:function(){
        var fa=this;
        return(
            <div className="view-explain answer" ref="explain">
                <span ref="content">{this.props.word}</span>
                {
                    (function(){
                        if (fa.state.iconup){
                            return(<span className="pulldown" onTouchEnd={fa.subheight}><i className="icon-caret-up"></i></span>);
                        }
                        if (fa.state.icondown){
                            return(<span className="pulldown" onTouchEnd={fa.addheight}><i className="icon-caret-down"></i></span>);
                        }
                    })()
                }
        </div>
        );
    }
});

