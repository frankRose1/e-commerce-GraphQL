import React, { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import styled, {ThemeProvider, injectGlobal} from 'styled-components';

//styles available via props
const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
};

const StyledPage = styled.div`
  color: ${props => props.theme.maxWidth};
  background: #fff;
`;

//wrap the page specific content
const Inner = styled.div`
  max-width: ${props => props.theme.black};
  padding: 2rem;
  margin: 0 auto;
`;

//reset and typography
injectGlobal`
  @font-face {
    font-family: 'radnika_next';
    src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
  html{
    font-size: 10px;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body{
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height:2;
    font-family: 'radnika_next';
  }
  a {
    text-decoration: none;
    color: ${theme.black}
  }
  button {
    cursor: pointer;
  }
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Header />
          <Meta />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;