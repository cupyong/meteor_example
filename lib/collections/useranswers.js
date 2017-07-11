/**
 * Created by oopsdata1 on 16-1-22.
 */
Useranswers= new Mongo.Collection('useranswers');

Useranswers.allow({
    insert: function () {
        // the user must be logged in, and the document must be owned by the user
        return true
    },
    update: function () {
        // can only change your own documents
        return true
    },
    remove: function () {
        // can only remove your own documents
        return true
    },

});
//Meteor.methods({
//    adduseranswer:function(thisuseranswer){
//        check(thisuseranswer,Object);
//        var id= Useranswers.insert(thisuseranswer)
//        return Useranswers.findOne({_id:id});
//    },
//    updateuseranswer:function(id,thisuseranswer){
//        check(thisuseranswer,Object);
//        Useranswers.update({_id:id},thisuseranswer)
//        return Useranswers.findOne({_id:id});
//    },
//})