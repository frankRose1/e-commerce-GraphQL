import styled from 'styled-components';

const ErrPopUpStyles = styled.div`
  top: 100px;
  left: 10px;
  min-width: 325px;
  position: fixed;
  border-radius: 5px;
  margin: 0;
  padding: 15px;
  text-align: center;
  z-index: 9999999;
  transform: translateX(-100%);
  transition: transform 0.5s ease-in-out;
  background-color: firebrick;
  color: white;
  ${props => props.showPopup && `transform: translateX(0);`};
`;

export default ErrPopUpStyles;