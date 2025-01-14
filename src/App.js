import React, { useMemo } from 'react'

import ConnectWallet from 'components/ConnectWallet'
import Portfolio from 'components/Portfolio'
import Statistics from 'components/Statistics'
import Transactions from 'components/Transactions'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { TronLinkAdapter, OkxWalletAdapter, BitKeepAdapter, TokenPocketAdapter, WalletConnectAdapter } from '@tronweb3/tronwallet-adapters'

import './App.scss'
import { StatisticsProvider } from './contexts/StatisticsContext';

const App = () => {
    function onError(e) {
        console.log(e)
    }

    const adapters = useMemo(function () {
        const tronLinkAdapter = new TronLinkAdapter({
          openTronLinkAppOnMobile: true,
          openUrlWhenWalletNotFound: true,
          dappName: 'Escrow',
          dappIcon: 'https://optritool.optriment.com/apple-touch-icon.png',
        })
    
        const okxwalletAdapter = new OkxWalletAdapter()
        const bitKeepAdapter = new BitKeepAdapter()
        const tokenPocketAdapter = new TokenPocketAdapter()
    
        // NOTE: Wasn't tested yet
        const walletConnectAdapter = new WalletConnectAdapter({
          network: 'Nile',
          options: {
            relayUrl: 'wss://relay.walletconnect.com',
            // example walletconnect app project ID
            // projectId: 'project-id',
            metadata: {
              name: 'OptriTool',
              description: 'OptriTool',
              url: 'https://optritool.optriment.com',
              icons: ['https://optritool.optriment.com/apple-touch-icon.png'],
            },
          },
        })
    
        return [
          tronLinkAdapter,
          okxwalletAdapter,
          bitKeepAdapter,
          tokenPocketAdapter,
          walletConnectAdapter,
        ]
    }, [])

    return (
        <WalletProvider onError={onError} adapters={adapters}>
            <StatisticsProvider>
                <div className='app-container'>
                    <div className='title-container'>
                        <div className='title'>Escrow Service</div>
                        <ConnectWallet />
                    </div>
                    <div className='description'>
                        Escrow service for the users. <strong>LIVE</strong>
                    </div>
                    <div className='content'>
                        <div className='grid-container'>
                            <main>
                                <Statistics />
                                <Portfolio />
                                <Transactions/>
                            </main>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </StatisticsProvider>
        </WalletProvider>
    )
}

export default App;