import React, { useState } from 'react'

import CreateEscrow from './CreateEscrow'
import ReleaseEscrow from './ReleaseEscrow'
import ResolveDispute from './ResolveDispute'
import CancelEscrow from './CancelEscrow'
import Relay from './Relay'

import './index.scss'

const Portfolio = () => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className='portfolio-container'>
            {/* <div className='card-container my-portfolio'>
                <MyPortfolio isLoading={isLoading} setIsLoading={setIsLoading}/>
            </div> */}
            <div className='card-container create-escrow'>
                <CreateEscrow />
            </div>
            <div className='card-container release-escrow'>
                <ReleaseEscrow/>
            </div>
            <div className='card-container resolve-dispute'>
                <ResolveDispute/>
            </div>
            <div className='card-container cancel-escrow'>
                <CancelEscrow/>
            </div>
            <div className='card-container relay'>
                <Relay/>
            </div>
        </div>
    )
}

export default Portfolio