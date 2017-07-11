/**
 * Created by oopsdata1 on 16-3-8.
 */


Template.invitation.onRendered(function(){
    document.body.style.backgroundColor="#0DA2EA"
})
//Template.invitation.onRendered(function () {
//   //var openId = getCookie('openId');
//   // HTTP.call("get","/api/getqrcodeurl?openId="+getCookie('openId'),null,function(err,result){
//   //     console.log(result);
//   //         if(result){
//   //             $('#wraper').qrcode({
//   //                 size: 200,
//   //                 text: result.content
//   //             });
//   //         }
//   // })
//
//
//    document.title="快来问卷吧问答问题领取红包";
//
//
//    //console.log(111);
//    //Meteor.call("getQrcode",openId,function(error , result){
//    //    if(error){
//    //        console.log(error);
//    //    }
//    //    if(result){
//    //        $('#wraper').qrcode({
//    //            size: 200,
//    //            text: result
//    //        });
//    //    }
//    //})
//
//
//});
//Template.invitation.helpers({
//    test: function () {
//        return "test1212"
//    },
//
//
//});