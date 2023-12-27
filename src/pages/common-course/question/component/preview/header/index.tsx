
import React, { } from 'react';
import logo from '@/img/logo-itol.png'
import './index.less'
import { Button } from 'antd';
import SuperIcon from '@/pages/components/icons';
import { history } from 'umi';
interface IProps {
  clickSave: () => void;
  courseId: string;
  parentId: string;
}

/**
 * 章节编辑的header
 * @param props 
 * @returns 
 */
const PreviewHeader = (props: IProps) => {
  const {
    clickSave: clickSave,
    courseId,
    parentId
  } = props;

    const customCloseIcon = <SuperIcon type="icon-chehui" style={{fontSize: '24px',color: '#00CE9B', marginRight: '15px' }}/>;
  /**
   * 跳转到
   */
  // 获取查询参数 clickFile
  const query = new URLSearchParams(window.location.search);
  const encodedClickFile = query.get('clickFile');
  
   const backup=()=>{
    history.push(`/teacher/course/question/${courseId}/${parentId}?clickFile=${encodedClickFile}`)
  //history.go(-1);    
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
            题目预览
        </div>
        <div className='header-right'>
          <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { clickSave() }}>
            编辑
          </Button>
        </div>
        <div className='header-right'>
        <a onClick={backup}>{customCloseIcon}</a>
        </div>
      </div>
    </div>
  )
}

export default PreviewHeader