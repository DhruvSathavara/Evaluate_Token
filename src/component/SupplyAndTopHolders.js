// command : "npm run dev" to run react app and to run bot.js node script
import { useEffect, useState } from 'react';
import axios from 'axios';
import calculateTrustScore from './TrustScore';
import FetchContractCode from './GetContractCode';
import CGLogo from "../chatGPT.png"
import AnswerBot from './AnswerBot';

const SupplyAndTopHolders = () => {

    const [prompt, setPrompt] = useState('');
    const [prePrompt, setPrePrompt] = useState('here is my smart contract code please deeply analyze it and if there is any critical vulnerabilities then list down it and it not then replay with only NO, here is code:');
    const [loading, setLoading] = useState(false);
    const [tokenSymbol, setTokenSymbol] = useState('TON');
    const [supplys, setSupplys] = useState();
    const [isBugInContract, setIsBugInContract] = useState('');
    const [trustScore, setTrustScore] = useState();
    const [topHoldersPercenage, setTopHoldersPercenage] = useState();
    const [topHolders, setTopHolders] = useState([]);

    useEffect(() => {
        if (supplys) {
            console.log('in use effect--');

            const trustScore = calculateTrustScore(supplys?.max_supply, supplys?.total_supply, supplys?.circulating_supply, topHolders, isBugInContract, setTopHoldersPercenage);
            setTrustScore(trustScore)
            console.log('final trust score---', trustScore);
            setLoading(false);
        }
    }, [supplys]);


    const getTopHolders = async (tokenAddress) => {

        let code = await FetchContractCode(tokenAddress);
        const res = await AnswerBot(code, prePrompt);
        setIsBugInContract(res);

        const options = {
            url: `https://api.chainbase.online/v1/token/top-holders?chain_id=1&contract_address=${tokenAddress}&page=1&limit=5`,
            method: 'GET',
            headers: {
                'x-api-key': process.env.REACT_APP_CHAINBASE_API_KEY,
                'accept': 'application/json'
            }
        };
        console.log('this is 2 ', tokenAddress);

        axios(options)
            .then(response => {
                console.log('holders data', response.data.data);
                setTopHolders(response.data.data);
                getSupplys();

            })
            .catch(error => console.log(error));
    }

    const getSupplys = async () => {
        console.log('this is 3 ');

        const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${tokenSymbol}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'X-CMC_PRO_API_KEY': process.env.REACT_APP_COINMARKETCAP_API_KEY,
                'Accept': 'application/json'
            }
        })

            .then(response => response.json())
            .then(data => {

                const tokenData = data.data[tokenSymbol.toUpperCase()];
                console.log('token datas--', tokenData);
                setSupplys(tokenData);
            })

    }


    const getDatas = async () => {
        setLoading(true);

        const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${tokenSymbol}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'X-CMC_PRO_API_KEY': process.env.REACT_APP_COINMARKETCAP_API_KEY,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data?.data) {
                    console.log('all e---', data.data);

                    for (let item of data.data) {
                        if (item?.platform !== null && item?.platform?.id == '1') {
                            getTopHolders(item?.platform?.token_address);
                            break;
                        }
                    }
                }

            })
            .catch(error => {
                console.error('Error fetching token data:', error);
            });
    }

    return (
        <>
            <div className="wrapper">
                <form style={{ marginTop: "25px" }}
                >
                    <img src={CGLogo} alt="" className={loading ? 'cg-logo loading' : 'cg-logo'} />
                    <input
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                        type="text"
                        placeholder="Paste your code here..."
                    />
                </form>
                <p className="response-area">
                    {loading ? 'loading...' : isBugInContract == "NO" ? 'Contract is safe, no security vulnerabilities detected in contract' : isBugInContract}
                </p>
            </div>
            <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
                <button
                    onClick={getDatas}
                    style={{ width: '20%', padding: '10px', marginBottom: '20px', cursor: 'pointer', color: "red" }}
                >
                    Show Results
                </button>
                <h5>Final Trust score of {supplys?.name} is {trustScore} </h5>
                <div>
                    <div
                        style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    >
                        <h6 className="holdersh6">{supplys?.name}</h6>
                        <h6 className="holdersh6" style={{ margin: "0px" }}>Maximum supply: {supplys?.max_supply == null ? " ∞" : Math.round(supplys?.max_supply)}</h6>
                        <h6 className="holdersh6">Total supply: {Math.round(supplys?.total_supply)}</h6>
                        <h6 className="holdersh6">Circulating supply: {Math.round(supplys?.circulating_supply)}</h6>
                    </div>
                </div>
            </div>
            <div>
                <h3>Top 5 Holders {topHoldersPercenage ? `have ${topHoldersPercenage} % of Total supply` : ''}  </h3>
                <div className='listdiv'>
                    {topHolders.map((holder, index) => (
                        <div key={index}
                            style={{ marginBottom: '5px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                        >
                            <h6 className="holdersh6" style={{ margin: "0px" }}>Address: {holder.wallet_address}</h6>
                            <h6 className="holdersh6">Balance: {Math.round(holder.amount)}</h6>
                            <h6 className="holdersh6">Value in USD: {Math.round(holder.usd_value)}</h6>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );

}

export default SupplyAndTopHolders;