// Imports

class Item {
    constructor(itemID) {
        this.itemID = itemID;
    }




    setItemID(value){
        this.itemID = value;
    }
    getItemID(){
        return this.itemID;
    }

}

module.exports = Item;
