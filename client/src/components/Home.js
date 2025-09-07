import React from 'react';

function Home({ onNavigate }) {
  return (
    <div>
      <h1>Hello Worldz</h1>
      <button onClick={() => onNavigate('signup')}>Sign Up</button>
    </div>
  );
}

export default Home;