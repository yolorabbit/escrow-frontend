import React, { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { toast } from 'react-toastify';
import { useActions } from '../../../hooks/useActions';
import './index.scss'

const CancelEscrow = () => {
    const [escrowId, setEscrowId] = useState(0);
    const { connected } = useWallet();
    const { cancelEscrow } = useActions();
    
    const onChangeEscrowId = (e) => {
        const value = e.target.value;

        setEscrowId(value)
    }

    const handleCancelEscrow = async () => {
        if (parseFloat(escrowId) < 0) {
            toast.error('Please enter a valid escrow ID');
            return;
        }

        await cancelEscrow(escrowId)
    };

    return (
        <div className='cancel-container'>
            <div className='card-title-wrapper'>
                <div className='card-title'>
                    Cancel Escrow
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
                        </div>
                    </div>
                    <div className='buttons-row desktop'>
                        <button className='btn purchase' onClick={handleCancelEscrow}
                            disabled={!connected || parseFloat(escrowId) < 0}>Cancel Escrow</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CancelEscrow