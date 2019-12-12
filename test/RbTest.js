const RbTest        = artifacts.require('RbTest');
const BN            = web3.utils.BN;
const web3ext       = require('./web3ext');
const Web3          = require('web3');
const murkyEpoch    = new BN("2626906");
let RbTestInst;
let myWeb3;

contract('Test RbTest', async (accounts) => {
    before("init...   -> success", async () => {
        try {
            RbTestInst = await  RbTest.deployed();
            myWeb3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
            web3ext.extend(myWeb3);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getEpochId invalid number value', async () => {
        try {
            let now = Date.now() / 1000;
            //console.log("timestamp:" + now);
            let ret = await RbTestInst.getEpochId(now);
            //console.log("ret:" + ret.toString());
        } catch (err) {
            assert.include(err.toString(), "invalid number value");
        }
    });

    it('getEpochId success', async () => {
        try {
            //console.log("====getEpochId success========");
            let now = Math.floor(Date.now() / 1000);
            //console.log("timestamp:" + now);
            let epochIdSc = await RbTestInst.getEpochId(now);
            //console.log("epochID:" + ret.toString());

            let epochIdApi = myWeb3.pos.getEpochID();
            //console.log("epochID by API:" + epochId.toString());
            assert.equal(epochIdSc,epochIdApi);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getRandomByBlockTime success', async () => {
        try {
            let now = Math.floor(Date.now() / 1000);
            //console.log("timestamp:" + now);
            let ret = await RbTestInst.getEpochId(now);
            let bnEpochId = new BN(ret.toString());
            console.log("epochID:" + ret.toString());

            let bnTime = new BN(now.toString());
            ret = await RbTestInst.getRandomByBlockTime(bnTime);
            console.log("RandomNumber:" + ret.toString());

            console.log(web3.utils.toHex(new BN(ret.toString())));

            let rndNumberByAPI = await myWeb3.pos.getRandom(Number(bnEpochId.toString()),Number('-1'));
            console.log("rndNumberByAPI:"+rndNumberByAPI);
            assert.equal(web3.utils.toHex(new BN(ret.toString())), rndNumberByAPI);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getRandomByEpochId success', async () => {
        try {
            let now = Math.floor(Date.now() / 1000);
            //console.log("timestamp:" + now);
            let ret = await RbTestInst.getEpochId(now);
            console.log("epochID:" + ret.toString());

            let bnEpochId = new BN(ret.toString());
            ret = await RbTestInst.getRandomByEpochId(bnEpochId);
            console.log("RandomNumber:" + ret.toString());

            console.log(web3.utils.toHex(new BN(ret.toString())));

            let rndNumberByAPI = await myWeb3.pos.getRandom(Number(bnEpochId.toString()),Number('-1'));
            console.log("rndNumberByAPI:"+rndNumberByAPI);

            assert.equal(web3.utils.toHex(new BN(ret.toString())), rndNumberByAPI);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getRandomByEpochId murkeyEpoch', async () => {
        try {
            let ret = await RbTestInst.getRandomByEpochId(murkyEpoch);
            console.log("RandomNumber:" + ret.toString());
            console.log(web3.utils.toHex(new BN(ret.toString())));
        } catch (err) {
            assert.fail(err);
        }
    });

});