import React, { Component ,PropTypes} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Navigator,
    StyleSheet,
    Platform,
    Dimensions,
    Image,
    PanResponder,
    TextInput
} from 'react-native';
let {width} = Dimensions.get('window');
global.SCREEN_WIDTH = width;
var left_width = SCREEN_WIDTH;//在一次完整事件中左组件的宽度
var right_width = 0;//在一次完整事件中右组件的宽度
var x = 0;//移动时的位移 大于dx x = delete_width
var visible = false;//是否显示删除按钮
const dx = 50;//滑动大于这个距离 即显示删除按钮
var vx = 0;//水平滑动的速度
var item_height = 50;
var delete_width = 100;//删除按钮的宽度
/**
 自定义滑动item
 **/
export default class SlideItem extends Component{

    constructor(props){
        super(props);
        this.pre_hide = this.props.pre_hide;
        this.pre_id = this.props.pre_id;
        this.state={
            item:{
                opacity:1,
            },
            left:{
                width:SCREEN_WIDTH,
                height:item_height,
            },
            right:{
                width:0,
                height:item_height,
            },
        }
    }

    //用户开始触摸屏幕的时候，是否愿意成为响应者；
    onStartShouldSetPanResponder=(evt, gestureState)=>{
        return true;
    }

    //在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
    onMoveShouldSetPanResponder=(evt, gestureState)=>{
        return true ;
    }

    // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
    onPanResponderGrant=(evt, gestureState)=>{
        // console.log("begin")
        vx = gestureState.vx; //开始时速度为0
        this.pre_hide();/*隐藏之前显示的view*/
        console.log('begin vx:'+ vx);
        if(left_width<SCREEN_WIDTH){//只能向右面滑动
            visible = true;//组件是否显示
        }else{ //只能向左面滑动
            visible = false;
        }
        this.setState({
            item:{
                backgroundColor: 'blue',
                opacity:0.8,
            },
        });
    }
    // 最近一次的移动距离为gestureState.move{X,Y}
    onPanResponderMove=(evt, gestureState)=>{
        // console.log("move");
        if(!visible){//删除按钮不可见 只能向左滑动
            // console.log("向左滑动");
            if(gestureState.dx<0){//向左滑动
                x = Math.abs(gestureState.dx);//累计横向位移
                // console.log("x:" + x);
                if(x>=dx){
                    x=delete_width;//设置右边删除按钮的宽度
                }
                //实时更新
                this.setState({
                    left:{
                        width:SCREEN_WIDTH - x,
                        height:item_height,
                    },
                    right:{
                        width:0 + x,
                        height:item_height,
                    },
                });
            }
        }else{//删除按钮已经显示 只能向右滑动
            // console.log("向右滑动")
            if(gestureState.dx>0){//向右滑动
                x = gestureState.dx;//累计横向位移
                // console.log("x:" + x);
                if(x>=dx){
                    x=delete_width;
                }
                //实时更新
                this.setState({
                    left:{
                        width:left_width + x,
                        height:item_height,
                    },
                    right:{
                        width:right_width - x,
                        height:item_height,
                    },
                });
            }
        }
    }

    // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
    // 一般来说这意味着一个手势操作已经成功完成。
    onPanResponderEnd=(evt, gestureState)=>{
        vx = gestureState.vx;
        console.log('End vx:' + vx);
        vx = Math.abs(vx);
        console.log("width:",gestureState.dx);
        if(!visible){//当删除按钮没显示的时候
            if(x>=dx||vx>=1){//停止滑动后 如果大于dx或者水平移动速度大于2 则显示删除按钮
                this.setState({
                    item:{
                        backgroundColor:'#E8E8E8',
                        opacity:1,
                    },
                    left:{
                        width:SCREEN_WIDTH-x,
                        height:item_height,
                    },
                    right:{
                        width:0+ x,
                        height:item_height,
                    },
                });
                this.pre_id(this.props.id);
                left_width = SCREEN_WIDTH-x;
                right_width = x;
            }else{//停止滑动后 如果不大于dx则不显示删除按钮
                this.setState({
                    item:{
                        backgroundColor:'#E8E8E8',
                        opacity:1,
                    },
                    left:{
                        width:SCREEN_WIDTH,
                        height:item_height,
                    },
                    right:{
                        width:0,
                        height:item_height,
                    },
                });
                left_width = SCREEN_WIDTH;
                right_width = 0;
            }
        }else{//当删除按钮已经显示的时候
            if(gestureState.dx>=0){//已经显示删除按钮 向左滑动无效 只能向右滑动
                this.setState({
                    item:{
                        backgroundColor:'#E8E8E8',
                        opacity:1,
                    },
                    left:{
                        width:SCREEN_WIDTH,
                        height:item_height,
                    },
                    right:{
                        width:0,
                        height:item_height,
                    },
                });
                left_width = SCREEN_WIDTH;
                right_width = 0;
            }
        }
        x=0;//一次事件结束 位移清零
        console.log("screen_width",SCREEN_WIDTH);
        console.log("left_width:" + left_width);
        console.log("right_width",right_width);
    }

