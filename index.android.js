import React, { Component ,PureComponent,PropTypes} from 'react';
import {
    AppRegistry,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    StyleSheet,
    Platform,
    Dimensions,
    Image,
    ScrollView,
    AsyncStorage
} from 'react-native';

let {width,height}=Dimensions.get("window");
import MListview from './view/MListview'

class HomeView extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render(){
        return(<View style={styles.container}>
                <MListview></MListview>
            </View>
            )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    slide:{
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    headerLine:{
        flexDirection:'row',
        height:30,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white'
    },
    headerTitleText:{
        marginLeft:5
    },
    headerMoreText:{
        left:null,
        right:20,
    },
    image:{
        width:width,
        height:300,
    },
    banner:{
        width:width,
        height:width/3,
        marginTop:10,
        marginBottom:10,
    },
    imageItem:{
        width:width/3,
        height:width/3,
        margin:2,
    },
    paginationStyle:{
        bottom:8,
        left:null,
        right: 10
    },
    scroll:{
        height:width/3-10,
        backgroundColor:'white',
    }
});

AppRegistry.registerComponent('test', ()=>HomeView);