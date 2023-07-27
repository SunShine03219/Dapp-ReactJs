import React, { useEffect, useState } from 'react';
import '../create_farm.css';
import { isAddress } from "web3-utils";

export const Tab2 = (props) => {

    const {
        maxTokenAmount,
        setMaxTokenAmount,
        minimumLockTime,
        setMinimumLockTime,
        emergencyWithdrawFee,
        setEmergencyWithdrawFee,
        feeReceiver,
        setFeeReceiver
    } = props.functions;

    const handleNextButton = () => {
        if (maxTokenAmount === 0) {
            props.notify("Token amount cannot be zero");
            return;
        }

        // if (feeReceiver == "") {
        //     props.notify("Fee receiver cannot be null address");
        //     return;
        // }
        if (feeReceiver != "" && isAddress(feeReceiver) == false) {
            props.notify("Fee receiver address is not valid");
            return;
        }
        if (emergencyWithdrawFee > 100) {
            props.notify("Emergency withdraw fee cannot exceed 100%");
            return;
        }

        // if (emergencyWithdrawFee < 0.01) {
        //     props.notify("Emergency withdraw fee cannot below 0.01%");
        //     return;
        // }
        props.onNext(3);
    }

    return (
        <>
            <div className="row">
                <div className="col-6 col-sm-12 col-xl-12 tab1-main-content" >
                    <p className='paragraph-with-bg'><strong>Set maximum amount of tokens</strong></p>
                    <input type="search" className='tab1-input-field text-center' value={maxTokenAmount} onChange={(e) => setMaxTokenAmount(e.target.value)} />
                </div>
                <div className="col-6 col-sm-12 col-xl-12 text-center-mt-6">
                    <p className='paragraph-with-bg'><strong>Minimum lock time(days)</strong></p>
                    <input type="search" className='tab1-input-field text-center' value={minimumLockTime} onChange={(e) => setMinimumLockTime(e.target.value)} />
                </div>
                <div className="col-12 col-xl-12 text-center-mt-6">
                    <p className='paragraph-with-bg'><strong>Emergency withdraw fee(%)</strong></p>
                    <input type="search" className='tab1-input-field text-center' value={emergencyWithdrawFee} min="0.01" max="100" step="0.01" onChange={(e) => setEmergencyWithdrawFee(e.target.value)} />
                </div>
                <div className="col-12 col-xl-12 text-center-mt-6">
                    <p className='paragraph-with-bg'><strong>Emergency early withdrawal fee receiver</strong></p>
                    <input className='tab1-input-field text-center' value={feeReceiver} onChange={(e) => setFeeReceiver(e.target.value)} />
                </div>
                <div className="col-xl-12 button-section"><button className="btn btn-primary next-button" data-bss-hover-animate="pulse" type="button" onClick={handleNextButton}>Next</button>
                </div>
                <div className="col-xl-12 button-section"><button className="btn btn-primary next-button" data-bss-hover-animate="pulse" type="button" onClick={() => props.onNext(1)}>Back</button>
                </div>
            </div>
        </>
    );
};