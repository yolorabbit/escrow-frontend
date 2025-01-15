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
    
    // Add refs for timeouts
    const statisticsTimeoutRef = useRef(null);
    const escrowsTimeoutRef = useRef(null);

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
            
            if (usdtBalance != statistics.usdtBalance ||
                accumulatedFees != statistics.accumulatedFees ||
                escrowCount != statistics.escrowCount ||
                platformFee != statistics.platformFee ||
                escrowBalance != statistics.escrowBalance 
            ) {
                setStatistics({
                    usdtBalance,
                    accumulatedFees,
                    escrowCount,
                    platformFee,
                    escrowBalance
                });
            }

            // Schedule next update
            statisticsTimeoutRef.current = setTimeout(fetchAllStatistics, 10000);
        }
    };

    const fetchEscrows = async () => {
        if (window.tron && window.tron.tronWeb) {
            const tronWeb = window.tron.tronWeb;
            
            const escrows_ = await getEscrows(tronWeb);
            escrows.sort((a, b) => a.id - b.id);
            if (escrows_.length != escrows.length) {
                setEscrows(escrows_);
            }

            // Schedule next update
            escrowsTimeoutRef.current = setTimeout(fetchEscrows, 10000);
        }
    };

    useEffect(() => {
        // Start fetching statistics
        fetchAllStatistics();
        
        // Cleanup function
        return () => {
            if (statisticsTimeoutRef.current) {
                clearTimeout(statisticsTimeoutRef.current);
            }
        };
    }, [connected, wallet]);

    useEffect(() => {
        // Start fetching escrows
        fetchEscrows();
        
        // Cleanup function
        return () => {
            if (escrowsTimeoutRef.current) {
                clearTimeout(escrowsTimeoutRef.current);
            }
        };
    }, [connected, wallet]);

    return (
        <StatisticsContext.Provider value={{ 
            statistics, 
            escrows,
            refreshStatistics: fetchAllStatistics
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