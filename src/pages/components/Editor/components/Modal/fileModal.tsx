import React from 'react';
import { useEffect, useState } from 'react';
import * as APP from '@/app';
import axios from 'axios';
import { Button, message, Modal, Upload, Tabs, Skeleton, Tree, Select, Radio, Row, Col } from 'antd';
import type { UploadProps } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { listResourcesTree,updateAuthType,delResources } from '@/services/resources/upload';
const { Option } = Select;
import './index.less'

interface IProps {
  onSubmit: (values: string) => void;
  onCancel: () => void;
  modalVisible: boolean;
  courseId: number;
  callParentMethod: () =>void;
}
interface DataNode {
  id: string;
  key: string;
  parentId: string;
  resourcesName: string;
  resourcesRename: string;
  resourcesTypeName: string;
  resourcesUrl: string;
  isleaf: boolean;
  childrens?: DataNode[];
}
const SelectImage: React.FC<IProps> = (props) => {
  const [path, setPath] = useState('');     // 通用数据
  // const [localPath, setLocalPath] = useState(''); // 本地
  // const [servicePath, setServicePath] = useState(''); // 服务器
  const [url, setUrl] = useState('');
  const [videoList, setVideoList] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [sumbitDisabled, setSumbitDisabled] = useState<boolean>(true);  // 确认按钮禁用判断
  const { DirectoryTree } = Tree;
  const [fileType, setFileType] = useState('1'); // 文档类型

  // 在组件中定义一个新的状态用来保存共享状态和资源ID
  const [selectedResource, setSelectedResource] = useState<{ id: number; share: boolean } | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [menuTitle, setMenuTitle] = useState('');

  const {
    onSubmit: onSubmit,
    onCancel: onCancel,
    courseId:courseId,
    modalVisible,
    callParentMethod
  } = props;
  const uploadProps: UploadProps = {
    name: 'file',
    action: `${APP.request.prefix}/resources/uploadResources`,
    headers: {
      "authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log('onChange', info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('上传成功');
        setSumbitDisabled(false)
      } else if (info.file.status === 'error') {
        if(info.file.error&&info.file.error.message){
          message.error(info.file.error.message);
        }else{
          message.error('上传失败');
          setSumbitDisabled(true)
        }
      }
    },
    beforeUpload(file: any) {
      if (!file.type.includes('application')) {
        message.error('请上传.pdf, .doc, .docx, .xls, .xlsx, .pptx后缀的文件')
        return Upload.LIST_IGNORE;
      }
      if (file.size / 1024 / 1024 >= 30) {
        message.warning('请上传小于10M的文件')
        return Upload.LIST_IGNORE;
      }
      return file.type.includes('application')
    },
    customRequest(data: any) {
      // 初始化按钮和回显页面
      setUrl('')
      setSumbitDisabled(true)

      const formData = new FormData();
      formData.append(data.filename, data.file);
      formData.append('resourcesType', data.file.type)
      formData.append('resourcesName', data.file.name)
      formData.append('resourcesSize', data.file.size)
      formData.append('lastModifiedDate', data.file.lastModifiedDate)
      formData.append('courseId', courseId+'')
      const headers = data.headers;
      axios.post(data.action, formData, { headers })
        .then((resp: any) => {
          if(!resp.data.success&&resp.data&&resp.data.message){
            throw new Error(resp.data.message);
          }
          let url = `/readResourse/`
          if (resp.data.obj.resourcesTypeName == '幻灯片') {
            let filenName = resp.data.obj.resourcesRename.substring(0, resp.data.obj.resourcesRename.lastIndexOf("."))
            url += `ppt/${filenName}.pdf`
          } else if (resp.data.obj.resourcesTypeName == '表格') {
            let filenName = resp.data.obj.resourcesRename.substring(0, resp.data.obj.resourcesRename.lastIndexOf("."))
            url += `excel/${filenName}.pdf`
          } else if (resp.data.obj.resourcesTypeName == '文档') {
            let filenName = resp.data.obj.resourcesRename.substring(0, resp.data.obj.resourcesRename.lastIndexOf("."))
            url += `word/${filenName}.pdf`
          } else if (resp.data.obj.resourcesTypeName == 'pdf') {
            url += `pdf/${resp.data.obj.resourcesRename}`
          }
          resp.data.obj.url = url
          setUrl(url)
          // setLocalPath(JSON.stringify(resp.data.obj))
          setPath(JSON.stringify(resp.data.obj))
          data.onSuccess(resp, data.file);
        }).catch(data.onError);
    }
  };
  const onChangeTab = (key: string) => {
    if (key == '2') {
      setLoading(true);
      setSumbitDisabled(true)
      getFileListData(fileType)
    }
  };
  /**
   * @function 请求文件库列表
   * @param keys 
   * @param info 
   */
  const getFileListData = (value: any) => {
    const data = {
      resourcesRetype: value,
      courseId: courseId
    }
    listResourcesTree(data).then((res) => {
      if (res.success) {
        if (res.obj) {
          setVideoList(res.obj)
        } else {
          setVideoList([])
        }

        setLoading(false);
      } else {
        setLoading(false);
      }
    })
  };
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    setSumbitDisabled(false)
    console.log('infoL:', info)
    let url = `${APP.request.prefix}/readResourse/`
    if (info.node.resourcesTypeName == '幻灯片') {
      let filenName = info.node.resourcesRename.substring(0, info.node.resourcesRename.lastIndexOf("."))
      url += `ppt/${filenName}.pdf`
    } else if (info.node.resourcesTypeName == '表格') {
      let filenName = info.node.resourcesRename.substring(0, info.node.resourcesRename.lastIndexOf("."))
      url += `excel/${filenName}.pdf`
    } else if (info.node.resourcesTypeName == '文档') {
      let filenName = info.node.resourcesRename.substring(0, info.node.resourcesRename.lastIndexOf("."))
      url += `word/${filenName}.pdf`
    } else if (info.node.resourcesTypeName == 'pdf') {
      url += `pdf/${info.node.resourcesRename}`
    }
    info.node.url = url
    // setServicePath(JSON.stringify(info.node))
    setPath(JSON.stringify(info.node))
  };
  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };
  const handleChangeSelect = (value: string) => {
    setSumbitDisabled(true)
    setFileType(value)
    getFileListData(value)
  };
  const hideContextMenu = () => {
    // 隐藏右键菜单
    setContextMenuVisible(false);
    setLoading(true);
    setSumbitDisabled(true)
    getFileListData(fileType)

  };
  const onNodeRightClick = (info) => {
    const event = info.event;
    const node = info.node;
    event.preventDefault();

    // 获取鼠标位置
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // 设置右键菜单的位置和显示状态
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setContextMenuVisible(true);
    setMenuTitle(node.resourcesName);
    // 更新选中的资源信息，包括id和共享状态
    setSelectedResource({ id: node.id, share: 2 === node.authType });
    console.log('resourcesId,Shareinit', node.id, 2 === node.authType);
  }
  const onChange = (e: RadioChangeEvent) => {
    const newShareValue = e.target.value;
    // 更新选中的资源的共享状态
    setSelectedResource(prevResource => {
      if (prevResource) {
        console.log('resourcesIdchange,Shareinit', prevResource.id, newShareValue);
        const data = {
          id: prevResource.id,
          authType: newShareValue ? 2 : 1,
          courseId: courseId
        }
           updateAuthType(data).then((result) => {
          if (result.success) {
            
          } else {
            message.error(result.message);
          }
        });
        return { ...prevResource, share: newShareValue };
      }
      return null;
    });
  };
  //删除资源
  const deleteResources = () => {
    const data = {
      id: selectedResource?.id,
      courseId: courseId
    };
  
    callParentMethod(); // 先执行 callParentMethod
  
    Modal.confirm({
      title: '删除确认框',
      content: '确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        delResources(data).then((result) => {
          if (result.success) {
            message.info("删除成功");
            setContextMenuVisible(false);
            setLoading(true);
            setSumbitDisabled(true);
            getFileListData(fileType)
          } else {
            message.error(result.message);
          }
        });
      },
    });
  };
  return (
    <Modal
      className="editui-dialog-div"
      maskClosable={false}
      destroyOnClose
      title="插入文件"
      open={modalVisible}
      width={600}
      bodyStyle={{ minHeight: 240 }}
      onCancel={() => { onCancel() }}
      footer={[
        <Button key="back" onClick={() => { onCancel() }}>
          取消
        </Button>,
        <Button key="submit" type="primary" style={{ marginLeft: 20 }} disabled={sumbitDisabled} onClick={() => { onSubmit(path) }}>
          确认
        </Button>,
        ,
      ]}
    >
      <Tabs onChange={onChangeTab} type="card"
        items={[
          {
            key: "1",
            label: '本地上传',
            children: <>
              <div>
                <Upload
                  {...uploadProps}
                  className="upload-list-inline"
                  accept=".pdf, .doc, .docx, .xls, .xlsx, .pptx"
                  maxCount={1}
                >
                  <Button type="primary" >上传文件</Button>
                </Upload>
              </div>
              {
                url != '' && (
                  <div>
                    <embed id="pdf-play" width="100%" height="100%" style={{ marginBottom: '40px', margin: '0px' }} src={APP.request.prefix+url} type="application/pdf" />
                  </div>
                )
              }
            </>
          }, {
            key: "2",
            label: '文件库选择',
            children:
              <>
                <span style={{ fontWeight: 'bold' }}>文件类型：</span>
                <Select defaultValue={fileType} style={{ width: 120, marginBottom: '10px' }} onChange={handleChangeSelect}>
                  <Option value="1">表格</Option>
                  <Option value="2">文档</Option>
                  <Option value="3">幻灯片</Option>
                  <Option value="10">pdf</Option>
                </Select>
                <Skeleton loading={loading}>
                  <DirectoryTree
                    style={{ height: '130px', overflow: 'auto' }}
                    multiple
                    defaultExpandAll
                    onSelect={onSelect}
                    onExpand={onExpand}
                    treeData={videoList}
                    fieldNames={{ title: 'resourcesName', key: 'id', children: 'childrens' }}
                    onRightClick={onNodeRightClick}
                  />
                    {/* 右键菜单 */}
                {contextMenuVisible && (
                  <Modal
                    className='rightMenu'
                    title={menuTitle}
                    visible={contextMenuVisible}
                    onCancel={hideContextMenu}
                    footer={null}
                    style={{
                      position: 'fixed',
                      top: contextMenuPosition.y,
                      left: contextMenuPosition.x,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      background: '#fff',
                      boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                      zIndex: 1000,
                    }}
                  >
                    <Radio.Group value={selectedResource?.share} onChange={onChange}>
                      <Row>
                        <Col span={12}>
                          <Radio value={true}><span style={{ fontWeight: "bold" }}>共享</span></Radio>

                        </Col>
                        <Col span={12}>
                          <Radio value={false}><span style={{ fontWeight: "bold" }}>私有</span></Radio>
                        </Col>
                      </Row>
                    </Radio.Group>
                    <div style={{ marginTop: '30px' }}>
                      <Button type='primary' onClick={deleteResources}>删除</Button>
                    </div>
                  </Modal>
                )}
                </Skeleton>
              </>
          }
        ]}
      />
    </Modal>
  )
}

export default SelectImage;
