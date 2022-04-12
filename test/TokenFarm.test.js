const { assert } = require("chai");

const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
	.use(require("chai-as-promised"))
	.should();

function tokens(n) {
	return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
	let daiToken, dappToken, tokenFarm;

	// This hook will run before the test cases
	// We can do the same setup of the deploy_contracts here
	before(async () => {
		// Load Contracts
		daiToken = await DaiToken.new();
		dappToken = await DappToken.new();
		tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

		// Transfer dapp tokens
		await dappToken.transfer(tokenFarm.address, tokens("1000000"));

		// Send tokens to investor
		await daiToken.transfer(investor, tokens("100"), { from: owner });
	});

	// Test example
	describe("Mock DAI deployment", async () => {
		it("has a name", async () => {
			const name = await daiToken.name();
			assert.equal(name, "Mock DAI Token");
		});
	});

	describe("DApp Token deployment", async () => {
		it("has a name", async () => {
			const name = await dappToken.name();
			assert.equal(name, "DApp Token");
		});
	});

	describe("Token Farm deployment", async () => {
		it("has a name", async () => {
			const name = await tokenFarm.name();
			assert.equal(name, "Dapp Token Farm");
		});

		it("contract has tokens", async () => {
			const balance = await dappToken.balanceOf(tokenFarm.address);
			assert.equal(balance.toString(), tokens("1000000"));
		});
	});

	describe("Farming tokens", async () => {
		it("rewards investor for staking mDai tokens", async () => {
			let result;

			// Check investor balance
			result = await daiToken.balanceOf(investor);
			assert.equal(
				result.toString(),
				tokens("100"),
				"investor Mock Dai walllet balance corret before staking"
			);

			// Stake Mock Dai tokens
			await daiToken.approve(tokenFarm.address, tokens("100"), {
				from: investor,
			});
			await tokenFarm.stakeTokens(tokens("100"), { from: investor });

			// Check staking balance
			result = await daiToken.balanceOf(investor);
			assert.equal(
				result.toString(),
				tokens("0"),
				"investor Mock Dai walllet balance corret after staking"
			);

			result = await daiToken.balanceOf(tokenFarm.address);
			assert.equal(
				result.toString(),
				tokens("100"),
				"Token Farm Mock Dai balance corret after staking"
			);

			result = await tokenFarm.stakingBalance(investor);
			assert.equal(
				result.toString(),
				tokens("100"),
				"investor staking balance corret after staking"
			);

			result = await tokenFarm.isStaking(investor);
			assert.equal(
				result.toString(),
				"true",
				"investor staking status corret after staking"
			);

			// Issue tokens
			await tokenFarm.issueTokens({ from: owner });

			result = await dappToken.balanceOf(investor);
			assert.equal(
				result.toString(),
				tokens("100"),
				"investor DApp Token wallet balance incorret after issuing"
			);

			// Ensure only owner can issue tokens
			await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

			// Unstake tokens
			await tokenFarm.unstakeTokens({ from: investor });

			// Checking results after unstaking
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(), tokens("100"), "investor Mock Dai wallet balance corret after staking");

			result = await daiToken.balanceOf(tokenFarm.address);
			assert.equal(result.toString(), tokens("0"), "Token Farm Mock Dai balance is corret after staking");

			result = await tokenFarm.stakingBalance(investor);
			assert.equal(result.toString(), tokens("0"), "investor staking balance corret after staking");

			result = await tokenFarm.isStaking(investor);
			assert.equal(result.toString(), "false", "investor staking status is corret after staking");
		});
	});
});
