import React from 'react'

import { transactionHeader } from 'data'
import { useStatistics } from 'contexts/StatisticsContext'

import './index.scss'

const Transactions = () => {
    const { escrows } = useStatistics();
    const transactions = escrows? escrows : [];
    console.log(transactions);

    return (
        <div className='transactions-container'>
            <div className='card-container'>
                <div className='card-title-wrapper'>
                    <div className='card-title'>
                        Recent Escrows
                    </div>
                </div>
                <div className='transaction-grid-container'>
                    <div className='grid'>
                        { transactionHeader.map(( headerText, index) => (
                            <span className='header-cell' key={index}><strong>{headerText}</strong></span>
                        ))}
                        {
                            transactions.reverse().map((rowData, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <span className='cell seller' key={`a-${index}`}>{rowData.seller}</span>
                                        <span className='cell buyer' key={`b-${index}`}>{rowData.buyer}</span>
                                        <span className='cell amount' key={`c-${index}`}>{rowData.usdtAmount}</span>
                                        <span className='cell fee' key={`d-${index}`}>{rowData.fee}</span>
                                        <span className='cell isActive' key={`e-${index}`}>{rowData.isActive? 'TRUE' : 'FALSE'}</span>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions