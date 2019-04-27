import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Button from 'react-native';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ 
  adapter: new Adapter() 
});


describe('Buttons', () => {
  it('renders three  components', () => {
    const wrapper = shallow(<initializeGame/>);
    expect(wrapper).toMatchSnapshot()
  });
});

describe('Button', () => {
  describe('Rendering', () => {
    it('should match to snapshot', () => {
      const component = shallow(<getWinner/>)
      expect(component).toMatchSnapshot()
    });
  });
});


describe('Button', () => {
  it('should be defined', () => {
    expect(Button).toBeDefined();
  });
  it('should render correctly', () => {
    const tree = shallow(
      <onNewGamePress  />
      );
      expect(tree).toMatchSnapshot();
    });
  });

  
  
      

