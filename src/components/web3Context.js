import React, { useState, useEffect } from "react";
import Moralis from 'moralis';

export const web3Context = React.createContext();

export const Web3ContextProvider = ({
    children,
}) => {
    // const [curSocket, setCurSocket] = useState<Socket>({} as Socket);
    const [web3, setWeb3] = useState();
    const [walletAddress, setWalletAddress] = useState("");

    return (
        <web3Context.Provider
            value={{
                web3,
                walletAddress,
                setWeb3,
                setWalletAddress
            }}
        >
            {children}
        </web3Context.Provider>
    );
};
