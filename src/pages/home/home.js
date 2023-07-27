import React, { useEffect, useState } from 'react';
import './home.css';
import home_image from "../../assets/img/photo_2022-12-13_17-16-08.jpg";
import bnb_image from "../../assets/img/bnb.png";
import redg_image from "../../assets/img/red_g_coin.webp";
import creed_image from "../../assets/img/creed_onetransparent.png";
import acake47_image from "../../assets/img/acake47logotransparent.png";
import peped_image from "../../assets/img/pepedaologo.png";
import redr_image from "../../assets/img/redrlogo.png";
import pangea_image from "../../assets/img/Pangealvlogo.png";
import man_image from "../../assets/img/lastmanstandinglogo.png";
import metamask from '../../assets/img/1_WSFGfKauFXLC8RKZhR2c3w-removebg-preview.png';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tokenAbi from '../../contracts/tokenAbi';
import useWeb3 from '../../components/useWeb3';
import Moralis from 'moralis';
import redg_logo from '../../assets/img/red_g_coin.webp';
import { DeployedERC20Farm, DeployedERC20FarmFixEnd, topics, inputs, farmType } from '../../contracts/eventAbi';
import erc20FarmAbi from '../../contracts/erc20FarmAbi';
import erc20FarmFixEndAbi from '../../contracts/erc20FarmFixEndAbi';
import lpAbi from '../../contracts/lpAbi';
import getContractsAddress from '../../contracts/contractsAddress';
import { FarmCard } from './farm_card';
import { BN } from 'bn.js';
import { PLATFORM_START_DATE } from '../../utils';

function toPlainString( num ) {
    return ( '' + +num ).replace( /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function ( a, b, c, d, e ) {
            return e < 0
                ? b + '0.' + Array( 1 - e - c.length ).join( 0 ) + c + d
                : b + c + d + Array( e - d.length + 1 ).join( 0 );
        } );
}

