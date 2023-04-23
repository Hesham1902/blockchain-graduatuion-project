import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
    return transactionsContract;

};


export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));


    //hard function to understand
    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
      };


    const checkIfWalletIsConnected = async () => {
        try{
            if (!ethereum) return alert('Make sure you have metamask!');
    
            const accounts = await ethereum.request({ method: 'eth_accounts' });
    
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            
                // getAllTransactions();
            }else{
                console.log('No Accounts found')
            }
        }catch (error) {
            console.log(error);

            throw new Error("No ethereum object found");
        }
    }
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Make sure you have metamask!');

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        }catch (error) {
            console.log(error);

            throw new Error("No ethereum object found");
            }
        };

    const sendTransaction = async () => {
        try {
         if (!ethereum) return alert('Make sure you have metamask!');

         const { addressTo, amount, keyword, message } = formData;
         const transactionContract = getEthereumContract();
         const parsedAmount = ethers.utils.parseEther(amount);

         
         await ethereum.request({ 
            method: 'eth_sendTransaction',
            params: [{
                from: currentAccount,
                to: addressTo,
                gas: '0x5208', // 21000 GWEI
                value: parsedAmount._hex,
            }]
        });
        const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);


        setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`);

        const transactionCount = await transactionContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object found");
        }
    };


    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return (
    <TransactionContext.Provider value= {{ 

        connectWallet,
        currentAccount,
        formData,
        sendTransaction,
        handleChange,
        }} >
        {children}
    </TransactionContext.Provider>

    )
} 
