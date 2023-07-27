export default [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_deploymentCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_maxLockTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_incomeFee",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "_feeReceiver",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_rewardPerBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_earlyWithdrawalFee",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_feeReceiver",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "_keepReflectionOnDeposit",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "DeployedERC20Farm",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_endBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_earlyWithdrawalFee",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_feeReceiver",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "DeployedERC20FarmFixEnd",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_rewardPerBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "DeployedERC721Farm",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_endBlock",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "DeployedERC721FarmFixEnd",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "NewDeploymentCost",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "name": "NewFeeReceiver",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "NewIncomeFee",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "NewMaxLockTime",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "contract IFarmDeployer20",
                "name": "farmDeployer20",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract IFarmDeployer20FixEnd",
                "name": "farmDeployer20FixEnd",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract IFarmDeployer721",
                "name": "farmDeployer721",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "contract IFarmDeployer721",
                "name": "farmDeployer721FixEnd",
                "type": "address"
            }
        ],
        "name": "SetFarmDeployers",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_rewardPerBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_earlyWithdrawalFee",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_feeReceiver",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_keepReflectionOnDeposit",
                "type": "bool"
            }
        ],
        "name": "deployERC20Farm",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_earlyWithdrawalFee",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_feeReceiver",
                "type": "address"
            }
        ],
        "name": "deployERC20FarmFixEnd",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_rewardPerBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            }
        ],
        "name": "deployERC721Farm",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_stakeToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_rewardToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_startBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endBlock",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_userStakeLimit",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minimumLockTime",
                "type": "uint256"
            }
        ],
        "name": "deployERC721FarmFixEnd",
        "outputs": [
            {
                "internalType": "address",
                "name": "farmAddress",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deploymentCost",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "farmDeployer20",
        "outputs": [
            {
                "internalType": "contract IFarmDeployer20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "farmDeployer20FixEnd",
        "outputs": [
            {
                "internalType": "contract IFarmDeployer20FixEnd",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "farmDeployer721",
        "outputs": [
            {
                "internalType": "contract IFarmDeployer721",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "farmDeployer721FixEnd",
        "outputs": [
            {
                "internalType": "contract IFarmDeployer721",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "feeReceiver",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "incomeFee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxLockTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IFarmDeployer20",
                "name": "_farmDeployer20",
                "type": "address"
            },
            {
                "internalType": "contract IFarmDeployer20FixEnd",
                "name": "_farmDeployer20FixEnd",
                "type": "address"
            },
            {
                "internalType": "contract IFarmDeployer721",
                "name": "_farmDeployer721",
                "type": "address"
            },
            {
                "internalType": "contract IFarmDeployer721",
                "name": "_farmDeployer721FixEnd",
                "type": "address"
            }
        ],
        "name": "setDeployers",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_deploymentCost",
                "type": "uint256"
            }
        ],
        "name": "setDeploymentCost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_feeReceiver",
                "type": "address"
            }
        ],
        "name": "setFeeReceiver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_incomeFee",
                "type": "uint256"
            }
        ],
        "name": "setIncomeFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_maxLockTime",
                "type": "uint256"
            }
        ],
        "name": "setMaxLockTime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]