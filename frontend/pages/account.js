import Account from '../components/Account';
import ProtectedRoute from '../components/ProtectedRoute';

const AccountPage = () => (
  <div>
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  </div>
);

export default AccountPage;