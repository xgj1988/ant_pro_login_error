import React from 'react';
import project from '@/project'

const Home = () => (
  <div style={{ width: '100%', textAlign: 'center', marginTop: '40px' }} >
    <h2 style={{
      color: 'rgb(144, 159, 172)',
      fontFamily: 'cursive',
      fontSize: '42px',
      fontWeight: '700'
    }}
    >
      {project.homeDesc}
    </h2 >
  </div >
);

export default Home;
