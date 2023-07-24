import { QUESTION_BANK } from '@/common/entity/questionbank';
import '@/pages/common-course/course-common.less';
import { threeColor } from "@/pages/common-course/question/component/utils/Utils";
import SuperIcon from "@/pages/components/icons";
import { deleteNewTableInfo, getDDLExerciseTable, recovery, saveCheckDetail } from '@/services/teacher/course/question-create';
import { Button, Form, Input, Menu, Modal, Popover, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ConstraintCard from './attribute/ConstraintCard';
import FKCard from './attribute/FKCard';
import FieldCard, { IFieldCardRef } from './attribute/field';
import IndexCard from './attribute/IndexCard';
import SeqCard from './attribute/SeqCard';


interface IProps {
  selectSceneId: number;
  onInit: QUESTION_BANK.QuestionExercise | null;
  exerciseId: number;
}
const Verify = (props: IProps) => {
  const {
    selectSceneId: selectSceneId,
    exerciseId: exerciseId
  } = props;

  const fieldCardRef = useRef<IFieldCardRef>(null);

  //显示信息
  const [displaytables, setdisplaytables] = useState<QUESTION_BANK.TSceneDetailDisplay[]>([]);

  //字段、索引、约束等
  const [activeMenu, setActiveMenu] = useState('1');
  //表点击id(可能为scenedetailId、checkdetailid)
  const [activeKey, setActiveKey] = useState<number>();
  //场景详情id
  const [detailId, setDetailId] = useState<number>(-1);
  //场景详情表名
  const [activeName, setactiveName] = useState<string>();
  //表描述
  const [describe, setdescribe] = useState<string>();
  //新建表名
  const [createName, setCreateName] = useState<string>();
  //新建表描述
  const [createDescribe, setCreateDescribe] = useState<string>();
  //重命名弹出框显示 
  const [isModalOpen, setIsModalOpen] = useState(false);
  //新建表弹出框显示 
  const [createModalOpen, setcreateModalOpen] = useState(false);



  useEffect(() => {
    //设置习题id
    initTableinfo(exerciseId == undefined ? null : exerciseId, 'switch');
  }, [selectSceneId])

  //初始化查询表结构
  const initTableinfo = ((id: number | null, type?: string) => {
    getDDLExerciseTable({ sceneId: selectSceneId, exerciseId: id }).then((result) => {
      if (result.success) {
        //新增表时点击到最新表
        //if (createName && result.obj?.sceneDetailDisplays) {
        if (type === 'create') {
          result.obj?.sceneDetailDisplays.forEach((item: QUESTION_BANK.TSceneDetailDisplay) => {
            if (item.detail && item.detail.tableName === createName) {
              setActiveKey(item.detail.id);
              setactiveName(item.detail.tableName);
            }
          });
        }
        if (type === 'recovery') {
          setActiveKey(undefined);
          setactiveName(undefined);
        }

        if (type === 'switch') {
          setActiveKey(undefined);
          setactiveName(undefined);
          setDetailId(-1);
        }
        // }

        //信息展示
        setdisplaytables(result.obj?.sceneDetailDisplays);

      } else {
        message.error(result.message);
      }

    })

  });


  useEffect(() => {
    if (!activeKey) {
      // 等待页面加载完成后，模拟点击第一个按钮
      displaytables && displaytables.length > 0 && displaytables.map((button, index) => {
        if (index === 0) {
          handleButtonClick(button);
        }
      })
    } else {
      displaytables && displaytables.length > 0 && displaytables.map((button) => {
        if (button.id === activeKey || (button.detail && button.detail.id === activeKey)) {
          handleButtonClick(button);
        }
      })
    }
  }, [displaytables])



  const handleMenuSelect = (key: any) => {
    setActiveMenu(key.key);
  };

  //点击切换表
  const handleButtonClick = (btn: QUESTION_BANK.TSceneDetailDisplay) => {
    setActiveKey(getKey(btn));
    setDetailId(getDetail(btn));
    setactiveName(btn.tableName ? btn.tableName : btn.detail ? btn.detail.tableName : "");
    setdescribe(btn.detail ? btn.detail.describe : btn.tableDesc);
  };



  //重命名
  const renameTable = () => {
    displaytables.map((button) => {
      if (button.id === activeKey) {
        if (button.detail && button.detail.checkStatus === 'DEL') {
          message.error("请恢复后再进行重命名操作！");
        } else {
          setIsModalOpen(true);
        }
      } else if (button.detail && button.detail.id === activeKey) {
        message.error("新增表无法进行重命名操作！");
      }
    })
  }
  //恢复表
  const restTable = () => {
    displaytables.map((button) => {
      if (button.id === activeKey) {
        if (!exerciseId) {
          message.error('请确认该表已经修改！');
        } else {
          recovery({ exerciseId: exerciseId, sceneDetailId: button.id, recoverType: 'TABLE', tableName: activeName }).then((result) => {
            if (result.success) {
              initTableinfo(exerciseId);
            } else {
              message.error(result.message);
            }
          })
          message.info('已恢复');
        }
      } else if (button.detail && button.detail.id === activeKey) {
        if (!exerciseId) {
          message.error('请确认该表已经修改！');
        } else {
          //调用删除接口
          deleteNewTableInfo({ exerciseId: exerciseId, types: 'TABLE', ids: [activeKey] }).then((result) => {
            if (result.success) {
              initTableinfo(exerciseId, 'recovery');
            } else {
              message.error(result.message);
            }
          })

        }
      }
    })
  }
  //删除表
  const delTable = () => {
    console.log('进入删除表', displaytables)
    try {
      displaytables.map((button) => {
        if (button.id === activeKey) {
          if (button.detail) {
            throw new Error("请恢复后再进行删除操作"); // 抛出错误并停止执行
          }
        } else if (button.detail && button.detail.id === activeKey) {
          throw new Error("新增表无法使用设置为删除，若想直接删除请使用恢复功能！"); // 抛出错误并停止执行
        }
      });
    } catch (error) {
      message.error(error.message);
      return;
    }
    displaytables.map((button) => {
      if (button.id === activeKey) {
        //更新详情
        const activeDetail = {
          detail: button.detail
            ? { ...button.detail, tableName: activeName ? activeName : '', describe: describe ? describe : '', checkStatus: 'DEL' }
            : { tableName: activeName ? activeName : '', describe: describe ? describe : '', sceneDetailId: button.id, checkStatus: 'DEL', exerciseId: exerciseId }
        };
        //更新dispalay
        const checkdetail = {
          ...button, activeDetail
        }

        saveCheckDetail({sceneId: selectSceneId,detail: activeDetail.detail}).then((result) => {
          if (result.success) {
            initTableinfo(result.obj);
            message.info('已设置为删除');
          } else {
            message.error(result.message);
          }

        })
        return checkdetail;

      } else {
        return button;
      }
    });
  }

  //重命名保存
  const handleOk = () => {
    setIsModalOpen(false);
    displaytables.map((button) => {
      if (button.id === activeKey) {

        //更新详情
        const activeDetail = {
          detail: button.detail
            ? { ...button.detail, tableName: activeName ? activeName : '', describe: describe ? describe : '', checkStatus: 'UPDATE', exerciseId: exerciseId }
            : { tableName: activeName ? activeName : '', describe: describe ? describe : '', sceneDetailId: button.id, checkStatus: 'UPDATE', exerciseId: exerciseId }
        };
        //更新dispalay
        const checkdetail = {
          ...button, activeDetail
        }
        if (!(activeDetail.detail && activeDetail.detail.sceneDetailId)) {
          message.error("新增的校验信息请删除后重新设置！");
        }
        saveCheckDetail({sceneId: selectSceneId,detail: activeDetail.detail}).then((result) => {
          if (result.success) {
            initTableinfo(result.obj);
            message.info('已重命名！');
          } else {
            message.error(result.message);
          }

        })
        return checkdetail;
      } else {
        return button;
      }
    });

  }
  //重命名取消
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //新建表取消
  const createNamehandleCancel = () => {
    setcreateModalOpen(false);
  };



  //新建表保存
  const saveTable = () => {
    setcreateModalOpen(false);
    //新建表
    const newTable = { detail: { tableName: createName ? createName : '', describe: createDescribe ? createDescribe : '', checkStatus: 'INSERT', exerciseId: exerciseId } };
    saveCheckDetail({sceneId: selectSceneId,detail: newTable.detail}).then((result) => {
      if (result.success) {
        //重新渲染
        initTableinfo(result.obj, 'create');
      } else {
        message.error(result.message);
      }
    })
  };
  //新建表
  const createTable = () => {
    setCreateName('');
    setCreateDescribe('');
    setcreateModalOpen(true);
  }

  /**
  * 写入表名
  * @param e 
  */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setactiveName(e.target.value);
  };
  //写入表描述
  const describChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdescribe(e.target.value);
  };

  /**
* 新建表名
* @param e 
*/
  const createTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateName(e.target.value);
  };
  //写入表描述
  const createDescribChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateDescribe(e.target.value);
  };

  //显示名称
  const getLableName = (btn: QUESTION_BANK.TSceneDetailDisplay) => {
    if (btn.detail) {
      //有检验信息显示校验名称
      return btn.detail.tableName;
    } else {
      //无校验信息显示原有名称
      return btn.tableName
    }
  }
  //显示样式
  const getClass = (btn: QUESTION_BANK.TSceneDetailDisplay) => {
    //被选中的样式
    if ((btn.id && btn.id === activeKey) || !btn.id && btn.detail && btn.detail.id === activeKey) {
      return 'dl-card answserClass dl-card mb-right-10';
    } else {
      //有检验信息
      if (btn.detail && btn.detail.id) {
        return threeColor(btn.detail.checkStatus);
      } else {
        //无校验信息
        return 'dl-card mb-right-10';
      }
    }
  }
  //获取key
  const getKey = (btn: QUESTION_BANK.TSceneDetailDisplay) => {
    if (btn.id) {
      return btn.id;
    } else {
      if (btn.detail && btn.detail.id) {
        return btn.detail.id;
      } else {
        return -1;
      }
    }
  }
  //获取场景id
  const getDetail = (btn: QUESTION_BANK.TSceneDetailDisplay) => {
    if (btn.id) {
      return btn.id;
    } else {
      return -1;
    }
  }
  //初始值
  const conent = (btn: QUESTION_BANK.TSceneDetailDisplay) => {
    return <div>
      <Form.Item label="表名称">  <Input placeholder="表名称" value={btn.tableName} readOnly={true} /></Form.Item>
      <Form.Item label="表描述">  <Input placeholder="表描述" value={btn.tableDesc} readOnly={true} /></Form.Item>
    </div>

  }


  const handleAddSave = () => {
    if (fieldCardRef.current) {
      fieldCardRef.current.addSave();
    }
  };
  const handleRecovery = () => {
    if (fieldCardRef.current) {
      fieldCardRef.current.handleRecovery();
    }
  };
  return (

    <div className='ddl-card'>
      <Space wrap>
        {
          displaytables.length > 0 && displaytables.map((btn) => {
            return <Popover content={conent(btn)} title="初始值" trigger="hover">
              <Button
                key={getKey(btn)}
                className={getClass(btn)}
                onClick={() => handleButtonClick(btn)}
              >
                {getLableName(btn)}
              </Button>
            </Popover>

          })}
      </Space>


      <div className='ddl-card ddl-content'>
        <div className='ddl-card ddl-content-h'>
          <div className='ddl-card broadside' >
            <Menu
              selectedKeys={[activeMenu]}
              onSelect={handleMenuSelect}
              mode="inline"
            >
              <>
                <Menu.Item key="1">字段</Menu.Item>
                <Menu.Item key="2">约束</Menu.Item>
                <Menu.Item key="3">外键</Menu.Item>
                <Menu.Item key="4">索引</Menu.Item>
                <Menu.Item key="5">序列</Menu.Item>
              </>
            </Menu>

          </div>
          <div className='ddl-card right'>

            {activeMenu === '1' && (
              <div>
                <div style={{ display: 'flex' }}>
                  <Button onClick={() => handleAddSave()}><SuperIcon type="icon-jiahao" />新建字段</Button>
                  <Button onClick={() => handleRecovery()}><SuperIcon type="icon-huifu" />一键恢复</Button>
                </div>
                <div>
                  {activeKey && activeName  && (<FieldCard ref={fieldCardRef} sceneId={selectSceneId}  tableName={activeName} sceneDetailId={detailId} exerciseId={exerciseId}></FieldCard>)}
                </div>
              </div>

            )}
            {activeMenu === '2' && (
              <div>
                <div>
                  <Button onClick={() => handleAddSave()}><SuperIcon type="icon-jiahao" />新建约束</Button>
                  <Button onClick={() => handleRecovery()}><SuperIcon type="icon-huifu" />一键恢复</Button>
                </div>
                <div>
                  {activeKey && activeName && (<ConstraintCard ref={fieldCardRef} sceneId={selectSceneId} tableName={activeName} sceneDetailId={detailId} exerciseId={exerciseId}></ConstraintCard>)}
                </div>
              </div>
            )}
            {activeMenu === '3' && (
              <div>
                <div>
                  <Button onClick={() => handleAddSave()}><SuperIcon type="icon-jiahao" />新建外键</Button>
                  <Button onClick={() => handleRecovery()}><SuperIcon type="icon-huifu" />一键恢复</Button>
                </div>
                <div>
                  {activeKey && activeName && (<FKCard ref={fieldCardRef} sceneId={selectSceneId} tableName={activeName} sceneDetailId={detailId} exerciseId={exerciseId}></FKCard>)}
                </div>
              </div>
            )}
            {activeMenu === '4' && (
              <div>
                <div>
                  <Button onClick={() => handleAddSave()}><SuperIcon type="icon-jiahao" />新建索引</Button>
                  <Button onClick={() => handleRecovery()}><SuperIcon type="icon-huifu" />一键恢复</Button>
                </div>
                <div>
                  {activeKey && activeName && (<IndexCard ref={fieldCardRef} sceneId={selectSceneId} tableName={activeName} sceneDetailId={detailId} exerciseId={exerciseId}></IndexCard>)}
                </div>
              </div>
            )}
            {activeMenu === '5' && (
              <div>
                <div>
                  <Button onClick={() => handleAddSave()}><SuperIcon type="icon-jiahao" />新建序列</Button>
                  <Button onClick={() => handleRecovery()}><SuperIcon type="icon-huifu" />一键恢复</Button>
                </div>
                <div>
                  {activeKey && activeName && (<SeqCard ref={fieldCardRef} sceneId={selectSceneId} tableName={activeName} sceneDetailId={detailId} exerciseId={exerciseId}></SeqCard>)}
                </div>
              </div>
            )}


          </div>
        </div>
        <Space wrap>
          <Button onClick={createTable} type='primary'><SuperIcon type="icon-jiahao" />新建表</Button>
          <Button onClick={renameTable}><SuperIcon type="icon-bianji1" />重命名</Button>
          <Button onClick={restTable}><SuperIcon type="icon-huifu" />恢复表</Button>
          <Button onClick={delTable}><SuperIcon type="icon-icon-close1" />删除表</Button>
        </Space>
        <Modal
          closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
          title="重命名"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}>
          <Form.Item label="表名称">  <Input placeholder="请输入修改后的表名称" value={activeName} onChange={handleChange} /></Form.Item>
          <Form.Item label="表描述">  <Input placeholder="请输入修改后的表表描述" value={describe} onChange={describChange} /></Form.Item>
        </Modal>
        <Modal
          closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
          title="新建表"
          open={createModalOpen}
          onOk={saveTable}
          onCancel={createNamehandleCancel}>
          <Form.Item label="表名称">  <Input placeholder="请输入表名称" value={createName} onChange={createTableNameChange} /></Form.Item>
          <Form.Item label="表描述">  <Input placeholder="请输入表描述" value={createDescribe} onChange={createDescribChange} /></Form.Item>
        </Modal>

      </div>

    </div>
  );
};



export default Verify;