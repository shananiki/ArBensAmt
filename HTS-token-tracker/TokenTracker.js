// Imports
const { getUSD } = require('./TokenRequester.js');
const util = require('util');
const Token = require('./Token');

class TokenTracker {
    constructor() {
        this.token_list = [];
    }

    addToken(token){
        this.token_list.push(token);
    }

    initialize(){
        this.token_list.forEach(token => {
            token.initialize();
        });
    }

    update(){
        this.token_list.forEach(token => {
            token.update();
        });
    }

    listTokens(){
        this.token_list.forEach(token => {
            console.log(token.getName());
        });
    }


}

module.exports = TokenTracker;
