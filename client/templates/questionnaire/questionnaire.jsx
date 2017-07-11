/**
 * Created by oopsdata1 on 16-1-26.
 */
SingleQuestionnaire = React.createClass({
    getInitialState:function(){
        var questions = get_question_list(this.props.questionnaire._id)
        return {
            questions:questions,
            questionaire:this.props.questionaire,
            title:this.props.questionnaire.title,
            num:questions.length,
            questions:questions,
            description:this.props.questionnaire.describe,

        }
    },
    componentDidMount:function(){
        //$(".view-explain").addClass("animated flipInX").removeClass("dn");
        //$(".answer").addClass("animated slideInUp").removeClass("dn");
        $(".view-explain").removeClass("dn");
        $(".answer").removeClass("dn");
    },
    render:function(){
        return(
            <div className="container">
                <SingleHeader  questionnaire={this.props.questionnaire} setnow={this.props.setnow}/>
                <QuestionBody questions={this.state.questions} questionaire={this.props.questionnaire}  setnow={this.props.setnow}/>
            </div>
        );
    }
});


QuestionBody = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        //订阅相关数据
        //var openId=Session.get('openId');
        var openId= getCookie('openId')
        const subHandles = [
            Meteor.subscribe("ViewBody1",this.props.questionaire._id),
            Meteor.subscribe("ViewBody2",this.props.questionaire._id),
            Meteor.subscribe("Answers",openId),
            Meteor.subscribe("getUseranswer",this.props.questionaire._id)
        ];
        const subsReady = _.all(subHandles, function (handle) {
            return handle.ready();
        });
        return {
            subsReady: subsReady,
        };
    },
    getInitialState:function(){
        var openId= getCookie('openId')
        //var openId=Session.get('openId');
        var questions=[];
        var questionId="";
        var answer=null;
        var question={};
        //查询useranswers
        var useranswer= Useranswers.findOne({questionnaire_id:this.props.questionaire._id,openId:getCookie('openId')});
        var answerlist= Answers.find({questionnaire_id:this.props.questionaire._id,openId:getCookie('openId')}).fetch();
        var code= Answers.find({questionnaire_id:this.props.questionaire._id,commonanswer:{$ne:true},openId:getCookie('openId')}).fetch().length;
        //修改成显示一道题
        if(useranswer&&useranswer.complete){
              this.props.setnow(4);
        }else{
            if(answerlist&&answerlist.length>0){
                //根据最后一道题查询出下一道题
                var nextquestion= findnextquestion(answerlist[answerlist.length-1])

                if(nextquestion.next_question_id=="end"){
                    this.props.setnow(4);
                }else{
                   var questionnext = Questions.findOne({_id: nextquestion.next_question_id})
                    question=questionnext;
                }
            }else{
                 //查询是否有排序
                var nextquestion=   findnextquestion(0,this.props.questionaire);
                if(nextquestion.next_question_id=="end"){
                    this.props.setnow(4);
                }else{
                    var questionnext = Questions.findOne({_id: nextquestion.next_question_id})
                    question=questionnext;
                }
            }
            //查询该问题是否是常见问题 如果是常见问题那么就设置默认答案
            if(question.common==true){
                var user = Users.findOne({openId:getCookie('openId')});
                var type=question.commontype;
                if(user.commonanswer&&user.commonanswer[question.commontype]){
                    answer ={
                        commonanswer:true,
                        questionnaire_id:question.questionnaire_id,
                        question_id:question._id,
                        type:question.type,
                        answer:user.commonanswer[question.commontype].answer,
                        openId:getCookie('openId'),
                        complete_time_sort:Date.now(),
                        complete_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                    }
                }
            }

        }
        return {
            address:false,
            addressvalue:"",
            bindquestionId:'',
            question:question,
            code:code,
            answer:answer
        }

    },
    componentDidMount:function (){
        if($(".op-edited:last").length){
            $("html,body").animate({scrollTop:$(".op-edited:last").offset().top},1000)
        }


    },
    componentDidUpdate:function (){
        if($(".op-edited:last").length){
            $("html,body").animate({scrollTop:$(".op-edited:last").offset().top},1000)
        }
    },
    setPreQuestion:function(id){
        var question = Questions.findOne({_id: id})
        var answer=null;
        var find = Answers.findOne({question_id:id,openId:getCookie('openId')})
        if(find){
            answer=find;
        }
        this.setState({question:question,code:this.state.code-1,answer:answer});
    },
    setNextQuestion:function(id){
        var answer=null;
        var find = Answers.findOne({question_id:id,openId:getCookie('openId')})
        var question = Questions.findOne({_id: id})
        if(find){
            answer=find;
        }else{
            //查询该问题是否是常见问题 如果是常见问题那么就设置默认答案
            if(question.common==true){
                var user = Users.findOne({openId:getCookie('openId')});
                var type=question.commontype;
                if(user.commonanswer&&user.commonanswer[question.commontype]){
                      answer ={
                         commonanswer:true,
                         questionnaire_id:question.questionnaire_id,
                         question_id:question._id,
                         type:question.type,
                         answer:user.commonanswer[question.commontype].answer,
                         openId:getCookie('openId'),
                         complete_time_sort:Date.now(),
                         complete_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                     }
                }
            }

        }

        this.setState({question:question,code:this.state.code+1,answer:answer});
    },
    addQuestion:function(id,answer){
        if(id=="end"){
            this.props.setnow(4);
            //Router.go('questionnairered', {_id: this.props.questionaire._id});
        }else{
            var question = Questions.findOne({_id: id})
            var questions=this.state.questions.push(question)
            var answers=this.state.answers.push(answer)
            this.setState({questionId: id,question:question});
        }

    },

    showaddressbyquestionId:function(questionId){
        this.setState({address:true,bindquestionId:questionId})
    },
    selectAddress:function(address){
        this.setState({address:false,addressvalue:address})
    },
    render:function(){
        var fa=this;
        console.log('anwser');
        if(this.state.address==false){
            return(
                <o>
                    <div className="content answer ">
                        {
                            (function(){
                                var list=[];
                                if(fa.state.question){
                                    switch (fa.state.question.type){
                                        case 1:
                                            list.push(<ViewSingle key={fa.state.question._id} number={fa.state.code} code={fa.state.code+1}
                                                                  question={fa.state.question} answer={fa.state.answer}/>);
                                            break;
                                        case 2:
                                            list.push(<ViewMulti key={fa.state.question._id} number={fa.state.code} code={fa.state.code+1}
                                                                 must={true} min={3} question={fa.state.question}  answer={fa.state.answer}/>);
                                            break;
                                        case 3:
                                            list.push(<ViewSort key={fa.state.question._id} number={fa.state.code} code={fa.state.code+1}
                                                                question={fa.state.question} answer={fa.state.answer}/>);
                                            break;
                                        case 4:
                                            list.push(<ViewFill key={fa.state.question._id}  number={fa.state.code} code={fa.state.code+1}
                                                                addressvalue ={fa.state.addressvalue}
                                                                bindquestionId={fa.state.bindquestionId}
                                                                showaddress={fa.showaddressbyquestionId}
                                                                question={fa.state.question} answer={fa.state.answer}/>);
                                            break;
                                        case 5:
                                            list.push(<ViewGrade key={fa.state.question._id} number={fa.state.code} code={fa.state.code+1}
                                                                 question={fa.state.question} answer={fa.state.answer}/>);
                                            break;

                                    }
                                }


                                //for (var i=0;i<fa.state.questions.length;i++){
                                //    var answer=null;
                                //    if(fa.state.answers.length>i){ //说明该题有答案
                                //        answer= fa.state.answers[i]
                                //    }
                                //    if (fa.state.questions[i].type==1)
                                //        list.push(<ViewSingle number={i} code={i+1} question={fa.state.questions[i]} answer={answer}/>);
                                //    if (fa.state.questions[i].type==2)
                                //        list.push(<ViewMulti number={i} code={i+1} must={true} min={3} question={fa.state.questions[i]}  answer={answer}/>);
                                //    if (fa.state.answersquestions[i].type==3)
                                //        list.push(<ViewSort number={i}  code={i+1} question={fa.state.questions[i]}  answer={answer}/>);
                                //    if (fa.state.questions[i].type==4)
                                //        list.push(<ViewFill number={i}  code={i+1} question={fa.state.questions[i]}  answer={answer}/>);
                                //    if (fa.state.questions[i].type==5)
                                //        list.push(<ViewGrade number={i}  code={i+1} question={fa.state.questions[i]}  answer={answer}/>);
                                //}
                                return list;
                            })()
                        }
                    </div>
                    <ViewSubmitBtn question={fa.state.question} setPreQuestion={fa.setPreQuestion}  setNextQuestion={fa.setNextQuestion}  setnow={this.props.setnow}/>
                </o>
            );
        }else {
            return(
                <AreaList bindquestionId={this.state.bindquestionId} selectAddress={this.selectAddress}/>)
        }


    }
});

