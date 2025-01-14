import React, { useState, useEffect } from 'react'
import { formatUnits } from 'ethers'
import './index.scss'

// import { ALTI_DECIMALS, USDT_DECIMALS } from 'constants'
import { useStatistics } from 'contexts/StatisticsContext'

const Statistics = () => {
    const { statistics } = useStatistics();
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(null);

    // const totalUSDCLocked = Number(formatUnits(statisticsData.totalUSDCLocked, USDT_DECIMALS)).toLocaleString()
    // const totalALTILocked = Number(formatUnits(statisticsData.totalDepositAmount - statisticsData.totalSaleAmount, ALTI_DECIMALS)).toLocaleString()

    const cards = [
        {
            title: 'Escrow Contract Balance',
            value: `$${ statistics.escrowBalance }`,
            className: ''
        },
        {
            title: (
                <>
                    Total Escrow Count
                </>
            ),
            value: (
                <>
                    { statistics.escrowCount }
                </>
            ),
            className: 'green'
        },
        {
            title: 'Accumulated Fees',
            value: `$${statistics.accumulatedFees}`,
            className: ''
        },
        {
            title: 'Platform Fee',
            value: `${statistics.platformFee / 100}%`,
            className: 'green'
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setPreviousIndex(currentIndex);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, cards.length]);

    return (
        <div className='statistics-container'>
            <div className='statistics-slider'>
                {previousIndex !== null && (
                    <div className={`overview-card ${cards[previousIndex].className} slide-out`} key={`prev-${cards[previousIndex].title}`}>
                        <div className='card-title'>{cards[previousIndex].title}</div>
                        <div className='card-value'>{cards[previousIndex].value}</div>
                    </div>
                )}
                <div className={`overview-card ${cards[currentIndex].className} slide-in`} key={cards[currentIndex].title}>
                    <div className='card-title'>{cards[currentIndex].title}</div>
                    <div className='card-value'>{cards[currentIndex].value}</div>
                </div>
            </div>

            <div className="statistics-grid">
                {cards.map((card, index) => (
                    <div className={`overview-card ${card.className}`} key={index}>
                        <div className='card-title'>{card.title}</div>
                        <div className='card-value'>{card.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Statistics