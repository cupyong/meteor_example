/**
 * Created by root on 16-1-18.
 */
//添加问题用
 QuestionaireType = React.createClass({
    cancel:function(){
        $('.add-question-option').removeClass("animated fadeInUp").addClass("animated fadeOutDown");
        setTimeout(function(){
            $('.add-question-option').addClass("dn");
            $('.add-question-option').addClass('dn').css({top:'0'});
            $(".questions").addClass("questionbottom");
            //$(".questions").css("bottom","0%")
            $('.questions').addClass('off');
            $('.common-content').hide();
            $('.common-content').removeClass('show');
            $('.questionaire_list').removeClass("hide");
            $('.icon.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
            $('.icon-bg.changyong').addClass('border');
            $('.add-question-option').removeClass("animated fadeOutDown");
        },100);
    },
    GoEdit:function(type,e){
        fa=this;
        $('.add-question-option').removeClass("animated fadeInUp").addClass("animated fadeOutUp");
        setTimeout(function(){
            $('.add-question-option').addClass("dn");
            $('.add-question-option').addClass('dn').css({top:'0'});
            $('.questions').addClass('off');
            $('.common-content').hide();
            $('.common-content').removeClass('show');
            $('.content').hide();
            $('.questionaire_list').hide();
            $('.icon.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
            $('.icon-bg.changyong').addClass('border');
            //fa.props.setnow(2,type);
        },1000);
        setTimeout(function(){
            Router.go('mysinglequestion',
                  {
                   questionnaireId: fa.props.questionaire._id,
                   type:type });
            //fa.props.setnow(2,type);
        },500);
    },

    showNormal:function(){
        var changyong = $('.changyong i');
        if(changyong.hasClass('icon-chevron-down')){
            setCookie(this.props.questionaire._id,'up')
            $('.changyong i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
            $('.icon-bg.changyong').removeClass('border');
            $('ul.questions').removeClass('off');
            $('.common-content').show();
            setTimeout(function(){$('.common-content').addClass('show');},50);
        }else{
            setCookie(this.props.questionaire._id,'dowm')
            $('.changyong i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
            $('.icon-bg.changyong').addClass('border');
            $('ul.questions').addClass('off');
            $('.common-content').removeClass('show');
            setTimeout(function(){$('.common-content').hide();},400);
        }
    },
    addnormal:function(type){
       console.log(type);
        var fa= this;
        var commonquestion = CommonQuestions.findOne({name:type});

        Router.go('mysinglequestion',
            {questionnaireId: fa.props.questionaire._id,
                questionId:type,
                type:commonquestion.type
            });
       //Meteor.call("addCommonQuestion",type,fa.props.questionaire._id,function(error , result){
       //
       //    if(result){
       //         Router.go('mysinglequestion',
       //                {questionnaireId: result.questionnaire_id,
       //                 questionId:result._id,
       //                 type:result.type
       //                });
       //     }
       //
       // })
    },
    render:function(){
        return(
            <div className="add-question-option dn">
                <div className="shadow"></div>
                <ul className="questions off">
                    <li>
                        <a href="javascript:void(0);" onTouchEnd={this.GoEdit.bind(this,1)}>
							<span className="icon-bg danxuan">
								<i className="icon icon-radiobuttonlist"></i>
							</span>
                            <span className="question-name">单选题</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onTouchEnd={this.GoEdit.bind(this,2)} >
							<span className="icon-bg duoxuan">
								<i className="icon icon-multiple-choice"></i>
							</span>
                            <span className="question-name">多选题</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onTouchEnd={this.GoEdit.bind(this,3)} >
							<span className="icon-bg paixu">
								<i className="icon icon-list-ol"></i>
							</span>
                            <span className="question-name">排序题</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onTouchEnd={this.GoEdit.bind(this,4)} >
							<span className="icon-bg tiankong">
								<i className="icon icon-blank"></i>
							</span>
                            <span className="question-name">填空题</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onTouchEnd={this.GoEdit.bind(this,5)} >
							<span className="icon-bg pingfen">
								<i className="icon icon-star"></i>
							</span>
                            <span className="question-name">评分题</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onTouchEnd={this.showNormal}>
							<span className="icon-bg changyong border">
								<i className="icon icon-chevron-down"></i>
							</span>
                            <span className="question-name">常用问题</span>
                        </a>
                    </li>
                </ul>
                <div className="common-content">
                    <ul className="common">
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"sex")}>
								<span className="common-icon-bg">
									<i className="icon icon-gender"></i>
								</span>
                                <span className="question-name">性别</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"age")}>
								<span className="common-icon-bg">
									<i className="icon icon-birthday-cake"></i>
								</span>
                                <span className="question-name">年龄</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"address")}>
								<span className="common-icon-bg">
									<i className="icon icon-map-marker"></i>
								</span>
                                <span className="question-name">所在地</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"phone")}>
								<span className="common-icon-bg">
									<i className="icon icon-phone"></i>
								</span>
                                <span className="question-name">电话</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"idcard")}>
								<span className="common-icon-bg">
									<i className="icon icon-id"></i>
								</span>
                                <span className="question-name">身份证</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"profession")}>
								<span className="common-icon-bg">
									<i className="icon icon-briefcase"></i>
								</span>
                                <span className="question-name">职业</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"income")}>
								<span className="common-icon-bg">
									<i className="icon icon-income"></i>
								</span>
                                <span className="question-name">收入</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" onTouchEnd={this.addnormal.bind(this,"marriage")}>
								<span className="common-icon-bg">
									<i className="icon icon-marriage"></i>
								</span>
                                <span className="question-name">婚姻</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <a href="javascript:void(0);" className="btn cancel" onTouchEnd={this.cancel}>取消</a>
            </div>
        );
    }
})