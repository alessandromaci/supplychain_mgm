import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {cost: 0, itemName: "", ean: 0, loaded:false};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      this.ItemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
    );      
    
      this.Item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address,
    );

    this.listenToPaymentEvent();
    this.setState({loaded:true});

// Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supply Chain Management Example</h1>
        <h2>Create Item</h2>
        <br/>
        <p>
        Article name: <input type="text" name="itemName" value={this.state.itemName} onChange={this.HandleInputChange} />  
        </p>        <p>
        EAN: <input type="text" name="ean" value={this.state.ean} onChange={this.HandleInputChange} />  
        </p>
        <p>
        Price in Wei: <input type="text" name="cost" value={this.state.cost} onChange={this.HandleInputChange} />
        </p>                     
        <button type="button" onClick={this.HandleSubmit}>Create new Item</button>
      </div>
    );
  }

  listenToPaymentEvent = () => {
    let self = this;
    this.ItemManager.events.SupplyChainStep().on("data", async function(evt){
      // eslint-disable-next-line
      if(evt.returnValues._step == 1) {
        let item = await self.ItemManager.methods.items(evt.returnValues._itemIndex).call();
        console.log(item);
        alert("Item "+ item._identifier +" was paid, deliver it now!");
      };
      console.log(evt);
    });
  }

  HandleSubmit = async () => {
    const {itemName, cost, ean} = this.state;
    console.log(itemName, ean, cost, this.ItemManager);
    let result = await this.ItemManager.methods.createItem(itemName, ean, cost).send({from:this.accounts[0]});
    console.log(result);
    alert("Send "+cost+" Wei to "+result.events.SupplyChainStep.returnValues._address);
   };

   HandleInputChange = (event) => {
     const target = event.target;
     const value = target.type === 'checkbox' ? target.checked : target.value;
     const name = target.name;

     this.setState ({
       [name]: value
     })
   } 
}

export default App;
