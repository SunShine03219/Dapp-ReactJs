import React, { useEffect, useState } from 'react';
import './home.css';
import home_image from "../../assets/img/photo_2022-12-13_17-19-56.jpg";
import bnb_image from "../../assets/img/bnb.png";
import redg_image from "../../assets/img/red_g_coin.webp";
import metamask from '../../assets/img/1_WSFGfKauFXLC8RKZhR2c3w-removebg-preview.png';
import Web3 from 'web3';
import farmAbiFixEnd from '../../contracts/erc20FarmFixEndAbi';
import getContractsAddress from '../../contracts/contractsAddress';
import tokenAbi from '../../contracts/tokenAbi';
import { NotificationManager } from 'react-notifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import unknown_img from '../../assets/img/questionmarktokenicon.png';
import useWeb3 from '../../components/useWeb3';
import { farmType } from '../../contracts/eventAbi';
import erc20FarmAbi from '../../contracts/erc20FarmAbi';
import erc20FarmFixEndAbi from '../../contracts/erc20FarmFixEndAbi';
import token_list from '../../token_list/pancakeswap-mini';
import BN from 'bn.js';
import { MAX_NUMBER } from '../../utils';
import Rodal from 'rodal';

function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

// Simple counter using React Hooks
export const FarmCard = (props) => {
    const { web3, walletAddress } = useWeb3();
    const [isApproved, setIsApproved] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [isButton1Loading, setIsButton1Loading] = useState(false);
    const [isHarvestLoading, setIsHarvestLoading] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [isExtraLoading, setIsExtraLoading] = useState(false);
    const [isHide, setHide] = useState(false);
    const { farm } = props;
    const [token0Logo, setToken0Logo] = useState(null);
    const [token1Logo, setToken1Logo] = useState(null);
    const [rewardTokenLogo, setRewardTokenLogo] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [rewardBalance, setRewardBalance] = useState(0);
    const [dailyReward, setDailyReward] = useState(0);
    const [projectedDate, setProjectedDate] = useState(0);
    const [myShares, setMyShares] = useState(0);
    const [myDepositToken, setMyDepositToken] = useState(0);
    const [tokenEarned, setTokenEarned] = useState(0);
    const [usdEarned, setUsdEarned] = useState(0);
    const [newDailyReward, setNewDailyReward] = useState(0);
    const [endDate, setEndDate] = useState(null);
    const [updateTime, setUpdateTime] = useState(0);

    const hide = () => {
        setNotificationOpen(false);
    }

    const notify = () => toast.info('Connect your wallet', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const warn = (msg) => toast.error(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const success = (msg) => toast.success(msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const provider = () => {
        // 1. Try getting newest provider
        const { ethereum } = window
        if (ethereum) return ethereum

        // 2. Try getting legacy provider
        const { web3 } = window
        if (web3 && web3.currentProvider) return web3.currentProvider
    }

    const addTokenToMetamask = async (token) => {
        if (walletAddress === "") {
            notify();
            return;
        }
        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await web3.currentProvider.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: token.contractAddress, // The address that the token is at.
                        symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: token.decimals, // The number of decimals in the token
                    },
                },
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeposit = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsButtonLoading(true);
        const web3_farm = new Web3(provider());
        const tokenContract = new web3_farm.eth.Contract(tokenAbi, farm.stakeToken.contractAddress);
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        try {
            const allowance = await tokenContract.methods.allowance(walletAddress, farm.farmAddress).call();

            if (allowance == 0) {
                await tokenContract.methods.approve(farm.farmAddress, MAX_NUMBER).send({
                    from: walletAddress
                });
            }
            else {
                const bigAmount = new BN(depositAmount.toString(), 10);
                const bigDecimal = new BN((10 ** farm.stakeToken.decimals).toString(), 10);
                const bigAmountDecimal = bigAmount.mul(bigDecimal);
                const res = await farmInstance.methods.deposit(bigAmountDecimal.toString()).send({
                    from: walletAddress
                });
                success("Deposit Completed!");
            }
        } catch (e) {
            console.log(e);
            warn("Deposit Failed!");
        }
        getAdminInfo();
        setIsButtonLoading(false);
    }

    const handleHarvest = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsHarvestLoading(true);
        try {
            const web3_farm = new Web3(provider());
            const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
            const res = await farmInstance.methods.withdraw("0").send({
                from: walletAddress
            });
            success("Harvest Completed!");
        } catch (e) {
            console.log(e);
            warn("Harvest Failed!");
        }
        setIsHarvestLoading(false);
    }

    const handleWithdraw = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsButton1Loading(true);
        try {
            const web3_farm = new Web3(provider());
            const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
            const res = await farmInstance.methods.withdraw(myShares).send({
                from: walletAddress
            });
            success("Withdraw Completed!");
            setMyShares(0);
        } catch (e) {
            console.log(e);
            warn("Withdraw Failed!");
        }
        setIsButton1Loading(false);
    }

    const handleWithdrawReward = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsButton1Loading(true);
        const web3_farm = new Web3(provider());
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        try {
            const bigAmount = new BN(depositAmount.toString(), 10);
            const bigDecimal = new BN((10 ** farm.rewardToken.decimals).toString(), 10);
            const bigAmountDecimal = bigAmount.mul(bigDecimal);
            const res = await farmInstance.methods.recoverERC20(farm.rewardToken.contractAddress, bigAmountDecimal.toString()).send({
                from: walletAddress
            });
            success("Withdraw Completed!");
            // setMyShares(0);
        } catch (e) {
            console.log(e);
            warn("Withdraw Failed!");
        }
        setIsButton1Loading(false);
    }

    const addRewards = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsAddLoading(true);
        const web3_farm = new Web3(provider());
        const tokenContract = new web3_farm.eth.Contract(tokenAbi, farm.rewardToken.contractAddress);
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        try {
            await tokenContract.methods.approve(farm.farmAddress, MAX_NUMBER).send({
                from: walletAddress
            });
            const bigAmount = new BN(rewardAmount.toString(), 10);
            const bigDecimal = new BN((10 ** farm.rewardToken.decimals).toString(), 10);
            const bigAmountDecimal = bigAmount.mul(bigDecimal);

            if (farm.type == farmType.ERC20_FIX_END) {
                const res = await farmInstance.methods.addReward(bigAmountDecimal.toString()).send({
                    from: walletAddress
                });
            }
            else {
                const res = await tokenContract.methods.transfer(farm.farmAddress, bigAmountDecimal.toString()).send({
                    'from': walletAddress
                });
            }
            success("Add rewards Completed!");
        } catch (e) {
            console.log(e);
            warn("Add rewards Failed!");
        }
        setIsAddLoading(false);
        setNotificationOpen(false);
    }

    const handleDailyReward = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsExtraLoading(true);
        const web3_farm = new Web3(provider());
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        const bigDailyReward = new BN(newDailyReward.toString(), 10);
        const dailyRewardDecimal = new BN(Math.floor(10 ** farm.rewardToken.decimals / (24 * 60 * 20)).toString(), 10);
        const rewardPerBlock = bigDailyReward.mul(dailyRewardDecimal);
        try {
            const res = await farmInstance.methods.setRewardPerBlock(rewardPerBlock.toString()).send({
                from: walletAddress
            });
            success("Set daily rewards Completed!");
        } catch (e) {
            console.log(e);
            warn("Set daily rewards Failed!");
        }
        setIsExtraLoading(false);
    }

    const handleEndDate = async () => {
        if (walletAddress === "") {
            notify();
            return;
        }
        setIsExtraLoading(true);
        const web3_farm = new Web3(provider());
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        const currentBlock = await web3_farm.eth.getBlockNumber();
        const end_timestamp = new Date(endDate) / 1000;
        const period = end_timestamp - new Date() / 1000;
        const block_count = period / 3;
        const endBlock = currentBlock + block_count;
        try {
            const res = await farmInstance.methods.setEndBlock(parseInt(endBlock)).send({
                from: walletAddress
            });
            success("Set end date Completed!");
        } catch (e) {
            console.log(e);
            warn("Set end date Failed!");
        }
        setIsExtraLoading(false);
    }

    useEffect(() => {
        if (walletAddress != "")
            getAdminInfo();
        else
            setMyShares(0);
    }, [walletAddress])

    const getEarnedInfo = async () => {
        const web3_farm = new Web3(provider());
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        let userInfo = await farmInstance.methods.pendingReward(walletAddress).call();
        const _earned = userInfo / (10 ** farm.rewardToken.decimals);
        setTokenEarned(_earned.toFixed(2));
        setUsdEarned((_earned * farm.rewardTokenPrice).toFixed(2));
    }

    const getAdminInfo = async () => {
        const web3_farm = new Web3(provider());
        const tokenContract = new web3_farm.eth.Contract(tokenAbi, farm.rewardToken.contractAddress);
        const farmInstance = new web3_farm.eth.Contract(farm.type === farmType.ERC20 ? erc20FarmAbi : erc20FarmFixEndAbi, farm.farmAddress);
        let userInfo = await farmInstance.methods.userInfo(walletAddress).call();
        const _earned = userInfo.rewardDebt / (10 ** farm.rewardToken.decimals);
        setTokenEarned(_earned.toFixed(2));
        setUsdEarned((_earned * farm.rewardTokenPrice).toFixed(2));
        const share_price = farm.type === farmType.ERC20_FIX_END ? await farmInstance.methods.stakePPS().call() : await farmInstance.methods.pricePerShare().call();
        const my_deposit = share_price * userInfo.shares / (10 ** farm.stakeToken.decimals);
        setMyShares(userInfo.shares);
        setMyDepositToken(my_deposit.toFixed(2));
        const contractBalance = await tokenContract.methods.balanceOf(farm.farmAddress).call();
        const currentBalance = await tokenContract.methods.balanceOf(walletAddress).call();
        setUserBalance((currentBalance / (10 ** farm.rewardToken.decimals)).toFixed(2));
        setRewardBalance((contractBalance / (10 ** farm.rewardToken.decimals)).toFixed(2));
        setDailyReward(farm.rewardPerBlock.toFixed(2));
    }


    useEffect(() => {
        if (typeof farm.token0.logo != "undefined") {
            setToken0Logo(farm.token0.logo);
        }
        if (typeof farm.token0.logo == "undefined") {
            const tokenInfo0 = token_list.tokens.find(token => token.symbol === farm.token0.symbol);
            setToken0Logo(typeof tokenInfo0 === "undefined" ? null : tokenInfo0?.logoURI);
        }
        if (typeof farm.token1.logo != "undefined") {
            setToken1Logo(farm.token1.logo);
        }
        if (typeof farm.token1.logo == "undefined") {
            const tokenInfo1 = token_list.tokens.find(token => token.symbol === farm.token1.symbol);
            setToken1Logo(typeof tokenInfo1 === "undefined" ? null : tokenInfo1?.logoURI);
        }

        if (typeof farm.rewardToken.logo != "undefined") {
            setRewardTokenLogo(farm.rewardToken.logo);
        }
        else {
            const tokenInfo0 = token_list.tokens.find(token => token.symbol === farm.rewardToken.symbol);
            setRewardTokenLogo(typeof tokenInfo0 === "undefined" ? null : tokenInfo0?.logoURI);
        }

        if (walletAddress != "")
            getAdminInfo();
        setProjectedDate(farm.endsIn);
    }, [farm]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (walletAddress != "") {
                getEarnedInfo()
            }
            setUpdateTime(new Date().getTime());
        }, 5000);
    }, [updateTime]);

    useEffect(() => {
        if (farm.type === farmType.ERC20)
            setProjectedDate(parseInt(rewardAmount / dailyReward) + farm.endsIn);
        else
            setProjectedDate(farm.endsIn);
    }, [rewardAmount]);

    useEffect(() => {
        setRewardAmount(0);
    }, [notificationOpen]);

    return (
        <>
            <div className="col-xl-4">
                <div className="card border-light border-1 d-flex justify-content-center p-4 card-wrapper" >
                    <div className="card-body">
                        <div>
                            <h4 className="fw-bold card-top">
                                <img src={token0Logo == null ? unknown_img : token0Logo} style={{ width: "54px", height: "54px" }} />
                                <img src={token1Logo == null ? unknown_img : token1Logo} className="second-image" />
                                <img src={rewardTokenLogo == null ? unknown_img : rewardTokenLogo} className="second-image" />
                                <br />{farm.token0.symbol}/{farm.token1.symbol}</h4>
                            <div className="pair-text"><i className="far fa-caret-square-down dropdown-icon" onClick={() => setHide(!isHide)}></i></div>
                        </div>
                        {!isHide &&
                            <div className="row">
                                <div className="col-6 apr-section">
                                    <p className='apr-text'><strong className='red-title'>APR <span className="d-inline-block" tabIndex="0" data-toggle="tooltip" data-placement="top" title="Note : APRs are provided for your convenience. APRs are constantly changing and do not represent guaranteed returns.">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" className='ml-4-mb-2'>
                                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z"></path>
                                        </svg>
                                    </span></strong><br /><br /><strong>{farm.apr}%</strong><br /></p>
                                </div>
                                <div className="col-6 earned-section">
                                    <p className="earned-text"><strong className='red-title'>Earned</strong><br /><strong>{tokenEarned}</strong><br /><strong>${usdEarned}</strong></p>
                                </div>
                                <div className="col-6 col-xl-6 liquidity-section">
                                    <p className="liquidity-text"><strong className='red-title'>Liquidity</strong><br /><strong>${farm.farmPrice}</strong></p>
                                </div>
                                <div className="col-6" style={{ height: "90px" }}>
                                    <p className='ends-date-text'><strong className='red-title'>Ends in</strong><br /><sub><strong>{farm.endsIn > 0 ? `${farm.endsIn} Days` : "Finished"} </strong></sub></p>
                                </div>
                                <div className="col-6">
                                    <p className='deposit-text'><strong className='red-title'>My deposit</strong><br />${(myDepositToken * farm.stakeTokenPrice).toFixed(2)}<br />
                                        <sub>
                                            <strong className='red-title'>{farm.token0.symbol} / {farm.token1.symbol}</strong></sub>
                                        <br /><sub><strong>{myDepositToken}</strong></sub><br /></p>
                                </div>
                                <div className="col-6">
                                    <p className='withdrawal-text'><strong className='red-title'>Max stake</strong><br /><sub><strong>{(farm.userStakeLimit / (10 ** farm.stakeToken.decimals)).toFixed(2)}</strong></sub
                                    ><br /><sub><strong className='red-title'>Withdrawal&nbsp;fee</strong></sub><br /><sub><strong>{farm.earlyWithdrawalFee / 100}%</strong></sub></p>
                                </div>
                                <div className="col" style={{ textAlign: "center" }}>
                                    <input type="number" className="deposit-input text-center" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                                </div>
                                {
                                    farm.farmOwner.toLowerCase() != walletAddress && <div className="col" style={{ textAlign: "center" }}>
                                        <button className="btn btn-primary deposit-button" data-bss-hover-animate="pulse" type="button" onClick={() => handleDeposit()}>{isButtonLoading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Deposit"}</button>
                                    </div>
                                }
                                {
                                    (farm.farmOwner.toLowerCase() != walletAddress && myShares != 0) && (<div className="col" style={{ textAlign: "center", marginTop: "18px" }}>
                                        <button className="btn btn-primary deposit-button" data-bss-hover-animate="pulse" type="button" onClick={() => handleWithdraw()}>{isButton1Loading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Withdraw"}</button>
                                    </div>)
                                }
                                {
                                    farm.farmOwner.toLowerCase() != walletAddress && <div className="col harvest-label">
                                        <button className="btn btn-primary harvest-button" data-bss-hover-animate="pulse" type="button" onClick={handleHarvest}>{isHarvestLoading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Harvest"}</button>
                                    </div>
                                }
                                {
                                    farm.farmOwner.toLowerCase() == walletAddress && <div className="col harvest-label">
                                        <button className="btn btn-primary harvest-button" data-bss-hover-animate="pulse" type="button" onClick={() => setNotificationOpen(true)}>Add Rewards</button>
                                    </div>
                                }
                                {
                                    farm.farmOwner.toLowerCase() == walletAddress && (<div className="col" style={{ textAlign: "center", marginTop: "18px" }}>
                                        <button className="btn btn-primary deposit-button" data-bss-hover-animate="pulse" type="button" onClick={() => handleWithdrawReward()}>{isButton1Loading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Withdraw Reward"}</button>
                                    </div>)
                                }
                                {
                                    farm.farmOwner.toLowerCase() == walletAddress && farm.type === farmType.ERC20 && (<>
                                        <div className="col" style={{ textAlign: "center" }}>
                                            <input type="number" className="admin-input text-center" value={newDailyReward} onChange={(e) => setNewDailyReward(e.target.value)} />
                                        </div>
                                        <div className="col" style={{ textAlign: "center", marginTop: "12px" }}>
                                            <button className="btn btn-primary deposit-button" data-bss-hover-animate="pulse" type="button" onClick={() => handleDailyReward()}>{isExtraLoading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Set Daily Reward"}</button>
                                        </div></>)
                                }
                                {
                                    farm.farmOwner.toLowerCase() == walletAddress && farm.type === farmType.ERC20_FIX_END && (
                                        <>
                                            <div className="col" style={{ textAlign: "center" }}>
                                                <input type="datetime-local" className="admin-input text-center" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                            </div>
                                            <div className="col" style={{ textAlign: "center", marginTop: "12px" }}>
                                                <button className="btn btn-primary deposit-button" data-bss-hover-animate="pulse" type="button" onClick={() => handleEndDate()}>{isExtraLoading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Set End Time"}</button>
                                            </div></>)
                                }
                                <div className="col-6 col-xl-6" style={{ textAlign: "center" }}>
                                    <p className="lock-time-text"><strong className='red-title'>lock time</strong><br />{parseInt(farm.minimumLockTime / (20 * 60 * 24))} days</p>
                                </div>
                                {/* <div className="col-6 col-xl-6" style={{ textAlign: "center" }}>
                                                <p className="min-stake-text">Min stake<br />{farm.userStakeLimit / (10 ** farm.stakeToken.decimals)}</p>
                                            </div> */}
                                <div className="col-12 col-xl-12 card-dropdown-section">
                                    <div className="dropdown">
                                        <button className="btn btn-primary dropdown-toggle info-button" aria-expanded="false" data-bs-toggle="dropdown" type="button">Info</button>
                                        <div className="dropdown-menu info-item-background">
                                            <a className="dropdown-item menu-item-strict border-radius-20" href={`https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${farm.stakeToken.contractAddress}`} target='_blank'>Get {farm.stakeToken.symbol}
                                                <i className="fas fa-external-link-alt menu-item-icon"></i>
                                            </a>
                                            <a className="dropdown-item menu-item-strict" href={`https://bscscan.com/address/${farm.stakeToken.contractAddress}`} target='_blank'>See token info
                                                <i className="fas fa-external-link-alt menu-item-icon"></i>
                                            </a>
                                            <a className="dropdown-item menu-item-strict" href={`https://bscscan.com/address/${farm.farmAddress}`} target='_blank'>View contract
                                                <i className="fas fa-external-link-alt menu-item-icon">
                                                </i>
                                            </a>
                                            <a className="dropdown-item menu-item-strict border-radius-17" onClick={() => addTokenToMetamask(farm.stakeToken)}>Add to Metamask
                                                <img src={metamask} style={{ width: "36px" }} />&nbsp;</a></div>
                                    </div>
                                </div>
                                {/* <div className="col-12 col-xl-12 bottom-badge">
                                                <span className="badge bg-primary badge-span">
                                                    <i className="fas fa-check-circle badge-core"></i>Core</span>
                                                <span className="badge bg-primary badge-hot"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 0 512 512" width="1em" height="1em" fill="currentColor">
                                                    <path d="M384 319.1C384 425.9 297.9 512 192 512s-192-86.13-192-192c0-58.67 27.82-106.8 54.57-134.1C69.54 169.3 96 179.8 96 201.5v85.5c0 35.17 27.97 64.5 63.16 64.94C194.9 352.5 224 323.6 224 288c0-88-175.1-96.12-52.15-277.2c13.5-19.72 44.15-10.77 44.15 13.03C215.1 127 384 149.7 384 319.1z"></path>
                                                </svg>Hot</span>
                                            </div> */}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Rodal visible={notificationOpen} onClose={hide} className="token-dlg-bg" width={350} height={450}>
                <div>
                    <h5 style={{ fontWeight: "bold", color: "white" }}>Add Rewards </h5>
                </div>
                <div style={{ marginTop: "36px", width: "100%", marginBottom: "24px", color: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Current Rewards</p>
                        <p>{rewardBalance}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Current Days Until End</p>
                        <p>{farm.endsIn}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Current Daily Rewards</p>
                        <p>{dailyReward}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                        <p>Amount to add</p>
                        <p>Balance: {userBalance}</p>
                    </div>
                    <input type="number" className='dlg-input-field' style={{ width: "100%", textAlign: "right" }} value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
                        <p>Projected Days Until End</p>
                        <p>{projectedDate}</p>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "18px", width: "100%" }}>
                    <button className="btn btn-primary" data-bss-hover-animate="pulse" type="button" onClick={addRewards}>{isAddLoading ? <div className="spinner-border primary" style={{ color: "white" }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div> : "Add"}</button>
                </div>
            </Rodal>
        </>
    );
};
