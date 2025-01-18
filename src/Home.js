import React from 'react';
import './index.css';

const Home = () => {
    return (
        <div>
            <div className="blinking-text">Powered by Dogs</div>
            <div className="content">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#game">Game</a></li>
                    <li><a href="#airdrop">Airdrop</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Home;