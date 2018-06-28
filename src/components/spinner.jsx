import React, {Component} from 'react';
import styled, {keyframes} from 'styled-components';

const bounce = keyframes`
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
`;

const SpinnerContainer = styled.div`
  width: 70px;
  height: 70px;
  position: relative;
`;

const Circle1 = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${({color}) => color};
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bounce} 2s infinite ease-in-out;
`;

const Circle2 = styled(Circle1)`
  animation-delay: -1s;
`;

export default class Spinner extends Component {
  render() {
    const {color} = this.props;

    return (
      <SpinnerContainer>
        <Circle1 color={color} />
        <Circle2 color={color} />
      </SpinnerContainer>
    );
  }
}
