import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import RequestReset from '../components/RequestReset';
import styled from 'styled-components';

const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignUpPage = () => (
  <Cols>
    <SignUp />
    <SignIn />
    <RequestReset />
  </Cols>
);

export default SignUpPage;