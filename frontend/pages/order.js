import Order from '../components/Order';
import ProtectedRoute from '../components/ProtectedRoute';

const OrderPage = ({query}) => (
  <div>
    <ProtectedRoute>
      <Order orderId={query.orderId} />
    </ProtectedRoute>
  </div>
);

export default OrderPage;