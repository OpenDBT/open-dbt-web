import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import './common.less'
interface IProps {
  // current: any;
  data: any;
  // taskList: any;
  beforeSubmitModel: (newValue: string) => void;
  childData: string;
};
const Single = (props: IProps) => {
  const {
    data,

  } = props;


  const [prefix, setPrefix] = useState<string>('');

  useEffect(() => {
    console.log('single useEffect exerciseId .....', data.exerciseId,data.stuAnswer);
    setPrefix(data.stuAnswer)
}, [data.exerciseId])

  //传值给父组件
  const handleChange = async (pre: string) => {
    console.log("ssss=" + pre);
    await setPrefix(pre);
    props.beforeSubmitModel(pre);
  }



  return (
    <div>
      {/* 题干 */}

      {
        data && data.exerciseInfos.map((eItem: QUESTION_BANK.QuestionExerciseOption, eIndex: number) => {
          return <div key={'single' + eIndex} style={{ display: 'flex' }}>
            <Button shape="circle" className={prefix == eItem.prefix ? 'clcikAnswserClass' : ''} onClick={() => { handleChange(eItem.prefix) }}>
              {eItem.prefix}
            </Button>
            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: eItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
          </div>
        })
      }
    </div>
  );
};

export default Single;
