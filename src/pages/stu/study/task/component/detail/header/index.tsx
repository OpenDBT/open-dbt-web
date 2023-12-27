import React from 'react';
import logo from '@/img/logo-itol.png'
import './index.less'
import SuperIcon from '@/pages/components/icons';
import { history } from 'umi';
const CreateHeader = () => {

  const backup = () => {
    history.go(-1);
  }
  const customCloseIcon = <SuperIcon type="icon-chehui" style={{ fontSize: '24px', color: '#00CE9B', marginRight: '15px' }} />;

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

export default CreateHeader