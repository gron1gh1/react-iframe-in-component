import React, { useState ,useEffect} from 'react';
import { Row, Col } from 'antd';

import "./style.css";

import {IFrameProvider,IFrame,CodeEditor} from 'react-playground-iframe';

import { Scrollbars } from 'react-custom-scrollbars';
import { Sidebar } from './Sidebar';
import styled from 'styled-components';

const StyledIFrame = styled(IFrame)`
  width:50%;
  cursor:pointer;
`
function App() {

  const InitCode = `const {Button} = antd;

function App()
{
  const [idx,SetIdx] = React.useState(0);
  return (
    <div>
      <Button type="primary" onClick={()=> SetIdx(idx+1)}>{idx}</Button>
    </div>
  )
}`;
  const [modules, SetModule] = useState(['antd']);
  const [css, SetCSS] = useState(['https://unpkg.com/antd@4.2.5/dist/antd.css']);

  useEffect(()=>{
      console.log(modules);
  },[modules]);

  return (
    <IFrameProvider>
      <Row style={{ height: '100vh' }}>
        <Col flex="264px" style={{ background: 'white', height: '100vh', borderRight: '1px solid lightgray' }}>
          <Scrollbars style={{ height: '100%' }} autoHide>
            <Sidebar modules={modules} SetModule={SetModule} css={css} SetCSS={SetCSS}/>
          </Scrollbars>
        </Col>
        <Col flex="auto" style={{
          background: 'lightgray',
          height: '100vh',
          overflowY: 'scroll'
        }}>

          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <CodeEditor InitCode={InitCode}/>
            </div>
            <StyledIFrame InitCode={InitCode} LoadModule={modules} LoadCSS={css} width="50%" />
          </div>

        </Col>
      </Row>
    </IFrameProvider>
  )
}

export default App;
