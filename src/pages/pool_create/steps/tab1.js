import React, { useEffect, useState } from 'react';
import { ProgressBar } from "react-milestone";
import Rodal from 'rodal';
import '../create_pool.css';
import 'rodal/lib/rodal.css';
import { isAddress } from "web3-utils";
import Moralis from 'moralis';
import token_list from '../../../token_list/pancakeswap-mini';
import redg_logo from '../../../assets/img/red_g_coin.webp';

function toPlainString(num) {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

export const Tab1 = (props) => {
    const {
        mainToken,
        rewardToken,
        startDate,
        endDate,
        dailyReward,
        totalReward,
        setMainToken,
        setRewardToken,
        setStartDate,
        setEndDate,
        setDailyReward,
        setTotalReward
    } = props.functions;

    const [tokenDlgOpen, setTokenDlgOpen] = useState(false);
    const [dlgMode, setDlgMode] = useState(0);
    const [inputType, setInputType] = useState("text");
    const [searchValue, setSearchValue] = useState("");
    const [displayDate, setDisplayDate] = useState();
    let matchCount = 0;
    const hide = () => {
        setTokenDlgOpen(false);
    }

    function ellipseAddress(
        address = "",
        width = 10
    ) {
        return `${address.slice(0, width)}...${address.slice(-width)}`;
    }

    const selectToken = (token) => {
        dlgMode === 0 ? setMainToken(token) : setRewardToken(token);
        setTokenDlgOpen(false);
    }

    function toLocal(date) {
        var local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON();
    }

    const handleNextButton = () => {
        if (Object.keys(mainToken).length === 0 || Object.keys(rewardToken).length === 0) {
            props.notify("Tokens cannot be empty");
            return;
        }
        if (dailyReward === 0 || totalReward == 0) {
            props.notify("Rewards cannot be zero");
            return;
        }
        props.onNext(2);
    }

    const getTokenMetadata = async (tokens) => {
        const addresses = tokens;

        const response = await Moralis.EvmApi.token.getTokenMetadata({
            addresses,
            chain: process.env.REACT_APP_CHAIN_ID,
        });

        const tokenData = (response.toJSON())[0].token;
        if (toPlainString(tokenData.contractAddress) === toPlainString(process.env.REACT_APP_TOKEN_ADDRESS))
            tokenData.logo = redg_logo;
        return tokenData;
    }

    const handleForce = async () => {
        if (!isAddress(searchValue)) {
            props.notify("Token address is not valid");
            return;
        }

        const tokenData = await getTokenMetadata([searchValue]);
        if (tokenData.symbol === '') {
            props.notify("Token address is not valid");
            return;
        }
        const newToken = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            address: tokenData.contractAddress,
            chainId: tokenData.chain,
            decimals: tokenData.decimals,
            logoURI: toPlainString(tokenData.contractAddress) === toPlainString(process.env.REACT_APP_TOKEN_ADDRESS) ? redg_logo : ""
        }
        dlgMode === 0 ? setMainToken(newToken) : setRewardToken(newToken);
        setTokenDlgOpen(false);
        setSearchValue("");
    }

    const handleDailyReward = (e) => {
        setDailyReward(e);
        if (endDate == "" || typeof endDate === "undefined") {
            if (totalReward != 0) {
                const days = totalReward / e;
                const newDate = new Date(startDate).getTime() + days * 24 * 3600 * 1000;
                setDisplayDate(toLocal(new Date(newDate)).slice(0, 19));
            }
        }
        else {
            setDisplayDate(endDate);
            const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 24 * 3600);
            setTotalReward((e * days).toFixed(3));
        }
    }

    const handleTotalReward = (e) => {
        setTotalReward(e);
        if (endDate == "" || typeof endDate === "undefined") {
            if (dailyReward != 0) {
                const days = e / dailyReward;
                const newDate = new Date(startDate).getTime() + days * 24 * 3600 * 1000;
                setDisplayDate(toLocal(new Date(newDate)).slice(0, 19));
            }
        }
        else {
            setDisplayDate(endDate);
            const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 24 * 3600);
            setDailyReward((e / days).toFixed(3));
        }
    }

    const handleEndTime = (e) => {
        setEndDate(e);
        setDisplayDate(e);
        const days = (new Date(e).getTime() - new Date(startDate).getTime()) / (1000 * 24 * 3600);
        const newTotal = dailyReward * days;
        setTotalReward(newTotal.toFixed(3));
    }

    useEffect(() => {
        setStartDate(toLocal(new Date()).slice(0, 19));
        setDisplayDate(toLocal(new Date()).slice(0, 19));
        // setEndDate(toLocal(new Date()).slice(0, 19));
    }, []);

    return (
        <>
            <div className="row">
                <div className="col-12 col-xl-12 tab1-main-content">
                    <p style={{ fontSize: "10px" }}><strong>Select token users will stake</strong></p>
                    <input type="search" className='tab1-input-field text-center' value={Object.keys(mainToken).length ? `${mainToken?.symbol}(address: ${ellipseAddress(mainToken?.address, 5)})` : ""} readOnly onClick={() => {
                        setTokenDlgOpen(true);
                        setDlgMode(0);
                    }} placeholder="Search" />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className="col-6 col-xl-6" style={{ textAlign: "center", height: "90px" }}>
                        <p className='paragraph-with-bg'><strong>Start Time</strong>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" className='ml-4-mb-2'>
                                <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z"></path>
                            </svg></p>
                        <input type="datetime-local" className='tab1-input-field text-center' value={startDate} onChange={(e) => setStartDate(e.target.value)} min={toLocal(new Date()).slice(0, 19)} max="2030-12-31T23:59:59" />
                    </div>
                    <div className="col-6" style={{ height: "90px", textAlign: "center" }}>
                        <p className="paragraph-with-bg" style={{ textAlign: "center" }}><strong>End Time</strong><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" className='ml-4-mb-2'>
                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z"></path>
                        </svg></p>
                        <input type={inputType} className='tab1-input-field text-center'
                            value={endDate} onChange={(e) => handleEndTime(e.target.value)} placeholder="Optional" onClick={(e) => {
                                setInputType("datetime-local")
                                setEndDate(startDate);
                            }} max="2030-12-31T23:59:59" />
                    </div>
                </div>
                <div className="col-6 col-sm-12 col-xl-12 text-center-mt-6">
                    <p className='paragraph-with-bg'><strong>Select token users will be rewarded</strong></p>
                    <input type="search" className='tab1-input-field text-center' placeholder="Search" readOnly value={Object.keys(rewardToken).length ? `${rewardToken?.symbol}(address: ${ellipseAddress(rewardToken?.address, 5)})` : ""} onClick={() => {
                        setTokenDlgOpen(true);
                        setDlgMode(1);
                    }} />
                </div>
                <div className="col-6 col-sm-12 col-xl-12 text-center-mt-6">
                    <p className='paragraph-with-bg'><strong>Daily rewards<br /><br /></strong></p>
                    <input type="search" className='tab1-input-field text-center' value={dailyReward} onChange={(e) => handleDailyReward(e.target.value)} />
                </div>
                <div className="col-12 col-xl-12 text-center-mt-6">
                    <p className='paragraph-with-bg'><strong>Total rewards</strong></p>
                    <input type="search" className='tab1-input-field text-center' value={totalReward} onChange={(e) => handleTotalReward(e.target.value)} />
                </div>
                <div className="col-12 col-xl-12" style={{ textAlign: "center" }}>
                    <p className='paragraph-with-bg'><br /><strong><span style={{ backgroundColor: "rgba(0, 59, 89, 0)" }}>*Expected to start from {startDate}&nbsp;and run until rewards run out in {displayDate}.&nbsp;There may be slight differences between actual and expected block numbers.*</span></strong><br /><br /></p>
                </div>
                <div className="col-xl-12 button-section">
                    <button className="btn btn-primary next-button" data-bss-hover-animate="pulse" type="button" onClick={() => handleNextButton()}>Next</button>
                </div>
            </div>
            <Rodal visible={tokenDlgOpen} onClose={hide} className="token-dlg-bg" width={350} height={500}>
                <div>
                    <h5 style={{ fontWeight: "bold" }}>Select a Token</h5>
                </div>
                <div style={{ marginTop: "36px", width: "100%", marginBottom: "24px" }}>
                    <input type="search" className='dlg-input-field text-center' style={{ width: "100%" }} placeholder="Search name or paste address" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                </div>
                <div style={{ overflow: "auto", height: "60%" }} >
                    {
                        token_list.tokens.map((token, index) => (searchValue === "" || (token?.symbol.toLowerCase().includes(searchValue.toLowerCase()))) &&
                            <div key={index} className="token-div" style={{ display: "flex", flexDirection: "row" }} onClick={() => selectToken(token)}>
                                <img src={token.logoURI} alt={token.symbol.at(0)} width="28px" height="28px" style={{ borderRadius: "50%", marginRight: "12px", marginTop: '4px' }} />
                                <div style={{ display: "flex", flexDirection: "column", marginTop: "0px" }}>
                                    <span style={{ fontSize: "13px", fontWeight: "bold" }}>{token.symbol}</span>
                                    <span style={{ fontSize: "11px" }}>{token.name}</span>
                                </div>
                                <span style={{ display: "none" }}>{matchCount++}</span>
                            </div>)
                    }
                    {
                        matchCount == 0 && <div style={{ textAlign: "center" }}>No results found </div>
                    }
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "18px", width: "100%" }}>
                    <button className="btn btn-primary" data-bss-hover-animate="pulse" type="button" onClick={handleForce}>Proceed Anyway</button>
                </div>
            </Rodal>
        </>
    );
};