import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, message, Divider, Modal } from 'antd';
import { QUESTION_BANK } from '@/common/entity/questionbank'
import './common.less'
interface IProps {
    // current: any;
    data: any;
    // taskList: any;
  };
const Multiple = (props: IProps) => {
    const {
        data,
    } = props;
    const [prefix, setPrefix] = useState<string>('')
    const [prefixList, setPrefixList] = useState<string[]>([])
        /**
     * 选中/取消选中答案
     */
        const bolListPefix = (name: string) => {
            if (prefixList.includes(name)) {
                setPrefixList(prefixList.filter(item => item != name))
            }
            else {
                setPrefixList([...prefixList, name]);
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
