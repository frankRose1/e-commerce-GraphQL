import styled from 'styled-components';

const FooterStyles = styled.footer`
  background-color: ${props => props.theme.grey};
  padding: 15px;
  position: relative;
  color: white;
  text-align: center;
  .footer-cols {
    max-width: ${props => props.theme.maxWidth};
    margin: 40px auto;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    .subscribe {
      position: relative;
      width: 100%;
      input {
        border: 0;
        outline: none;
        border-radius: 3px;
        line-height: 1.42;
        font-size: 1rem;
      }
      input[type="email"]{
        width: 100%;
        padding: 9px 10px;
      }
      input[type="submit"]{
        position: absolute;
        right: 1.5px;
        top: 2.3px;
        z-index: 2;
        color: white;
        background-color: #003366;
        cursor: pointer;
        padding: 8px 10px;
        font-family: inherit;
      }
    }
    h4 {
      text-transform: uppercase;
      text-align: center;
      &:after {
        content: "";
        height: 1px;
        background-color: white;
        display: block;
        margin: 5px auto 15px auto;
        width: 80%;
      }
    }
    ul {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      list-style: none;
      a {
        color: white;
        padding-bottom: 1.5px;
        border-bottom: 1px solid transparent;
        transition: border-bottom 0.3s ease-in;
        &:hover {
          border-bottom: 1px solid white;
        }
      }
    }
  }
`;

const FooterLogo = styled.h2`
  color: white;
  background: ${props => props.theme.red};
  transform: skew(-5deg) rotate(-1deg) translateX(-50%);
  font-size: 2.5rem;
  padding: 0 1rem;
  position: absolute;
  left: 50%;
  top: -50px;
`;

export {
  FooterStyles,
  FooterLogo
};