import CODE_CONSTANT from '@/common/code';
import { QUESTION_BANK } from '@/common/entity/questionbank';
import { Button, Menu } from 'antd';
import React, { useRef, useState } from 'react';
import DDLSql from '../type/ddlSql';
import Judge from '../type/judge';
import MultipleChoice from '../type/multiple';
import ShortAnswer from '../type/shortAnswer';
import SingleChoice from '../type/singleChoice';
import SpaceA from '../type/space';
import Sql from '../type/sql';
import Header from './header';
import './index.less';
import ViewSql from '../type/viewSql';
import FunctionSql from '../type/functionSql';
import TriggerSql from '../type/TriggerSql';
import { useParams } from 'react-router-dom';
interface IRef extends React.RefObject<HTMLDivElement> {
  clickSave: () => void;
  continueAnswer: () => void;
}
const CreateQuestion = () => {
  const [showIndex, setShowIndex] = useState<number>(1); // 显示的组件的排列顺序对应变量
  const cRef = useRef<IRef>(null);
  const [initData, setInitData] = useState<QUESTION_BANK.QuestionExercise | null>(null)
  const [selectedValue, setSelectedValue] = useState("");
  const { courseId } = useParams();
  /**
   * @description 选择按钮回调, 进行相应组件显示
   * @param number 进行判断的类型值
  */
  const selectBUttonStatus = (num: number) => {
    setShowIndex(num)
  }
  /**
   * 点击保存按钮
   */
  const clickSave = () => {
    // 调用ref组件内部方法
    cRef.current && cRef.current.clickSave()
  };
  /**
   * 点击继续答题，刷新题目出题页面
   */
  const continueAnswer = () => {
    // 调用ref组件内部方法
    cRef.current && cRef.current.continueAnswer()
  }
  const menu = (
    <Menu>
      {CODE_CONSTANT.DDLName && CODE_CONSTANT.DDLName.map((item) => {
        return <Menu.Item key={item.value} onClick={() => handleClick(item.value, item.name)} >{item.name}</Menu.Item>
      })}
    </Menu>
  );

  const handleClick = (key: number, value: string) => {
    setShowIndex(key);
    setSelectedValue(value);
  };

  return (
    <>
      <Header clickSave={() => clickSave()} continueAnswer={() => continueAnswer()} courseId={courseId} parentId={'0'}/>
      <div className='question-create-div'>
        <div className='content'>
          <div className='question-create-card'>
            <span className='mb-right-20'>基础题型</span>
            {
              CODE_CONSTANT.questionType.length != 0 && CODE_CONSTANT.questionType.map((item, index) => {
                if (index < 5) {
                  {
                    return <Button key={index + 'Bt'}
                      className={showIndex == index + 1 ? 'answserClass mb-right-10' : 'mb-right-10'}
                      onClick={() => { selectBUttonStatus(index + 1) }}>{item}</Button>
                  }
                }

              })
            }
          </div>
          <div className='question-create-card'>
            <span className='mb-right-20'>实验题型</span>
            <div style={{ display: 'inline-block' }}>
              {
                CODE_CONSTANT.questionType.length != 0 && CODE_CONSTANT.questionType.map((item, index) => {
                  if (index >= 5) {
                    {
                      return <Button key={index + 'Bt'}
                        className={showIndex == index + 1 ? 'answserClass mb-right-10' : 'mb-right-10'}
                        onClick={() => { selectBUttonStatus(index + 1) }}>{item}</Button>
                    }
                  }

                })
              }

            </div>
          </div>
          {showIndex == 1 && <SingleChoice ref={cRef} onInit={initData} />}
          {showIndex == 2 && <MultipleChoice ref={cRef} onInit={initData} />}
          {showIndex == 3 && <Judge ref={cRef} onInit={initData} />}
          {showIndex == 4 && <SpaceA ref={cRef} onInit={initData} />}
          {showIndex == 5 && <ShortAnswer ref={cRef} onInit={initData} />}
          {showIndex == 6 && <Sql ref={cRef} onInit={initData} />}
          {showIndex == 7 && <DDLSql ref={cRef} onInit={initData} />}
          {showIndex == 8 && <ViewSql ref={cRef} onInit={initData} />}
          {showIndex == 9 && <FunctionSql ref={cRef} onInit={initData} />}
          {showIndex == 10 && <TriggerSql ref={cRef} onInit={initData} />}
        </div>
      </div>
    </>

  )
}

export default CreateQuestion
