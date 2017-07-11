/**
 * Created by root on 15-12-31.
 */
//微信关注用户
Users = new Mongo.Collection('users');
Meteor.methods({
    userInsert: function(user) {
        var user = Users.findOne(user.openId);
        if(user){
            //修改用相关信息
            Users.update({openId:user.openId},{$set:
                        {
                            "headurl":user.headimgurl,
                             "nickname":user.wxname,
                             "sex":user.sex,
                             "country":user.country,
                             "city":user.city,
                             "province":user.province
                        }
            })

        }else {
            Users.insert({
                openId:user.openid,
                "headurl":user.headimgurl,
                "nickname":user.wxname,
                "sex":user.sex,
                "country":user.country,
                "city":user.city,
                "province":user.province
            })
        }
    },
    userupdate:function(openId,commonanswer){
        check(openId,String);
        check(commonanswer,Object);
        Users.update({openId:openId},{$set:{commonanswer:commonanswer}})
    }

});
