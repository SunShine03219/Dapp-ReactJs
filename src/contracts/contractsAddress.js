const getContractsAddress = (networkId) => {
    switch (networkId) {
        case 56:
            return '0x394dDDDF48b25c37261A6c36E82d1e03EC1EF888';
        default:
            return '0x82BbD305e775d4D39FA5dFDda0F3f0182d50F759';
    }
}

export default getContractsAddress
