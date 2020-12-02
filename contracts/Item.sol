pragma solidity ^0.6.4;

import "./ItemManager.sol";

contract Item {
    
    uint index;
    uint priceInWei;
    uint paidWei;
    
    ItemManager parentContract;
    
    constructor (ItemManager _parentContract, uint _priceInWei, uint _index) public {
        parentContract = _parentContract;
        index = _index;
        priceInWei = _priceInWei;
    }
    
    receive() external payable {
        require( msg.value == priceInWei, "Only full payments");
        require (paidWei == 0, "already paid");
        paidWei += msg.value;
        (bool success, ) = address(parentContract).call{value:msg.value}(abi.encodeWithSignature("triggerPayment(uint256)", index));
        require(success, "Payment failed");
    }
    
    fallback () external {
        
    }
}