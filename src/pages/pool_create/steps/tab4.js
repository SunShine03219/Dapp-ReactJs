import React, { useEffect, useState } from 'react';
import abi from '../../../contracts/tokenAbi';
import erc20FarmAbi from '../../../contracts/erc20FarmAbi';
import erc20FarmFixEndAbi from '../../../contracts/erc20FarmFixEndAbi';
import BN from 'bn.js';
import '../create_pool.css';
import { useNavigate } from 'react-router-dom';
import Rodal from 'rodal';

export const Tab4 = (props) => {

    const {
        mainToken,
        rewardToken,
        totalReward,
        poolAddress,
        walletAddress,
        poolType,
        web3
    } = props.values;

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const hide = () => {
        setNotificationOpen(false);
    }

    const handleNavigate = () => {
        navigate('/pool');
    }

    const handleFund = async () => {
        setIsLoading(true);
        try {
            const tokenAddress = rewardToken.address;
            const contractInstance = new web3.eth.Contract(abi, tokenAddress);
            const bigTotalReward = new BN(parseInt(totalReward).toString(), 10);
            const bigTokenDecimal = new BN((10 ** rewardToken.decimals).toString(), 10);
            const totalRewardDecimal = bigTokenDecimal.mul(bigTotalReward);
            let res = await contractInstance.methods.approve(poolAddress, totalRewardDecimal.toString()).send({
                'from': walletAddress
            });
            const farmInstance = new web3.eth.Contract(poolType === 1 ? erc20FarmAbi : erc20FarmFixEndAbi, poolAddress);
            if (poolType === 1) {
                res = await contractInstance.methods.transfer(poolAddress, totalRewardDecimal.toString()).send({
                    'from': walletAddress
                });
            }
            else if (poolType == 2) {
                res = await farmInstance.methods.addReward(totalRewardDecimal.toString()).send({
                    'from': walletAddress
                });
            }
            setIsLoading(false);
            if (typeof res == "undefined") {
                props.notify("Fund failed!");
                return;
            }
            props.success("Fund completed!");
            setNotificationOpen(true);
        } catch (e) {
            setIsLoading(false);
            props.notify("Fund failed!");
            return;
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-sm-12 col-xl-12 text-center-mt-6">
                    <p className="paragraph-with-bg align-left"><strong>Your pool has been created. Now we fund the rewards.</strong></p>
                </div>
                <div className="col-12 col-sm-12 col-xl-12 text-center-mt-6">
                    <p className="paragraph-with-bg align-left"><strong>Total rewards for the pool:&nbsp; {totalReward} {rewardToken.symbol}</strong><br /></p>
                </div>
                <div className="col-12 col-sm-12 col-xl-12 text-center-mt-6">
                    <div style={{ height: "13px" }}></div>
                    <p className="paragraph-with-bg align-left round-17-bg-mt-5"><strong>&nbsp; &nbsp; &nbsp; </strong><br /><
                        strong>&nbsp; &nbsp; &nbsp; {poolAddress}</strong><a href={`https://bscscan.com/address/${poolAddress}`} target="_blank"><i className="fas fa-external-link-alt"></i> </a><br /><br />
                        <img src={mainToken.logoURI} style={{ width: "14px", marginLeft: "14px" }} />&nbsp;{mainToken.symbol}<br />
                        <img src={rewardToken.logoURI} style={{ width: "14px", marginLeft: "14px" }} />&nbsp;{rewardToken.symbol}<br /><br />
                        &nbsp; &nbsp; &nbsp; Created by {walletAddress}<br /><br /></p>
                </div>
                <div className="col-xl-12 button-section">
                    <button className="btn btn-primary next-button" data-bss-hover-animate="pulse" type="button" onClick={handleFund}>
                        {isLoading ?
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> : "Fund"
                        }
                    </button>

                </div>
            </div>
            <Rodal visible={notificationOpen} onClose={hide} className="token-dlg-bg" width={350} height={250}>
                <div>
                    <h5 style={{ fontWeight: "bold" }}>Success</h5>
                </div>
                <div style={{ marginTop: "36px", width: "100%", marginBottom: "24px", textAlign: "center" }}>
                    <p>Your liquidity FARM/POOL was successfully launched.</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "18px", width: "100%" }}>
                    <button className="btn btn-primary" data-bss-hover-animate="pulse" type="button" onClick={handleNavigate}>OK</button>
                </div>
            </Rodal>
        </>
    );
};