/**
 * Created by oopsdata1 on 16-3-8.
 */
Invitations= new Mongo.Collection('invitations');
Invitations.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return true
    },

});