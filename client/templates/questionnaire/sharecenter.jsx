/**
 * Created by oopsdata1 on 16-1-26.
 */

Template.sharecenter.onRendered(function () {
    ReactDOM.render(<ShareCenter  />, document.getElementById('wraper'));
});

 ShareCenter= React.createClass({
    share:function(id,e){
       //window.location.href="/sharequestionnaire/"+id
        window.location.href=getweixinUrl("sharequestionnaire/"+id)
    },

    render:function(){
        var fa =this;
        //查询推广的问卷
        var questionnaires=Questionnaires.find({status: { $in: [ 1, 2 ] },level: { $in: [ 1, 2 ] }},{sort:{share: -1,status:1}}).fetch();
        for(var i=0;i<questionnaires.length;i++){
              if(questionnaires[i].share==1){ //推广的问卷
                 //查询推广的份额
                 var clicknum= Shareclicks.find({shareopenid:questionnaires[i].openId,questionnaire_id:questionnaires[i]._id}).fetch().length
                 //获取的推广金额
                  var comnum = Sharecompletes.find({shareopenid:questionnaires[i].openId,questionnaire_id:questionnaires[i]._id}).fetch().length
                  var money =clicknum*0.1+comnum*0.1;
                  questionnaires[i].num =clicknum;
                  questionnaires[i].money =money;
              }
        }
        return(
            <div className="share-center">
                <header className="edited">
                    <div id="survey-title">
                        <div className="survey-name">
                            <h2 className="title">推广中心</h2>
                        </div>
                    </div>
                </header>
                <ul>
                   {
                      (function(){
                         var list=[];
                         for(var i=0;i<questionnaires.length;i++){
                             if(questionnaires[i].share==1&&questionnaires[i].status!=2){
                                 list.push( <li onClick={fa.share.bind(this,questionnaires[i]._id)}>
                                     <span className="title">{questionnaires[i].title}</span>
                                     <span className="state ing">推广中</span>
                                     <span className="state-num">已推广<b>{questionnaires[i].num}</b>份</span>
                                     <span className="money">获得<b>{questionnaires[i].money}</b>元</span>
                                     <i className="icon-chevron-right"></i>
                                 </li>)
                             }else if(questionnaires[i].share!=1&&questionnaires[i].status!=2){
                                 list.push(
                                     <li onClick={fa.share.bind(this,questionnaires[i]._id)}>
                                         <span className="title">{questionnaires[i].title}</span>
                                         <span className="state">待推广</span>
                                         <i className="icon-chevron-right"></i>
                                     </li>
                                 )
                             }else if(questionnaires[i].status==2){
                                 list.push(
                                     <li>
                                         <span className="title stop">{questionnaires[i].title}</span>
                                         <span className="state stop">已结束</span>
                                         <i className ="icon-chevron-right"></i>
                                     </li>
                                 )
                             }
                         }
                          return list;
                     })()
                    }
                </ul>
            </div>
        );
    }
});


