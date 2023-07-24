import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
interface IProps {
  data: any;
  beforeSubmitModel: (newValue: string) => void;
  childData: string;
}
const Judge = (props: IProps) => {
  const {
    data,
  } = props;

  const [bolAnswser, setBolAnswser] = useState<string>('')

  useEffect(() => {
    if (data && data.stuAnswer !== undefined) {
      setBolAnswser(data && data.stuAnswer);
    }

  }, [data.exerciseId])




  return (
    <>
      <Form.Item>
        <Tooltip placement="leftTop" title="设为答案">
          <Button
            shape="circle"
            className={bolAnswser == '1' ? 'clcikAnswserClass' : ''}
            onClick={async () => {
              await setBolAnswser('1');
              await props.beforeSubmitModel('1');
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
            className={bolAnswser == '2' ? 'clcikAnswserClass' : ''}
            onClick={async () => {
              await setBolAnswser('2');
              await props.beforeSubmitModel('2');
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
