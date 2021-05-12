import React, { useState, useEffect } from 'react';
import './index.css';

import Demo1 from './Demo1';
import Demo2 from './Demo2';

interface AppProps {}

const App: React.FC<AppProps> = props => {
  return (
    <div>
      <h2>H5 拖拽</h2>
      <div className="flex demo-list">
        <Demo1 />
        <Demo2 />
      </div>
    </div>
  );
};

export default App;
