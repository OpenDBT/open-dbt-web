import React, { useState } from 'react';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { Modal } from 'antd';
import MathEditor from './MathEditor';
import KaTeXBlock from './KaTeXBlock';
const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showMathEditor, setShowMathEditor] = useState(false);

  // 处理插入数学公式的逻辑
  const handleInsertMathFormula = (mathText) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('MATH', 'IMMUTABLE', { mathText });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    setEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '));
    setShowMathEditor(false);
  };



  // 定义自定义块渲染函数
  const customBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      const contentState = editorState.getCurrentContent();
      const entityKey = contentBlock.getEntityAt(0);
      const entity = contentState.getEntity(entityKey);
      const data = entity.getData();
      if (data.mathText && entity.getType() === 'MATH') {
        console.log("mathText, type =", data.mathText, entity.getType());
        return {
          component: KaTeXBlock,
          editable: false,
          props: {
            mathText: data.mathText, // 将属性名改为 mathText
          },
        };
      }
    }
    return null;
  };
  // extendControls属性用于添加自定义按钮到工具栏
  const editorProps = {
    extendControls: [
      {
        key: 'math-input',
        type: 'button',
        text: '插入数学公式',
        onClick: () => setShowMathEditor(true),
      },
    ],
    blockRendererFn: customBlockRenderer, // 设置自定义块渲染函数
  };

  return (
    <div>
      <BraftEditor value={editorState} onChange={setEditorState} {...editorProps} />
      <Modal
        title="数学公式编辑器"
        visible={showMathEditor}
        onCancel={() => setShowMathEditor(false)}
        footer={null}
        bodyStyle={{ padding: '12px', maxHeight: '80vh', overflow: 'auto' }}
        width="80%"
      >
        <MathEditor onInsertFormula={handleInsertMathFormula} />
      </Modal>
    </div>
  );
};

export default MyEditor;
