import React from 'react';
import styled from 'styled-components';

const Hero = styled.div`
  background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url('../static/hero.jpg') no-repeat center / cover;
  height: 70vh;
  position: relative;
  margin: 0 calc(50% - 50vw);
  h4 {
    position: absolute;
    top: 10%;
    left: 20%;
    color: white;
    font-size: 4rem;
    line-height: 2;
    text-transform: capitalize;
  }
`;

const Home = () => {
  return (
    <div>
      <Hero>
        <h4>Dress <span>to</span> impress</h4>
      </Hero>
    </div>
  );
};

export default Home;