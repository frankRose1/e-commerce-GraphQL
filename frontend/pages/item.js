import ItemProfile from '../components/ItemProfile';

const ItemProfilePage = ({query}) => (
  <div>
    <ItemProfile id={query.id}/>
  </div>
);

export default ItemProfilePage;