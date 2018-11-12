import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ErrorMessage from '../components/ErrorMessage';

const mockSingleError = {
  message: 'GraphQL error: This is a test error'
};

describe('ErrorMessage />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ErrorMessage error={mockSingleError} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
