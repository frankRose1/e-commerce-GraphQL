import styled from 'styled-components';

const SubTitleStyles = styled.h4`
  color: ${props => props.theme.black};
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1.42;
  opacity: 0.75;
  font-size: 2.7rem;
  text-align: center;
  &:after{
    content: "";
    margin: 10px auto 25px auto;
    display: block;
    width: 35px;
    height: 3px;
    background: ${props => props.theme.black};
    opacity: 0.2;
  }
`;

export default SubTitleStyles;