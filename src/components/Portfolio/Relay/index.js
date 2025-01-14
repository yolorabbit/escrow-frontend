import React, { useState, useEffect, useMemo, act } from 'react'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { toast } from 'react-toastify';
import { useActions } from '../../../hooks/useActions';
import './index.scss'

const Relay = () => {
    const [usdtAmount, setUSDTAmount] = useState(0);
    const [escrowId, setEscrowId] = useState(0);
    const [recipient, setRecipient] = useState();
    const { connected } = useWallet();
    const { relay } = useActions();
  
    const onChangeEscrowId = (e) => {
        setEscrowId(e.target.value);
    }

    const onChangeRecipient = (e) => {
        setRecipient(e.target.value);
    }

    const onChangeUSDTAmount = (e) => {
        const value = e.target.value;

        if (parseFloat (value <= 0)) {
            setUSDTAmount(0)
        } else {
            setUSDTAmount(value);
        }
    }

    const handleRelay = async () => {
        if (parseFloat(escrowId) < 0 || !recipient || parseFloat(usdtAmount) <= 0) {
            toast.error('Please enter a valid inputs');
            return;
        }

        await relay(escrowId, recipient, usdtAmount)
    };

    return (
        <div className='relay-container'>
            <div className='card-title-wrapper'>
                <div className='card-title'>
                    Relay
                </div>
            </div>
            <div className='card-content'>
                <div className='card-content-wrapper'>
                    <div className="chart-data">
                        <div className='items-data'>
                            <div className='item-address'>
                                <div className='name'>Escrow ID</div>
                                <input className='input-address' type="text" value={escrowId} onChange={onChangeEscrowId}></input>
                            </div>
                            <div className='item-address'>
                                <div className='name'>Recipient</div>
                                <input className='input-address' type="text" value={recipient} onChange={onChangeRecipient}></input>
                            </div>
                            <div className='item-usdt'>
                                <div className='name'>Amount</div>
                                <div className='input-container'>
                                    <input className='input-value' type="text" value={usdtAmount} onChange={onChangeUSDTAmount}></input>
                                    <div className='value'>USDT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='buttons-row desktop'>
                        <button className='btn purchase' onClick={handleRelay}
                            disabled={!connected || parseFloat(escrowId) < 0 || !recipient || parseFloat(usdtAmount) <= 0}>Relay</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Relay