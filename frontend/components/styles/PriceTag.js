import styled from 'styled-components';

const PriceTag = styled.span`
  transform: rotate(3deg);
  color: white;
  background-color: ${props => props.theme.red};
  padding: 5px;
  font-weight: 600;
  line-height: 1;
  display: inline-block;
  font-size: 3rem;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default PriceTag;
