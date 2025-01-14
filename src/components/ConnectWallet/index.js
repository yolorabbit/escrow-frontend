import React, { useEffect } from 'react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { formatAddress } from 'utils';
import './index.scss'
import { TronLinkAdapterName } from '@tronweb3/tronwallet-adapters';

const ConnectWallet = () => {
    const { connect, select, connected, address } = useWallet();

    useEffect(() => {
        select(TronLinkAdapterName);
    }, [])
    const handleConnectWallet = async () => {
        if (!connected) {
            await connect();
        }
    }
    return (
        <button className='btn wallet' onClick={handleConnectWallet}>{ !connected ? 'Connect Wallet' : formatAddress(address)}</button>
    )
}

export default ConnectWallet;