/**
 * Created by oopsdata1 on 16-1-26.
 */
//用来存储给用户发送的消息
PushMessage= new Mongo.Collection('pushmessages');
Meteor.methods({
    pushmessageInsert:function(action){
        check(action,Object);
        PushMessage.insert(action)
    }
})