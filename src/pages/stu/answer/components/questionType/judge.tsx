import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
interface IProps {}
const Judge = (props: IProps) => {
    const [bolAnswser, setBolAnswser] = useState<number>(0)
  return (
    <>
      <Form.Item>
        <Tooltip placement="leftTop" title="设为答案">
          <Button
            shape="circle"
            className={bolAnswser == 1 ? 'answserClass' : ''}
            onClick={() => {
              setBolAnswser(1);
            }}
          >
            A
          </Button>
        </Tooltip>

        <span style={{ marginLeft: '20px' }}>正确</span>
      </Form.Item>
      <Form.Item>
        <Tooltip placement="leftTop" title="设为答案">
          <Button
            shape="circle"
            className={bolAnswser == 2 ? 'answserClass' : ''}
            onClick={() => {
              setBolAnswser(2);
            }}
          >
            B
          </Button>
        </Tooltip>
        <span style={{ marginLeft: '20px' }}>错误</span>
      </Form.Item>
    </>
  );
};

export default Judge;
