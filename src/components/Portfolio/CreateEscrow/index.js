import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useStatistics } from '../../../contexts/StatisticsContext';
import { useActions } from '../../../hooks/useActions';
import { toast } from 'react-toastify';

import './index.scss'

const CreateEscrow = () => {
    const [usdtAmount, setUSDTAmount] = useState(0);
    const [buyerAddress, setBuyerAddress] = useState('');

    const { connected } = useWallet();
    const { statistics } = useStatistics();
    const { approveUSDT, createEscrow } = useActions();

    const onChangeUSDTAmount = (e) => {
        const value = e.target.value;
        if (parseFloat(value) <= 0) {
            setUSDTAmount(0);
        } else {
            setUSDTAmount(value);
        }
    };

    const onChangeBuyerAddress = (e) => {
        setBuyerAddress(e.target.value);
    };

    const handleCreateEscrow = async () => {
        if (!buyerAddress) {
            toast.error('Please enter buyer address');
            return;
        }

        if (parseFloat(usdtAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        // First approve USDT
        const approved = await approveUSDT(usdtAmount);
        if (!approved) return;

        // Then create escrow
        await createEscrow(buyerAddress, usdtAmount);
    };

    return (
        <div className='create-container'>
            <div className='card-title-wrapper'>
                <div className='card-title'>
                    Create Escrow
                </div>
            </div>
            <div className='card-content'>
                <div className='card-content-wrapper'>
                    <div className="chart-data">
                        <div className='items-data'>
                            <div className='item-address'>
                                <div className='name'>Your USDT Balance</div>
                                <div className='value'>{connected ? `${statistics.usdtBalance} USDT` : ''}</div>
                            </div>
                            <div className='item-address'>
                                <div className='name'>Buyer</div>
                                <input 
                                    className='input-address' 
                                    type="text" 
                                    value={buyerAddress} 
                                    onChange={onChangeBuyerAddress}
                                    placeholder="Enter buyer's TRON address"
                                ></input>
                            </div>
                            <div className='item-usdt'>
                                <div className='name'>Amount</div>
                                <div className='input-container'>
                                    <input 
                                        className='input-value' 
                                        type="number" 
                                        value={usdtAmount} 
                                        onChange={onChangeUSDTAmount}
                                        min="0"
                                        step="0.1"
                                    ></input>
                                    <div className='value'>USDT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='buttons-row desktop'>
                        <button 
                            className='btn purchase' 
                            onClick={handleCreateEscrow}
                            disabled={!connected || !buyerAddress || parseFloat(usdtAmount) <= 0}
                        >
                            Create Escrow
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEscrow