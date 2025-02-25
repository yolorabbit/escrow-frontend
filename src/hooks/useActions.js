import { useCallback } from 'react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { toast } from 'react-toastify';
import { USDT_ADDRESS, ESCROW_ADDRESS } from '../constants';
import MockERC20ABI from '../abi/MockERC20.json';
import EscrowABI from '../abi/Escrow.json';
import { useStatistics } from '../contexts/StatisticsContext';

export const useActions = () => {
    const { connected, wallet } = useWallet();
    const { refreshAll } = useStatistics();

    const approveUSDT = useCallback(async (amount) => {
        if (!connected || !wallet || !window.tron || !window.tron.tronWeb) {
            toast.error('Please connect your wallet');
            return false;
        }

        try {
            const tronWeb = window.tron.tronWeb;
            const contract = await tronWeb.contract(MockERC20ABI, USDT_ADDRESS);
            const amountInSun = tronWeb.toSun(amount);
            
            const tx = await contract.methods.approve(ESCROW_ADDRESS, amountInSun).send();
            await refreshAll();
            
            toast.success('USDT approved successfully');
            return true;
        } catch (error) {
            console.error('Error approving USDT:', error);
            toast.error('Failed to approve USDT');
            return false;
        }
    }, [connected, wallet, refreshAll]);

    const createEscrow = useCallback(async (buyer, amount) => {
        if (!connected || !wallet || !window.tron || !window.tron.tronWeb) {
            toast.error('Please connect your wallet');
            return false;
        }

        try {
            const tronWeb = window.tron.tronWeb;
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);
            const amountInSun = tronWeb.toSun(amount);

            const tx = await contract.methods.createEscrow(buyer, amountInSun).send();
            await refreshAll();
            
            toast.success('Escrow created successfully');
            return true;
        } catch (error) {
            console.error('Error creating escrow:', error);
            toast.error('Failed to create escrow');
            return false;
        }
    }, [connected, wallet, refreshAll]);

    const releaseEscrow = useCallback(async (escrowId) => {
        if (!connected || !wallet || !window.tron || !window.tron.tronWeb) {
            toast.error('Please connect your wallet');
            return false;
        }

        try {
            const tronWeb = window.tron.tronWeb;
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);

            const tx = await contract.methods.releaseEscrow(escrowId).send();
            await refreshAll();
            
            toast.success('Escrow released successfully');
            return true;
        } catch (error) {
            console.error('Error releasing escrow:', error);
            toast.error('Failed to release escrow');
            return false;
        }
    }, [connected, wallet, refreshAll]);

    const resolveDispute = useCallback(async (escrowId, releaseToBuyer) => {
        if (!connected || !wallet || !window.tron || !window.tron.tronWeb) {
            toast.error('Please connect your wallet');
            return false;
        }

        try {
            const tronWeb = window.tron.tronWeb;
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);

            const tx = await contract.methods.resolveDispute(escrowId, releaseToBuyer).send();
            await refreshAll();
            
            toast.success('Dispute resolved successfully');
            return true;
        } catch (error) {
            console.error('Error resolving dispute:', error);
            toast.error('Failed to resolve dispute');
            return false;
        }
    }, [connected, wallet, refreshAll]);

    const cancelEscrow = useCallback(async (escrowId) => {
        if (!connected || !wallet || !window.tron || !window.tron.tronWeb) {
            toast.error('Please connect your wallet');
            return false;
        }

        try {
            const tronWeb = window.tron.tronWeb;
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);

            const tx = await contract.methods.cancelEscrow(escrowId).send();
            await refreshAll();
            
            toast.success('Escrow cancelled successfully');
            return true;
        } catch (error) {
            console.error('Error cancelling escrow:', error);
            toast.error('Failed to cancel escrow');
            return false;
        }
    }, [connected, wallet, refreshAll]);

    const relay = useCallback(async (escrowId, recipient, usdtAmount) => {
        if (!connected || !wallet || !window.tron || !window.tron.tronWeb) {
            toast.error('Please connect your wallet');
            return false;
        }

        try {
            const tronWeb = window.tron.tronWeb;
            const contract = await tronWeb.contract(EscrowABI, ESCROW_ADDRESS);

            const tx = await contract.methods.relay(escrowId, recipient, usdtAmount).send();
            await refreshAll();
            
            toast.success('Relay successful');
            return true;
        } catch (error) {
            console.error('Error relaying:', error);
            toast.error('Failed to relay');
            return false;
        }
    }, [connected, wallet, refreshAll]);

    return {
        approveUSDT,
        createEscrow,
        releaseEscrow,
        resolveDispute,
        cancelEscrow,
        relay
    };
};
