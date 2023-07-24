import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
//import Editor from '@/pages/common-course/question/component/type/components/editor/braft/braft';
import Editor from '@/pages/stu/study/task/component/braft/braft';
import BraftEditor, { BraftEditorProps, ControlType, EditorState, ExtendControlType } from 'braft-editor';

import './common.less'

interface IProps {
  // current: any;
  data: any;
  beforeSubmitModel: (newValue: string) => void;
  childData: string;
  // taskList: any;
};
const ShortAnswer = (props: IProps) => {
  const {
    data,
  } = props;



  const [editorState, setEditorState] = useState<EditorState>(BraftEditor.createEditorState(data.stuAnswer));
  useEffect(() => {
    console.log('shortAnswer useEffect exerciseId .....', data.exerciseId, data.stuAnswer);
    if (data && data.stuAnswer) {
      setEditorState(BraftEditor.createEditorState(data.stuAnswer))
    }
  }, [data.exerciseId])


  const changeEdit = (editorState: EditorState) => {
    props.beforeSubmitModel((editorState && editorState.toHTML() != '<p></p>') ? editorState.toHTML() : '');
  }



  return (
    <div>
      <div>
        <Form.Item label="答案">
          <Editor className="border" placeholder="请输入正文内容"
            value={editorState}
            onChange={changeEdit}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default ShortAnswer;
