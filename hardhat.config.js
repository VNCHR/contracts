require("@nomiclabs/hardhat-waffle");
/**require("hardhat-deploy");
require("@nomiclabs/hardhat-solhint");**/
const walletUtils = require("./walletUtils");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 * version: "0.5.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.2"
      },
      {
        version: "0.7.3"
      },
      {
        version: "0.7.5"
      },
      {
        version: "0.6.9"
      }
    ]
    },
  networks:{
    hardhat:{
      //forking:{url:`https://rpc.xdaichain.com/`},
      accounts:walletUtils.localWallet("1000000000000000000000000",num=20),
      chainId:100
    },
    xdai:{
      url: `https://rpc.xdaichain.com/`,
      accounts:walletUtils.makeKeyList()
    //gas : "auto",
    //gasPrice : "1000000000"
    },
    mumbai:{
      url:"https://rpc-mumbai.matic.today",
      accounts:walletUtils.makeKeyList()
    },
    matic:{
      url:"https://rpc-mainnet.matic.network",
      accounts:walletUtils.makeKeyList()
    }
  }
};