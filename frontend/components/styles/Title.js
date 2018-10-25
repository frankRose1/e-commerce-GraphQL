import styled from 'styled-components';

const Title = styled.h3`
  margin: 0 1rem;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.1);
  text-align: center;
  margin-top: -3rem;
  transform: skew(-5deg) rotate(-1deg);
  a {
    background: ${props => props.theme.red};
    font-size: 4rem;
    color: white;
    padding: 0 1rem;
    display: inline;
    line-height: 1.3;
    text-align: center;
  }
`;

export default Title;
