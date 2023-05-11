import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import './common.less'
interface IProps {
  // current: any;
  data: any;
  childData: string;
  beforeSubmitModel: (newValue: string) => void;
  // taskList: any;
};
const Multiple = (props: IProps) => {
  const {
    data,
  } = props;

  const [prefixList, setPrefixList] = useState<string[]>([])



  useEffect(() => {
    console.log('multiple useEffect exerciseId .....', data.exerciseId, data.stuAnswer);
    if (data&&data.stuAnswer) {
       setPrefixList(data.stuAnswer.split(','))
    }
  }, [data.exerciseId])


  useEffect(() => {
    console.log('multiple  .....', data.exerciseId,prefixList.join(','));
    props.beforeSubmitModel(prefixList.join(','));
  
  }, [prefixList])

  /**
* 选中/取消选中答案
*/
  const bolListPefix = async (name: string) => {
    if (prefixList.includes(name)) {
      await setPrefixList(prefixList.filter(item => item != name))
    }
    else {
      await setPrefixList([...prefixList, name]);
    }
  }
  return (
    <div>
      {/* 题干 */}
      {
        data && data.exerciseInfos.map((sItem: QUESTION_BANK.QuestionExerciseOption, sIndex: number) => {
          return <div key={'multiple' + sIndex} style={{ display: 'flex' }}>
            <Button className={prefixList.includes(sItem.prefix) ? 'clcikAnswserClass' : ''} onClick={() => { bolListPefix(sItem.prefix) }}>
              {sItem.prefix}
            </Button>
            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: sItem?.content }} style={{ fontWeight: 'normal', marginLeft: '20px' }}></div>
          </div>
        })
      }
    </div>
  );
};

export default Multiple;
