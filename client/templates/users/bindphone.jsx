/**
 * Created by oopsdata1 on 16-3-11.
 */
Template.bindphone.onRendered(function () {

// hack在微信等webview中无法修改document.title的情况
//    var $body = $('body');
//    document.title = 'title';
//    // hack在微信等webview中无法修改document.title的情况
//    var $iframe = $('<iframe src="/favicon.ico"></iframe>');
//    $iframe.on('load',function() {
//        setTimeout(function() {
//            $iframe.off('load').remove();
//        }, 0);
//    }).appendTo($body);
   ReactDOM.render(<Thisbindphone />, document.getElementById('wraper'));
});
Thisbindphone = React.createClass({
    getInitialState:function(){
        return {status:0,second:20,code:"",sign:"",time:"",phone:"",msg:""};
    },
    getCode:function(){

        var phone=ReactDOM.findDOMNode(this.refs.phone).value;
        if(phone.length!=11){
            alert('手机号码不正确');
            return
        }
        var fa = this;
        fa.setState({status:1,second:20});
        var a =setInterval(function(){
           if(fa.state.second>0){
               var second = fa.state.second-1
               fa.setState({second:second});
           }else{
               clearInterval(a);
           }
        },1000)
        //获取验证码
        HTTP.call('get','/api/getphonecode?phone='+phone,null,function(err,result){
            console.log(result.content);
            var json =JSON.parse(result.content)
            if(json.code==0){
                fa.setState({code:json.vcode,sign:json.sign,time:json.time,phone:phone});
            }
        })

    },
    bindphone:function(){
        var fa = this;
        var phone=ReactDOM.findDOMNode(this.refs.phone).value;
        if(phone!=this.state.phone){
            fa.setState({msg:"手机号码不正确"});
            return;
        }
        HTTP.call('get','/api/bindphone?phone='+phone+"&openId="+getCookie('openId')
            +"&code="+fa.state.code+"&sign="+fa.state.sign+"&time="+fa.state.time,
            null,function(err,result){
            var json =JSON.parse(result.content)
            if(json.code==0){
                fa.setState({msg:"绑定成功"});
            }else {
                if(json.code==-1||json.code==-2){
                    $("#spanphone").addClass("error")
                }
                if(json.code==-3){
                    $("#spancode").addClass("error")
                }
               fa.setState({msg:json.msg});
            }
        })

    },

    render:function(){
        var fa= this;
        return(
            <div className="binding">
                <h2>绑定手机即可领取<b>￥1.00</b>元红包</h2>
                <p>
 		<span className="input-wrap" id="spanphone">
	 		<input type="tel" placeholder="请输入手机号" ref="phone"/>
            {
                (function(){
                    if(fa.state.status==0){
                        return  <a className="send" href="javascript:void(0);" onClick={fa.getCode}>获取验证码</a>
                    }
                })()
            }
          </span>
            </p>
              <p>
 		<span className="input-wrap" id="spancode">
 			<input type="tel" placeholder="请输入验证码" />
            {
                (function(){
                   if(fa.state.status==1&&fa.state.second==0){
                        return  <a className="restart" href="javascript:void(0);" onClick={fa.getCode}>重新发送</a>
                    }else{
                        return   <span className="num">{fa.state.second}</span>
                    }
                })()
            }


 		</span>
             </p>
             <p>
                 <a href="javascript:void(0);" className="btn submit blue" onClick={fa.bindphone}>绑定手机</a>
                 {
                     (function(){
                         if(fa.state.msg.length>0){
                             return    <a href="javascript:void(0);" className="btn error">{fa.state.msg}</a>
                         }
                     })()
                 }

             </p>
            </div>

        )
    }
});