/**
 * Created by oopsdata1 on 16-1-26.
 */
//记录关注的微信用户行为
UserAction= new Mongo.Collection('useractions');
Meteor.methods({
    useractionInsert:function(action){
        check(action,Object);
        UserAction.insert(action)
    }
})