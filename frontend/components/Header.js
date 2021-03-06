import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from './Nav';
import Cart from './Cart';
import AutoComplete from './AutoComplete';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  z-index: 2;
  position: relative;
  transform: skew(-7deg);
  a {
    padding: 0.5rem 1rem;
    background: ${props => props.theme.red};
    color: #fff;
    text-transform: uppercase;
    text-decoration: none;
  }

  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media(max-width: 1300px){
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
  .sub-bar{
    display: grid;
    grid-template-columns: 1fr;
    border-bottom: 3px solid ${props => props.theme.lightgrey};
    input{
      background: ${props => props.theme.offWhite};
      transition: background 0.4s ease-in-out;
      &:focus{
        background: ${props => props.theme.lightgrey};
      }
    }
  }
`;


const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>BackPackzz</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className="sub-bar">
      <AutoComplete />
    </div>
    <Cart />
  </StyledHeader>
);

export default Header;