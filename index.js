require('dotenv').config();
var express = require('express');
var cors = require('cors');
var app = express();
var WeaveDB = require('weavedb-sdk-node');
app.use(cors());

app.use(express.json());
const wallet = {
    getAddressString: () => process.env.ADMIN_ADDRESS.toLowerCase(),
    getPrivateKey: () => Buffer.from(process.env.ADMIN_PRIVATE_KEY, "hex"),
};

let db;
global.owner = process.env.ADMIN_ADDRESS;

// Initialize WeaveDB
async function init() {
    db = new WeaveDB({ contractTxId: process.env.CONTRACT_TX_ID });
    await db.initializeWithoutWallet();
    db.setDefaultWallet(wallet, "evm");
}

init();

app.get('/', async function (req, res, next) {
    console.log("req", req.body.userId);
    try{
    const Data = { wallet: req.body.wallet, handle: req.body.handle };
    const tx = await db.add(Data, "Artist");
    console.log("tx", tx);
    const result = await db.get("Artist");
    console.log("result", result);
    res.json({ tx: tx, result: result });
    } catch (error) {
       res.json({ error: error });
    }
});

app.get('/get', async function (req, res, next) {
    const result = await db.get("Artist");
    res.json({ result: result });
})

app.listen(3000, function () { 
    console.log('CORS-enabled web server listening on port 3000');
});
