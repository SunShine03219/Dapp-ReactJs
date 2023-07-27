import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import rg_logo from '../assets/img/rg_logo_flare.webp';
import { getWeb3 } from '../web3/getWeb3'
// Import button component
import Web3 from "web3";
import { toWei, fromWei } from "web3-utils";
import './nav.css';
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import useWeb3 from "./useWeb3";

const getProviderOptions = () => {
    const infuraId = "00ca1859789d4b40bce01f4104844224";
    const providerOptions = {
        walletconnect: {
            package: WalletConnect,
            options: {
                network: "binance",
                rpc: {
                    56: "https://bsc-dataseed1.binance.org"
                }
            }
        },
        coinbasewallet: {
            package: CoinbaseWalletSDK, // Required
            options: {
                appName: "Red Giant Staking", // Required
                infuraId: "", // Required
                rpc: "https://bsc-dataseed1.binance.org", // Optional if `infuraId` is provided; otherwise it's required
                chainId: 56, // Optional. It defaults to 1 if not provided
                darkMode: false // Optional. Use dark theme, defaults to false
            }
        },
        // "custom-trustwallet": {
        //     display: {
        //         logo: "https://lh3.googleusercontent.com/qocFty4qaglr5hALOybvr0SnX4-XJ5fz2LDT0zLDYuhPFyD9IvG6_Kw13gtNwHiFGc7MuZednp7iFXdxntzKi0JPCA=w128-h128-e365-rj-sc0x00ffffff",
        //         name: "Trust Wallet",
        //         description: "Connect to your Trust Wallet"
        //     },
        //     package: true,
        //     connector: async () => {
        //         let provider = null;
        //         if (typeof window.trustwallet !== 'undefined') {
        //             provider = window.trustwallet;
        //             try {
        //                 const account = await provider.request({ method: 'eth_requestAccounts' })
        //             } catch (error) {
        //                 throw new Error("User Rejected");
        //             }
        //         } else {
        //             throw new Error("No Trust Wallet found");
        //         }
        //         return provider;
        //     }
        // },
        "custom-binancechainwallet": {
            display: {
                logo: "https://lh3.googleusercontent.com/rs95LiHzLXNbJdlPYwQaeDaR_-2P9vMLBPwaKWaQ3h9jNU7TOYhEz72y95VidH_hUBqGXeia-X8fLtpE8Zfnvkwa=w128-h128-e365-rj-sc0x00ffffff",
                name: "Binance Chain Wallet",
                description: "Connect to your Binance Chain Wallet"
            },
            package: true,
            connector: async () => {
                let provider = null;
                if (typeof window.BinanceChain !== 'undefined') {
                    provider = window.BinanceChain;
                    try {
                        const account = await provider.request({ method: 'eth_requestAccounts' })
                        console.log(account[0]);
                    } catch (error) {
                        throw new Error("User Rejected");
                    }
                } else {
                    throw new Error("No Binance Chain Wallet found");
                }
                return provider;
            }
        },
        "custom-safepalwallet": {
            display: {
                logo: "https://lh3.googleusercontent.com/QW00mbAVyzdfmjpDy6DGRU-qlIRNMGA-DZpGTYfTp1X1ISWb6NNyXhR2ss2iiqmLp9KYkRiWDrPrvL3224HkUtJbIQ=w128-h128-e365-rj-sc0x00ffffff",
                name: "SafePal Wallet",
                description: "Connect to your SafePal Wallet"
            },
            package: true,
            connector: async () => {
                let provider = null;
                if (typeof window.safepalProvider !== 'undefined') {
                    provider = window.safepalProvider;
                    try {
                        const account = await provider.request({ method: 'eth_requestAccounts' })
                    } catch (error) {
                        throw new Error("User Rejected");
                    }
                } else {
                    throw new Error("No SafePal Wallet found");
                }
                return provider;
            }
        }
    };
    return providerOptions;
};

