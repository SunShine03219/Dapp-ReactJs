import Web3 from 'web3'
import abi from './erc20FarmAbi';
import * as Web3Utils from 'web3-utils';

const provider = () => {
    // 1. Try getting newest provider
    const { ethereum } = window
    if (ethereum) return ethereum

    // 2. Try getting legacy provider
    const { web3 } = window
    if (web3 && web3.currentProvider) return web3.currentProvider
}

let stakeInstance

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
    stakeInstance = web3.eth.net.getId().then(id => {
        const address = process.env.REACT_APP_STAKING_ADDRESS;
        const stakeInstance = new web3.eth.Contract(abi, address)
        return {
            async mint(count, sender) {
                try {
                    const res = await stakeInstance.methods.mint(count).send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async stakeMulti(_ids, sender) {
                try {
                    const nft = "0x5D1DCe56Bc2de2e12DD603bA7c684b631c357a04";
                    const res = await stakeInstance.methods.stakeMulti(nft, _ids).send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async cancelMulti(count, sender) {
                try {
                    const res = await stakeInstance.methods.cancelMulti(count).send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async claimAll(sender) {
                try {
                    const res = await stakeInstance.methods.claimAll().send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async compoundAll(sender) {
                try {
                    const res = await stakeInstance.methods.compoundAll().send({
                        'from': sender
                    })
                    return res;
                } catch (e) {
                    console.log(e)
                }
            },
            async viewRewards(address) {
                try {
                    const rewards = await stakeInstance.methods.viewRewardAll(address).call();
                    return rewards;
                } catch (e) {
                    console.log(e);
                }
            },
            async viewStakeCount(address) {
                try {
                    const count = await stakeInstance.methods.viewStakeCount(address).call();
                    return count;
                } catch (e) {
                    console.log(e);
                }
            }
        }
    })
}

export default stakeInstance
