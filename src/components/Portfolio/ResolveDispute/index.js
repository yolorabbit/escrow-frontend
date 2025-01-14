import React, { useState, useEffect, useMemo, act } from 'react'
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { toast } from 'react-toastify';
import { useActions } from '../../../hooks/useActions';
import './index.scss'

const ResolveDispute = () => {
    const [escrowId, setEscrowId] = useState(0);
    const [recipient, setRecipient] = useState();
    const { connected } = useWallet();
    const { resolveDispute } = useActions();

    const onChangeEscrowId = (e) => {
        setEscrowId(e.target.value);
    }

    const onChangeRecipient = (e) => {
        setRecipient(e.target.value);
    }

    const handleResolveDispute = async () => {
        if (parseFloat(escrowId) < 0 || !recipient) {
            toast.error('Please enter a valid input');
            return;
        }

        await resolveDispute(escrowId, recipient);
    };

    return (
        <div className='resolve-container'>
            <div className='card-title-wrapper'>
                <div className='card-title'>
                    ResolveDispute
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
                        </div>
                    </div>
                    <div className='buttons-row desktop'>
                        <button className='btn purchase' onClick={handleResolveDispute}
                            disabled={!connected || parseFloat(escrowId) < 0 || !recipient}>Resolve Dispute</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResolveDispute