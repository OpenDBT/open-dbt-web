import React, { useEffect, useState } from 'react';
import { message, Col, Row, Modal, Button, Checkbox, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { sharedExercise } from '@/services/student/progress';
interface IProps {
  onCancel: () => void;
  onSubmit: () => void;
  checkList: any [];
  visible: boolean;
  courseId: number;
}
const SharedSettings = (props: IProps) => {
  const [value, setValue] = useState<boolean>(false);//单选框选中
  const [itemVisible, setItemVisible] = useState<boolean>(true); //任务点弹框判断
  const { onCancel: onCancel, onSubmit: onSubmit, visible, checkList,courseId } = props;

    //如果是单个题目设置原始值
    useEffect(() => {
      if(checkList&&checkList.length==1){
        console.log("--------",checkList[0].authType);
        setValue(checkList[0].authType==2?true:false);
      }
     
    }, [])
  // 确定
  const handleOk = () => {
    settingExercise()
  };
  // 共享设置
  const settingExercise = () => {
    const idCollection = checkList.map(item => item.id);
    let parmas = {
      ids: idCollection,
      authType: value==true?2:1,
      courseId: courseId
    }
    sharedExercise(parmas).then((res) => {
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
      title={'共享设置'}
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
              <Radio value={true}><span style={{ fontWeight: "bold" }}>共享</span></Radio>

            </Col>
            <Col span={12}>
              <Radio value={false}><span style={{ fontWeight: "bold" }}>私有</span></Radio>
            </Col>
          </Row>
        </Radio.Group>
        <Checkbox onChange={onChangeCheckboxItem} checked={true} style={{marginTop: '20px'}}>同步设置场景</Checkbox>
        <span className='setting-remark'>设置为共享时对应的场景一并设置为共享</span>
        {/* <div>
          {
            checkList[0]
          }
        </div> */}
    </Modal>
  );
};
export default SharedSettings;
