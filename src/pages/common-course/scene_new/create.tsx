import React from 'react';
import './index.less';
import '@/pages/common-course/course-common.less';
import { Form, Input, Button, Space, message } from 'antd';
import moment from 'moment';
import BraftEditor from '@/pages/editor/braft';
import { testSceneSQLShell } from '@/services/teacher/course/scene';
import { saveScene } from '@/services/teacher/course/scene';
import { API } from '@/common/entity/typings';
import logo from '@/img/logo-itol.png'
import { useParams } from 'umi'
import { ValidateIntegerParam } from '@/utils/utils'
import { useEffect } from 'react';
import { history } from 'umi';
import SuperIcon from '@/pages/components/icons';

const { TextArea } = Input;
const FormItem = Form.Item;

const addIndex = (props) => {
  const params: any = useParams();
  const courseId = params.courseId || props.courseId; // 使用useParams获取courseId，若不存在则使用属性传递的courseId
  const [form] = Form.useForm();

  useEffect(() => {
    ValidateIntegerParam(courseId);
  }, []);

  /**
   * 保存
   */
  const onFinish = async (values: API.SceneListRecord) => {
      // 检查 values.sceneDesc 的类型
      if (typeof values.sceneDesc === 'string') {
        // 如果类型是 string，不做处理，或者进行其他操作
      } else  {
        // 如果类型是 BraftEditor，调用 .toHTML() 方法转换为 HTML
        values.sceneDesc = values.sceneDesc.toHTML()
      }
    const result = await saveScene(values)
    if (result.success) {
      message.success('保存成功');
      //window.location.reload();
      backup();
    } else {
      message.error(result.message);
    }
  };

  /**
   * 下载脚本
   */
  const downLoadShell = () => {
    const sceneName = form.getFieldValue('sceneName');
    const initShell = form.getFieldValue('initShell');
    console.log('sceneName == ', sceneName, ', initShell == ', initShell);

    if (sceneName.trim().length == 0 || initShell.trim().length == 0) {
      message.error('应用场景名称和初始化的脚本不可为空！');
    } else {
      const blob = new Blob([initShell]);
      const fileName = `${sceneName}_${moment(new Date()).format('YYYYMMDDHHmmss')}.sql`;
      const link = document.createElement('a');
      const evt = document.createEvent('MouseEvents');
      link.style.display = 'none';
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link); // 此写法兼容可火狐浏览器
      evt.initEvent('click', false, false);
      link.dispatchEvent(evt);
      document.body.removeChild(link);// 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 释放掉blob对象
    }
  };
  /**
   * 测试运行
   * @returns 
   */
  const testShell = async () => {
    const initShell: string = form.getFieldValue('initShell');
    console.log('initShell == ', initShell);
    if (initShell.length === 0) {
      message.warning('请输入脚本内容')
      return;
    }

    const result = await testSceneSQLShell({ initShell: initShell })
    if (result.success) {
      message.success('脚本语法正确');
    } else {
      message.error(result.message);
    }
  };
  const backup=()=>{
    history.push(`/scene/list/${courseId}`)
  }

    const customCloseIcon = <SuperIcon type="icon-chehui" style={{fontSize: '24px',color: '#00CE9B', marginRight: '15px' }}/>;
  return (
    <div className='custom-single'>
      <div className='custom-header-row' style={{ position: 'fixed', top: 0 }}>
        <div className='custom-header-row' style={{ position: 'fixed', top: 0, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div className='header-logo'>
            <img src={logo} alt="" onClick={() => history.push('/')} />
          </div>
          <div className='header-right'>
            <a onClick={backup}>{customCloseIcon}</a>
        </div>
        </div>
      </div>

      <div className='main-container scene'>
        <div className="title-4">新建场景</div>
        <div className='scene-create'>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            initialValues={{
              courseId: courseId,
              sceneName: '',
              sceneDesc: '',
              initShell: ''
            }}
          >
            <FormItem name="courseId" hidden={true}><Input /></FormItem>
            <FormItem
              name="sceneName"
              label="应用场景名称"
              rules={[{ required: true, message: '请输入应用场景名称' }]}
            >
              <Input placeholder="请输入应用场景名称" style={{ width: '40%' }} />
            </FormItem>
            <FormItem name="sceneDesc" label="应用场景描述" >
              <BraftEditor placeholder="请输入正文内容" />
            </FormItem>
            <div style={{ height: 50, lineHeight: '50px' }}>
              <Space>
                <h3>初始化脚本</h3>
                <Button type="primary" style={{ marginLeft: 20 }} onClick={() => downLoadShell()}>脚本下载</Button>
                <Button type="primary" style={{ marginLeft: 20 }} onClick={() => testShell()}>检查脚本</Button>
              </Space>
            </div>
            <FormItem name="initShell">
              <TextArea
                style={{ minHeight: 100 }}
                placeholder={"请输入脚本"}
                rows={10}
              />
            </FormItem>
            <div style={{ textAlign: 'center' }}>
              <Form.Item><Button type="primary" htmlType="submit">保存设置</Button></Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default addIndex;
