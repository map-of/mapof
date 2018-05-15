import React, {Component} from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

class App extends Component {
  render() {
    return (
      <Title>
        To get started, edit <code>src/App.js</code> and save to reload.
      </Title>
    );
  }
}

export default App;