    //不释放 事件
    onResponderTerminationRequest=(evt)=>{
        return false;
    }

    //以外终止事件处理
    onResponderTerminate=(evt,gestureState)=>{
        // console.log("Terminate:");
        vx = gestureState.vx;
        console.log('Terminate vx:' + vx);
        if(!visible){//当删除按钮没显示的时候
            if(x>=dx||vx>=1){//停止滑动后 如果大于dx或者水平移动速度大于2 则显示删除按钮
                this.setState({
                    item:{
                        opacity:1,
                        backgroundColor:'#E8E8E8',
                    },
                    left:{
                        width:SCREEN_WIDTH-x,
                        height:item_height,
                    },
                    right:{
                        width:0+ x,
                        height:item_height,
                    },
                });
                this.pre_id(this.props.id);
                left_width = SCREEN_WIDTH-x;
                right_width = x;

            }else{//停止滑动后 如果不大于dx则不显示删除按钮
                this.setState({
                    item:{
                        opacity:1,
                        backgroundColor:'#E8E8E8',
                    },
                    left:{
                        width:SCREEN_WIDTH,
                        height:item_height,
                    },
                    right:{
                        width:0,
                        height:item_height,
                    },
                });
                left_width = SCREEN_WIDTH;
                right_width = 0;
            }
        }else{//当删除按钮已经显示的时候
            if(gestureState.dx>=0){//已经显示删除按钮 向左滑动无效 只能向右滑动
                this.setState({
                    item:{
                        opacity:1,
                        backgroundColor:'#E8E8E8',
                    },
                    left:{
                        width:SCREEN_WIDTH,
                        height:item_height,
                    },
                    right:{
                        width:0,
                        height:item_height,
                    },
                });
                left_width = SCREEN_WIDTH;
                right_width = 0;
            }
        }
        x=0;//一次事件结束 位移清零
    }

    componentWillMount(evt, gestureState){
        this._panResponder=PanResponder.create({
            onStartShouldSetPanResponder:this.onStartShouldSetPanResponder,//开始时询问是否成为响应者
            onMoveShouldSetPanResponder:this.onMoveShouldSetPanResponder,//滑动时询问是否成为响应者
            onPanResponderGrant:this.onPanResponderGrant,//已经成为响应者 类似于android中touch的down事件
            onPanResponderMove:this.onPanResponderMove,//类似于android中touch的move事件
            onPanResponderRelease:this.onPanResponderEnd,//类似于android中touch的up事件
            onPanResponderTerminate:this.onResponderTerminate,//意外终止 类似于android中touch的cancel事件
            onResponderTerminationRequest:this.onResponderTerminationRequest,//其他view想获得事件 是否释放事件
        });
    }

    /*删除item*/
    delete=()=>{
        this.setState({
            item:{/*高度置为0 不回去绘制组件*/
                height:0,
                marginBottom:0,
                marginTop:0,
            },
        });
    }

    /*将删除按钮隐藏*/
    hide=()=>{
        this.setState({
            left:{
                width:SCREEN_WIDTH,
                height:item_height,
            },
            right:{
                width:0,
                height:item_height,
            },
        });
        left_width = SCREEN_WIDTH;
        right_width = 0;
    }

    render(){
        let del = this.props.del;
        let id = this.props.id;
        let RowData = this.props.RowData;
        return(
            <View {...this._panResponder.panHandlers}
                  style={[styles.item,this.state.item]}>
                <View
                    style={[styles.left,this.state.left]}>
                    <View style={[{height:item_height,flex:1}]}>
                        <Text numberOfLines={1} style={[styles.text,{fontSize:18,position:'absolute', top:10}]}>
                            id:{RowData}
                        </Text>
                    </View>
                </View>
                {/*touch设置样式*/}
                <TouchableHighlight style={[styles.right,this.state.right]} onPress={()=>{del(id)}}>
                    <View style={[styles.right,this.state.right]}>{/*动态改变布局视图的属性view*/}
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles=StyleSheet.create({
    item:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width:SCREEN_WIDTH,
        height:item_height,
        marginBottom:5,
        marginTop:5,
        backgroundColor:'#E8E8E8',
    },
    left:{
        flexDirection:'row' ,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width:SCREEN_WIDTH,
        height:item_height,
    },
    right:{
        justifyContent: 'center',
        alignItems: 'center',
        width:0,
        height:item_height,
        backgroundColor:'red',


    },
    text:{
        fontWeight:'bold',
        fontSize:15,
    },
    image:{
        width:item_height,
        height:item_height,
        marginRight:10,
    }
});
