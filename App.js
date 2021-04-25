import React from 'react';
import { Alert, StyleSheet, ActivityIndicator, Text, View, ScrollView, Button, TouchableHighlight, TouchableOpacity , TouchableNativeFeedback, AppState, RefreshControl} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Icon from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen';
// import MissingCaFetch from './MissingCaFetch';

const cheerio = require('react-native-cheerio');

class ChangeDisplayButton extends React.Component {
  constructor(props){
    super(props);
    // this.state={toggleDisplayChangeFlag: true}
  }
  render(){
    let value = this.props.Entry;
    return (
        <TouchableHighlight style={{paddingLeft: 9}} onPress={this.props.displayChangeButtonPressed} underlayColor= 'transparent'>
          <View style={[styles.button, {backgroundColor: (value[0])>=0 ? '#5ae224':'#c10141'}]}>
            <Text style={styles.buttonText}>{this.props.toggleDisplayChangeFlag ? ((value[0])>0 ? '+'+(value[0]) : value[0]) : (value[1]>=0 ? '+'+value[1]+'%' : value[1]+'%')}</Text>
          </View>
        </TouchableHighlight>
    )
  }
}

class CommodityEntry extends React.PureComponent {
  // constructor(props){
  //   super(props);
  //   // state: Color of this entry
  //   this.state={isSelected: false}
  // }
  // handleEntryPress2=(index)=>{
  //   this.setState({isSelected: true})
  // }
  // componentWillMount(){
  //   console.log("what the hell is this: "+ this.props.selectedCommodityIndex + this.props.index);
  //   console.log("I am in componentDidMount of CommodityEntry: "+ this.props.selectedCommodityIndex===this.props.index)
  //   this.setState({isSelected: this.props.selectedCommodityIndex===this.props.index?true:false})
  // }
  render(){
    // console.log("Index of entry Selected is: "+this.props.index + " So: "+this.props.isSelected);
    let entry = this.props.value;
    let priceArr = this.props.value[3] ? this.props.value[3].trim().split(" ").filter(elem => elem !== "") : [];
    // console.log("==============>       :::: ", this.props.value);
    // console.log(priceArr);
    let ltp = priceArr[1];
    let high = priceArr[2];
    let low = priceArr[0];
    let changeDisplayEntry = [Number(entry[5]), Number(entry[6])]
    return (
        //  <View style={(this.props.index!=this.props.selectedCommodityIndex)?styles.stockEntry:styles.selectedStockEntry}>
        <TouchableHighlight useForeground={true} onPress={()=>{this.props.handleEntryPress(this.props.index)}} underlayColor= '#293242'>
          {/* <View style={(this.props.index!=this.props.selectedCommodityIndex)?styles.stockEntry:styles.selectedStockEntry}> */}
          <View style={!this.props.isSelected?styles.stockEntry:styles.selectedStockEntry}>
            <View>
              <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6, fontSize: 15}}>
                {this.props.value[0] + " "}
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', paddingLeft: 6}}>{this.props.value[1]}</Text>
            </View>


            <View style={styles.stockEntryRightPart} >

              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
                {Number(ltp).toFixed(2)}
              </Text>
              <ChangeDisplayButton displayChangeButtonPressed = {this.props.displayChangeButtonPressed} toggleDisplayChangeFlag={this.props.toggleDisplayChangeFlag} Entry={changeDisplayEntry} />

