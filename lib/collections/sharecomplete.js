/**
 * Created by oopsdata1 on 16-2-25.
 */
//分享被完成回答

Sharecompletes = new Mongo.Collection('sharecompletes');
Meteor.methods({
    //添加记录
    create_sharecompletes:function(sharecomplete) {
       check(sharecomplete,Object);
        //查询是否存在shareclick中
        var click= Shareclicks.findOne(
                {clickopenId:sharecomplete.completeopenId,
                questionnaire_id:sharecomplete.questionnaire_id})
        if(click){
            var complete= Sharecompletes.find({
                 completeopenId:sharecomplete.completeopenId,
                 questionnaire_id:sharecomplete.questionnaire_id
            })
            if(!complete){
                sharecomplete.time=moment().format('YYYY-MM-DD HH:mm:ss')
                sharecomplete.time_sort=Date.now(),
                sharecomplete.shareopenid=click.shareopenid;
                Sharecompletes.insert(sharecomplete)
            }
        }
    }
})