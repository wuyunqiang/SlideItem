/**
 * Created by xq on 16/10/18.
 */
import React, { Component ,PropTypes} from 'react';
import {
    TouchableHighlight,
    ScrollView,
    RefreshControl,
    ListView,
    InteractionManager,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    StyleSheet,
    Platform,
    Dimensions,
    Image,
    TextInput
} from 'react-native';

import SlideItem from './SlideItem';

var pageNum = 1;
export default class MListview extends Component{
    constructor(props) {
        super(props);
        this.data=[];
        this.reflist=[];
        this.pid = -1;//默认值
        const ds  =new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),
            isShowToTop: false,
            isReFresh: false,
            scrollEnable: true,
            hasIdOpen: false
        };
    }

    componentDidMount() {
        pageNum=1;
    }



    _listView() {
        /*
         * android，ios都使用原生下拉刷新组件：
         */
        return (
            <ListView
                style={styles.listview}
                dataSource={this.state.dataSource}
                renderRow={this.rowRender}
                onEndReachedThreshold = {10}
                ref="listview"/>
        );
    }

    render() {
        let listView = this._listView();
        return (
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>滑动删除列表</Text>
                </View>
                <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                    {listView}
                </View>
            </View>
        );
    }

    /*删除收藏item*/
    deleteItem=(inputId)=>{
        let len = this.reflist.length;
        for(let i=0;i<len;i++){
            let id=this.reflist[i].props.id;
            if(inputId==id){
                this.reflist[i].delete();
                // console.log("delete i: ",this.reflist[i].RowData);
            }
        }
    }

    /*根据id 隐藏前一个 显示*/
    pre_hide=()=>{
        let inputId = this.pid;
        let len = this.reflist.length;
        for(let i=0;i<len;i++){
            let id=this.reflist[i].props.id;
            if(inputId==id){
                console.log("delete i: ",i);
                this.reflist[i].hide();
            }
        }
        this.pid = -1;
    }

    /*隐藏前一个的id显示*/
    pre_id = (inputId)=>{
        this.pid=inputId;
    }

    rowRender=(data, a, b)=> {
        let id =b;
        console.log('id:' + id);
        return (
            <SlideItem
                ref={(component)=>{this.reflist.push(component)}}
                RowData = {data}
                id = {id}
                del = {this.deleteItem}
                pre_hide = {this.pre_hide}
                pre_id = {this.pre_id}>
            </SlideItem>
        );
    }

}

const styles = StyleSheet.create({
    listview:{
        flex: 1,
        width: SCREEN_WIDTH*0.95,
        backgroundColor: 'white'
    },
    header: {
        height : 50,
        paddingTop:15,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor : '#099fde'
    },
    headerText: {
        color: '#ffffff'
    },
    deletebtn: {
        flex: 1,
        width: 80,
        height: 74,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btntext: {
        color: '#ffffff'
    },
    deleteBut: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
