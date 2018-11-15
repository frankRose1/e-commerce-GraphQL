import styled from 'styled-components';

const SingleItemStyles = styled.div`
  max-width: ${props => props.theme.maxWidth};
  position: relative;
  max-height: 800px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: flex;
  h3.price {
    position: absolute;
    background: ${props => props.theme.red};
    color: white;
    top: -30px;
    left: -10px;
    font-size: 3rem;
    font-weight: bold;
    padding: 5px;
    transform: rotate(-10deg);
  }

  img {
    height: 100%;
    width: 60%;
    object-fit: contain;
  }

  .details {
    text-align: center;
    font-size: 2rem;
    margin: 1.5rem;
    width: 35%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    h2 {
      text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
      text-transform: capitalize;
      &:after {
        content: '';
        display: block;
        width: 80%;
        margin: 0.5rem auto;
        height: 2px;
        background-color: ${props => props.theme.black};
        opacity: 0.2;
      }
    }

    .item-buttons {
      display: grid;
      width: 100%;
      border-top: 1px solid ${props => props.theme.lightgrey};
      grid-gap: 1px;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      & > * {
        background: white;
        border: 0;
        font-size: 1rem;
        padding: 1rem;
      }
    }
  }
`;

export default SingleItemStyles;
