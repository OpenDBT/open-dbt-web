import { useState, useCallback, forwardRef, useRef,useImperativeHandle } from 'react';
import BraftEditor, { ControlType, EditorState,ExtendControlType } from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import './braft.css';
import SuperIcon from "@/pages/components/icons";
import ImgModal from '@/pages/components/Editor/components/Modal/imageModal';
const options = {
  defaultColumns: 3, // 默认列数
  defaultRows: 3, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: 'border="1" style="border-collapse: collapse"', // 指定输出HTML时附加到table标签上的属性字符串
};
interface CustomBraftEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  controls?: ControlType[];
  // 其他可选属性
}
const CustomBraftEditor = forwardRef((props, ref) => {
  const { value, readOnly, controls, onChange, ...restProps } = props as CustomBraftEditorProps;
  const editorRef = useRef(null);
  const [imgVisible, setImgVisible] = useState<boolean>(false); //图片弹框判断
  const [editorState, setEditorState] = useState<EditorState>(
    BraftEditor.createEditorState(value)
  );


  BraftEditor.use(Table(options));

  //'font-family',  , 'table'
  const controlsData: ControlType[] = ['undo', 'redo', 'separator', 'font-size', 'line-height', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through',
    'separator', 'text-align', 'separator',
    'separator',  'link', 'separator', 'clear'
  ];
  /**
   * @function 自定义扩展组件
  */
  const extendControls: ExtendControlType[] = [
    // 插入图片
    {
      key: 'insert-img',
      type: 'button',
      title: '插入图片',
      text: (<SuperIcon type="icon-tupian" />),
      onClick: () => setImgVisible(true),
    },
  ]
  // 封装的方法：设置编辑器的值
  const setValue = (newValue: string) => {
    const newEditorState = BraftEditor.createEditorState(newValue);
    setEditorState(newEditorState);
  };

  // 将方法暴露给父组件
  useImperativeHandle(ref, () => ({
    setValue,
  }));
  
  const onEditorChange = useCallback( async(e) => {
    await setEditorState(e)
    return onChange && onChange(e);
  }, [onChange]);

  
  return (
    <>
      {
        imgVisible && (
          <ImgModal
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
      ref={editorRef} 
      {...props}
        controls={readOnly ? [] : (controls ? controls : controlsData)}
        extendControls={extendControls}
        value={editorState}
        className="test1"
        readOnly={readOnly}
        style={{ width: '100%' ,height: '200px'}}
        onChange={onEditorChange}
      />
    </>
  );
});

export default CustomBraftEditor;
