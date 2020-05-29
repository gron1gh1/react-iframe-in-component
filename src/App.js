import React, { useEffect, useState, useCallback } from 'react';
import { transform } from 'buble';
import axios from 'axios';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import '../node_modules/prismjs/components/prism-clike';
import '../node_modules/prismjs/components/prism-javascript';
import '../node_modules/prismjs/components/prism-markup';
import '../node_modules/prismjs/components/prism-jsx';
import "./style.css";
function Frame({ code ,lib}) {
  function createBlobUrl(html) {
    let blob = new Blob([html], {
      type: 'text/html',
      endings: 'native'
    });
    return URL.createObjectURL(blob);
  }

  return (
    <iframe style={{ width: '50%', border: '1px solid black' }} src={createBlobUrl(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
          <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
         
          ${lib.reduce((a,b)=> 
            `<script src="https://unpkg.com/${a}" crossorigin></script>`+'\n'+`<script src="https://unpkg.com/${b}" crossorigin></script>`)}
          <link rel="stylesheet" href="https://unpkg.com/antd@4.2.5/dist/antd.css">
          <script>


         ${code}

          window.onload = () => {
            console.log(React.createElement)
            ReactDOM.render(React.createElement( App, null ), document.getElementById('root'));
          }
          </script>
        </head>
        <body>
          <div id="root"></div>

        </body>
    </html>
    `)} />
  )
}

function App() {
  const [transCode, SetTransCode] = useState('');
  const [Code, SetCode] = useState(`
  function App()
  {
    const [idx,SetIdx] = React.useState(0);
    return (
      <div>
        <antd.Button type="primary" onClick={()=> SetIdx(idx+1)}>{idx}</antd.Button>
      </div>
    )
  }
  `);

  const ErrorComponent = useCallback((ErrorMessage) => `
  function App()
  {
    return (
      <div>
        <antd.Alert
        message="Error"
        description="${ErrorMessage}"
        type="error"
        showIcon
      />
      </div>
    )
  }
`, []);

  function textarea_onChange(input_code) {
    SetCode(input_code);
  }

  useEffect(() => {
    try {
      SetTransCode(transform(Code).code);
    }
    catch (e) {
      SetTransCode(transform(ErrorComponent(e.message)).code)
    }
  }, [Code]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>

        <Editor
          value={Code}
          onValueChange={textarea_onChange}
          highlight={code => highlight(code, languages.jsx)}
          padding={10}
          style={{ width: '50%', height: '768px' }}
        />
        <Frame code={transCode}  lib={['antd','reactstrap']}/>

      </div>
      <input type="text" id="text"/>
      <div style={{ display: 'flex' }}>
        <button onClick={()=>{
          let text = document.getElementById('text').value;
          axios.get(`http://unpkg.com/${text}`).then((v) => console.log(v));
        }}>Test</button>
      </div>
    </div>
  );
}

export default App;
