import React from 'react';

function Game() {
  return (
    <div style={styles.container}>
      <p>Game is loading...</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  // পুরো স্ক্রিনের উচ্চতা দখল করবে
    textAlign: 'center',
  },
};

export default Game;
