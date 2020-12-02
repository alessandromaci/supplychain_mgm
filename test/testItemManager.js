const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", accounts => {
    it("... should you let you create items", async () => {
        const itemManagerInstance = await ItemManager.deployed();
        const itemName = "example";
        const itemPrice = 100;
        const itemEan = 000005;

        const result = await itemManagerInstance.createItem(itemName, itemEan, itemPrice, {from: accounts[0]});

        assert.equal(result.logs[0].args._itemIndex, 0, "error");
        const item = await itemManagerInstance.items(0);
        assert.equal(item._identifier, itemName, "error");


    
    });
});