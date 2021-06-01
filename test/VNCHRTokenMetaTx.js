const { expect } = require("chai");
const { ethers:ethersMain } = require("ethers");
const walletUtils = require("../walletUtils");

describe("Meta Tx Enabled VNCHR", function() {

    let vnchrMTx;
    let accounts;

    const permitType = [
        {name:"owner", type:"address"},
        {name:"spender", type:"address"},
        {name:"value", type:"uint256"},
        {name:"nonce", type:"uint256"},
        {name:"deadline", type:"uint256"}
    ];

    const types = {
        Permit : permitType
    };

    let vnchrMTxDomain;

    const keyList = walletUtils.makeKeyList(num=20);

    console.log("key list : " + keyList);

    beforeEach(async function(){

        //fetch account signers object
        accounts = await ethers.getSigners();

        //deploy VNCHR MTX Token
        const VNCHRMTX = await ethers.getContractFactory("VNCHRTokenMetaTx");
        vnchrMTx = await VNCHRMTX.deploy();
        await vnchrMTx.deployed();

        //fill domain data following initialisation of VNCHR token contract
        vnchrMTxDomain ={
            name : "VNCHRTokenMetaTx",
            version: '1',
            chainId: 100,
            verifyingContract : vnchrMTx.address
        };

        await vnchrMTx.mint(await accounts[1].getAddress(),ethers.utils.parseEther("1000"));
            
    });

    describe("token details", function(){

        it("Is called VNCHR", async function(){
            expect(await vnchrMTx.name()).to.equal("VNCHR");
        })

        it("Has the symbol VNCHR", async function(){
            expect(await vnchrMTx.symbol()).to.equal("VNCHR");
        })

        it("Has a cap of 5e24 wei", async function(){
            expect((await vnchrMTx.cap()).toString()).to.equal("5000000000000000000000000");
        })

        it("cap works", async function(){
            await expect(vnchrMTx.mint(
                await accounts[1].getAddress(),
                ethers.utils.parseEther("10000000")))
                .to.be.revertedWith("ERC20Capped: cap exceeded");
        });

    })

    describe("Permit", function(){

        it("Permit works with valid request",async function(){
            
            const permitReq = {
                owner : await accounts[1].getAddress(),
                spender : await accounts[2].getAddress(),
                value : ethers.utils.parseEther("100"),
                nonce : 0,
                deadline : Math.floor(Date.now()/1000)+120
            };

            //create signature
            const signature = await (new ethersMain.Wallet(keyList[1]))
                                ._signTypedData(vnchrMTxDomain,types,permitReq);
            //make r,s,v
            const r = signature.substring(0, 66);
            const s = "0x" + signature.substring(66, 130);
            const v = parseInt(signature.substring(130, 132), 16);

            await vnchrMTx.permit(
                permitReq.owner,
                permitReq.spender,
                permitReq.value,
                permitReq.deadline,
                v,r,s);

            await (vnchrMTx.connect(accounts[2])).transferFrom(
                    await accounts[1].getAddress(),
                    await accounts[3].getAddress(),
                    ethers.utils.parseEther("100")
                );

            expect
            ((await vnchrMTx.balanceOf(await accounts[3].getAddress())).toString())
            .to.equal(ethers.utils.parseEther("100"));

        });

        it("Permit fails with incorrect nonce", async function(){

            const permitReq = {
                owner : await accounts[1].getAddress(),
                spender : await accounts[2].getAddress(),
                value : ethers.utils.parseEther("100"),
                nonce : 1,
                deadline : Math.floor(Date.now()/1000)+120
            };

            //create signature
            const signature = await (new ethersMain.Wallet(keyList[1]))
                                ._signTypedData(vnchrMTxDomain,types,permitReq);
            //make r,s,v
            const r = signature.substring(0, 66);
            const s = "0x" + signature.substring(66, 130);
            const v = parseInt(signature.substring(130, 132), 16);

            await expect(vnchrMTx.permit(
                permitReq.owner,
                permitReq.spender,
                permitReq.value,
                permitReq.deadline,
                v,r,s))
            .to.be.revertedWith("ERC20Permit: invalid signature");

        });
        it("Permit fails with invalid signature", async function(){

            const permitReq = {
                owner : await accounts[3].getAddress(),
                spender : await accounts[2].getAddress(),
                value : ethers.utils.parseEther("100"),
                nonce : 1,
                deadline : Math.floor(Date.now()/1000)+120
            };

            //create signature
            const signature = await (new ethersMain.Wallet(keyList[1]))
                                ._signTypedData(vnchrMTxDomain,types,permitReq);
            //make r,s,v
            const r = signature.substring(0, 66);
            const s = "0x" + signature.substring(66, 130);
            const v = parseInt(signature.substring(130, 132), 16);

            await expect(vnchrMTx.permit(
                permitReq.owner,
                permitReq.spender,
                permitReq.value,
                permitReq.deadline,
                v,r,s))
            .to.be.revertedWith("ERC20Permit: invalid signature");

        });
        it("Permit fails with expired deadline", async function(){

            const permitReq = {
                owner : await accounts[1].getAddress(),
                spender : await accounts[2].getAddress(),
                value : ethers.utils.parseEther("100"),
                nonce : 1,
                deadline : Math.floor(Date.now()/1000) - 120
            };

            //create signature
            const signature = await (new ethersMain.Wallet(keyList[1]))
                                ._signTypedData(vnchrMTxDomain,types,permitReq);
            //make r,s,v
            const r = signature.substring(0, 66);
            const s = "0x" + signature.substring(66, 130);
            const v = parseInt(signature.substring(130, 132), 16);

            await expect(vnchrMTx.permit(
                permitReq.owner,
                permitReq.spender,
                permitReq.value,
                permitReq.deadline,
                v,r,s))
            .to.be.revertedWith("ERC20Permit: expired deadline");

        })
    })
});

//test permit functionality
//erc20 transfer handler