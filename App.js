import React from 'react';
import { StyleSheet, View, Button,Text, Alert, TouchableOpacity, BackHandler} from 'react-native';
import { MaterialCommunityIcons as Icon } from 'react-native-vector-icons';
import Modal from "react-native-modal";

export default class App extends React.Component {
  //Mekanik ve UI kısmı
  constructor(props) {
    super(props);

    this.state = {//Here We find out whose turn to play.
      gameState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      currentPlayer: 1,
      playerOneScore: 0,
      playerTwoScore: 0,
      draws:0,
      isScoreModalVisible: false
    }
  }

  componentDidMount() {
    this.initializeGame(); //This is the part that we start the game
  }

  initializeGame = () => {
    this.setState({
      gameState:
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ],
      currentPlayer: 1,
    });
    this.resetScore = this.resetScore.bind(this);
  }

  //Returns 1, if Player 1 won -1 if Player 2 won or a 0 if no one has won.
  getWinner = () => {
    const NUM_TILES = 3;
    var arr = this.state.gameState;
    var sum;
    let countBlanks=0;
    //Check rows 
    for (var i = 0; i < NUM_TILES; i++) {
      sum = arr[i][0] + arr[i][1] + arr[i][2];
        if (sum == 3) { 
          return 1; 
        }
        else if (sum == -3) { 
          return -1; 
        }
        else if (sum == ""){
          countBlanks++;
        }

    }
    //Check columns
    for (var i = 0; i < NUM_TILES; i++) {
      /Burada ise tictocta hangi bolgelerde dogru olabilir, onu buluyoruz
      sum = arr[0][i] + arr[1][i] + arr[2][i];
        if (sum == 3) { 
          return 1; 
        }
        else if (sum == -3) { 
          return -1; 
        }
        else if (sum == ""){
          countBlanks++;
        }
    }
    
    //Check the diagonals..0,0 ve 1,1  ve 2,2 olan kisimlarda X X X veya 0 0 0  olma durumu
    sum = arr[0][0] + arr[1][1] + arr[2][2];      
      if (sum == 3) { 
        return 1; 
      }
      else if (sum == -3) { 
        return -1; 
      }

    sum = arr[2][0] + arr[1][1] + arr[0][2];     
      if (sum == 3) { 
        return 1; 
      }
      else if (sum == -3) {
        return -1; 
      }
    //There are no winners.. 
    if(countBlanks==0){
      this.setState(prevState => ({
        gameState :  [["","",""], ["","",""], ["","",""]],
        draws: prevState.draws + 1
      }));
      Alert.alert("Game resulted in a Draw!");
      return 0;
    }
  }

  onTilePress = (row, col) => {
    // Dont allow tiles to change Kutuda X olustu tekrar tikladigimizda O olmasin
    var value = this.state.gameState[row][col];
      if (value != 0) {
        //Yani X degerimiz veya O degerimiz sifira esitse sabit olacak
        return;
      }

    //Grab current player
    var currentPlayer = this.state.currentPlayer;

    //Set the correct tile
    var arr = this.state.gameState.slice();
    arr[row][col] = currentPlayer;
    this.setState({ gameState: arr });

    //Switch to other player...
    var nextPlayer = (currentPlayer == 1) ? -1 : 1;
    this.setState({ currentPlayer: nextPlayer });

    //Check for winners.
    var winner = this.getWinner();

    if (winner == 1) {
      this.setState( prevState => ({
        //Ilk once arttirma yaptiktan sonra  yazdiricaz 
        playerOneScore: prevState.playerOneScore + 1  
      }));
      Alert.alert("Winner is Player 1 !!");                       
      this.initializeGame();   //Oyunu tekrardan baslatma
    }
    else if (winner == -1) {
      this.setState( prevState => ({
        playerTwoScore: prevState.playerTwoScore + 1
      }));
      Alert.alert("Winner is Player 2 !! ");
      this.initializeGame();
    }
  }

  onNewGamePress = () => {             
    this.initializeGame();
  }

  renderIcon = (row, col) => {
    var value = this.state.gameState[row][col];
    switch (value) {
      case 1: return <Icon name="close" style={styles.tileX} />;   
      case -1: return <Icon name="circle-outline" style={styles.tileO} />;
      default: return <View />;
    }
  }
  
  resetScore = function(){
    this.setState({
      getState :  [[0,0,0], 
                   [0,0,0], 
                   [0,0,0]],
      playerOneScore: 0,
      playerTwoScore: 0,
      draws:0,
      isScoreModalVisible: true
    });
  }

  exit_function = () =>{
    BackHandler.exitApp();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row',marginLeft: 5}}>
          <Text style={{color: '#00AF89', fontSize: 35, marginTop: 50, marginRight: 10}}>X = </Text>
          <Text style={{color: 'white', fontSize: 35, marginTop: 50, marginRight: 100}}>{this.state.playerOneScore}</Text>
          <Text style={{color: '#00AF89', fontSize: 35, marginTop: 50, marginLeft: 10}}>O =</Text>
          <Text style={{color: 'white', fontSize: 35, marginTop: 50, marginLeft:10}}>{this.state.playerTwoScore}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop:50, justifyContent: "center" }}>
          <TouchableOpacity onPress={() => this.onTilePress(0, 0)} style={[styles.tile, { borderLeftWidth: 0, borderTopWidth: 0 }]}>
            {this.renderIcon(0, 0)}    
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTilePress(0, 1)} style={[styles.tile, { borderTopWidth: 0 }]}>
            {this.renderIcon(0, 1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTilePress(0, 2)} style={[styles.tile, { borderRightWidth: 0, borderTopWidth: 0 }]}>
            {this.renderIcon(0, 2)}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => this.onTilePress(1, 0)} style={[styles.tile, { borderLeftWidth: 0, borderTopWidth:0}]}>
            {this.renderIcon(1, 0)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTilePress(1, 1)} style={[styles.tile, {}]}>
            {this.renderIcon(1, 1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTilePress(1, 2)} style={[styles.tile, { borderRightWidth: 0, }]}>
            {this.renderIcon(1, 2)}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => this.onTilePress(2, 0)} style={[styles.tile, { borderBottomWidth: 0, borderLeftWidth: 0 }]}>
            {this.renderIcon(2, 0)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTilePress(2, 1)} style={[styles.tile, { borderBottomWidth: 0, }]}>
            {this.renderIcon(2, 1)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onTilePress(2, 2)} style={[styles.tile, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
            {this.renderIcon(2, 2)}
          </TouchableOpacity>
        </View>

        <View style={styles.scorebar}>
          <TouchableOpacity style={{ height: 100, marginTop:50, width:300}}>
            <Button
                  onPress={() => this.setState({ isScoreModalVisible: true })}
                  title="Reset Score"
                  color="#00AF89"
                />
          </TouchableOpacity>
        </View>

        <View style={styles.scorebar}>
          <TouchableOpacity style={{ height: 100, marginTop: 60, width:300}}>
            <Button 
                  onPress={this.onNewGamePress} 
                  title="Reset"
                  />
          </TouchableOpacity>
        </View>

        <View style={styles.scorebar}>
          <TouchableOpacity style={{ color: 'red', height: 100, marginTop:70, width:300}}>
            <Button 
                  onPress={this.exit_function} 
                  title="Exit" 
                  color ="red" 
                  />
          </TouchableOpacity>
        </View>

        <View style={{flex:3, flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
          <Text style={{color: '#ffcc00', fontSize: 30, marginTop: 120}}> # Draws = </Text>
          <Text style={{color: 'white', fontSize: 30, marginTop: 120}}>{this.state.draws}</Text>
        </View>

        <View style={{flex:3, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: '#ffcc00', fontSize: 30}}> # FUAT KARA  # </Text>
        </View>

        <Modal isVisible={this.state.isScoreModalVisible}
              onBackdropPress={() => this.setState({ isScoreModalVisible: false })}
              animationIn={'slideInLeft'}       //Reset tusuna bastigimizda yazi soldan gelicek saga gidicek 
              animationOut={'slideOutRight'}
              backdropColor={'#00000033'}
              backdropOpacity={0.5}>
          <View style={{ flex: 5, justifyContent:'center', alignItems: 'center' }}>
            <View style={{flex:2}}>
            </View>
            <View style={{flex:1, margin:25, padding:20, backgroundColor:'white', justifyContent:'center', alignItems: 'center', borderRadius: 10, elevation: 4}}>
              <Text>Are you sure you want to Reset the Score and the Board?</Text>
              <View style={{flexDirection: 'row', justifyContent:'flex-end', marginTop:10}}>
                <TouchableOpacity onPress={() => this.resetScore()} style={styles.modalButtons}>
                  <Text style={{color: 'white'}}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ isScoreModalVisible: false })} style={styles.modalButtons}>
                  <Text style={{color: 'white'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>
    </View>
    );
  }
}  
//Min max theoremi

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', //'#ff8080',
    alignItems: 'center', // x ekseninde ortaliyor.
    justifyContent: 'center', // y ekseninde ortaliyor
  },

  modalButtons: {
    backgroundColor: '#00AF89',
    borderRadius:5,
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:6,
    paddingRight:6,
    margin: 4
  },

  scorebar: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },

  tile: {
    borderWidth: 10,
    borderColor: '#fff',
    width: 100,
    height: 100,
  },

  tileX: {
    color: "yellow",
    fontSize: 60,
  },

  tileO: {
    color: "red",
    fontSize: 60, //Bu fontsize bize O veya X in buyuklugunu soyluyor.
  }, 

  button_container: {
    flexDirection: 'row',  //Tuslari yanyana koyar
  },

  modalButtons: {
    backgroundColor: '#00AF89',
    borderRadius:5,
    paddingTop:3,
    paddingBottom:3,
    paddingLeft:6,
    paddingRight:6,
    margin: 4
  }
  
});