// import '../../public/bootstrap/css/bootstrap.min.css'
// Simple counter using React Hooks
export const Nav = () => {
    const location = useLocation();
    const { web3, setWeb3, walletAddress, setWalletAddress } = useWeb3();

    // const getNetwork = () => getChainData(this.state.chainId).network;

    const web3Modal = new Web3Modal({
        network: "Binance",
        cacheProvider: true,
        providerOptions: getProviderOptions(),
    });

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            // onConnect();
            resetApp();
        }
    }, []);

    const subscribeProvider = async (provider) => {
        if (!provider.on) {
            return;
        }
        provider.on("close", () => resetApp());
        provider.on("accountsChanged", async (accounts) => {
            console.log(accounts[0]);
            setWalletAddress(accounts[0]);
            // setWeb3Data({ ...web3Data, address: accounts[0] });
            // await this.getAccountAssets();
        });
        provider.on("chainChanged", async (chainId) => {
            // const { web3 } = web3Data;
            // const networkId = await web3.eth.net.getId();
            // setWeb3Data({ ...web3Data, chainId: chainId, networkId: networkId });
            // await this.getAccountAssets();
        });

        provider.on("networkChanged", async (networkId) => {
            // const { web3 } = web3Data;
            // const chainId = await web3.eth.chainId();
            // setWeb3Data({ ...web3Data, chainId: chainId, networkId: networkId });
            // await this.getAccountAssets();
        });
    };

    const resetApp = async () => {
        // const { web3 } = web3Data;
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
            await web3.currentProvider.close();
        }
        setWalletAddress("");
        await web3Modal.clearCachedProvider();
        // setWeb3Data({ ...INITIAL_STATE });
    };

    const onConnect = async () => {
        try {
            const provider = await web3Modal.connect();
            await subscribeProvider(provider);
            await provider.enable();
            setWeb3(new Web3(provider));
            const chainId = await provider.request({ method: 'eth_chainId' });
            const binanceTestChainId = '0x38'
            if (chainId === binanceTestChainId) {
                console.log("Bravo!, you are on the correct network");
            } else {
                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }],
                    });
                    console.log("You have succefully switched to Binance main network")
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x38',
                                        chainName: 'Binance Smart Chain',
                                        rpcUrls: ['https://bsc-dataseed1.binance.org'],
                                        blockExplorerUrls: ['https://bscscan.com/'],
                                        nativeCurrency: {
                                            symbol: 'BNB',
                                            decimals: 18,
                                        }
                                    }
                                ]
                            });
                        } catch (addError) {
                            console.log(addError);
                            // alert(addError);
                        }
                    }
                    // alert("Failed to switch to the network")
                    return;
                }
            }

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            setWalletAddress(account);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        console.log(location.pathname);
    }, []);

    function ellipseAddress(
        address = "",
        width = 10
    ) {
        return `${address.slice(0, width)}...${address.slice(-width)}`;
    }

    return (
        <>
            <nav className="navbar navbar-light navbar-expand-md fixed-top navbar-shrink py-3" style={{ background: "var(--bs-navbar-active-color)" }} id="mainNav">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <span>
                            <img src={rg_logo} style={{ width: "91px" }} />
                        </span>
                    </a>
                    <button data-bs-toggle="collapse" className="navbar-toggler navbar-menu-button" data-bs-target="#navcol-1">
                        <span className="visually-hidden">Toggle navigation</span>
                        <span className="navbar-toggler-icon toggle-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navcol-1">
                        <form className="search-form nav-search-form">
                            <div className="input-group color-white">
                                <input className="search-input form-control" type="text" placeholder="Search Farms/Pools" /></div>
                        </form>
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link to="/" className={`nav-link color-white ${location.pathname == "/" ? "nav-bold" : ""}`}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/farm" className={`nav-link color-white ${location.pathname?.indexOf("farm") > 0 ? "nav-bold" : ""}`}>Farms</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/pool" className={`nav-link color-white ${location.pathname?.indexOf("pool") > 0 ? "nav-bold" : ""}`}>Pools</Link>
                            </li>
                            <li className="nav-item ml-1">
                                <div className="nav-item dropdown" style={{ marginTop: "8px" }}>
                                    <a className="dropdown-toggle nav-create" aria-expanded="false" data-bs-toggle="dropdown" href="#">Create</a>
                                    <div className="dropdown-menu bg-black color-dropdown">
                                        <Link to="/lp" className="dropdown-item color-dropdown" href="#">Farm</Link>
                                        <Link to="/single" className="dropdown-item color-dropdown" href="#">Pool</Link>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <a className="btn btn-primary shadow wallet-connect" role="button" onClick={walletAddress === "" ? onConnect : resetApp}>{walletAddress === "" ? "Connect Wallet" : ellipseAddress(walletAddress, 5)}</a>
                    </div>
                </div>
            </nav>
        </>
    );
};