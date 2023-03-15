import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.addEventListener('message', e => {
      console.log(e.data);
    });
  }, []);

  const sendMsgToFather = () => {
    parent?.postMessage('recived message from child', '*');
  };

  return (
    <div className="App">
      <h2>Child</h2>
      <div>
        Father
        <button onClick={sendMsgToFather}>给 Father 发消息</button>
      </div>
    </div>
  );
}

export default App;
