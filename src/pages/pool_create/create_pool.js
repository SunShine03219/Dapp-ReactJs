import React, { useEffect, useState } from 'react';
import './create_pool.css';
import home_image from "../../assets/img/photo_2022-12-13_17-19-56.jpg";
import bnb_image from "../../assets/img/bnb.png";
import redg_image from "../../assets/img/red_g_coin.webp";
import metamask from '../../assets/img/1_WSFGfKauFXLC8RKZhR2c3w-removebg-preview.png';
// import Web3 from 'web3';
import abi from '../../contracts/erc20FarmAbi';
// import contractInstance from '../../contracts/lockInstance';
// import getContractsAddress from '../../contracts/contractsAddress';
import { NotificationManager } from 'react-notifications';
import { ToastContainer, toast } from 'react-toastify';
import { ProgressBar } from "react-milestone";
import 'react-toastify/dist/ReactToastify.css';

import useWeb3 from '../../components/useWeb3';

import { Tab1 } from './steps/tab1';
import { Tab2 } from './steps/tab2';
import { Tab3 } from './steps/tab3';
import { Tab4 } from './steps/tab4';

function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

// Simple counter using React Hooks
export const CreatePool = () => {
    const [hover, setHover] = useState(false);
    const [count, setCount] = useState(0);
    const [supply, setSupply] = useState(0);
    const [curStep, setCurStep] = useState(1);
    const { web3, walletAddress } = useWeb3();
    const [mainToken, setMainToken] = useState({});
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [rewardToken, setRewardToken] = useState({});
    const [dailyReward, setDailyReward] = useState(0);
    const [totalReward, setTotalReward] = useState(0);
    const [maxTokenAmount, setMaxTokenAmount] = useState(0);
    const [minimumLockTime, setMinimumLockTime] = useState(0);
    const [emergencyWithdrawFee, setEmergencyWithdrawFee] = useState(0);
    const [feeReceiver, setFeeReceiver] = useState("");
    const [poolAddress, setPoolAddress] = useState("");
    const [poolType, setPoolType] = useState(0);

    const notify = (msg) => toast.error(msg, {
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

    function createNotification(type) {
        return () => {
            switch (type) {
                case 'info':
                    NotificationManager.info('Info message');
                    break;
                case 'success':
                    NotificationManager.success('Success message', 'Success');
                    break;
                case 'error':
                    NotificationManager.success('Invalid input parameters', 'Failed');
                    break;
                case 'wallet':
                    NotificationManager.info('Connect your wallet');
                    break;
            }
        };
    };

    function renderTab() {
        switch (curStep) {
            case 1:
                return <Tab1 onNext={setCurStep} functions={
                    {
                        mainToken: mainToken,
                        rewardToken: rewardToken,
                        startDate: startDate,
                        endDate: endDate,
                        dailyReward: dailyReward,
                        totalReward: totalReward,
                        setMainToken: setMainToken,
                        setRewardToken: setRewardToken,
                        setStartDate: setStartDate,
                        setEndDate: setEndDate,
                        setDailyReward: setDailyReward,
                        setTotalReward: setTotalReward
                    }} notify={notify} />;
            case 2:
                return <Tab2 onNext={setCurStep} functions={
                    {
                        maxTokenAmount: maxTokenAmount,
                        setMaxTokenAmount: setMaxTokenAmount,
                        minimumLockTime: minimumLockTime,
                        setMinimumLockTime: setMinimumLockTime,
                        emergencyWithdrawFee: emergencyWithdrawFee,
                        setEmergencyWithdrawFee: setEmergencyWithdrawFee,
                        feeReceiver: feeReceiver,
                        setFeeReceiver: setFeeReceiver
                    }
                } notify={notify}
                />;
            case 3:
                return <Tab3 onNext={setCurStep} values={{
                    mainToken: mainToken,
                    startDate: startDate,
                    endDate: endDate,
                    rewardToken: rewardToken,
                    dailyReward: dailyReward,
                    totalReward: totalReward,
                    maxTokenAmount: maxTokenAmount,
                    minimumLockTime: minimumLockTime,
                    emergencyWithdrawFee: emergencyWithdrawFee,
                    feeReceiver: feeReceiver,
                    walletAddress: walletAddress,
                    poolAddress: poolAddress,
                    setPoolAddress: setPoolAddress,
                    setPoolType: setPoolType
                }} notify={notify} success={success} />
            case 4:
                return <Tab4 onNext={setCurStep}
                    values={{
                        mainToken: mainToken,
                        rewardToken: rewardToken,
                        totalReward: totalReward,
                        poolAddress: poolAddress,
                        poolType: poolType,
                        walletAddress: walletAddress,
                        web3: web3
                    }}
                    notify={notify} success={success} />;
        }
    }

    return (
        <>
            <header className="pt-5">
                <div className="container pt-4 pt-xl-5">
                    <div className="row pt-5">
                        <div className="col-12 col-lg-10 mx-auto">
                            <div className="text-center position-relative">
                                <img className="img-fluid" src={home_image} style={{ width: "800px", borderRadius: "18px" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section>
                <div className="container py-4 py-xl-5">
                    <div className="row gy-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                        <div className="col-xl-12">
                            <div className="card border-light border-1 d-flex justify-content-center p-4 main-card">
                                <div className="card-body bg-card-body">
                                    <div className="bg-card-cap">
                                        <h4 className="fw-bold card-text-center"><br />Single-Token pool creation</h4>
                                        <p style={{ textAlign: "center" }}><span style={{ color: "rgb(255, 255, 255)" }}>Stake tokens to receive rewards</span></p>
                                        {/* <div className='stick-bar-main'>
                                            <div className="stick-bar-content"></div>
                                        </div> */}
                                        <ProgressBar percentage={(curStep - 1) * 33} milestoneCount={4} style={{ marginBottom: "20px", backgroundColor: "#a32638" }}
                                        >
                                            {({ containerStyles, completedBarStyles, milestoneElements }) => {
                                                return (
                                                    <div style={{ ...containerStyles, backgroundColor: "white", color: "red" }}>
                                                        <div style={{ ...completedBarStyles, backgroundColor: "#a32638" }} />
                                                        {milestoneElements.map((milestone, index) => (
                                                            curStep >= index + 1 ?
                                                                <span key={index} className='numberCircle-complete' style={milestone.props.style}>
                                                                    {index + 1}
                                                                </span> :
                                                                <span key={index} className='numberCircle' style={milestone.props.style}>
                                                                    {index + 1}
                                                                </span>
                                                            // milestone
                                                        )
                                                        )}
                                                    </div>
                                                );
                                            }}
                                        </ProgressBar>
                                    </div>
                                    {renderTab()}
                                </div>
                            </div >
                        </div >
                    </div >
                </div >
            </section >
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};