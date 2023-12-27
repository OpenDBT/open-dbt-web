import React from 'react';
import logo from '@/img/logo-itol.png'
import './header.less'
import SuperIcon from '@/pages/components/icons';
import { history } from 'umi';
/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const EditorHeader = () => {
  const customCloseIcon = <SuperIcon type="icon-chehui" style={{ fontSize: '24px', color: '#00CE9B', marginRight: '15px' }} />;
  const backup = () => {
    //history.push(`/teacher/course/question/${courseId}/${parentId}?clickFile=${encodedClickFile}`)
    history.go(-1);
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
          作业详情
        </div>
        <div className='header-right'>
          <a onClick={backup}>{customCloseIcon}</a>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader