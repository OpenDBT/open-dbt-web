import React, { useState } from 'react'
import { Divider, Input, Dropdown, Space, Menu } from 'antd';
import SuperIcon from "@/pages/components/icons";
import { QUESTION_BANK } from '@/common/entity/questionbank'
interface IProps {
  onChangeScore: (value: any) => void;
  editSumbit: (value: any) => void;
  editReset: (value: any) => void;
  editHalf: (value: any) => void;
  current: any;
  data: any;
  taskList: any;
  changeAllScore: any;
};
const SpaceQeustion = (props: IProps) => {
  const {
    data,
    current,
    changeAllScore,
    onChangeScore: onChangeScore,
    editSumbit: editSumbit,
    editReset: editReset,
    editHalf: editHalf
} = props;
  const [clickMore, setClickMore] = useState<any>(); //点击更多存储当前行数据
   // 控制Input数值的输入
   const onNumerInputKeyDown = (event:any) => {
    if(event.key === "e") event.preventDefault();
    if(event.key === "+") event.preventDefault();
    if(event.key === "-") event.preventDefault();
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a onClick={() => { editSumbit(clickMore) }}>
              <SuperIcon type={'icon-icon-duihao31'} className='answser-submit-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: '#23dba7' }} />
              正确
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a onClick={() => { editReset(clickMore) }}>
              <SuperIcon type={'icon-icon-cuowu21'} className='answser-cuowu-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: 'red' }} />
              错误
            </a>
          ),
        },
        {
          key: '3',
          label: (
              <a onClick={() => { editHalf(clickMore) }}>
                  <SuperIcon type={'icon-half-correct'} className='answser-cuowu-button' style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px', color: 'red' }} />
                  半对
              </a>
          ),
        }
      ]}
    />
  );
  return (
    <div>
      <div className='answser-own-braft'>
        <div className='header'>
        <div>
            <Dropdown overlay={menu} trigger={['click']}>
              <a onClick={e => { e.preventDefault(); setClickMore(data) }}>
                <Space>
                <SuperIcon type={data.isCorrect == 1 ? 'icon-icon-duihao31' :(data.isCorrect == 2 ?'icon-icon-cuowu21':'icon-half-correct') } className={data.isCorrect == 1 ? 'answser-submit-button' : 'answser-cuowu-button'} style={{ verticalAlign: 'middle', fontSize: '1.5rem', marginRight: '20px' }} />
                </Space>
              </a>
            </Dropdown>
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>我的答案：</span>
          </div>

          {/* <span>{item.exerciseScore} 分</span> */}
          <div>
            <span>得分：</span><span><Input style={{ display: 'inline-block', width: '80px' }} type="number" onKeyPress={(e)=>onNumerInputKeyDown(e)} min={0} max={data.exerciseActualScore} value={data.exerciseScore} onChange={(e) => onChangeScore(e)}></Input></span>
          </div>
        </div>
        <div className='answser-content'>
          {
            data.exercise.exerciseInfos.map((tItem: QUESTION_BANK.QuestionExerciseOption, tIndex: number) => {
              return <div className='space-answser-line' key={'space' + tIndex} style={{display: 'flex'}}>
                <span>空格{tIndex + 1}：</span>
                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: current.exerciseResult.split('@_@')[tIndex] }} style={{ fontWeight: 'normal' }}></div>
              </div>
            })
          }
        </div>
      </div>
      {/* 正确答案 */}
      <div className='answser-normal-braft'>
        <div className='header'>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>正确答案：</span>
        </div>
        <div className='answser-content'>
          {
            data.exercise.exerciseInfos.map((tItem: QUESTION_BANK.QuestionExerciseOption, tIndex: number) => {
              return <div className='space-answser-line' key={'space-sumbit' + tIndex} style={{display: 'flex'}}>
                <span>空格{tIndex + 1}：</span>
                <div className='html-width-class' dangerouslySetInnerHTML={{ __html: tItem.content }} style={{ fontWeight: 'normal' }}></div>
              </div>
            })
          }
        </div>
        <Divider></Divider>
        <div className='header'>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案解析：</span>
        </div>
        <div className='answser-content'>
          <div className='html-width-class' dangerouslySetInnerHTML={{ __html: data.exercise.exerciseAnalysis != null ? data.exercise.exerciseAnalysis : '无' }}></div>
        </div>
      </div>
    </div>
  )
}

export default SpaceQeustion