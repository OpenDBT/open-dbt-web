
import React,{ } from 'react';
import logo from '@/img/logo-itol.png'
import { Button, Menu } from 'antd';
import { history } from 'umi';
import SuperIcon from "@/pages/components/icons";
import '../header.less';
interface IProps {
  courseId: number;
  clazzId: number;
  chapterId: number;
}
/**
 * 章节预览，header
 * @param props 
 * @returns 
 */
const PreviewHeader = (props: IProps) => {
  const {
    courseId,
    clazzId,
    chapterId
  } = props;
  /**
   * @function 编辑章节跳转
   */
  const clickEdit = () => {
    history.push(`/edit/chapter/${courseId}/${clazzId}/${chapterId}`)
  }
   const backup=()=>{
         //history.push(`/expert/course/chapter/${courseId}`);
    //history.push(`/edit/chapter/${courseId}/${clazzId}/${chapterId}`)
    history.go(-1);
      }
    const customCloseIcon = <SuperIcon type="icon-chehui" style={{fontSize: '24px',color: '#00CE9B', marginRight: '15px' }}/>;
  return (
    <div className='custom-single'>
      <div className='custom-header-row' style={{position:'fixed'}}>
        <div className='header-logo'>
          <img src={logo} alt="" />
        </div>
        <div className='header-menu'>
          <Menu mode="horizontal" defaultSelectedKeys={['detail']}>
            <Menu.Item key="detail">
              课程详情
            </Menu.Item>
          </Menu>
        </div>
        {/* <div className='header-right'>
          <Button type="primary" style={{ borderRadius: '5px' }} onClick={() => { clickEdit() }}>
            <SuperIcon type="icon-icon-edit-3" />
            编辑章节</Button>
        </div> */}
        <div  className='header-right'>
            <a onClick={backup}>{customCloseIcon}</a>
        </div>
      </div>
    </div>
  )
}

export default PreviewHeader