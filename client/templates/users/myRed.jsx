/**
 * Created by oopsdata1 on 16-1-26.
 */
Template.myred.onRendered(function () {
    ReactDOM.render(<MyRed />, document.getElementById('wraper'));
});
 MyRed = React.createClass({
     getInitialState:function(){
         var openId= getCookie('openId');
         var shareclick= Shareclicks.find({shareopenid:openId}).fetch();
         var sharecomplete = Sharecompletes.find({shareopenid:openId}).fetch();
         var answerred=Answerreds.find({openId:openId}).fetch();
         var sharemoney= Sharemoneys.find({openId:openId}).fetch();
         var invitation = Invitations.find({openId:openId}).fetch();

         var allredmoney=shareclick.length*0.1+sharecomplete.length*0.1;
         var surplus=allredmoney;
         for(var i=0;i<sharemoney.length;i++){
             surplus-=sharemoney[i].money;
         }
         for(var i=0;i<answerred.length;i++){
             allredmoney+=answerred[i].money;
         }
         for(var i=0;i<invitation.length;i++){
             allredmoney+=invitation[i].money;
         }
         //绑定手机
         var user = Users.findOne({openId:openId})
         if(user.phone&&user.phone.length>8){
             allredmoney+=1;

         }
         var list=[];

         //答
         for(var i=0;i<answerred.length;i++){
             var namastate=""
             var now =new Date().getTime();
             if(answerred[i].status&&answerred[i].status=="RECEIVED"){
                 namastate="已领取"

             }else if(answerred[i].status||now-answerred[i].time_sort>12*3600*1000){
                 namastate="已过期"
             }else{
                 namastate="未领取"
             }
             list.push(
                 {
                     classname:"state-img green",
                     name:"答",
                     questionId:answerred[i].questionnaire_id,
                     title:Questionnaires.findOne({_id:answerred[i].questionnaire_id}).title,
                     state:namastate,
                     status:answerred[i].status,
                     time:answerred[i].time,
                     money:answerred[i].money
                 }
             )
         }
         //绑
         if(user.phone&&user.phone.length>8){
            var namastate=""
             if(user.redstatus&&user.redstatus=="RECEIVED"){
                 namastate="已领取"
             }else{
                 namastate="未领取"
             }
             list.push(
                 {
                     classname:"state-img red",
                     name:"绑",
                     title:"绑定手机",
                     state:namastate,
                     status:user.redstatus,
                     time:user.bindphonetime,
                     money:1
                 }
             )
         }

         //推
         for(var i=0;i<shareclick.length;i++){
             var questionnaire_id=shareclick[i].questionnaire_id;
             //查询list中是否存在 推广的 questionnaire_id
             var findlist=_.find(list,function(item){
                 return item.name=="推"&&item.questionId==questionnaire_id
             })
             if(!findlist||findlist.length==0){
                 //不存在就新增记录
                 var thisshareclick=  Shareclicks.find({shareopenid:getCookie('openId'),questionnaire_id:questionnaire_id}).fetch();
                 var thissharecomplete=  Sharecompletes.find({shareopenid:getCookie('openId'),questionnaire_id:questionnaire_id}).fetch();
                 list.push({
                     classname:"state-img blue",
                     name:"推",
                     questionId:questionnaire_id,
                     title:Questionnaires.findOne({_id:questionnaire_id}).title,
                     time:shareclick[i].time,
                     money:thisshareclick.length*0.1+thissharecomplete.length*0.1
                 })

             }
         }
         //邀
         for(var i=0;i<invitation.length;i++){
             var user = Users.findOne({openId:invitation[i].beopenid})
             var namastate=""
             if(invitation[i].status&&invitation[i].status=="RECEIVED"){
                 namastate="已领取"
             }else{
                 namastate="未领取"
             }
             list.push(
                 {
                     classname:"state-img orange",
                     name:"邀",
                     title:"邀请好友"+user.nickname,
                     beopenid:invitation[i].beopenid,
                     state:namastate,
                     status:invitation[i].status,
                     time:invitation[i].time,
                     money:invitation[i].money
                 }
             )
         }
         return (
         {
             now:1,
             shareclick:shareclick,
             sharecomplete:sharecomplete,
             answerred:answerred,
             sharemoney:sharemoney,
             allredmoney:allredmoney,
             surplus:surplus,
             invitation:invitation,
             user:user,
             list:list
         });
     },
     componentDidMount:function(){
         var fa= this;
         //邀请 绑定 回答问题红包 需要请求微信服务是否发送红包
         for(var i=0;i<this.state.list.length;i++){
             if(this.state.list[i].name=="答"){
                 (function (i){
                     if((!fa.state.list[i].status)||fa.state.list[i].status=="SENDING"||fa.state.list[i].status=="SENT"){
                         //查询payorder中orderno
                         HTTP.call("get","/api/findredpay?openId="+fa.state.user.openId+"&questionnaireId="+fa.state.list[i].questionId+"&type=2"
                             ,null,function(err,result){
                                 if(result){
                                     if(result){
                                         var list = fa.state.list
                                         list[i].status=result.content;
                                         if(result.content=="RECEIVED"){
                                             list[i].state="已领取";
                                         }
                                         fa.setState({list:list});
                                     }
                                 }

                             })

                     }

                 })(i)

             }
             if(this.state.list[i].name=="邀"){

                 if((!this.state.list[i].status)||this.state.list[i].status=="SENDING"||this.state.list[i].status=="SENT"){
                     //查询payorder中orderno

                     (function(i){
                         HTTP.call("get","/api/findredpay?beopenid="+fa.state.list[i].beopenid+"&openId="+fa.state.user.openId+"&type=5"
                             ,null,function(err,result){
                                 if(result){
                                     var list = fa.state.list
                                     list[i].status=result.content;
                                     if(result.content=="RECEIVED"){
                                         list[i].state="已领取";
                                     }
                                     fa.setState({list:list});
                                 }

                             })
                     })(i)


                 }
             }
             if(this.state.list[i].name=="绑"){
                 //判断状态是否更新过
                 if((!this.state.list[i].status)||this.state.list[i].status=="SENDING"||this.state.list[i].status=="SENT"){
                     //查询payorder中orderno
                     (function(i){
                         HTTP.call("get","/api/findredpay?openId="+fa.state.user.openId+"&type=6"
                             ,null,function(err,result){
                                 if(result){
                                    var list = fa.state.list
                                     list[i].status=result.content;
                                      if(result.content=="RECEIVED"){
                                          list[i].state="已领取";
                                      }
                                     fa.setState({list:list});
                                 }

                             })
                     })(i)


                 }
             }
         }


     },
     receive:function(){
           if(this.state.surplus>=1){
               //发红红包
               HTTP.call("get","/api/pay/redmoney?openId="+getCookie('openId'),null,function(err,result){
                   if(result){
                       //重新加载页面 todo
                       window.location.href= window.location.href;
                   }

               })

           }else{
               alert('必须大于1元才能领取')
           }
     },
     render:function(){


         var fa= this;
         if(this.state.allredmoney==0){
             return(
                 <div className="my-red">
                     <header className="edited red">
                         <div id="survey-title">
                             <div className="survey-name">
                                 <h2 className="title">我的红包</h2>
                             </div>
                         </div>
                     </header>
                     <div className="red-content">
                         <div><b>{this.state.allredmoney.toFixed(2)}</b>元</div>
                         {
                             (function(){
                                 if(fa.state.surplus>0){
                                     return   <span>未领取红包 {fa.state.surplus.toFixed(2)}元 <a href="javascript:void(0);" onClick={fa.receive}>立即领取</a></span>
                                 }
                             })()
                         }
                      </div>
                     <h2>赚取红包途径</h2>
                     <ul>

                         <li>
                             <span className="state-img red">绑</span>
                             <span className="showtitle">关注问卷吧公众号绑定手机</span>

                         </li>
                         <li>
                             <span className="state-img orange">邀</span>
                             <span className="showtitle">邀请好友关注问卷吧公众号</span>
                         </li>
                         <li>
                             <span className='state-img green'>答</span>
                             <span className="showtitle">参与答题</span>
                         </li>
                         <li>
                             <span className='state-img blue'>推</span>
                             <span className="showtitle">推广问卷</span>
                         </li>
                    </ul>
                 </div>
             );
         }else{
             return(
                 <div className="my-red">
                     <header className="edited red">
                         <div id="survey-title">
                             <div className="survey-name">
                                 <h2 className="title">我的红包</h2>
                             </div>
                         </div>
                     </header>
                     <div className="red-content">
                         <div><b>{this.state.allredmoney.toFixed(2)}</b>元</div>

                         {
                             (function(){
                                 if(fa.state.surplus>0){
                                     return   <span>未领取红包 {fa.state.surplus.toFixed(2)}元 <a href="javascript:void(0);" onClick={fa.receive}>立即领取</a></span>
                                 }
                             })()
                         }


                     </div>
                     <ul>
                         {

                             (function(){
                                 var htmllist=[];

                                 for(var i=0;i<fa.state.list.length;i++){
                                     if(fa.state.list[i].state){
                                         htmllist.push(
                                             <li>
                                                 <span className={fa.state.list[i].classname}>{fa.state.list[i].name}</span>
                                                 <span className="title">{fa.state.list[i].title}</span>
                                                 <span className="state">{fa.state.list[i].state}</span>
                                                 <span className="time">{fa.state.list[i].time.split(' ')[0]}</span>
                                                 <span className="money">￥{fa.state.list[i].money.toFixed(2)}</span>
                                             </li>
                                         )
                                     }else{
                                         htmllist.push(
                                             <li>
                                                 <span className={fa.state.list[i].classname}>{fa.state.list[i].name}</span>
                                                 <span className="title">{fa.state.list[i].title}</span>
                                                 <span className="time">{fa.state.list[i].time.split(' ')[0]}</span>
                                                 <span className="money">￥{fa.state.list[i].money.toFixed(2)}</span>
                                             </li>
                                         )
                                     }

                                 }
                                 return htmllist;
                             })()
                         }

                     </ul>
                 </div>
             );
         }

    }
});
