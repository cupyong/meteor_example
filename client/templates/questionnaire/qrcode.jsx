/**
 * Created by oopsdata1 on 16-4-15.
 */
/**
 * Created by oopsdata1 on 16-1-26.
 */

Template.qrcode.onRendered(function () {
    ReactDOM.render(<Qrcode  />, document.getElementById('wraper'));
});

Qrcode= React.createClass({


    render:function(){
        var divStyle = {
            height: '44rem'

        };
        return(
            <div className="share-page">
                <div className="share-page-content">

                </div>
                //<div className="villi-q"></div>
                <div className="yun1">
                    <p>关注公众号并绑定手机</p>
                    <p>即可获得<b>1</b>元红包</p>
                </div>
                <div className="qr-code" id="qrcode"><img alt="1" src="/image/villi/wj8.jpg" /></div>
                <div className="yun2"></div>
                <footer>
                    <p><span className="dot"></span> 分享问卷被点击即可获得<b>0.1</b>元红包，每日上限100人次点击 </p>
                    <p><span className="dot"></span> 好友成功答题即可获得<b>0.1</b>元红包</p>
                </footer>
            </div>
        );
    }
});



