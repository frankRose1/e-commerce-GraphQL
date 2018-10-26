import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {

  it("renders properly", () => {
    //the test would fail if the componenet didnt shallow render properly
    shallow(<CartCount count={5} />)
  });

  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCount count={5} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props', () => {
    const wrapper = shallow(<CartCount count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps( {count: 15} );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});