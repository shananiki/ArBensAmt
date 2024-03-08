// Imports
const { getUSD } = require('./TokenRequester.js');
const Token = require('./Token');
const TokenTracker = require('./TokenTracker');

const util = require('util');

// Variables
var BASE_URL = "https://api.saucerswap.finance/";
var PRICE_URL = "/tokens/prices/latest/";
var FIVE_MIN_URL = "%s?interval=FIVEMIN";

// Debug list tokens
var TOKEN_HASHKY = "0.0.4335383";

// Build string
var TOKEN_INFO_URL = BASE_URL + PRICE_URL + util.format(FIVE_MIN_URL, TOKEN_HASHKY);


async function main(){
    const tokenTracker = new TokenTracker();
    const T1 = new Token("0.0.4335383", "Hashky");
    const T2 = new Token("0.0.786931", "HSUITE");
    tokenTracker.addToken(T1);
    tokenTracker.addToken(T2);
    tokenTracker.listTokens();
    tokenTracker.initialize();

    
    while(true){
        tokenTracker.update();
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

main();
