import Sell from '../components/Sell';
import ProtectedRoute from '../components/ProtectedRoute';

const SellPage = props => (
  <div>
    <ProtectedRoute>
      <Sell />
    </ProtectedRoute>
  </div>
);

export default SellPage;