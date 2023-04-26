import React, { useEffect, useState } from 'react';
import { message, Col, Row, Modal, Button, Checkbox, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { publishExercise } from '@/services/student/progress';
interface IProps {
  onCancel: () => void;
  onSubmit: () => void;
  checkList: any [];
  visible: boolean;
}
const ExerciseSetting = (props: IProps) => {
  const [value, setValue] = useState<boolean>(false);//单选框选中
  const [itemVisible, setItemVisible] = useState<boolean>(true); //任务点弹框判断
  const { onCancel: onCancel, onSubmit: onSubmit, visible, checkList } = props;
  // 确定
  const handleOk = () => {
    settingExercise()
  };
  // 练习设置
  const settingExercise = () => {
    let parmas = {
      ids: checkList,
      exerciseStatus: value==true?0:1,
      showAnswer: itemVisible==true?0:1
    }
    publishExercise(parmas).then((res) => {
      if (res.success) {
        message.success("设置完成")
        onSubmit();
      }else {
        message.error("设置失败")
      }
    })
  }
  // 取消
  const handleCancel = () => {
    onCancel();
  };
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
    // 任务点选择函数
    const onChangeCheckboxItem = (e: CheckboxChangeEvent) => {
      setItemVisible(e.target.checked)
    };
  return (
    <Modal
      key="exercise-setting"
      className="exercise-setting-modal"
      open={visible}
      title={'练习设置'}
      maskClosable={true}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <div className="move-modal-footer" key="footer-one" style={{display: 'flex',justifyContent: 'end'}}>
          <div>
            <Button key="back" onClick={()=>{handleCancel()}}>
              取消
            </Button>
            <Button key="submit" type="primary" onClick={()=>{handleOk()}}>
              确定
            </Button>
          </div>
        </div>,
      ]}
    >
      <Radio.Group style={{ width: '100%' }} value={value} onChange={onChange}>
          <Row>
            <Col span={12}>
              <Radio value={true}><span style={{ fontWeight: "bold" }}>练习题</span></Radio>
              
            </Col>
            <Col span={12}>
              <Radio value={false}><span style={{ fontWeight: "bold" }}>非练习题</span></Radio>
            </Col>
          </Row>
        </Radio.Group>
        <Checkbox onChange={onChangeCheckboxItem} checked={itemVisible} style={{marginTop: '20px'}}>记住登录状态</Checkbox>
        <span className='setting-remark'>设置为练习题时方可设置学生答题完成后是否显示答案和解析</span>
        <div>
          {
            checkList[0]
          }
        </div>
    </Modal>
  );
};
export default ExerciseSetting;
