
import React from 'react';
import logo from '@/img/logo-itol.png'
import './index.less'
import { Button } from 'antd';
import { history } from 'umi';
import SuperIcon from "@/pages/components/icons";

interface IProps {
  clickSave: () => void;  // 保存
  continueAnswer: () => void; // 继续答题
  courseId?: string;
  parentId: string;
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const CreateHeader = (props: IProps) => {
  const {
    clickSave: clickSave,
    continueAnswer: continueAnswer,
    courseId: courseId,
    parentId: parentId,
  } = props;
   const backup=()=>{
        history.push(`/teacher/course/question/${courseId}/${parentId}`)
      }
  return (
    <div className='custom-single'>
      <div className='custom-header-row'>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
          创建题目
        </div>
        <div className='header-right'>
          <Button type="primary" className='button-radius' onClick={clickSave}>
            <SuperIcon type="icon-baocun" />保存
          </Button>
          <Button type="primary" className='button-radius continue-button' style={{}} onClick={continueAnswer}>
            <SuperIcon type="icon-yulan" />继续出题
          </Button>
          
           <Button type="primary" className='button-radius continue-button' style={{}} onClick={backup}>
            <SuperIcon type="icon-chehui" />返回
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateHeader