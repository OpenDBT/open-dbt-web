import React,{ useState, useCallback } from 'react';
import BraftEditor, { BraftEditorProps, ControlType, EditorState, ExtendControlType } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import './braft.css'
import SuperIcon from "@/pages/components/icons";
import ImgModal from '@/pages/components/Editor/components/Modal/imageModal';
import 'braft-editor/dist/index.css';
import { Modal } from 'antd';
import MathEditor from './MathEditor';
import KaTeXBlock from './KaTeXBlock';
import { AtomicBlockUtils } from 'draft-js';
const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: 'border="1" style="border-collapse: collapse"', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['id-2']  // 指定该模块对哪些BraftEditor无效
};

export default function Braft(props: BraftEditorProps) {
  const {courseId, value, readOnly, controls, onChange, ...restProps } = props;
  console.log("courseId============",courseId);
  const [imgVisible, setImgVisible] = useState<boolean>(false); //图片弹框判断
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(value)
  );
  const onEditorChange = useCallback( async(e) => {
    await setEditorState(e)
    return onChange && onChange(editorState);
  }, [onChange]);

  BraftEditor.use(Table(options));

  //'font-family',  , 'table'
  const controlsData: ControlType[] = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through',
    'separator', 'text-align', 'separator',
    'separator',  'link', 'separator', 'clear'
  ];
  


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
       // 插入图片
    {
      key: 'insert-img',
      type: 'button',
      title: '插入图片',
      text: (<SuperIcon type="icon-tupian" />),
      onClick: () => setImgVisible(true),
    },
    ],
    blockRendererFn: customBlockRenderer, // 设置自定义块渲染函数
  };

  return (
    <>
      {
        imgVisible && (
          <ImgModal
            courseId={courseId}
            modalVisible={imgVisible}
            onCancel={() => { setImgVisible(false) }}
            onSubmit={(value: string) => {
              // 没有值，关闭弹框，避免报错
              if (value == '') {
                setImgVisible(false)
                return
              }
              let url = value
              // 使用编辑器自带的media功能来显示图片
              setEditorState(
                ContentUtils.insertMedias(editorState, [{
                  type: 'IMAGE',
                  url: url
                }])
              )
              setImgVisible(false)
            }}
          />
        )}
      <BraftEditor
        {...restProps}
        controls={readOnly ? [] : (controls ? controls : controlsData)}
        value={editorState}
        onChange={onEditorChange}
        className="test1"
        readOnly={readOnly}
        style={{ width: '100%' }}
        {...editorProps}
      />
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

    </>
  );
}
