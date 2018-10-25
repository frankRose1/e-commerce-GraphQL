import Items from '../components/Items';

// This page will render on "/"

const Home = ({query}) => (
  <div>
    <Items page={ parseFloat(query.page) || 1 } />
  </div>
);

export default Home;