import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'


export const TransactionContext = React.createContext()

const { ethereum } = window

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    // const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner()
    const transactionConTract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionConTract
}

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFromData] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFromData((prev) => ({ ...prev, [name]: e.target.value }))
    }

    const getAllTransactions = async () => {

        try {
            if (!ethereum) return alert('Please install metamask')

            const transactionsContract = createEthereumContract()

            const availableTransactions = await transactionsContract.getAllTransactions();

            console.log(availableTransactions)

            const structuredTransactions = availableTransactions.map((transaction) => {
                return {
                    addressFrom: transaction.sender,
                    addressTo: transaction.receiver,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    keyword: transaction.keyword,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18)
                }
            })
            console.log('structuredTransactions', structuredTransactions)
            setTransactions(structuredTransactions)

        } catch (error) {
            console.log(error)

            throw new Error('getAllTransactions')
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {

            if (!ethereum) return alert('Please install metamask')

            const accounts = await ethereum.request({ method: "eth_accounts" })


            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions()
            } else {
                console.log("No accounts found");
            }
            console.log('checkIfWalletIsConnected', accounts)

        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    const checkIfTransactionExist = async () => {

        try {
            if (!ethereum) return alert('Please install metamask')

            const transactionsContract = createEthereumContract()
            const currentTransactionCount = await transactionsContract.getTransactionCount()

            window.localStorage.setItem('transactionCount', currentTransactionCount)
        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Please install metamask')

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            console.log('connectWallet', accounts)

            setCurrentAccount(accounts[0])

            window.location.reload();
        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert('Please install metamask')

            // get the data from the form...
            const { addressTo, amount, keyword, message } = formData
            const parseAmount = ethers.utils.parseEther(amount)
            const transactionsContract = createEthereumContract()

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parseAmount._hex, // 0.00001
                }]
            })

            const transactionHash = await transactionsContract.addToBlockChain(addressTo, parseAmount, message, keyword)

            setIsLoading(true)
            console.log(`Loading ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success ${transactionHash.hash}`)

            const transactionCount = await transactionsContract.getTransactionCount()

            setTransactionCount(transactionCount.toNumber())

            window.location.reload();
        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionExist()
    }, [])

    return (
        <TransactionContext.Provider value={{
            currentAccount, formData, transactions, isLoading,
            connectWallet, setFromData, handleChange, sendTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    )
}