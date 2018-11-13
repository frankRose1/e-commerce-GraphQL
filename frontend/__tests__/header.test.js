import { shallow } from 'enzyme';
import Header from '../components/Header';

describe('<Header />', () => {
  it('renders the nav and logo', () => {
    const wrapper = shallow(<Header />);
    const bar = wrapper.find('.bar');
    expect(bar.find('Nav').exists()).toBe(true);
    expect(bar.find('Header__Logo').exists()).toBe(true);
  });

  it('renders the search bar and cart', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('AutoComplete').exists()).toBe(true);
    expect(wrapper.find('Cart').exists()).toBe(true);
  });
});
