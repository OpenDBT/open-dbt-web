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
const BlanksExercise = (props: IProps) => {
  const {
    data,
  } = props;



  const [mapState, setMapState] = useState(new Map());

  const changeBlans = (prefix: number) => (event: any) => {
    const newMap = new Map(mapState);
    newMap.set(prefix, event.target.value);
    setMapState(newMap);
  }



  useEffect(() => {
    console.log('blanks useEffect exerciseId .....', data.exerciseId, data.stuAnswer);
    if (data && data.stuAnswer) {
      const myArray = data.stuAnswer.split('@_@').map((item: string) => item.trim());
      const newMap = new Map(myArray.map((item: string, index: number) => [index + 1, item]));
      setMapState(newMap)
    }
  }, [data.exerciseId])


  useEffect(() => {
    console.log('blanks  .....', data.exerciseId, mapState);
    //根据key排序
    const sortedEntries = [...mapState.entries()]
      .sort((a, b) => a[0].toString().localeCompare(b[0].toString()));
    //排序后value值组成字符串用@_@隔开
    const sortedValues = sortedEntries.map(entry => entry[1]).join('@_@');
    props.beforeSubmitModel(sortedValues);
  }, [mapState])



  return (
    <div>

      {
        (data && data.exerciseInfos.map((eItem: QUESTION_BANK.QuestionExerciseOption, eIndex: number) => {
          return <div>
            <Form.Item label={`空格 ${eItem.prefix}`} style={{ width: '100%' }}>

              <Input style={{ width: '100%' }} value={mapState.get(parseInt(eItem.prefix))} onChange={changeBlans(parseInt(eItem.prefix))} />

            </Form.Item>
          </div>

        }))
      }



    </div>
  );
};

export default BlanksExercise;
