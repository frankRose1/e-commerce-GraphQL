import React from 'react';
import PropTypes from 'prop-types';
import ErrPopUpStyles from './styles/ErrPopUpStyles';

//meant to handle errors on buttons where the UI is too small to display an error message

const ErrorPopup = ({error}) => {
  
  console.log(error);
  return (
    <ErrPopUpStyles showPopup={error ? true : false}>
      <p>{error}</p>
    </ErrPopUpStyles>
  );
};

ErrorPopup.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorPopup;