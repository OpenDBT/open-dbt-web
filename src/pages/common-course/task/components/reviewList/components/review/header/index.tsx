
import React, {  } from 'react'
import logo from '@/img/logo-itol.png'
import './index.less'
import SuperIcon from '@/pages/components/icons';
import { history } from 'umi';
import { useParams } from 'react-router-dom';
interface IProps {
  clickSave: () => void;  // 保存
  continueAnswer: () => void; // 继续答题
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const CreateHeader = (props: IProps) => {
  const customCloseIcon = <SuperIcon type="icon-chehui" style={{fontSize: '24px',color: '#00CE9B', marginRight: '15px' }}/>;
  const {  homeworkId, courseId, classId } = useParams();
 //返回
 const backup=()=>{
  history.push(`/teacher/course/task/review/courseId/classId/homeworkId/${courseId}/${classId}/${homeworkId}`)
}
  return (
    <div className='custom-single'>
      <div className='custom-header-row' style={{ position: 'fixed', top: 0, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div className='header-left'>
          <div className='header-logo'>
            <img src={logo} alt="" />
          </div>
        </div>
        <div className='header-title'>
          作业批阅
        </div>
        <div className='header-right' style={{ textAlign: 'right' }}>
        <a onClick={backup}>{customCloseIcon}</a>
        </div>
      </div>
    </div>
  )
}

export default CreateHeader