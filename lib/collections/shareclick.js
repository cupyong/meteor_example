/**
 * Created by oopsdata1 on 16-2-25.
 */
//分享被点击
//
//shareclick:{
//    _id:"objectId",
//        shareopenid:'openId',
//        clickopenId:'openid'
//    questionnaire_id:questionnaire_id//问卷
//    time:"201-8-9 10:10:10"
//}

Shareclicks = new Mongo.Collection('shareclicks');
Meteor.methods({
    //添加记录
    create_shareclick:function(shareclick) {
        check(shareclick,Object);
        var one= Shareclicks.findOne(
            {clickopenId:shareclick.clickopenId,
                questionnaire_id:shareclick.questionnaire_id})
        if(!one){
            shareclick.time=moment().format('YYYY-MM-DD HH:mm:ss')
            shareclick.time_sort=Date.now()
            Shareclicks.insert(shareclick)
        }
    }
})
