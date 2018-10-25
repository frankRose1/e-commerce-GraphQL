import ResetPassword from '../components/ResetPassword';

const Reset = ({query}) => (
  <div>
    <ResetPassword resetToken={query.resetToken} />
  </div>
);

export default Reset;