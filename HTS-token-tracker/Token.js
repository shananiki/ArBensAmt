// Imports
const { getUSD, getLiquidityUSD } = require('./TokenRequester.js');
const util = require('util');
// Variables
var BASE_URL = "https://api.saucerswap.finance/";
var PRICE_URL = "/tokens/prices/latest/";
var FIVE_MIN_URL = "%s?interval=FIVEMIN";

class Token {
    constructor(tokenID, tokenName) {
        this.tokenID = tokenID;
        this.tokenName = tokenName;
        this.history = [];
        this.URL_USD = BASE_URL + PRICE_URL + util.format(FIVE_MIN_URL, this.tokenID);
        this.changeUpDown = "=";
        this.value_USD = 0;
        this.value_Liquidity = 0;
        this.value_alert_USD = -0.0;
    }

    async initialize(){
        this.setValueUSD = await this.fetchUSD();
        await this.update();
    }

    async update(){
        var newPrice = await getUSD(this.URL_USD);
        if(newPrice !== this.value_USD){
            if (newPrice > this.value_USD){
                console.log("Price raised!");
                HASHKY.setChangeUpDown("+");
            }
            if (newPrice < this.value_USD){
                console.log("Price fell!");
                HASHKY.setChangeUpDown("-");
            }
            this.value_USD = newPrice;
        }
        console.log(this.tokenName + " " + this.changeUpDown + " " + this.value_USD);
        if(this.value_USD === this.value_alert_USD){
            console.log("Price limit reached.");
        }
    }

    setValueAlertUSD(value){
        this.value_alert_USD = value;
    }
    getValueAlertUSD(){
        return this.value_alert_USD;
    }
    setValueUSD(value){
        this.value_USD = value;
    }
    getValueUSD(value){
        return this.value_USD;
    }
    setValueLiquidity(value){
        this.value_Liquidity = value;
    }

    getValueLiquidity(value){
        return this.value_Liquidity;
    }

    setChangeUpDown(value){
        this.changeUpDown = value;
    }

    getChangeUpDown(){
        return this.changeUpDown;
    }

    addToHistory(data) {
        this.history.push(data);
    }

    getHistory() {
        return this.history;
    }

    getName(){
        return this.tokenName;
    }

    fetchUSD(){
        this.value_USD = getUSD(this.URL_USD);
    }

    fetchLiquidity(){
        this.value_Liquidity = getLiquidityUSD(this.URL_USD);
    }
}

module.exports = Token;
