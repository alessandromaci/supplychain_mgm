pragma solidity ^0.6.4;

import "./Item.sol";
import "./Ownable.sol";

contract ItemManager {
    
    enum SupplyChainSteps {Created, Paid, Delivered}
    
    struct S_Item {
        Item _item;
        string _identifier;
        uint _ean;
        ItemManager.SupplyChainSteps _step;
    }
    
    mapping(uint => S_Item) public items;
    
    uint index;
    
    event SupplyChainStep(uint _itemIndex, uint _step, address _address);
    
    function createItem(string memory _identifier, uint _ean, uint _priceInWei) public  {
        Item item = new Item(this, _priceInWei, index);
        items[index]._item = item;
        items[index]._identifier = _identifier; 
        items[index]._ean = _ean; 
        items[index]._step = SupplyChainSteps.Created;
        emit SupplyChainStep(index, uint(items[index]._step), address(item));        
        index++;

    }
    
    function triggerPayment(uint _index) public payable  {
        Item item = items[_index]._item; 
        require(address(item) == msg.sender, "Not allowed");
        require(items[index]._step == SupplyChainSteps.Created, "Already paid");        
        items[_index]._step = SupplyChainSteps.Paid;
        emit SupplyChainStep(_index, uint(items[_index]._step), address(item));         
        
    } 
    
    function triggerDelivery(uint _index) public {
        require(items[index]._step == SupplyChainSteps.Paid, "Not possible");         
        items[index]._step = SupplyChainSteps.Delivered;
        emit SupplyChainStep(_index, uint(items[_index]._step), address(items[index]._item));          
        
    }
}