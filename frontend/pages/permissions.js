import Permissions from '../components/Permissions';
import ProtectedRoute from '../components/ProtectedRoute';

const PermissionsPage = () => (
  <div>
    <ProtectedRoute>
      <Permissions />
    </ProtectedRoute>
  </div>
);

export default PermissionsPage;