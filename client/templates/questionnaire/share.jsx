/**
 * Created by oopsdata1 on 16-1-26.
 */

Template.sharehtml.onRendered(function () {
  var questionnaireId=this.data.params._id;
   var questionaire=Questionnaires.findOne({_id:questionnaireId});
    ReactDOM.render(<Share questionaire={questionaire} />, document.getElementById('wraper'));

});

Share= React.createClass({
    componentDidMount:function (){
        //公众号二维码
        //生成分享二维码
        //var size =$("#qrcode").height();
        //$('#qrcode').qrcode({
        //    size: size,
        //    text: window.location.href
        //});


    },

    render:function(){
        var divStyle = {
            height: '44rem'

        };
        return(
            <div className="share-content">
                <div className="share-top" >
                    <img src="/image/villi/sharetop.png" />
                </div>
                <div className="share-binding">
                    <div className="share-middle">
                        <div className="content">关注公众并绑定手机即可获得<b> 1元 </b>红包</div>
                        <img src="/image/villi/sharemoney.png"  />

                    </div>

                </div>
                <div className="share-click">
                    <div className="table">
                        <div className="content">
                            <div></div>
                            <p><span className="dot">1</span> 分享问卷被点击即可获得<b>0.1元</b>红包，每日上限100人次点击 </p>
                            <p><span className="dot">2</span> 好友成功答题即可获得<b>0.1元</b>红包</p>
                        </div>
                    </div>
                    <div className="tablebottom">
                        <img src="/image/villi/tablebottom.png"  />
                    </div>
                </div>
                <div className="share-bottom">
                    <img src="/image/villi/sharebottom.png" />
                </div>
            </div>

        );
    }
});

Red = React.createClass({
    componentDidMount:function (){

        init_weixin(function(wx){
            wx.ready(function () {

            })
        });
        var fa= this;
        //查询是否是红包问卷
        if(this.props.money&&this.props.money>0){
            $(ReactDOM.findDOMNode(this.refs.notice)).removeClass("dn");
            //$(ReactDOM.findDOMNode(this.refs.thanks)).addClass("dn");
            $(ReactDOM.findDOMNode(this.refs.redcontent)).removeClass("dn");
            $(ReactDOM.findDOMNode(this.refs.thanks)).addClass("dn");
            $(ReactDOM.findDOMNode(this.refs.bottom)).addClass("dn");
            $(ReactDOM.findDOMNode(this.refs.notice)).removeClass("dn");
        }else{
            var anwerred= Answerreds.findOne({openId:getCookie('openId'),questionnaire_id:fa.props.questionnaire._id});
            if(anwerred&&anwerred.money>=1){
                $(ReactDOM.findDOMNode(this.refs.notice)).removeClass("dn");
                //$(ReactDOM.findDOMNode(this.refs.thanks)).addClass("dn");
                $(ReactDOM.findDOMNode(this.refs.redcontent)).removeClass("dn");
                $(ReactDOM.findDOMNode(this.refs.thanks)).addClass("dn");
                $(ReactDOM.findDOMNode(this.refs.bottom)).addClass("dn");
                $(ReactDOM.findDOMNode(this.refs.notice)).removeClass("dn");
            }
        }
    },

    lookresult:function(){
       this.props.setnow(5);
    },
    share:function(){
        this.props.setnow(6);
    },
    qrcode:function(){
        Router.go("qrcode")
    },
    showmoney:function(){
        var fa= this;
        if(this.props.money&&this.props.money>0){
            return this.props.money
        }else {
            var anwerred= Answerreds.findOne({openId:getCookie('openId'),questionnaire_id:fa.props.questionnaire._id});
            if(anwerred&&anwerred.money>=1){
                return anwerred.money

            }else{
                return 0;
            }
        }
    },

    //share:function(){
    //    $(ReactDOM.findDOMNode(this.refs.redcontent)).removeClass("dn");
    //    $(ReactDOM.findDOMNode(this.refs.thanks)).addClass("dn");
    //    $(ReactDOM.findDOMNode(this.refs.bottom)).addClass("dn");
    //    $(ReactDOM.findDOMNode(this.refs.notice)).removeClass("dn");
    //},
    render:function(){
        var fa= this;
        return(
            <div className="container">
                <h3 ref="notice" className="notice green dn">
                    <i className="icon-check" ></i>您获得了 {fa.showmoney()} 元红包 <a onClick={this.qrcode} href="javascript:void(0);">关注公众号</a>
                </h3>
                <div ref="thanks" className="thanks">
                    <img src="/image/villi/succ.png" alt ="bg" />
                    <b>谢谢参与</b>
                </div>
                <div ref="bottom" className="container-bottom">
                    <a href="javascript:void(0);" onTouchEnd={this.share} className="btn share blue"><i className="icon-share"></i>分享问卷</a>
                    {
                        (function(){
                            if (fa.props.questionnaire.allow){
                                return(<a href="javascript:void(0);"  onTouchEnd={fa.lookresult} className="btn result"><i className="icon-pie-chart"></i>查看结果</a>);
                            }
                        })()
                    }

                  </div>
                <div ref="redcontent" className="red-content dn">
                    <div className="red">
                        <div className="money"></div>
                        <i className="out m1"></i>
                        <i className="out m2"></i>
                        <i className="out m3"></i>
                        <i className="out m4"></i>
                        <i className="out m5"></i>
                        <i className="out m6"></i>
                    </div>
                    <div className="red2">
                        <span><b>{fa.showmoney()}</b><em>元</em></span>
                        <a className="rbtn share-more" onTouchEnd={this.share} href="javascript:void(0);">分享问卷拿更多红包</a>
                        {
                            (function(){
                                if (fa.props.questionnaire.allow){
                                    return(<a href="javascript:void(0);"  onTouchEnd={fa.lookresult} className="rbtn view-result">查看结果</a>);
                                }
                            })()
                        }

                    </div>
                   <div className="money1"></div>

                </div>
            </div>
        );
    }
});

