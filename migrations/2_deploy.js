const TestRB = artifacts.require('RbTest');

module.exports = async (deployer) => {
    try{
        //await deployer.deploy(TestRB,{from:'0x2d0e7c0813a51d3bd1d08246af2a8a7a57d8922e',value:100});
        await deployer.deploy(TestRB);
        //await deployer.deploy(TestRB,{from:'0x2d0e7c0813a51d3bd1d08246af2a8a7a57d8922e',gasPrice:'0x3500000000',gas:'1000000'});
        let trbInst = await TestRB.deployed();
    }catch(e){
        console.log("deployer failed:"+e.toString());
    }
}