            </View>
          </View>
        </TouchableHighlight>
    )
  }
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      appState: AppState.currentState, internetStatus: true,
      commodity: [], selectedStock: [], selectedCommodityIndex: null,
      refreshing: false,
      toggleDisplayChangeFlag: true
    }
  }

  loadLiveFeed(){
    let url = "https://ncdex.com/market-watch/live_quotes";
    // MissingCaFetch.fetch(html=>{
    fetch(url, { }).then(res => res.text() )
        .then(html => {
          console.log("I am in this magical function>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
          const $= cheerio.load(html, {
            xml: {
              normalizeWhitespace: true,
            }
          });

          let newData = 0;
          newData = $('tbody').html();
          // console.log(newData);

          let newerData = 0;
          newerData = $('tr', newData);

          let dataArray=[];
          newerData.each(function (i, el){
            let entryArr = []
            $('td', this).each(function (ind, innerElem){
              entryArr.push($(this).text().trim());
            })
            dataArray.push(entryArr);
          })

          dataArray.sort(function (a, b){
            let x = a[0] ? a[0].toLowerCase() : " ";
            let y = b[0] ? b[0].toLowerCase() : " ";
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
          });
          this.setState({commodity: dataArray}, ()=>{
            this.setState({refreshing: false});
          });

          //************************************************************************************************************************ */

          // var info2 = $('.altItemcolor').text().trim().replace(/\s\s+/g, ',')
          // var dataArray2 = info2.split(",");
          // var temp=[];
          // var tempdata=[]
          // for(index=0; index<dataArray2.length; index++){
          //  temp[index%15] = dataArray2[index];
          //  if(index%15 == 14){
          //    tempdata.push(temp);
          //    temp= [null];
          //  }
          // }

          //************************************************************* */
          // tempdata.forEach(elem=>{
          //   console.log(elem[0]);
          // })
          // console.log("---------------------------------------------------------------------------------------------")
        })
  }

  handleEntryPress=(index)=>{

    // console.log("Entry number this is pressed: "+ index + this.state.commodity[index]);

    this.setState({selectedStock: this.state.commodity[index], selectedCommodityIndex: index})
    // this.setState({isSelected: true})
    //  this.setState({selectedStock: this.state.commodity[index]});
    // -------->
    // this.setState({selectedCommodityIndex: index});
    // var temp = [];
    // for(i=0;i<this.state.selectedCommodityInfoArray.length;i++){
    //   if(i===index){
    //     temp[index]=true;
    //   }else {
    //     temp[i] = false ;
    //   }
    // }

    // this.setState({selectedCommodityInfoArray: temp})

    // Alert.alert("Entry number this is pressed:" + index + this.state.commodity[index]);
  }

  onSwipeDown(gestureState) {
    // console.log('You swiped down!');
    this.setState({selectedCommodityIndex: null, selectedStock: []})
  }

  _onRefresh = ()=>{
    //     this.setState({refreshing: true});
    //     this._onPressButton();
  }

  recurringLoading = ()=>{
    console.log("I am recurringLoading ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    if(this.state.appState==='active' && this.state.internetStatus){
      console.log(" Yeah I am being called!!!!!!!!!!--------------------------------------------------")
      console.log("Our appState is :"+ this.state.appState + "^^^^^" + "internetStatus is: " +this.state.internetStatus);
      this.loadLiveFeed();
    }
  }

  handleConnectivityChange = (connectionInfo)=>{
      console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    if(connectionInfo.type != "none"){
      // console.log("------------------" + connectionInfo.type)
      this.setState({internetStatus: true}, ()=>{
        this.recurringLoading();
      });
      // this.recurringLoading();
    }else {
      this.setState({internetStatus: false});
    }
  }

  _handleAppStateChange = (nextAppState)=>{
    //  console.log("_handleAppStateChange is called: "+nextAppState);
    //  console.log("this.state.appState: "+this.state.appState)
    //  var bool1 = this.state.appState==='background';
    //  var bool2 = nextAppState === 'active'
    //  console.log(bool1);
    //  console.log("bdkjbsk" + bool2)

    // if (this.state.appState==='background' && nextAppState === 'active') {
    //   console.log('App has come to the foreground!')
    //   this.setState({appState: nextAppState}, ()=>{
    //     // console.log(this.state.appState);
    //     this.recurringLoading();
    //   });
    // }
    this.setState({appState: nextAppState}, ()=>{
      this.recurringLoading();
    });
  }

  componentDidMount(){
    // SplashScreen.hide();
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.addEventListener(
        this.handleConnectivityChange
    );
    NetInfo.fetch().then(state => {
      console.log('First, is ' + (state.isConnected ? 'online' : 'offline'));
      if(state.isConnected){
        this.setState({internetStatus: true});
      }else {
        this.setState({internetStatus: false});
      }
    });
    // this.loadLiveFeed();
    //  console.log("State of the app is: ------------------------->"+AppState.currentState);
    setInterval(this.recurringLoading, 5000)

    // this.recurringLoading();
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.loadLiveFeed();
  }

  displayChangeButtonPressed = () => {
    this.setState({toggleDisplayChangeFlag: !this.state.toggleDisplayChangeFlag})
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    // console.log("===========================================> "+this.state.commodity);
    let bool = this.state.commodity.length;
    return (
        <View style={styles.container}>

          {

            function(){

              if(bool){
                return (
                    <View style={styles.stockBasket}>
                      <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                      }>
                        {
                          this.state.commodity.map(function(value,index){
                            //   console.log("--------------------------------------------------------------------------------------------------- : "+index + " "+value[0]);
                            if(value){
                              return (
                                  <CommodityEntry displayChangeButtonPressed={this.displayChangeButtonPressed} toggleDisplayChangeFlag={this.state.toggleDisplayChangeFlag}  value={value} isSelected={this.state.selectedCommodityIndex==index?true:false } handleEntryPress={this.handleEntryPress} index={index} key={index}/>
                              )
                            }



                          }.bind(this))

                        }
                      </ScrollView>
                    </View>
                )
              } else {
                if(this.state.internetStatus){
                  return (
                      <View style={ {flex: 1, backgroundColor: '#02091A', justifyContent: 'center', alignItems: 'center'} }>
                        <Text style={{color: '#fff'}}>Loading... Please wait!</Text>
                        <ActivityIndicator size="large" color="#00ff00" />
                      </View>
                  )
                }else {
                  return(
                      <View style={ {flex: 1, backgroundColor: '#02091A', justifyContent: 'center', alignItems: 'center'} }>
                        <Text style={{color: '#fff', fontSize: 18}}>No or Bad Internet!</Text>
                        <Text style={{color: '#fff'}}>Please check your Connection and try again!</Text>
                      </View>
                  )

                }

              }
            }.bind(this)()

          }

          {/* <View> */}


          {


            function(){
              if(this.state.selectedStock.length){
                let priceArr = this.state.selectedStock[3] ? this.state.selectedStock[3].trim().split(" ").filter(elem => elem !== "") : [];
                let ltp = priceArr[1];
                let high = priceArr[2];
                let low = priceArr[0];
                let spotDateTimeArr = this.state.selectedStock[9] ? this.state.selectedStock[9].split(" | ") : [];
                let spotDate = spotDateTimeArr[0] + " " + spotDateTimeArr[1];
                return (
                    <GestureRecognizer
                        // onSwipe={(direction, state) => this.onSwipe(direction, state)}
                        onSwipeDown={(state) => this.onSwipeDown(state)}
                        config={config}
                        style={{
                          flex: 2,
                        }}
                    >
                      {/* <Text> {this.state.selectedStock[0]}</Text> */}
                      <View style={styles.selectedStockInfo}>
                        {/* <View style={styles.infoAreaSingleRow}><View style={styles.infoAreaSingleItem}><Text> {this.state.selectedStock[0]}</Text></View></View> */}
                        <View style={{borderBottomWidth: 1, alignItems: 'center', borderTopWidth: 2, borderTopColor: 'rgb(183, 168, 168)', borderBottomColor: 'rgb(183, 168, 168)'}}>
                          <Icon name="angle-down" backgroundColor= '#fff' size={30} color="#f9f4f4" />
                          <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18}}>{this.state.selectedStock[0]}</Text>
                          <Text style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[1]}</Text>
                        </View>
                        <View style={styles.infoAreaSingleRow} >
                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1', paddingLeft: 6}}>OPEN</Text>
                            <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[2]}</Text>
                          </View>

                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1'}}>SPOT PRICE</Text>
                            <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[8]}</Text>
                          </View>

                        </View>

                        <View style={styles.infoAreaSingleRow} >
                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1', paddingLeft: 6}}>HIGH</Text>
                            <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{high}</Text>
                          </View>

                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1'}}>SPOT DT.</Text>
                            <Text adjustsFontSizeToFit={true} style={{fontSize: 8, width: 60, color: '#fff', fontWeight: 'bold', marginRight: 6 }}>{spotDate}</Text>
                          </View>

                        </View>

                        <View style={styles.infoAreaSingleRow} >
                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1', paddingLeft: 6}}>LOW</Text>
                            <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{low}</Text>
                          </View>

                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1'}}>BEST BUY</Text>
                            <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[10]}</Text>
                          </View>

                        </View>

                        <View style={styles.infoAreaSingleRow} >
                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1', paddingLeft: 6}}>CLOSE</Text>
                            <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[4]}</Text>
                          </View>

                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1'}}>BEST SELL</Text>
                            <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[11]}</Text>
                          </View>

                        </View>
                        <View style={styles.infoAreaSingleRow} >
                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1', paddingLeft: 6}}>AV TP.</Text>
                            <Text style={{marginRight: 15, color: '#fff', fontWeight: 'bold'}}>{this.state.selectedStock[7]}</Text>
                          </View>

                          <View style={styles.infoAreaSingleItem}>
                            <Text style={{color: '#c8cbd1'}}>OPEN INT.</Text>
                            <Text style={{color: '#fff', fontWeight: 'bold', marginRight: 6}}>{this.state.selectedStock[12]}</Text>
                          </View>

                        </View>
                      </View>
                    </GestureRecognizer>
                )
              }else {
                return <Text>----</Text>
              }

            }.bind(this)()


          }


        </View>
        //  </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02091A',
    // marginTop: 20,
  },
  stockBasket: {
    flex: 3,
    backgroundColor: '#02091A',
    // backgroundColor: '#fff',

    // Color: '#fff'
    // borderWidth: 5
  },
  stockEntry: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(183, 168, 168)',
    marginTop: 4,
    // borderWidth: 5
  },
  selectedStockEntry: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(183, 168, 168)',
    // marginTop: 4,
    backgroundColor: '#293242'
  },
  selectedStockInfo: {
    flex: 2,
    backgroundColor: '#293242',
    // backgroundColor: '#EEEFF6',
  },
  stockEntryRightPart: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  button: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#5ae224',
    marginRight: 6,
    borderRadius: 5
  },
  buttonText: {
    padding: 2,
    color: 'white',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoAreaSingleRow: {
    flex: 1,
    flexDirection: 'row',
    //  justifyContent: 'space-between',
    //  height: 20,
    //  borderWidth: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(183, 168, 168)'
    //  alignItems: 'center'
  },
  infoAreaSingleItem: {
    flex: 1,
    flexDirection: 'row',
    //  borderRightWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
