// command : "npm run dev" to run react app and to run bot.js node script
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const NewTokenAlert = () => {
    const [chatIds, setChatIds] = useState([]);

    useEffect(() => {
        const provider = new ethers.providers.WebSocketProvider(process.env.REACT_APP_WEB_SOCKET_PROVIDER);
        const wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY);
        const account = wallet.connect(provider);

        const factory = new ethers.Contract(
            "0x541d5c7754B84F8Db0bB2ec7035aC63e643c5935",
            ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
            account
        );
        console.log('started listening to the server...');

        factory.on("PairCreated", async (token0, token1, addressPair, timeStamp) => {
            const message = `New pair created: Token 0: ${token0} Token 1: ${token1} Pair Address: ${addressPair} at ${timeStamp} time`;
            console.log(message);
            await sendMessageToTelegram(message);
        });

        // Cleanup
        return () => {
            provider.removeAllListeners();
        };
    }, []);

    const sendMessageToTelegram = async (message) => {
        const url = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/sendMessage`;
        const headers = { 'Content-Type': 'application/json' };

        for (const chatId of chatIds) {
            const body = JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            });

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                });
                const data = await response.json();
                console.log(`Message sent to chat ID ${chatId}:`, data);
            } catch (error) {
                console.error(`Error sending message to chat ID ${chatId}:`, error);
            }
        }
    };

};

export default NewTokenAlert;
