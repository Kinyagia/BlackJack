import React,{ Component } from 'react';
import axios from 'axios';
import './App.css';

const PATH_BASE= 'https://deckofcardsapi.com/api/deck/';
const PATH_NEW= '/new';
const PATH_SHUFFLE= '/shuffle/';
const PATH_DRAW='/draw/';
const PATH_DECK_COUNT='?deck_count=6';
const PATH_COUNT='?count=312';



class App extends Component {
  constructor (props){
    super(props);
    this.state= {
      cards:[], 
      playerHand:[],
      dealerHand:[],
      playerScore: 0,
      dealerScore: 0,
      currentAccount: 1000,
      betSize:0, 
    };  
    this.playerHit = this.playerHit.bind(this);
    this.dealerHit = this.dealerHit.bind(this);
    this.playerStand = this.playerStand.bind(this);
    this.placeBet = this.placeBet.bind(this);
    this.clearArray = this.clearArray.bind(this);

  }

  componentDidMount() {
    axios(`${PATH_BASE}${PATH_NEW}${PATH_SHUFFLE}${PATH_DECK_COUNT}`)
      .then(response => { const id= response.data.deck_id;
      axios(`${PATH_BASE}${id}${PATH_DRAW}${PATH_COUNT}`)
        .then(response => response.data.cards.map(result => (
          
         {
           value: result.value,
           image: result.image,
           code:  result.code
          })))   
        .then (newData => {
          for (let i = 0; i<newData.length; i++){
            if (newData[i].value != "KING" && newData[i].value != "QUEEN" && newData[i].value != "JACK" && newData[i].value != "ACE"){
              newData[i].value = parseInt(newData[i].value);
            }  
            else if (newData[i].value == "ACE") {
               newData[i].value = 11;  
            }
            else newData[i].value = 10;
          }  
          const changedData = newData 
          this.setState({cards: changedData, store: newData})})
        .catch(error => this.setState({error})
        );
      })
  }
  
  playerHit(){
    while(this.state.playerScore < 21){
    const cards = [...this.state.cards];
    const rmvCard =  cards.splice(1,1);
    const playerHand = [...this.state.playerHand,...rmvCard];
    
    const hand = playerHand.map(item => {
      return item.value;
    });
    let score = this.checkScore(hand);
    this.setState({
      cards: cards,
      playerHand: playerHand,
      playerScore: score
    })
      break;
    }
    
    if(this.state.playerScore>21){ 
      this.setState({ betSize: 0})
      this.clearArray();
    }
  }
 
  dealerHit(){
    const cards = [...this.state.cards];
    const rmvCard =  cards.splice(1,1);
    const dealerHand = [...this.state.dealerHand,...rmvCard];
    const hand = dealerHand.map(item => {
      return item.value;
    });

    let score = this.checkScore(hand);
    this.setState({
      cards: cards,
      dealerHand: dealerHand,
      dealerScore: score
    })
  }

  checkScore = hand => {
    let score = hand.reduce(function(total, num) {
      return total + num;
    }, 0);
    if (score > 21) {
      hand.forEach(function(item) {
        if (item === 11) {
          score -= 10;
        }
      });
    }
    return score;
  };
  
  playerStand () {
    while(this.state.dealerScore <= 16){
      this.dealerHit()
        break;
     
    };
    if(this.state.playerScore>21){ 
      this.setState({ betSize: 0})
      this.clearArray();
    }else if(this.state.dealerScore>21){ 
      this.setState({ currentAccount: this.state.currentAccount + this.state.betSize*2})
      this.clearArray();
    }else if(this.state.dealerScore>=17 && this.state.playerScore > this.state.dealerScore){
      this.setState({ currentAccount: this.state.currentAccount + this.state.betSize*2})
      this.clearArray();
    }else if (this.state.dealerScore>=17 && this.state.playerScore == this.state.dealerScore){
      this.setState({ currentAccount: this.state.currentAccount + this.state.betSize})
      this.clearArray();
    }else if (this.state.dealerScore>=17 && this.state.playerScore < this.state.dealerScore){
      this.setState({ betSize: 0})
      this.clearArray();
    }
    
  }
  placeBet(){
    this.setState({
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0 
    });
    this.setState({
     currentAccount: this.state.currentAccount-100,
     betSize: this.state.betSize+100
    });
  }  
  clearArray(){
    this.setState({
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0, 
      betSize: 0
    });
  }
  render () {
   const { playerHand, playerScore, dealerHand, dealerScore} = this.state;
    return (
       <div> 
       
       <div className="box">
         {dealerHand.map(dealerCard =>  
           <div key={dealerCard.code} className="card"> 
             <img src={dealerCard.image}/>
           </div>
         )}
         <div className="end">
           <p>Dealer </p>
           <p>DealerScore: {dealerScore} </p> 
           <button onClick={this.playerStand}>Deal</button> 
         </div> 
       </div>
       <div className="box"> 
         {playerHand.map(playerCard => 
           <div key={playerCard.code} className="card"> 
             <img src={playerCard.image}/>
           </div>
          )}
         <div className="end">
           <p>Player </p>
           <div>
             <p>Account: $ {this.state.currentAccount}</p>
             <p>Bet placed: $ {this.state.betSize}</p>
             <button onClick={this.placeBet} >
              100$ chip
             </button>
           </div>
           <p>PlayerScore {playerScore}</p> 
           <button onClick={this.playerHit}>playerHit</button> 
           <button onClick={this.playerStand}>PlayerStand</button> 
         </div> 
       </div>
      </div>
    );
  }
}


 
export default App;













