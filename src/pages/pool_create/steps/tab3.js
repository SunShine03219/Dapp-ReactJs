import React, { useEffect, useState } from 'react';
import '../create_pool.css';
import Moralis from 'moralis';
import contractInstance from '../../../contracts/deployerInstance';
import BN from 'bn.js';
import { NULL_ADDRESS } from '../../../utils';

export const Tab3 = (props) => {
    const {
        mainToken,
        startDate,
        endDate,
        rewardToken,
        dailyReward,
        totalReward,
        maxTokenAmount,
        minimumLockTime,
        emergencyWithdrawFee,
        feeReceiver,
        walletAddress,
        setPoolAddress,
        setPoolType
    } = props.values;

    const [isLoading, setIsLoading] = useState(false);


    const handleNextButton = async () => {
        if (walletAddress == "") {
            props.notify("Connect your wallet first!");
            return;
        }
        setIsLoading(true);
        try {
            let date = new Date(startDate) / 1000;
            const response = await Moralis.EvmApi.block.getDateToBlock({
                date,
                chain: process.env.REACT_APP_CHAIN_ID
            });
            const startBlock = response.toJSON().block;
            const deployerContract = await contractInstance;
            const cost = await deployerContract.getDeploymentCost();
            // const maxTokenAmountWithDecimal = BigInt(maxTokenAmount) * BigInt(10 ** mainToken.decimals);
            const bigMaxToken = new BN(maxTokenAmount.toString(), 10);
            const maxTokenDecimal = new BN((10 ** mainToken.decimals).toString(), 10);
            const maxTokenAmountWithDecimal = bigMaxToken.mul(maxTokenDecimal);
            let poolType = 0;
            let deploymentRes = "";
            if (typeof endDate === "undefined") {
                const bigDailyReward = new BN(dailyReward.toString(), 10);
                const dailyRewardDecimal = new BN(Math.floor(10 ** rewardToken.decimals / (24 * 60 * 20)).toString(), 10);
                const rewardPerBlock = bigDailyReward.mul(dailyRewardDecimal);
                poolType = 1;
                deploymentRes = await deployerContract.deployERC20Farm(walletAddress, mainToken.address, rewardToken.address, startBlock, rewardPerBlock.toString(), maxTokenAmountWithDecimal.toString(), minimumLockTime * 20 * 60 * 24, emergencyWithdrawFee * 100, feeReceiver == "" ? NULL_ADDRESS : feeReceiver, false, cost)
            } else {
                const end_timestamp = new Date(endDate) / 1000;
                const period = end_timestamp - date;
                const block_count = period / 3;
                // const moralis_res = await Moralis.EvmApi.block.getDateToBlock({
                //     date,
                //     chain: process.env.REACT_APP_CHAIN_ID
                // });
                // const endBlock = moralis_res.toJSON().block;
                const endBlock = startBlock + block_count;
                poolType = 2;
                deploymentRes = await deployerContract.deployERC20FarmFixEnd(walletAddress, mainToken.address, rewardToken.address, startBlock, parseInt(endBlock), maxTokenAmountWithDecimal.toString(), minimumLockTime * 20 * 60 * 24, emergencyWithdrawFee * 100, feeReceiver == "" ? NULL_ADDRESS : feeReceiver, cost)
            }
            if (typeof deploymentRes == "undefined") {
                setIsLoading(false);
                props.notify("Pool deployment is failed!");
                return;
            }

            setPoolAddress(poolType === 1 ? deploymentRes.events?.DeployedERC20Farm?.returnValues?.farmAddress : deploymentRes.events?.DeployedERC20FarmFixEnd?.returnValues?.farmAddress);
            setPoolType(poolType);
            setIsLoading(false);
            props.success("Your liquidity farm/pool was successfully launched.");
            props.onNext(4);
        } catch (e) {
            setIsLoading(false);
            props.notify("Pool deployment is failed!");
            return;
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-6 col-sm-12 col-xl-6 text-center-mt-6">
                    <p className="paragraph-with-bg align-left"><strong>Type</strong><br /><br /><strong>Staked tokens</strong><br /><br /><strong>Start time</strong><br /><br /><strong>End time</strong></p>
                </div>
                <div className="col-6 col-sm-12 col-xl-6 text-center-mt-6">
                    <p className="paragraph-with-bg align-right"><strong>Single token pool</strong><br /><br />
                        <img src={mainToken.logoURI} width="20px" />
                        <strong>{mainToken.symbol}</strong><br /><br />
                        <strong>{startDate}</strong><br /><br />
                        <strong>&nbsp;{typeof endDate === "undefined" ? "-" : endDate}</strong></p>
                </div>
                <div className="col-6 col-sm-12 col-xl-6 text-center-mt-6">
                    <p className="paragraph-with-bg align-left">
                        <strong>Reward</strong><br />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 0 512 512" width="1em" height="1em" fill="currentColor" style={{ fontSize: "11px" }}>
                            <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"></path>
                        </svg>&nbsp;Address<br /><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" style={{ fontSize: "11px" }}>
                            <path d="M152 0H154.2C186.1 0 215.7 16.91 231.9 44.45L256 85.46L280.1 44.45C296.3 16.91 325.9 0 357.8 0H360C408.6 0 448 39.4 448 88C448 102.4 444.5 115.1 438.4 128H480C497.7 128 512 142.3 512 160V224C512 241.7 497.7 256 480 256H32C14.33 256 0 241.7 0 224V160C0 142.3 14.33 128 32 128H73.6C67.46 115.1 64 102.4 64 88C64 39.4 103.4 0 152 0zM190.5 68.78C182.9 55.91 169.1 48 154.2 48H152C129.9 48 112 65.91 112 88C112 110.1 129.9 128 152 128H225.3L190.5 68.78zM360 48H357.8C342.9 48 329.1 55.91 321.5 68.78L286.7 128H360C382.1 128 400 110.1 400 88C400 65.91 382.1 48 360 48V48zM32 288H224V512H80C53.49 512 32 490.5 32 464V288zM288 512V288H480V464C480 490.5 458.5 512 432 512H288z"></path>
                        </svg>&nbsp;Daily rewards<br /><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" style={{ fontSize: "11px" }}>
                            <path d="M512 80C512 98.01 497.7 114.6 473.6 128C444.5 144.1 401.2 155.5 351.3 158.9C347.7 157.2 343.9 155.5 340.1 153.9C300.6 137.4 248.2 128 192 128C183.7 128 175.6 128.2 167.5 128.6L166.4 128C142.3 114.6 128 98.01 128 80C128 35.82 213.1 0 320 0C426 0 512 35.82 512 80V80zM160.7 161.1C170.9 160.4 181.3 160 192 160C254.2 160 309.4 172.3 344.5 191.4C369.3 204.9 384 221.7 384 240C384 243.1 383.3 247.9 381.9 251.7C377.3 264.9 364.1 277 346.9 287.3C346.9 287.3 346.9 287.3 346.9 287.3C346.8 287.3 346.6 287.4 346.5 287.5L346.5 287.5C346.2 287.7 345.9 287.8 345.6 288C310.6 307.4 254.8 320 192 320C132.4 320 79.06 308.7 43.84 290.9C41.97 289.9 40.15 288.1 38.39 288C14.28 274.6 0 258 0 240C0 205.2 53.43 175.5 128 164.6C138.5 163 149.4 161.8 160.7 161.1L160.7 161.1zM391.9 186.6C420.2 182.2 446.1 175.2 468.1 166.1C484.4 159.3 499.5 150.9 512 140.6V176C512 195.3 495.5 213.1 468.2 226.9C453.5 234.3 435.8 240.5 415.8 245.3C415.9 243.6 416 241.8 416 240C416 218.1 405.4 200.1 391.9 186.6V186.6zM384 336C384 354 369.7 370.6 345.6 384C343.8 384.1 342 385.9 340.2 386.9C304.9 404.7 251.6 416 192 416C129.2 416 73.42 403.4 38.39 384C14.28 370.6 .0003 354 .0003 336V300.6C12.45 310.9 27.62 319.3 43.93 326.1C83.44 342.6 135.8 352 192 352C248.2 352 300.6 342.6 340.1 326.1C347.9 322.9 355.4 319.2 362.5 315.2C368.6 311.8 374.3 308 379.7 304C381.2 302.9 382.6 301.7 384 300.6L384 336zM416 278.1C434.1 273.1 452.5 268.6 468.1 262.1C484.4 255.3 499.5 246.9 512 236.6V272C512 282.5 507 293 497.1 302.9C480.8 319.2 452.1 332.6 415.8 341.3C415.9 339.6 416 337.8 416 336V278.1zM192 448C248.2 448 300.6 438.6 340.1 422.1C356.4 415.3 371.5 406.9 384 396.6V432C384 476.2 298 512 192 512C85.96 512 .0003 476.2 .0003 432V396.6C12.45 406.9 27.62 415.3 43.93 422.1C83.44 438.6 135.8 448 192 448z"></path>
                        </svg>&nbsp;Total rewards<br /><br /></p>
                </div>
                <div className="col-6 col-sm-12 col-xl-6 text-center-mt-6">
                    <p className="paragraph-with-bg align-right">
                        <img src={rewardToken.logoURI} width="20px" /> <strong>{rewardToken.symbol}</strong><br />
                        <strong>{rewardToken.address}</strong>
                        <br />
                        <strong>{dailyReward}</strong>
                        <br />
                        <strong>{totalReward}</strong>
                    </p>
                </div>
                <div className="col-6 col-xl-6 text-center-mt-6">
                    <p className="paragraph-with-bg align-left"><sub><strong>Max amount of tokens</strong></sub><br /><sub><strong>Minimum lock time</strong></sub><br /><sub><strong>Emergency withdraw fee</strong></sub><br /><sub><strong>Emergency fee address</strong></sub></p>
                </div>
                <div className="col-6 col-xl-6 text-center-mt-6">
                    <p className="paragraph-with-bg align-right">
                        <strong>{maxTokenAmount}</strong><br />
                        <strong>{minimumLockTime} days</strong><br />
                        <strong>{emergencyWithdrawFee} %</strong><br />
                        <strong>{feeReceiver}</strong></p>
                </div>
                <div className="col-12 col-xl-12 align-center">
                    <p className="paragraph-with-bg "><br /><strong><span className='caution-red'>*Don't forget to exclude farm address from any token fees/taxes after farm deployment, if possible.*</span></strong><br /><br /></p>
                </div>
                {isLoading && <div className="col-12 col-xl-12 align-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                }
                <div className="col-xl-6 button-section">
                    <button className="btn btn-primary next-button ml-0" data-bss-hover-animate="pulse" type="button" onClick={() => handleNextButton()}>
                        Next
                    </button></div>
                <div className="col-xl-6 button-section">
                    <button className="btn btn-primary next-button ml-0" data-bss-hover-animate="pulse" type="button" onClick={() => props.onNext(2)}>Back</button></div>
            </div>
        </>
    );
};