// In App.js in a new project

import * as React from 'react';
import { Provider } from 'react-redux';
import Navigaion from './src/screens/Navigation';
import { store } from './src/redux/store';
function App() {
  return (
    <Provider store={store}>
      <Navigaion></Navigaion>
    </Provider> 
  );
}

export default App;