const FetchContractCode = async (tokenAddress) => {


    const abiUrl = `${process.env.REACT_APP_ETHERSCAN_BASE_URL}?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const sourceCodeUrl = `${process.env.REACT_APP_ETHERSCAN_BASE_URL}?module=contract&action=getsourcecode&address=${tokenAddress}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;

    try {
        const abiResponse = await fetch(abiUrl);
        const abiData = await abiResponse.json();
        const sourceCodeResponse = await fetch(sourceCodeUrl);
        const sourceCodeData = await sourceCodeResponse.json();

        if (abiData.status === '1' && abiData.message === 'OK' && sourceCodeData.status === '1' && sourceCodeData.message === 'OK') {
            return sourceCodeData.result[0].SourceCode
        } else {
            throw new Error('Failed to fetch contract data');
        }
    } catch (error) {
        console.error('Error fetching contract data:', error);
        return null;
    }
};


export default FetchContractCode;