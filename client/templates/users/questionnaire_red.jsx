/**
 * Created by oopsdata1 on 16-1-21.
 */


 QuestionMoney = React.createClass({
    getInitialState:function(){
         return {now:0,questionnaire:this.props.questionnaire};
    },
    setNow:function(num){
        this.setState({now: num});
    },
     setQuestionnaire:function(questionnaire){
         this.setState({questionnaire: questionnaire});
     },
    render:function(){
        switch(this.state.now){
            case 0:
                return(
                    <div>
                        <Quota setQuestionnaire={this.setQuestionnaire} questionnaire={this.state.questionnaire} setnow={this.props.setnow}/>
                        <RedOption  setNow ={this.setNow} questionnaire={this.state.questionnaire} setnow={this.props.setnow} params = {this.props.params}/>
                    </div>
                )
            break;
            case 1:
                return(
                   <Share questionnaire={this.props.questionnaire}/>
                )
                break;

        }

    }
});
 Quota = React.createClass({
    componentDidMount:function(){
       var fa=this;
       var changeCheckbox = document.querySelector('.js-switch')

        if(this.props.questionnaire.allow&&this.props.questionnaire.allow==true){
            changeCheckbox.checked=true;
        }
        var switchery = new Switchery(changeCheckbox);
        changeCheckbox.onchange = function() {
             Meteor.call("update_questionnaire",this.id,{allow:changeCheckbox.checked},function(error , id){

             })

        };

    },
    handleInput:function(e){
        var fa=this;
        var sum = parseInt($(e.currentTarget).text());
        if(sum>99999){
            $(e.currentTarget).text(sum.toString().substring(0,5))
            return ;
        }
        if(!isNaN(sum)){


            Meteor.call("update_questionnaire",this.props.questionnaire._id,{maxCount:sum},function(error , result){

                //如果问卷是结束的 并且设置的回收数据大于已经回收的问卷那么就重新发布问卷
                var questionnaire = Questionnaires.findOne({_id:fa.props.questionnaire._id});
                if(questionnaire.status==2){
                    //查询回收数量
                    var useransewrs = Useranswers.find({questionnaire_id:questionnaire._id,complete:true}).fetch()
                    if(useransewrs){
                        questionnaire.answerNum=useransewrs.length;
                    }else{
                        questionnaire.answerNum=0;
                    }

                }
                if(questionnaire.answerNum<sum){
                    Questionnaires.update({_id:fa.props.questionnaire._id},{$set:{status:1}})
                }
                fa.props.setQuestionnaire(result)
            })
        }

    },
    render:function(){
        return(
            <div className="quota">
                <div className="quota-num">
                    回收<span onInput={this.handleInput} ref="count" className="quota-num-input" contentEditable={true} placeholder="10">{this.props.questionnaire.maxCount}</span>份
                </div>
                <div className="view-results">
                    <p ref="box" className="clearfix">
                        <span className="op-title l">允许答题者查看结果</span>
                        <input ref="switch1" type="checkbox" className="js-switch"  id={this.props.questionnaire._id}/>
                    </p>
                </div>
            </div>
        );
    }
});
 RedOption = React.createClass({
     init:function(type){
         var level= this.props.questionnaire.level;
         var money =  this.props.questionnaire.money;
         var addmoney="";
         //var addmoneynum=0;
         if(this.props.params.query.type=="red"){
             level=2;
         }
         if(type){
             level=type;
         }
         //计算出还需要回收的问卷数量
         var answerpapercount = Useranswers.find({complete:true,questionnaire_id:this.props.questionnaire._id}).fetch().length;

         var recoverycount =this.props.questionnaire.maxCount- answerpapercount;
         console.log(recoverycount);
         //计算addmoneynum默认值
         var  addmoneynum=money>recoverycount?0:recoverycount-money
         if(level==1){
             addmoneynum=money>recoverycount*1.3?0:recoverycount*1.3-money
             addmoneynum=parseFloat(addmoneynum.toFixed(2))
         }
         return {level:level,money:money,addmoney:addmoney,addmoneynum:addmoneynum,recoverycount:recoverycount}
     },

     getInitialState:function(){
         return(this.init());
    },
     setMoneyHtml:function(oldmoney,addmoney){
         if(ReactDOM.findDOMNode(this.refs.money)&&ReactDOM.findDOMNode(this.refs.money).value.trim()==""){
             var oldaddmoney=this.props.questionnaire.money>this.state.recoverycount?0:this.state.recoverycount-this.props.questionnaire.money
             if(this.state.level==1){
                 oldaddmoney=this.props.questionnaire.money>this.state.recoverycount*1.3?0:this.state.recoverycount*1.3-this.props.questionnaire.money
                 oldaddmoney=parseFloat(oldaddmoney.toFixed(2))
             }
             if(addmoney!=oldaddmoney){
                 this.setState({addmoneynum:oldaddmoney});
             }
         }
        if(addmoney>0&&oldmoney>0){
           return  (<span className="remain">
                     <b>￥{oldmoney.toFixed(2)}</b>
                     <em>+￥{addmoney.toFixed(2)}</em></span>)
         }else if(oldmoney==0){
             return  (<span className="remain">
                     <em>￥{addmoney.toFixed(2)}</em></span>)
         }else{
             return  (<span className="remain">
                      <b>￥{oldmoney.toFixed(2)}</b></span>)
         }

     },
     //手气红包
     getplaceholdermoney:function(){
         var level= this.props.questionnaire.level;

         var money =  this.props.questionnaire.money;

         var placeholdermoney=money>=this.state.recoverycount?money:this.state.recoverycount-money
         return placeholdermoney

     },
     //普通红包
     getplaceholdermoney2:function(){

         var money =  this.props.questionnaire.money;

         var placeholdermoney=money>this.state.recoverycount*1.3?money:this.state.recoverycount*1.3
         return  parseFloat((placeholdermoney/this.state.recoverycount/1.3).toFixed(2));
     },


     share:function(){
        //用 Router.go 跳转会引起jssdk签名不正确
         window.location.href=getweixinUrl("sharequestionnaire/"+this.props.questionnaire._id)
        //window.location.href="/sharequestionnaire/"+this.props.questionnaire._id
        //Router.go('questionnairedetail', {_id: this.props.questionnaire._id});
        //this.props.setnow(1,this.props.questionnaire._id)
    },
     componentDidUpdate:function(){
         var recoverycount= this.state.recoverycount;
         var answerpapercount = Useranswers.find({complete:true,questionnaire_id:this.props.questionnaire._id}).fetch().length;

         var newrecoverycount =this.props.questionnaire.maxCount- answerpapercount;
         if(recoverycount!=newrecoverycount){
            var json =this.init(this.state.level);
            this.setState(json)
         }
      },
    componentDidMount:function(){
        init_weixin(function(wx){
         wx.ready(function () {
          })
        });
       if(this.state.level==1){
            $(ReactDOM.findDOMNode(this.refs.common)).addClass("active");
        }
        if(this.state.level==2){
            $(ReactDOM.findDOMNode(this.refs.random)).addClass("active");
        }
    },
    wei_pay:function(){
        var fa=this;
        //if(ReactDOM.findDOMNode(this.refs.money).value.trim().length<1){
        //    alert('请输入金额')
        //    return;
        //}
        if(this.state.addmoneynum<=0){
            alert('总金额必须大于账户余额')
            return;
        }
        if(this.state.level==2){
            if(parseFloat(parseFloat(ReactDOM.findDOMNode(this.refs.money).value).toFixed(2))<this.getplaceholdermoney()){
                alert('每个红包金额不低于1元，您的充值的金额不足')
                return;
            }
        }else{
            if(parseFloat(parseFloat(ReactDOM.findDOMNode(this.refs.money).value).toFixed(2))<1){
                alert('每个红包金额不低于1元，您的充值的金额不足')
                return;
            }
            //if(parseFloat(parseFloat(ReactDOM.findDOMNode(this.refs.money).value).toFixed(2))<1.3){
            //    alert('普通红包要保证红包总额大于30%')
            //    return;
            //}
        }
        var attr={level:this.state.level}

        if(this.state.level==1){
             var addmoney=parseFloat(ReactDOM.findDOMNode(this.refs.money).value);
             attr={level:this.state.level,singlemoney:addmoney}
        }
        //var attr={money:parseFloat(parseFloat(ReactDOM.findDOMNode(this.refs.money).value).toFixed(2)),level:this.state.level}

        Meteor.call("update_questionnaire",fa.props.questionnaire._id,attr,function(error , id){

        })
        var timestamp = new Date().getTime();
        var money = this.state.addmoneynum*100;
        var openId = getCookie('openId');
        HTTP.call('get','/api/pay/unifiedorder?questionnaireid='+fa.props.questionnaire._id+'&timestamp='+timestamp+"&money="+money+"&openId="+openId,null,function(err,result){
            var json =JSON.parse(result.content)
            init_weixin(function(wx){
                wx.ready(function () {
                    wx.chooseWXPay({
                        timestamp: timestamp,
                        nonceStr: weixinClint.nonce_str,
                        package: json.package,
                        signType: 'MD5',
                        paySign: json.paySign,
                        success: function (res) {
                           //alert('充值成功');
                           ////跳转到分享页面
                            //alert(getweixinUrl("sharequestionnaire/"+id));
                            //window.location.href="http://www.baidu.com";
                            window.location.href=getweixinUrl("sharequestionnaire/"+fa.props.questionnaire._id)
                           //window.location.href="/sharequestionnaire/"+id
                         // Meteor.call("update_questionnaire",fa.props.questionnaire._id,attr,function(error , id){
                         //
                         //})
                        }
                    });
                })
            });
        })
        //Meteor.call("update_questionnaire",fa.props.questionnaire._id,attr,function(error , id){
        // })
    },
    cancel:function(){
        console.log(1111);
        if (this.state.red){
            this.setState({red:false,common:false,random:false});
            $(ReactDOM.findDOMNode(this.refs.random)).removeClass("active");
            $(ReactDOM.findDOMNode(this.refs.common)).removeClass("active");
        }else{
            Router.go('myquestionprew',{_id: this.props.questionnaire._id});
        }
    },
    active:function(a){
        var json =this.init(a);
        if (a==2){
           $(ReactDOM.findDOMNode(this.refs.random)).addClass("active");
            $(ReactDOM.findDOMNode(this.refs.common)).removeClass("active");

        }
        else{
            $(ReactDOM.findDOMNode(this.refs.random)).removeClass("active");
            $(ReactDOM.findDOMNode(this.refs.common)).addClass("active");
        }
        json.level=a
        this.setState(json)
    },
    handleInput:function(){
        var addmoney=parseFloat(ReactDOM.findDOMNode(this.refs.money).value);
        if (isNaN(addmoney)){
            if (ReactDOM.findDOMNode(this.refs.money).value !="") alert("请输入数值");
            addmoney="";
        }
        if(this.state.level==2){
            if(addmoney==""){
                this.setState({addmoneynum:this.props.questionnaire.money>this.state.recoverycount?0:this.state.recoverycount-this.props.questionnaire.money});
            }else{
                addmoney=addmoney-this.props.questionnaire.money
                this.setState({addmoneynum:parseFloat(addmoney.toFixed(2))})
            }


        }else if(this.state.level==1){
            if(addmoney==""){
                this.setState({addmoneynum:this.props.questionnaire.money>this.state.recoverycount?0:this.state.recoverycount-this.props.questionnaire.money});
            }else{
                addmoney=addmoney*1.3;
                addmoney=addmoney*this.state.recoverycount-this.props.questionnaire.money
                this.setState({addmoneynum:parseFloat(addmoney.toFixed(2))})
            }
        }



    },
    render:function(){
        var fa=this;
        return(
            <div className="red-option">
                {
                    (function(){
                        if (fa.state.level!=1&&fa.state.level!=2) return(<p className="f13 ">加快回收速度？<br/>发红包给答题者吧</p>)
                    })()
                }
                <div className="red-tab">
                    <ul>
                        <li ref="random" className="menu l random" onTouchEnd={this.active.bind(this,2)}>
                            <a className="javascript:void(0);" href="javascript:void(0);"><i className="icon-envelope"></i>拼手气红包</a>
                        </li>
                        <li ref="common" className="menu r common" onTouchEnd={this.active.bind(this,1)}>
                            <a className="javascript:void(0);" href="javascript:void(0);"><i className="icon-envelope"></i>普通红包</a>
                        </li>
                    </ul>
                    {
                        (function(){

                            if(fa.state.level!=1&&fa.state.level!=2){

                            }else{
                                return(
                                    <div className="money-tip">
                                        <b className="arr"></b>
                                        <span><i>!</i>
                                            <span className="tipcontent">
                                            问卷回收完成后按实际回收数量计算成本，余额自动退回</span></span>
                                    </div>
                                )
                            }
                        })()
                    }




                    {
                        (function(){
                       if (fa.state.level==2) return(
                                <div className="content">
                                    <div className="red-input clearfix">
                                        <span className="red-input-txt-l l">充值最小金额</span>
                                        <span className="red-input-txt-r r">元</span>
                                        <input ref="money" onInput={fa.handleInput} className="r" type="text" placeholder={fa.getplaceholdermoney().toFixed(2)}/>
                                    </div>
                                    <p className="input-txt">每份问卷可领一个，金额随机且不低于1元</p>
                                    {
                                        (function(){
                                            return fa.setMoneyHtml(fa.state.money,fa.state.addmoneynum)
                                        })()
                                    }
                                </div>
                            );
                      if (fa.state.level==1) return(
                                <div className="content">
                                    <div className="red-input clearfix">
                                        <span className="red-input-txt-l l">每份红包</span>
                                        <span className="red-input-txt-r r">元</span>
                                        <input ref="money" onInput={fa.handleInput} className="r" type="text" placeholder={fa.getplaceholdermoney2().toFixed(2)} />
                                    </div>
                                    <p className="input-txt">每份问卷可领一个，金额固定且不低于1元</p>
                                    {
                                        (function(){
                                            return fa.setMoneyHtml(fa.state.money,fa.state.addmoneynum)
                                        })()
                                    }
                              </div>
                            );
                        })()
                    }
                    {
                        (function(){

                            if(fa.state.level!=1&&fa.state.level!=2){
                                return(
                                    <div className="op-btn">
                                    <a href="javascript:void(0);" onTouchEnd={fa.share} className="btn share ">分享问卷</a>
                                        <a href="javascript:void(0);" onTouchEnd={fa.cancel} className="btn op-cancel op-cancel-top">取消</a>
                                    </div>)
                            }else{
                                return(
                                    <div className="op-btn">
                                       <a href="javascript:void(0);" onTouchEnd={fa.wei_pay} className="btn recharge btnright">充值</a>
                                        <a href="javascript:void(0);" onTouchEnd={fa.cancel} className="btn op-cancel btnleft ">取消</a>
                                    </div>
                            )
                            }
                        })()
                    }



                </div>
            </div>
        );
    }
});
