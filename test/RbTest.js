const RbTest = artifacts.require('RbTest');
const BN = web3.utils.BN;
const web3ext = require('./web3ext');
const Web3 = require('web3');
const murkyEpoch = new BN("18100");
let RbTestInst;
let myWeb3;

contract('Test RbTest', async (accounts) => {
    before("init...   -> success", async () => {
        try {
            RbTestInst = await  RbTest.deployed();
            //myWeb3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
            myWeb3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.19:3333"));
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
            console.log("epochID:" + epochIdSc.toString());

            let epochIdApi = myWeb3.pos.getEpochID();
            console.log("epochID by API:" + epochIdApi.toString());
            assert.equal(epochIdSc, epochIdApi);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getRandomNumberByTimestamp success', async () => {
        try {
            let now = Math.floor(Date.now() / 1000);
            //console.log("timestamp:" + now);
            let ret = await RbTestInst.getEpochId(now);
            let bnEpochId = new BN(ret.toString());
            console.log("epochID:" + ret.toString());

            let bnTime = new BN(now.toString());
            ret = await RbTestInst.getRandomNumberByTimestamp(bnTime);
            console.log("RandomNumber:" + ret.toString());

            console.log("RandomNumber(hex):" + web3.utils.toHex(new BN(ret.toString())));

            let rndNumberByAPI = await myWeb3.pos.getRandom(Number(bnEpochId.toString()), Number('-1'));
            console.log("rndNumberByAPI:" + rndNumberByAPI);
            assert.equal(web3.utils.toHex(new BN(ret.toString())), rndNumberByAPI);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getRandomNumberByEpochId success', async () => {
        try {
            let now = Math.floor(Date.now() / 1000);
            //console.log("timestamp:" + now);
            let ret = await RbTestInst.getEpochId(now);
            console.log("epochID:" + ret.toString());

            let bnEpochId = new BN(ret.toString());
            ret = await RbTestInst.getRandomNumberByEpochId(bnEpochId);
            console.log("RandomNumber:" + ret.toString());

            console.log("RandomNumber(hex):" + web3.utils.toHex(new BN(ret.toString())));

            let rndNumberByAPI = await myWeb3.pos.getRandom(Number(bnEpochId.toString()), Number('-1'));
            console.log("rndNumberByAPI:" + rndNumberByAPI);

            assert.equal(web3.utils.toHex(new BN(ret.toString())), rndNumberByAPI);
        } catch (err) {
            assert.fail(err);
        }
    });

    it('getRandomNumberByEpochId should return 0x0', async () => {
        try {
            let now = Math.floor(Date.now() / 1000);
            //console.log("timestamp:" + now);
            let ret = await RbTestInst.getEpochId(now);
            console.log("epochID:" + ret.toString());

            let bnEpochId = new BN(ret.toString());
            bnEpochId = bnEpochId.add(new BN(2));
            ret = await RbTestInst.getRandomNumberByEpochId(bnEpochId);
            console.log("RandomNumber:" + ret.toString());
            console.log("RandomNumber(hex):" + web3.utils.toHex(new BN(ret.toString())));
            assert.equal(web3.utils.toHex(new BN(ret.toString())), '0x0');

        } catch (err) {
            assert.fail(err);
        }
    });
    it('getRandomNumberByEpochId murkeyEpoch', async () => {
        try {
            let ret = await RbTestInst.getRandomNumberByEpochId(murkyEpoch);
            console.log("RandomNumber:" + ret.toString());
            console.log("RandomNumber(hex):" + web3.utils.toHex(new BN(ret.toString())));
        } catch (err) {
            assert.fail(err);
        }
    });

});