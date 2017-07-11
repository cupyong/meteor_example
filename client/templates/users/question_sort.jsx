/**
 * Created by oopsdata1 on 16-1-19.
 */
 SortQuestions = React.createClass({
    getInitialState:function(){
        var questionlist = get_question_list(this.props.questionaire._id)
        return({starty:0,offy:0,domstarty:0,halfheight:0,gap:0,topest:0,lowest:0,k:0,question_list:questionlist})
    },
    componentDidMount:function(){
        var height;
        var fa = this;
        this.state.topest = $(".op-edited:first").position().top;
        this.state.lowest = $(".op-edited:last").position().top;
        if ($(".op-edited").length>1){
            this.state.gap = $(".op-edited:nth-child(2)").position().top-$(".op-edited:nth-child(1)").position().top;
        }
        var j=0;
        $(".op-edited").each(function(){
            this.number=j;
            this.id=fa.state.question_list[j]._id;
            j++;
            $(this).height($(this).height());
            $(this).width($(this).width());
            height=$(this).height();
            $(this).css("top",$(this).position().top);
        });
        $("#lastdiv").css("top",$("#lastdiv").position().top);
        this.state.halfheight=parseInt(height)/2;
        $(".op-edited").each(function(){
            $(this).css("position","absolute");
        });
        console.log(11);

        $("#lastdiv").css("position","absolute");
        $("#lastdiv").css("height","50px");
        $("#lastdiv").css("width","50px");
        $(".drag-icon").each(function(){
            touch.on(this,"touchstart",function(e){
                var odiv=$(e.currentTarget).parent().parent()[0];
                e.preventDefault();
                fa.state.k = odiv.number;
                odiv.style.zIndex=99;
                $(odiv).addClass("active");
                fa.state.starty=e.touches[0].clientY;
                fa.state.domstarty=$(odiv).position().top;
            });
            touch.on(this,"drag",function(e){
                var odiv=$(e.currentTarget).parent().parent()[0];
                fa.state.offy = e.position.y;
                var newtop=fa.state.domstarty+fa.state.offy;
                if (newtop<fa.state.topest || newtop>fa.state.lowest) return;
                odiv.style.top=newtop+"px";
                $(".op-edited").each(function(){//碰撞检测
                    if (odiv !== $(this)[0]){
                        console.log("number:",odiv.number,"k",fa.state.k);
                        if (this.number<fa.state.k){//上方元素
                            if (newtop-$(this).position().top<fa.state.halfheight){//重叠面积大于1/2
                                //下移一格
                                this.number++;fa.state.k--;
                                $(this).css("top",this.number*fa.state.gap+fa.state.topest+"px");
                            }
                        }else{//下方元素
                            if ($(this).position().top-newtop<fa.state.halfheight){//重叠面积大于1/2
                                //上移一格
                                this.number--;fa.state.k++;
                                $(this).css("top",this.number*fa.state.gap+fa.state.topest+"px");
                            }
                        }
                    }
                });//碰撞检测结束
                $(odiv).children("span").text(fa.state.k);
            });
            touch.on(this,"touchend",function(e){
                odiv=$(e.currentTarget).parent().parent()[0];
                odiv.style.top=fa.state.k*fa.state.gap+fa.state.topest+"px";
                odiv.number=fa.state.k;
                fa.state.starty=0;
                fa.state.offy=0;
                fa.state.domstarty=0;
                odiv.style.zIndex="auto";
                $(odiv).removeClass("active");
            });
        });
    },
    complete:function(){

        var sorted=[];
        sorted.length=this.state.question_list.length;
        $(".op-edited").each(function(){
            sorted[this.number]=this.id;
        });
        var fa=this;
        var questionnaire={sort_questions:sorted}
        Meteor.call("update_questionnaire",this.props.questionaire._id,questionnaire,function(error , result){

                if (error)
                    return throwError(error.reason);
                if(result){
                    //Router.go('myquestionlist',
                    //    {
                    //        _id: fa.props.questionaire._id
                    //    });
                    //Session.set("questionnaire",1)
                    Router.go('publishquestionnaire',
                        {
                            _id: fa.props.questionaire._id
                        });

                }
        });
        //$.putJSON("/villi/questionaires/resort",sorted,function(data){
        //    console.log(data);
        //    window.questionaire=data.value.survey;
        //    window.questions=data.value.questions;
        //    fa.props.setnow(1);
        //});
    },
    cancel:function(){
        //Router.go('myquestionlist',
        //    {
        //        _id: this.props.questionaire._id
        //    });
        //Session.set("questionnaire",1)
        Router.go('publishquestionnaire',
            {
                _id: this.props.questionaire._id
            });

    },
    render:function(){
        var fa = this;
        return(
            <div className="container">
                <EditedHeader  questionaire={this.props.questionaire} setnow={this.callBackState} left={""} right={""} />
                <h3 className="notice green">
                    按住拖拽以调整位置
                </h3>
                <div className="content" id="contentlist">
                    {
                        (function(){
                            var questions=[];


                            for (var i = 0; i < fa.state.question_list.length; i++){
                                questions.push(
                                    <div className="op-edited drag">
                                        <div className="q-name">
                                            <b>{i+1}</b>
                                            <span className="title">{fa.state.question_list[i].title}</span>
                                            <span className="drag-icon"><i className="fa fa-bars"></i></span>
                                        </div>
                                        <span className="dn">{i}</span>
                                    </div>
                                )
                            }
                            return questions;
                        })()
                    }
                    <div id="lastdiv" >

                    </div>
                </div>

                <div className="bottom-option">
                    <div className="shadow"></div>
                    <a  onTouchEnd={this.complete} className="submit r">排序完成</a>
                    <a  onTouchEnd={this.cancel} className="cancel l">取消</a>
                </div>
            </div>
        );
    }
});
