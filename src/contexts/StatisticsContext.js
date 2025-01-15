import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { USDT_ADDRESS, ESCROW_ADDRESS } from '../constants';
import MockERC20ABI from '../abi/MockERC20.json';
import EscrowABI from '../abi/Escrow.json';

const StatisticsContext = createContext();

export const StatisticsProvider = ({ children }) => {
    const [statistics, setStatistics] = useState({
        usdtBalance: 0,
        accumulatedFees: 0,
        escrowCount: 0,
        platformFee: 0,
        escrowBalance: 0
    });
    const [escrows, setEscrows] = useState([]);
    
    const { connected, wallet, address } = useWallet();

    const getUSDTBalance = async (tronWeb, address) => {
        try {
            const contract = await tronWeb.contract(MockERC20ABI, USDT_ADDRESS);
            const balance = await contract.methods.balanceOf(address).call();
            console.log(balance);
            return tronWeb.fromSun(balance);
        } catch (error) {
            console.error('Error fetching USDT balance:', error);
            return 0;
        }
    };

    const getAccumulatedFees = async (tronWeb) => {
        try {
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);
            const fees = await contract.methods.accumulatedFees().call();
            return tronWeb.fromSun(fees);
        } catch (error) {
            console.error('Error fetching accumulated fees:', error);
            return 0;
        }
    };

    const getEscrowCount = async (tronWeb) => {
        try {
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);
            const count = await contract.methods.escrowCount().call();
            return parseInt(count.toString());
        } catch (error) {
            console.error('Error fetching escrow count:', error);
            return 0;
        }
    };

    const getEscrows = async (tronWeb) => {
        try {
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);
            const count = await contract.methods.escrowCount().call();
            const iCount = parseInt(count.toString());
            const escrows = []
            for (let i = 0; i < iCount; i ++) {
                const escrow = await contract.escrows(i).call();
                escrows.push(escrow);
            }
            const transactions = escrows.map((item) => {
                return {
                    seller: tronWeb.address.fromHex(item.seller),
                    buyer: tronWeb.address.fromHex(item.buyer),
                    usdtAmount: tronWeb.fromSun(item.amount),
                    fee: tronWeb.fromSun(item.fee),
                    isActive: item.isActive
                } 
            })
            return transactions;
        } catch (error) {
            console.error('Error fetching escrows: ', error);
            return [];
        }
    }

    const getPlatformFee = async (tronWeb) => {
        try {
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);
            const fee = await contract.methods.platformFee().call();
            return parseInt(fee.toString());
        } catch (error) {
            console.error('Error fetching platform fee:', error);
            return 0;
        }
    };

    const getEscrowContractBalance = async (tronWeb) => {
        try {
            const contract = await tronWeb.contract(MockERC20ABI, USDT_ADDRESS);
            const balance = await contract.methods.balanceOf(ESCROW_ADDRESS).call();
            return tronWeb.fromSun(balance);
        } catch (error) {
            console.error('Error fetching escrow contract balance:', error);
            return 0;
        }
    };

    const fetchAllStatistics = async () => {
        if (window.tron && window.tron.tronWeb) {
            const tronWeb = window.tron.tronWeb;
            
            const [
                usdtBalance,
                accumulatedFees,
                escrowCount,
                platformFee,
                escrowBalance
            ] = await Promise.all([
                getUSDTBalance(tronWeb, address),
                getAccumulatedFees(tronWeb),
                getEscrowCount(tronWeb),
                getPlatformFee(tronWeb),
                getEscrowContractBalance(tronWeb)
            ]);
            
            setStatistics({
                usdtBalance,
                accumulatedFees,
                escrowCount,
                platformFee,
                escrowBalance
            });
        }
    };

    const fetchEscrows = async () => {
        if (window.tron && window.tron.tronWeb) {
            const tronWeb = window.tron.tronWeb;
            
            const escrows_ = await getEscrows(tronWeb);
            escrows_.sort((a, b) => a.usdtAmount - b.usdtAmount);
            setEscrows(escrows_);
        }
    };

    const refreshAll = async () => {
        await Promise.all([
            fetchAllStatistics(),
            fetchEscrows()
        ]);
    };

    useEffect(() => {
        if (connected && wallet && address) {
            refreshAll();
        }
    }, [connected, wallet, address]);

    return (
        <StatisticsContext.Provider value={{ 
            statistics, 
            escrows,
            refreshAll
        }}>
            {children}
        </StatisticsContext.Provider>
    );
};

export const useStatistics = () => {
    const context = useContext(StatisticsContext);
    if (!context) {
        throw new Error('useStatistics must be used within a StatisticsProvider');
    }
    return context;
}; 