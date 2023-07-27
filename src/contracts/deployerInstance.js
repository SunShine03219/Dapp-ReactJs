import Web3 from 'web3'
import abi from './deployerAbi'
import * as Web3Utils from 'web3-utils';
import getContractsAddress from './contractsAddress';
import { DeployedERC20Farm } from './eventAbi';

const provider = () => {
    // 1. Try getting newest provider
    const { ethereum } = window
    if (ethereum) return ethereum

    // 2. Try getting legacy provider
    const { web3 } = window
    if (web3 && web3.currentProvider) return web3.currentProvider
}

let contractInstance


function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

if (provider()) {
    const web3 = new Web3(provider())
    contractInstance = web3.eth.net.getId().then(id => {
        const address = getContractsAddress(id)
        const contractInstance = new web3.eth.Contract(abi, address)
        return {
            async getOwner() {
                try {
                    const res = await contractInstance.methods.owner().call();
                    return res;
                } catch (e) {
                    console.log(e);
                }
            },
            async getDeploymentCost() {
                try {
                    const res = await contractInstance.methods.deploymentCost().call();
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async deployERC20Farm(sender, _stakeToken, _rewardToken, _startBlock, _rewardPerBlock, _userStakeLimit, _minimumLockTime, _earlyWithdrawalFee, _feeReceiver, _keepReflectionOnDeposit = false, cost) {
                try {
                    const deployerAddress = await contractInstance.methods.owner().call();
                    const res = await contractInstance.methods.deployERC20Farm(_stakeToken, _rewardToken, _startBlock, _rewardPerBlock, _userStakeLimit, _minimumLockTime, _earlyWithdrawalFee, _feeReceiver, _keepReflectionOnDeposit).send({
                        'from': sender,
                        'value': toPlainString(deployerAddress) == toPlainString(sender) ? 0 : cost
                    });
                    return res;
                } catch (e) {
                    console.log(e)
                }

            },
            async deployERC20FarmFixEnd(sender, _stakeToken, _rewardToken, _startBlock, _endBlock, _userStakeLimit, _minimumLockTime, _earlyWithdrawalFee, _feeReceiver, cost) {
                try {
                    console.log("deployERC20FarmFixEnd");
                    console.log(sender);
                    const deployerAddress = await contractInstance.methods.owner().call();
                    const res = await contractInstance.methods.deployERC20FarmFixEnd(_stakeToken, _rewardToken, _startBlock, _endBlock, _userStakeLimit, _minimumLockTime, _earlyWithdrawalFee, _feeReceiver).send({
                        'from': sender,
                        'value': toPlainString(deployerAddress) == toPlainString(sender) ? 0 : cost
                    });
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
        }
    })
}

export default contractInstance