// Simple counter using React Hooks
export const Home = () => {
    const [ hover, setHover ] = useState( false );
    const [ count, setCount ] = useState( 0 );
    const [ supply, setSupply ] = useState( 0 );
    const { web3, walletAddress } = useWeb3();
    const [ poolList, setPoolList ] = useState( [] );
    const [ isApproved, setIsApproved ] = useState( false );
    const [ reRender, setRerender ] = useState( false );
    const [ depositAmount, setDepositAmount ] = useState( 0 );
    const [ isButtonLoading, setIsButtonLoading ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ displayMode, setDisplayMode ] = useState( 0 );
    const notify = () => toast.info( 'Connect your wallet', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    } );

    const getTokenMetadata = async ( tokens ) => {
        const addresses = tokens;

        const response = await Moralis.EvmApi.token.getTokenMetadata( {
            addresses,
            chain: process.env.REACT_APP_CHAIN_ID,
        } );

        const tokenData = ( response.toJSON() )[ 0 ].token;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_TOKEN_ADDRESS ) )
            tokenData.logo = redg_logo;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_CREED_ADDRESS ) )
            tokenData.logo = creed_image;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_ACAKE47_ADDRESS ) )
            tokenData.logo = acake47_image;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_PEPED_ADDRESS ) )
            tokenData.logo = peped_image;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_REDR_ADDRESS ) )
            tokenData.logo = redr_image;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_PANGEA_ADDRESS ) )
            tokenData.logo = pangea_image;
        if ( toPlainString( tokenData.contractAddress ) === toPlainString( process.env.REACT_APP_MAN_ADDRESS ) )
            tokenData.logo = man_image;
        return tokenData;
    }

    const getTokenReserve = async ( pairAddress, decimal0, decimal1 ) => {
        const response = await Moralis.EvmApi.defi.getPairReserves( {
            pairAddress,
            chain: process.env.REACT_APP_CHAIN_ID,
        } );
        const reserves = response.toJSON();
        const reserve0 = reserves.reserve0 / 10 ** decimal0;
        const reserve1 = reserves.reserve1 / 10 ** decimal1;
        return {
            usdPrice: ( 1 / ( reserve1 / reserve0 ) ).toFixed( 7 )
        };
    }

    async function getEvents() {
        setIsLoading( true );
        const web3_inline = new Web3( new Web3.providers.HttpProvider( process.env.REACT_APP_HTTP_PROVIDER ) );

        const fixed_response = await Moralis.EvmApi.events.getContractLogs( {
            address: getContractsAddress( parseInt( process.env.REACT_APP_CHAIN_ID ) ),
            chain: process.env.REACT_APP_CHAIN_ID,
            topic0: topics.erc20FixEnd,
        } );
        const fixed_logs = fixed_response.toJSON();
        let pool_array = [];
        for ( var i = 0; i < fixed_logs.length; i++ ) {
            const log = fixed_logs[ i ];
            try {
                const data = await web3_inline.eth.abi.decodeLog( inputs.deployedERC20FarmFixEnd, log.data, [ topics.erc20FixEnd ] );
                if ( data._startBlock < PLATFORM_START_DATE )
                    continue;
                const farmOwner = data.owner;
                const stakeTokenData = await getTokenMetadata( [ data._stakeToken ] );
                const rewardTokenData = await getTokenMetadata( [ data._rewardToken ] );
                if ( stakeTokenData.symbol.toLowerCase().includes( "-lp" ) ) {
                    const lpContract = new web3_inline.eth.Contract( lpAbi, stakeTokenData.contractAddress );
                    const token0 = await lpContract.methods.token0().call();
                    const token1 = await lpContract.methods.token1().call();
                    const token0Data = await getTokenMetadata( [ token0 ] );
                    const token1Data = await getTokenMetadata( [ token1 ] );
                    const tokenContract = new web3_inline.eth.Contract( tokenAbi, rewardTokenData.contractAddress );
                    const tokenBalance = await tokenContract.methods.balanceOf( data.farmAddress ).call();
                    const tokenPrice = await getTokenPrice( rewardTokenData.contractAddress );
                    // const tokenPrice = { usdPrice: 0.269 };
                    const farmPrice = tokenPrice.usdPrice * ( tokenBalance / 10 ** rewardTokenData.decimals );
                    const mainTokenPrice = await getTokenReserve( stakeTokenData.contractAddress, token0Data.decimals, token1Data.decimals );
                    // const mainTokenPrice = { usdPrice: 0.43 };
                    let type = farmType.ERC20_FIX_END;
                    let farmInstance = new web3_inline.eth.Contract( erc20FarmFixEndAbi, data.farmAddress );

                    let stakeTotalShares = await farmInstance.methods.stakeTotalShares().call();
                    const share_price = await farmInstance.methods.stakePPS().call();
                    const total_staked = stakeTotalShares * share_price / ( 10 ** stakeTokenData.decimals );

                    const current_block_number = await web3_inline.eth.getBlockNumber();
                    let final_block_number = await farmInstance.methods.endBlock().call();
                    let rewardPerBlock = await farmInstance.methods.rewardPerBlock().call();
                    const RPS = await farmInstance.methods.rewardPPS().call();
                    rewardPerBlock = rewardPerBlock * RPS;
                    const dailyReward = ( rewardPerBlock * 20 * 60 * 24 ) / ( 10 ** rewardTokenData.decimals );

                    let bogged_res = await fetch( `https://api.bogged.finance/v1/token_volume?hrs=24&token=${ token1.toLowerCase() == process.env.REACT_APP_WBNB_ADDRESS.toLowerCase() ? token0 : token1 }&chain=bsc&api_key=Y6nhoCxSBh2k8yccVsDd` );
                    const trading_volume = await bogged_res.json();

                    bogged_res = await fetch( `https://api.bogged.finance/v1/token_liquidity?token=${ token1.toLowerCase() == process.env.REACT_APP_WBNB_ADDRESS.toLowerCase() ? token0 : token1 }&chain=bsc&api_key=Y6nhoCxSBh2k8yccVsDd` );
                    const liquidity = await bogged_res.json();

                    let apr = ( trading_volume.data.vol_24h_usd * 365 * 0.17 / 100 ) / liquidity.data.liq_usd;
                    if ( liquidity.data.liq_usd == 0 ) apr = 0;
                    apr = ( ( apr.toFixed( 2 ) ) * 100 ).toFixed( 2 );

                    pool_array.push( {
                        farmOwner: farmOwner,
                        farmAddress: data.farmAddress,
                        stakeToken: stakeTokenData,
                        rewardToken: rewardTokenData,
                        stakeTokenPrice: mainTokenPrice.usdPrice,
                        rewardTokenPrice: tokenPrice.usdPrice,
                        token0: token0Data,
                        token1: token1Data,
                        earlyWithdrawalFee: data._earlyWithdrawalFee,
                        feeReceiver: data._feeReceiver,
                        minimumLockTime: data._minimumLockTime,
                        rewardPerBlock: dailyReward,
                        startBlock: data._startBlock,
                        userStakeLimit: data._userStakeLimit,
                        farmPrice: farmPrice.toFixed( 2 ),
                        endsIn: parseInt( ( final_block_number - current_block_number ) * 3 / ( 3600 * 24 ) ),
                        myDeposit: 0,
                        depositTokenAmount: 0,
                        earned: 0,
                        earnedUsd: 0,
                        apr: apr,
                        type: type
                    } )
                }
            } catch ( e ) {
                console.log( e );
                continue;
            }
        }

        const response = await Moralis.EvmApi.events.getContractLogs( {
            address: getContractsAddress( parseInt( process.env.REACT_APP_CHAIN_ID ) ),
            chain: process.env.REACT_APP_CHAIN_ID,
            topic0: topics.erc20,
        } );
        const logs = response.toJSON();
        for ( var i = 0; i < logs.length; i++ ) {
            const log = logs[ i ];
            try {
                const data = await web3_inline.eth.abi.decodeLog( inputs.deployedERC20Farm, log.data, [ topics.erc20 ] );
                if ( data._startBlock < PLATFORM_START_DATE )
                    continue;
                const farmOwner = data.owner;
                const stakeTokenData = await getTokenMetadata( [ data._stakeToken ] );
                const rewardTokenData = await getTokenMetadata( [ data._rewardToken ] );
                if ( stakeTokenData.symbol.toLowerCase().includes( "-lp" ) ) {
                    const lpContract = new web3_inline.eth.Contract( lpAbi, stakeTokenData.contractAddress );
                    const token0 = await lpContract.methods.token0().call();
                    const token1 = await lpContract.methods.token1().call();
                    const token0Data = await getTokenMetadata( [ token0 ] );
                    const token1Data = await getTokenMetadata( [ token1 ] );
                    const tokenContract = new web3_inline.eth.Contract( tokenAbi, rewardTokenData.contractAddress );
                    const tokenBalance = await tokenContract.methods.balanceOf( data.farmAddress ).call();
                    const tokenPrice = await getTokenPrice( rewardTokenData.contractAddress );
                    // const tokenPrice = { usdPrice: 0.269 };
                    const farmPrice = tokenPrice.usdPrice * ( tokenBalance / 10 ** rewardTokenData.decimals );
                    const mainTokenPrice = await getTokenReserve( stakeTokenData.contractAddress, token0Data.decimals, token1Data.decimals );
                    // const mainTokenPrice = { usdPrice: 0.43 };
                    let type = farmType.ERC20;
                    let farmInstance = new web3_inline.eth.Contract( erc20FarmAbi, data.farmAddress );

                    let stakeTotalShares = await farmInstance.methods.stakeTotalShares().call();
                    const share_price = await farmInstance.methods.pricePerShare().call();
                    const total_staked = stakeTotalShares * share_price / ( 10 ** stakeTokenData.decimals );

                    const current_block_number = await web3_inline.eth.getBlockNumber();
                    let final_block_number = await farmInstance.methods.getFinalBlockNumber().call();
                    let rewardPerBlock = await farmInstance.methods.rewardPerBlock().call();
                    const dailyReward = ( rewardPerBlock * 20 * 60 * 24 ) / ( 10 ** rewardTokenData.decimals );

                    let bogged_res = await fetch( `https://api.bogged.finance/v1/token_volume?hrs=24&token=${ token1.toLowerCase() == process.env.REACT_APP_WBNB_ADDRESS.toLowerCase() ? token0 : token1 }&chain=bsc&api_key=Y6nhoCxSBh2k8yccVsDd` );
                    const trading_volume = await bogged_res.json();

                    bogged_res = await fetch( `https://api.bogged.finance/v1/token_liquidity?token=${ token1.toLowerCase() == process.env.REACT_APP_WBNB_ADDRESS.toLowerCase() ? token0 : token1 }&chain=bsc&api_key=Y6nhoCxSBh2k8yccVsDd` );
                    const liquidity = await bogged_res.json();

                    let apr = ( trading_volume.data.vol_24h_usd * 365 * 0.17 / 100 ) / liquidity.data.liq_usd;

                    if ( liquidity.data.liq_usd == 0 ) apr = 0;
                    apr = ( ( apr.toFixed( 2 ) ) * 100 ).toFixed( 2 );

                    pool_array.push( {
                        farmOwner: farmOwner,
                        farmAddress: data.farmAddress,
                        stakeToken: stakeTokenData,
                        stakeTokenPrice: mainTokenPrice.usdPrice,
                        rewardTokenPrice: tokenPrice.usdPrice,
                        token0: token0Data,
                        token1: token1Data,
                        rewardToken: rewardTokenData,
                        earlyWithdrawalFee: data._earlyWithdrawalFee,
                        feeReceiver: data._feeReceiver,
                        minimumLockTime: data._minimumLockTime,
                        rewardPerBlock: dailyReward,
                        startBlock: data._startBlock,
                        userStakeLimit: data._userStakeLimit,
                        farmPrice: farmPrice.toFixed( 2 ),
                        endsIn: parseInt( ( final_block_number - current_block_number ) * 3 / ( 3600 * 24 ) ),
                        myDeposit: 0,
                        depositTokenAmount: 0,
                        earned: 0,
                        earnedUsd: 0,
                        apr: apr,
                        type: type
                    } )
                }
            } catch ( e ) {
                console.log( e );
                continue;
            }
        }
        setPoolList( pool_array );
        setIsLoading( false );
    }

    useEffect( () => {
        getEvents();
        setRerender( false );
    }, [] );

    const getTokenPrice = async ( address ) => {
        const response = await Moralis.EvmApi.token.getTokenPrice( {
            address,
            chain: process.env.REACT_APP_CHAIN_ID,
            // chain: "0x38",
        } );

        return response.toJSON();
    }

    const provider = () => {
        // 1. Try getting newest provider
        const { ethereum } = window
        if ( ethereum ) return ethereum

        // 2. Try getting legacy provider
        const { web3 } = window
        if ( web3 && web3.currentProvider ) return web3.currentProvider
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
            <section className='col-12 col-xl-12 mt-3' style={{ display: "flex", justifyContent: "center" }}>
                <div className='display-container'>
                    <h4 className={displayMode == 1 ? "display-mode" : "display-mode-selected"} onClick={() => setDisplayMode( 0 )}>Live</h4>
                    <h4 className={displayMode == 0 ? "display-mode" : "display-mode-selected"} onClick={() => setDisplayMode( 1 )}> Finished</h4>
                </div>
            </section >
            <section>
                <div className="container py-4 py-xl-5">
                    <div className="row gy-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                        {isLoading ? <div className="col-12 col-xl-12 align-center">
                            <div className="spinner-border primary" style={{ color: "white" }} role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                            : ( poolList.length == 0 ? <div className="col-12 col-xl-12 align-center">
                                <span style={{ color: "white" }}>No Farming Pool is found</span>
                            </div> : poolList.map( ( farm, index ) => (
                                displayMode == 0 ? ( farm.endsIn > 0 && <FarmCard farm={farm} key={index} /> ) : ( farm.endsIn <= 0 && <FarmCard farm={farm} key={index} /> ) ) ) )
                        }
                    </div>
                </div>
            </section>
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