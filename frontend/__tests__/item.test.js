import ItemComponent from '../components/Item';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
  id: "12341541",
  title: 'A fake item',
  price: 5012,
  description: 'Is it real or is it fake',
  image: 'pizza.jpg',
  largeImage: 'largepizza.jpg',
}

describe('<Item />', () => {

  it('matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('renders and displays title and pricetag properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$50.12');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders the images properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it('renders the buttons properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });

});