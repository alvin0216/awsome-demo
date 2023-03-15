import { useRef, useEffect } from 'react';

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendMsgToChild = () => {
    iframeRef.current?.contentWindow?.postMessage('message from father', '*');
  };

  useEffect(() => {
    window.addEventListener('message', e => {
      console.log(e.data);
    });
  }, []);

  return (
    <div className="App">
      <div>
        Father
        <button onClick={sendMsgToChild}>给 Child 发消息</button>
      </div>
      <iframe
        ref={iframeRef}
        src="http://localhost:5501"
        style={{ width: 500, height: 500 }}
      ></iframe>
    </div>
  );
}

export default App;
