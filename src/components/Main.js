import React, { Component } from "react";
import web3 from "web3";
import daiImg from "../dai.png";

class Main extends Component {
	state = {};

	submitHandler = (e) => {
		e.preventDefault();
		const inputValue = this.input.value.toString();
		const amount = web3.utils.toWei(inputValue, "Ether");
		this.props.stakeTokens(amount);
	};

	render() {
		return (
			<div id="content" className="mt-3">
				<table className="table table-borderless text-muted text-center">
					<thead>
						<tr>
							<th scope="col">
								<b>Staking Balance</b>
							</th>
							<th scope="col">
								<b> Reward Balance</b>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								{web3.utils.fromWei(
									this.props.stakingBalance,
									"Ether"
								)}{" "}
								mDAI
							</td>
							<td>
								{web3.utils.fromWei(
									this.props.dappTokenBalance,
									"Ether"
								)}{" "}
								DAPP
							</td>
						</tr>
					</tbody>
				</table>

				<div className="card mb-4">
					<div className="card-body">
						<form className="mb-3" onSubmit={this.submitHandler}>
							<div>
								<label className="float-left">
									<b>Stake Tokens</b>
								</label>
								<span className="float-right text-muted">
									Balance:{" "}
									{web3.utils.fromWei(
										this.props.daiTokenBalance,
										"Ether"
									)}
								</span>
							</div>
							<div className="input-group mb-4">
								<input
									ref={(input) => {
										this.input = input;
									}}
									type="text"
									className="form-control form-control-lg"
									placeholder="0"
									required
								/>
								<div className="input-group-append">
									<div className="input-group-text">
										<img src={daiImg} height="32" alt="" />
										&nbsp;&nbsp;&nbsp; mDAI
									</div>
								</div>
							</div>
							<button
								type="submit"
								className="btn btn-primary btn-block btn-lg"
							>
								STAKE!
							</button>
							<button
								type="submit"
								className="btn btn-danger btn-block btn-lg"
								onClick={(e) => {
									e.preventDefault();
									this.props.unstakeTokens();
								}}
							>
								UNSTAKE!
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Main;
