questionResultJson=new Array();
QuestionnaireResult = React.createClass({
    getInitialState:function(){
        return({num:5})
    },
    componentDidMount:function(){
        $('.chart').each(function(idx,ele){
            var color = $(this).data('color');
            $(ele).easyPieChart({
                barColor: color,
                trackColor: '#f8f8f8',
                trackWidth: 4,
                size:55,
                scaleColor:false,
            });
        });
    },
    optionResult:function(option){
        var width =option.sort+"%";
        var style={
            width:width
        }
       return(
          <li>
              <span className="op-name">{option.content}</span>
              <span className="num">{option.sort}%</span>
						<span className="progress-bar">
							<span className="progress" style={style}></span>
						</span>
          </li>)
    } ,
    showTitle:function(num){
         var stylename="";
         switch (num){
             case 0:
                 stylename="one";
                 break;
             case 1:
                 stylename="two";
                 break;
             case 2:
                 stylename="three";
                 break;
         }
         return(
             <h3>第<b className={stylename}>{num+1}</b>名</h3>
         )
     },
    sortUl:function(sorts){
         var fa=this;
         return(<ul>
                 {
                     (function(){

                         var results=[];
                         for (var i = 0; i<sorts.length; i++){

                             results.push(fa.sortLi(sorts[i]));
                         }
                         return results;
                     })()
                 }
             </ul>
         )
     },
    sortLi:function(sort){
         var width =sort.sort+"%";
         var style={
             width:width
         }
         return(
             <li>
                 <span className="op-name">{sort.content}</span>
                 <span className="num">{sort.sort}%</span>
						<span className="progress-bar">
							<span className="progress" style={style}></span>
						</span>
             </li>)
     },
    bankAnswer:function(answer){
         var user= Users.findOne({openId:answer.openId})
        if(user){
            return(
                <li>
                    <span className="head"><img src={user.headimgurl}/></span>
                    <span className="name">{user.name}</span>
                    <span className="txt">{answer.answer.content}！</span>
                </li>
            )
        }else {
            return(
                <li></li>
            )
        }


     } ,
    singleResult:function(question,num){
        //计算百分比
      var fa= this;
      var answers = Answers.find({question_id:question._id}).fetch();
      var result=_.countBy(answers,function(item){
          for(var i=0;i<question.options.length;i++){
              if(item.answer.key==question.options[i].key){
                  return "key"+item.answer.key
              }
              if(item.answer.other_select==true){
                  return "other"
              }
          }
      })

       var options=[];
        for(var i=0;i<question.options.length;i++){
            var sort=0
             if(answers.length>0){
                 if(result["key"+question.options[i].key]){
                     sort=result["key"+question.options[i].key]/answers.length*100
                 }

             }
            options.push({
                sort:sort,
                content:question.options[i].content,
            })
        }
        if(result["other"]>0){
            var sort=result["other"]/answers.length*100
            options.push({
                sort:sort,
                content:"其他",
            })
        }
      var shownum=num>8?num+1:"0"+(num+1);
        questionResultJson.push({
            no:shownum,
            type:"单选题",
            title:question.title,
            options:options
        })
      return(
            <div className="result-list-content">
                <div className="title">
                    <b>{shownum}</b>
                    <h2>{question.title}</h2>
                    <span>单选题</span>
                </div>
                <ul>
                    {
                        (function(){

                            var results=[];
                            for (var i = 0; i<options.length; i++){
                                results.push(fa.optionResult(options[i]));
                            }
                            return results;
                        })()
                    }
              </ul>
            </div>
        );
    },
    multiResult:function(question,num){
        //计算百分比
        var fa= this;
        var answers = Answers.find({question_id:question._id}).fetch();
        var optionObject={};
        for(var i=0;i<question.options.length;i++){
            optionObject["key"+question.options[i].key]=0;
        }
        optionObject["other"]=0;
        for(var i=0;i<answers.length;i++){
            for(var j=0;j<answers[i].answer.keys;j++){
                var key="key"+answers[i].answer.keys[j];
                optionObject[key]++;
            }
        }

        var options=[];
        for(var i=0;i<question.options.length;i++){
            var sort=0
            if(answers.length>0){
                if(optionObject["key"+question.options[i].key]){
                    sort=optionObject["key"+question.options[i].key]/answers.length*100
                }

            }
            options.push({
                sort:sort,
                content:question.options[i].content,
            })
        }
        if(optionObject["other"]>0){
            var sort=optionObject["other"]/answers.length*100
            options.push({
                sort:sort,
                content:"其他",
            })
        }

        var shownum=num>8?num+1:"0"+(num+1);
        questionResultJson.push({
            no:shownum,
            type:"多选题",
            title:question.title,
            options:options
        })
        return(
            <div className="result-list-content">
                <div className="title">
                    <b>{shownum}</b>
                    <h2>{question.title}</h2>
                    <span>多选题</span>
                </div>
                <ul>
                    {
                        (function(){

                            var results=[];
                            for (var i = 0; i<options.length; i++){
                                results.push(fa.optionResult(options[i]));
                            }
                            return results;
                        })()
                    }
                </ul>
            </div>
        );
    },

    sortResult:function(question,num){
        var fa=this;
        var shownum=num>8?num+1:"0"+(num+1);
        var answers = Answers.find({question_id:question._id}).fetch();
        var sorts=[];


        for(var i=0;i<question.options.length;i++){
            var optionObject={}
            for(var m=0;m<question.options.length;m++){
                optionObject["key"+question.options[m].key]=0;
            }

            for(var j=0;j<answers.length;j++){
               var key= answers[j].answer.orders[i];
               optionObject["key"+key]++;
            }
            var options=[];
            for(var m=0;m<question.options.length;m++){
                var sort=0
                if(answers.length>0){
                    if(optionObject["key"+question.options[m].key]){
                        sort=optionObject["key"+question.options[m].key]/answers.length*100
                    }

                }
                options.push({
                    sort:sort,
                    content:question.options[m].content,
                })
            }
            sorts[i]=options;

        }
        questionResultJson.push({
            no:shownum,
            type:"排序题",
            title:question.title,
            sorts:sorts,

        })
        return(
            <div className="result-list-content">
                <div className="title">
                    <b>{shownum}</b>
                    <h2>{question.title}</h2>
                    <span>排序题</span>
                </div>
                {
                    (function(){

                        var results=[];
                        for (var i = 0; i<sorts.length; i++){

                            results.push(fa.showTitle(i));
                            results.push(fa.sortUl(sorts[i]));
                        }
                        return results;
                    })()
                }

            </div>
        );
    },
    gradeOption:function(score){
        return(
            <div className="star" style={{border:"none"}}>
                <p>
                    <span className="op-title">{score.content}</span>
                    <span className="average">平均分<i>{score.average}</i></span>
                </p>
                <div className="chart-content">
                    <div className="chart one" data-color="#A9A9A9" data-percent={score.scorelist["key1"]}>{score.scorelist["key1"]}%</div>
                    <b>1分</b>
                </div>
                <div className="chart-content">
                    <div className="chart two" data-color="#AED27B" data-percent={score.scorelist["key2"]}>{score.scorelist["key2"]}%</div>
                    <b>2分</b>
                </div>
                <div className="chart-content">
                    <div className="chart three" data-color="#72BBE7" data-percent={score.scorelist["key3"]}>{score.scorelist["key3"]}%</div>
                    <b>3分</b>
                </div>
                <div className="chart-content">
                    <div className="chart four" data-color="#EFB900" data-percent={score.scorelist["key4"]}>{score.scorelist["key4"]}%</div>
                    <b>4分</b>
                </div>
                <div className="chart-content">
                    <div className="chart five" data-color="#F9504B" data-percent={score.scorelist["key5"]}>{score.scorelist["key5"]}%</div>
                    <b>5分</b>
                </div>
            </div>
        )
    } ,
    gradeResult:function(question,num){
        var fa=this;
        var shownum=num>8?num+1:"0"+(num+1);
        var answers = Answers.find({question_id:question._id}).fetch();
        var scores=[];
        for(var i=0;i<question.options.length;i++){
            var key=question.options[i].key;
            var score=0;
            var key1=0;
            var key2=0;
            var key3=0;
            var key4=0;
            var key5=0;


            for(var j=0;j<answers.length;j++){
                var single= answers[j].answer.score[key]
                switch (single){
                    case 1:
                        key1++;
                        score+=single;
                        break;
                    case 2:
                        key2++;
                        score+=single;
                        break;
                    case 3:
                        key3++;
                        score+=single;
                        break;
                    case 4:
                        key4++;
                        score+=single;
                        break;
                    case 5:
                        key5++;
                        score+=single;
                        break;
                }
            }

            var scorelist={
                "key1":score==0?0:key1/answers.length*100,
                "key2":score==0?0:key2/answers.length*100,
                "key3":score==0?0:key3/answers.length*100,
                "key4":score==0?0:key4/answers.length*100,
                "key5":score==0?0:key5/answers.length*100
            }
            var  average = score==0?0:score/answers.length;
            scores.push({
                score:score,
                scorelist:scorelist,
                content:question.options[i].content,
                average:average
            })
        }
        questionResultJson.push({
            no:shownum,
            type:"评分题",
            title:question.title,
            scores:scores,

        })
        return(
            <div className="result-list-content">
                <div className="title">
                    <b>{shownum}</b>
                    <h2>{question.title}</h2>
                    <span>评分题</span>
                </div>
                {
                    (function(){

                        var results=[];
                        for (var i = 0; i<scores.length; i++){
                             results.push(fa.gradeOption(scores[i]));
                        }
                        return results;
                    })()
                }

            </div>
        );
    },

    fillResult:function(question,num){
        var fa=this;
        var shownum=num>8?num+1:"0"+(num+1);
        var answers = Answers.find({question_id:question._id}).fetch();
        questionResultJson.push({
            no:shownum,
            type:"填空题",
            title:question.title,
            answers:answers,

        })
        return(
            <div className="result-list-content">
                <div className="title">
                    <b>{shownum}</b>
                    <h2>{question.title}</h2>
                    <span>填空题</span>
                </div>
                <ul className="txt-content">
                    {
                        (function(){
                            var result=[];
                            for (var i = 0; i<answers.length;i++){
                                result.push(fa.bankAnswer(answers[i]))
                            }
                            return result;
                        })()
                    }
                </ul>
            </div>
        );
    },
    showSend:function(bool){
        this.setState({show:bool})
    },
    render:function(){
        var fa=this;
        questionResultJson = new Array();

        return(
            <div className="result">
                <div className="result-list">
                    {
                        (function(){
                            var questions = get_question_list(fa.props.questionnaire._id)
                            var results=[];
                            for (var i = 0; i<questions.length; i++){
                                switch(questions[i].type){
                                    case 1:
                                        results.push(fa.singleResult(questions[i],i));
                                        break;
                                    case 2:
                                        results.push(fa.multiResult(questions[i],i));
                                        break;
                                    case 3:
                                        results.push(fa.sortResult(questions[i],i));
                                        break;
                                    case 4:
                                        results.push(fa.fillResult(questions[i],i));
                                        break;
                                    case 5:
                                        results.push(fa.gradeResult(questions[i],i));
                                        break;
                                }
                            }
                            return results;
                        })()
                    }
                </div>
                <SendEmail questionnaire={fa.props.questionnaire}/>
            </div>
        );
    }
});
 SendEmail = React.createClass({
    getInitialState:function(){
        return({error:false,sending:false})
    },
    sending:function(){
        var fa= this;
        var email = $(ReactDOM.findDOMNode(this.refs.email)).val().trim();
        if (fa.checkemail(email)){
            fa.setState({error:false,sending:true});
            var subject="("+fa.props.questionnaire.title+")：问卷结果";
            var html=$(".result-list").html()
            //console.log(questionResultJson);
            Meteor.call('sendEmail',
                 email,
                 subject,
                 html,
                fa.props.questionnaire._id,
                function(err,result){
                    fa.setState({error:false,sending:false});
                });

        }else{
            fa.setState({error:true,sending:false});
        }

    },

    checkemail:function(str){
        var reg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (reg.test(str)) return true;
        else return false;
    },
    cancel:function(){
        $(".report").addClass("dn");
    },
    clear:function(){
        $(ReactDOM.findDOMNode(this.refs.email)).val("");
    },
    render:function(){
        var fa = this;
        return(
            <div className="report error dn">
                <div className="shadow"></div>
                <div className="report-content">
                    {
                        (function(){
                            if (fa.state.error){
                                return(<p className="error"><i className="icon-exclamation-circle"></i>邮箱有误请重新填写</p>);
                            }
                        })()
                    }
                    <div className="input-content">
                        <span className="mail"><i className="icon-envelope-o"></i></span>
                        <input ref="email" type="text" name="" id="" placeholder="邮件地址" />
                        <a href="javascript:void(0);" onClick={this.clear}><i className="icon-times-circle"></i></a>
                    </div>
                    <a href="javascript:void(0);" onClick={this.cancel} className="cancel">取消</a>
                    {
                        (function(){
                            if (fa.state.sending){
                                return(<a href="javascript:void(0);" className="send loading">正在发送</a>);
                            }else return(<a href="javascript:void(0);" onTouchEnd={fa.sending} className="send">发送</a>);
                        })()
                    }
                </div>
            </div>
        );
    }
});
