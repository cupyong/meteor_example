/**
 * Created by oopsdata1 on 16-3-29.
 */

Logs= new Mongo.Collection('logs');
Logs.allow({
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