findnextquestion=function(answer,questionnaire){
    var question;
    var next_question_id=null;
    var error = null;
    var complete=false;
    if(answer==0){
        if(questionnaire.sort_questions&&questionnaire.sort_questions.length>0){
           if(Questions.findOne({_id: questionnaire.sort_questions[0]})){
               next_question_id = questionnaire.sort_questions[0]
           }else{
               next_question_id =  Questions.findOne({questionnaire_id: questionnaire._id})._id
           }


        }else{
            next_question_id =  Questions.findOne({questionnaire_id: questionnaire._id})._id
        }
    }else{
        question= Questions.findOne({_id:answer.question_id});
        var questionnaire=Questionnaires.findOne({_id:question.questionnaire_id});


        //查询排序的sort

        var questionlist=[];
        var questions = Questions.find({questionnaire_id: question.questionnaire_id}).fetch();

        var num=questions.length;
        if(questionnaire.sort_questions){
            for(var i=0;i<questions.length;i++){
                var index=  _.indexOf(questionnaire.sort_questions,questions[i]._id);
                if(index==-1){
                    questions[i].sortnum=num++;
                }else{
                    questions[i].sortnum=index;
                }


            }
            questions=_.sortBy(questions, function(item){return item.sortnum});
        }
        var sort=[];
        for(var i=0;i<questions.length;i++){
            sort.push(questions[i]._id);
        }


        //第一步 查询是否有逻辑控制
        if(answer.type==1){ //单选题才有逻辑控制
            for (var i=0;i<question.options.length;i++){
                if(question.options[i].key=answer.answer.key){
                    if(question.options[i].link=="stop"){
                        next_question_id="end"
                    }else if(question.options[i].link!=null&&question.options[i].link){
                        next_question_id = question.options[i].link

                    }
                }
                //并且逻辑控制的题目必须在顺序的后面
                if(next_question_id!=null){
                    var index1= _.indexOf(sort,question._id);
                    var index2= _.indexOf(sort,next_question_id);
                    if(index1>index2){
                        next_question_id=null;
                    }
                }


            }

        }
        if(next_question_id==null){
            var index= _.indexOf(sort,question._id);
            if(index>-1&&index<sort.length-1){
                next_question_id=sort[index+1]
            }else{
                complete=true
                next_question_id="end";
            }
        }

    }


    var useranswer= Useranswers.findOne({questionnaire_id:questionnaire._id,openId:getCookie('openId')});
    var thisuseranswer={
        type:"normal",
        openId:getCookie('openId'),
        complete:complete,
        questionnaire_id:questionnaire._id,
        question_id:answer.question_id,
        complete_time_sort:Date.now(),
        complete_time:moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    //if(getCookie('openId')){
    //    if(useranswer){
    //        Useranswers.update({_id:useranswer._id},{$set:{thisuseranswer}})
    //    }else{
    //        Useranswers.insert(thisuseranswer)
    //    }
    //}



    if(next_question_id=="end"){
        return {
            next_question_id:next_question_id,
            error:error,
            complete:complete
        }
    }else{
        ////判断下一题是否是常用问题 如果是常用问题 并且一周内回答过 直接跳过 并且插入答案
        //var  next_question = Questions.findOne({_id:next_question_id});
        //console.log(next_question)
        //if(next_question.common&&next_question.common==true){
        //      //常用问题
        //      //查询用户是否存在该常用问题的答案
        //     var user = Users.findOne({openId:getCookie('openId')});
        //     if(user.commonanswer&&user.commonanswer[next_question.commontype]&&user.commonanswer[next_question.commontype].time){
        //
        //         //判断时间
        //         var nowtime = new Date().getTime()
        //         if(nowtime-user.commonanswer[next_question.commontype].time>7*24*3600*1000){
        //             return {
        //                 next_question_id:next_question_id,
        //                 error:error,
        //                 complete:complete
        //             }
        //         }else{
        //             //插入答案并且找下一题
        //             var answer ={
        //                 commonanswer:true,
        //                 questionnaire_id:next_question.questionnaire_id,
        //                 question_id:next_question._id,
        //                 type:next_question.type,
        //                 answer:user.commonanswer[next_question.commontype].answer,
        //                 openId:getCookie('openId'),
        //                 complete_time_sort:Date.now(),
        //                 complete_time:moment().format('YYYY-MM-DD HH:mm:ss'),
        //             }
        //             Answers.insert(answer);
        //
        //             return findnextquestion(answer);
        //         }
        //     }else {
        //         return {
        //             next_question_id:next_question_id,
        //             error:error,
        //             complete:complete
        //         }
        //     }
        //}
        return {
            next_question_id:next_question_id,
            error:error,
            complete:complete
        }
    }




    //
    //if(next_question_id==null){
    //    //第二步 查询是否有排序控制
    //    if(questionnaire.sort_questions){
    //        var index= _.indexOf(questionnaire.sort_questions,question._id);
    //        if(index>-1&&index<questionnaire.sort_questions.length-1){
    //            next_question_id = questionnaire.sort_questions[index+1]
    //        }else{
    //            var questions = Questions.find({questionnaire_id: question.questionnaire_id}).fetch();
    //            if(questionnaire.sort_questions.length==questions.length){
    //                next_question_id = "end"
    //            }
    //        }
    //
    //
    //    }
    //
    //}
    //if(next_question_id==null){
    //    //第三步 没有逻辑控制和排序 按照默认的排序返回答案
    //    var questions = Questions.find({questionnaire_id: question.questionnaire_id}).fetch();
    //    var sort=[];
    //    for(var i=0;i<questions.length;i++){
    //        sort.push(questions[i]._id);
    //    }
    //    var index= _.indexOf(sort,question._id);
    //    if(index>-1&&index<sort.length-1){
    //        next_question_id=sort[index+1]
    //    }else{
    //        complete=true
    //        next_question_id="end";
    //    }
    //}
    //return {
    //    next_question_id:next_question_id,
    //    error:error,
    //    complete:complete
    //}

},



ViewSubmitBtn = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        //订阅相关数据
        var openId= getCookie('openId')
        //var openId=Session.get('openId');
        const subHandles = [
            Meteor.subscribe("ViewBody1",this.props.question.questionnaire_id),
            Meteor.subscribe("ViewBody2",this.props.question.questionnaire_id),
            Meteor.subscribe("Answers",openId)
        ];
        const subsReady = _.all(subHandles, function (handle) {
            return handle.ready();
        });
        return {
            subsReady: subsReady,
        };
    },
    prequestion:function(){
      //查询当前问题是否有答案

        var openId= getCookie('openId')
        var find= Answers.findOne({question_id:this.props.question._id,openId:openId})
        if(find){
            //如果有答案就查询出该答案的上一个答案的question
            var answers= Answers.find({questionnaire_id:this.props.question.questionnaire_id,openId:openId},
                {sort:{createTime_sort: -1}}).fetch()

            var filter =_.filter(answers,function(item){
                return  item.commonanswer!=true;
            })
            var findindex=0;
            for(var i=0;i<filter.length;i++){
                if(filter[i]._id==find._id){
                    findindex=i;
                }
            }
            //var index = _.indexOf(filter,function(item){
            //    return  item._id==find._id;
            //})

            this.props.setPreQuestion(filter[findindex+1].question_id);

        }else{
            //没有答案就是最后一个答案的question
            var answers= Answers.find({questionnaire_id:this.props.question.questionnaire_id,openId:openId},
                {sort:{createTime_sort: -1}}).fetch()

            var filter =_.filter(answers,function(item){
                return  item.commonanswer!=true;
            })
            this.props.setPreQuestion(filter[0].question_id);
            //this.props.setPreQuestion(answers[answers.length-1].question_id);
        }
    },
    submitAnswer:function(){
        var fa= this;
        var openId= getCookie('openId')
       // var openId=Session.get('openId');
        var answerContent={}
        var selectkey;
        switch(this.props.question.type){
            case 1:
                  selectkey=$(".op-edited:last").find("input:checked")
                  if(selectkey.attr("data-key")=="other"){
                      answerContent={
                          other_select:true,
                          other_option:$(".op-edited:last").find(".op-list-input").val().trim()
                      }
                      if($(".op-edited:last").find(".op-list-input").val().trim().length<1){
                          $(".op-edited").addClass("error")
                          $(".error-txt").removeClass("dn")
                          $(".condition").addClass("dn")
                          $(".error-txt").html("(请输入其他填写内容)")
                          return;
                      }

                  }else{
                      answerContent={ key:parseInt(selectkey.attr("data-key"))}
                  }
                 //判斷答案是否錯誤
                  if(selectkey.length<1){
                   $(".op-edited").addClass("error")
                   $(".error-txt").removeClass("dn")
                   $(".condition").addClass("dn")
                   $(".error-txt").html("(此题为必答题)")
                    return;
                  }

             break;
            case 2:
                selectkey=$(".op-edited:last").find("input:checked")
                var selectkeys=[];
                var  other_select =false;
                var  other_option="";
                var no_option=false;
                for(var i=0;i<selectkey.length;i++){
                    if($(selectkey[i]).attr("data-key")=="other"){
                        other_select=true;
                        other_option=$(".op-edited:last").find(".op-list-input").val().trim();
                        if(other_option.length<1){

                            $(".op-edited").addClass("error")
                            $(".error-txt").removeClass("dn")
                            $(".condition").addClass("dn")
                            $(".error-txt").html("(请输入其他填写内容)")
                            return;
                        }
                    }else if($(selectkey[i]).attr("data-key")=="noall"){
                        no_option=true;
                    }
                    else{
                        selectkeys.push(parseInt($(selectkey[i]).attr("data-key")))
                    }
                }
                if(selectkeys.length>0){
                    answerContent.keys=selectkeys;
                }
                answerContent={
                    keys:selectkeys,
                    no_option:no_option,
                    other_option:other_option,
                    other_select:other_select
                }
                //判斷答案是否錯誤
                if(selectkey.length<1){
                    $(".op-edited").addClass("error")
                    $(".error-txt").removeClass("dn")
                    $(".condition").addClass("dn")
                    $(".error-txt").html("(此题为必答题)")
                    return;
                }
                if(this.props.question.issue.choice_limit){
                    if(this.props.question.issue.min_choice>selectkey.length){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(至少选择"+this.props.question.issue.min_choice+"項)")
                        return;
                    }
                    if(this.props.question.issue.max_choice<selectkey.length){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(最多选择"+this.props.question.issue.max_choice+"項)")
                        return;
                    }
                }

                break;
            case 3: //排序题目
                var sorti=$(".op-edited:last").find("i")
                var sortilist=[];
                var selectOrderNum=0;


                for(var i=0;i<sorti.length;i++){
                   var sort=$(sorti[i]).html()
                   var key= $(sorti[i]).attr("data-key");
                    if(sort.length>0){
                        selectOrderNum++;
                        sortilist.push({key:key,sort:parseInt(sort)})
                    }else {
                        //sortilist.push({key:key,sort:sorti.length})
                    }
                }
                if(this.props.question.issue.choice_limit){
                    if(this.props.question.issue.min_choice>selectOrderNum){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(至少排序"+this.props.question.issue.min_choice+"項)")
                        return;
                    }
                    if(this.props.question.issue.max_choice<selectOrderNum){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(最多排序"+this.props.question.issue.max_choice+"項)")
                        return;
                    }
                }

                var sortresult=  _.sortBy(sortilist, function(item){return item.sort});
                var orders=[];
                for(var i=0;i<sortresult.length;i++){
                    orders.push(parseInt(sortresult[i].key))
                }
                answerContent={
                    orders:orders
                }

                break;
            case 4:
                if(this.props.question.commontype=='address'){
                    answerContent={ content:$(".op-edited:last").find(".address_input1").val()}
                    if($(".op-edited:last").find(".address_input1").val().trim().length<1){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(此题为必答题)")
                        return;
                    }
                }else if(this.props.question.common==true&&this.props.question.commontype=='phone'){
                    answerContent={ content:$(".op-edited:last").find(".address_input1").val()}
                    if($(".op-edited:last").find(".address_input1").val().length>11){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(电话号码格式不正确)")
                        return;
                    }
                    if($(".op-edited:last").find(".address_input1").val().trim().length<1){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(此题为必答题)")
                        return;
                    }
                }else{
                    answerContent={ content:$(".op-edited:last").find(".op-textarea").text().trim()}
                    if($(".op-edited:last").find(".op-textarea").text().trim().length<1){
                        $(".op-edited").addClass("error")
                        $(".error-txt").removeClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").html("(此题为必答题)")
                        return;
                    }
                    if(this.props.question.issue.is_limit){
                        if($(".op-edited:last").find(".op-textarea").text().trim().length<this.props.question.issue.min_value){
                            $(".op-edited").addClass("error")
                            $(".error-txt").removeClass("dn")
                            $(".condition").addClass("dn")
                            $(".error-txt").html("(最少輸入"+this.props.question.issue.min_value+"个字)");
                            return;
                        }


                    }
                    if(this.props.question.issue.onlynum){
                        var reg = new RegExp("^[0-9|.]*$");
                        if(!reg.test($(".op-edited:last").find(".op-textarea").text().trim())){
                            $(".op-edited").addClass("error")
                            $(".error-txt").removeClass("dn")
                            $(".condition").addClass("dn")
                            $(".error-txt").html("(必须输入数字)");
                            return;
                        }

                    }
                }

                break;
            case 5:
                var scores=$(".op-edited:last").find(".score")
                var score={};
                for(var i=0;i<scores.length;i++){
                    var key= $(scores[i]).attr("data-key");
                    var value=parseInt($(scores[i]).find("b").html())
                    if(value==0){
                        $(".op-edited").addClass("error")
                        $(".condition").addClass("dn")
                        $(".condition").addClass("dn")
                        $(".error-txt").removeClass("dn")
                        $(".error-txt").html("(此题为必答题)");
                        return;
                    }

                    score[key]=value
                }
                 answerContent={
                    score:score
                }

                break;
        }

        var answer={
           questionnaire_id: this.props.question.questionnaire_id,
           question_id:this.props.question._id,
           type:this.props.question.type,
           answer:answerContent,
           openId:openId,
           createTime_sort:Date.now(),
           createTime:moment().format('YYYY-MM-DD HH:mm:ss')
       };
       console.log(answer);
        //查询用户是否回答过该题目

        var find= Answers.findOne({question_id:answer.question_id,openId:openId})
        if(find){
           //var  error = "您已回答过该题目了"
           //this.props.setnow(4)
           //如果回答过该题目 说明已经回到了上一题 那么删除该题目后面的答案
           // var answers= Answers.find({questionnaire_id:this.props.question.questionnaire_id,openId:openId
           // ,createTime_sort: { $gte: find.createTime_sort }}
           //).fetch()
           //
           // for(var i=0;i<answers.length;i++){
           //     Answers.remove({_id:answers[i]._id})
           // }

            var position=false;
            var question_list = get_question_list(this.props.question.questionnaire_id);
            for(var i=0;i<question_list.length;i++){
                if(question_list[i]._id==answer.question_id){
                    position=true;
                }
                if(position){
                    var delanswer=Answers.findOne({openId:openId,question_id:question_list[i]._id})
                    if(delanswer){
                        Answers.remove({_id:delanswer._id})
                    }

                }
            }

        }
        Answers.insert(answer);
        //判断是否是常用问题 如果是常用问题那么需要更新相关信息
        if(this.props.question.common&&this.props.question.common==true){

            //判断用户是否存在commonanswer
            var user = Users.findOne({openId:openId});
            var commonanswer = user.commonanswer;
            if(commonanswer){
                commonanswer[this.props.question.commontype]={
                    answer:answerContent,
                    time:new Date().getTime()
                }
            }else{
                commonanswer={}
                commonanswer[this.props.question.commontype]={
                    answer:answerContent,
                    time:new Date().getTime()
                }
            }
            Meteor.call("userupdate",openId,commonanswer)
        }

        //同时useranswer表
        var nextquestion=  findnextquestion(answer);
        var useranswer= Useranswers.findOne({questionnaire_id:this.props.question.questionnaire_id,openId:openId});
        var thisuseranswer={
            type:"normal",
            openId:openId,
            complete:nextquestion.complete,
            questionnaire_id:this.props.question.questionnaire_id,
            question_id:answer.question_id,
            complete_time_sort:Date.now(),
            complete_time:moment().format('YYYY-MM-DD HH:mm:ss'),
        }

        if(nextquestion.next_question_id&&nextquestion.next_question_id!='end'){
            if(useranswer){
                Useranswers.update({_id:useranswer._id},{$set:thisuseranswer})

            }else{
                Useranswers.insert(thisuseranswer)
            }
            this.props.setNextQuestion(nextquestion.next_question_id)
        }else{
            thisuseranswer.complete=true;
            if(useranswer){
                Useranswers.update({_id:useranswer._id},{$set:thisuseranswer})

            }else{
                Useranswers.insert(thisuseranswer)
            }
        }
       if(thisuseranswer.complete==true){

           //查询是否是红包问卷 如果是就发红红包
           HTTP.call("get","/api/pay/red?openId="+getCookie('openId')+"&questionnaireid="+this.props.question.questionnaire_id,null,function(err,result){
               var json =JSON.parse(result.content)
               //
               ////判断回收份数是否达到要求如果达到 那么就关闭问卷
               //Meteor.call("checkComplete_questionnaire",fa.props.question.questionnaire_id);
               //var  sharecomplete={
               //    completeopenId:getCookie('openId'),
               //    questionnaire_id:fa.props.question.questionnaire_id,//问卷
               //}
               //Meteor.call("create_sharecompletes",sharecomplete);

               if(json.money){
                   fa.props.setnow(4,json.money)
               }else{
                   fa.props.setnow(4)
               }

           })




        }
    //
    },
    render:function(){

        //如果没有答案 或者该题前面的答案都是 common==ture 那么这题就是第一题
        var flag= true;
        if(this.props.question.questionnaire_id){
            var questionlist = get_question_list(this.props.question.questionnaire_id)
            if(this.props.question._id==questionlist[0]._id){
                flag=false;
            }
        }



        //var answerslist =Answers.find({questionnaire_id:this.props.question.questionnaire_id}
        //,{sort:{createTime_sort: 1}}).fetch();
        //if(answerslist.length==0){
        //    flag= false;
        //}else{
        //   var filter =_.filter(answerslist,function(item){
        //     return  item.commonanswer!=true;
        //   })
        //    if(filter[0].question_id==this.props.question._id){
        //        flag= false;
        //    }
        //}
       if(flag){
            return(
                <div className="divpadding" >
                    <a href="javascript:void(0);"  onTouchEnd={this.prequestion} className="btn l">上一题</a >
                    <a href="javascript:void(0);" onTouchEnd={this.submitAnswer} className="btn blue r">提交</a >
                </div>
            );
        }else{
            return(
                <div  className="divpadding">
                <a href="javascript:void(0);" onTouchEnd={this.submitAnswer} className="btn submit-survey">提交</a>
                </div>
            )
        }

    }
});