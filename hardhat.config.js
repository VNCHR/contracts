require('dotenv').config();
require('@nomiclabs/hardhat-waffle');

task('accounts', 'Prints the list of accounts', async () => {
	const accounts = await ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	networks: {
		hardhat: {},
		rinkeby: {
			url: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY,
		},
	},
	solidity: {
		version: '0.7.3',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
};
