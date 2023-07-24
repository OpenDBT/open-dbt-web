import { QUESTION_BANK } from '@/common/entity/questionbank';
import '@/pages/common-course/course-common.less';
import '@/pages/common-course/question/component/type/common.less';
import { treeColorCss } from "@/pages/common-course/question/component/utils/Utils";
import SuperIcon from "@/pages/components/icons";
import { fieldRecovery, getDDLExerciseField, recovery, saveCheckField } from '@/services/teacher/course/question-create';
import { Form, Input, InputNumber, Modal, Radio, Select, Space, Table, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { fieldType } from '../constants';
interface IProps {
  sceneDetailId: number;
  exerciseId: number;
  tableName: string;
  sceneId: number,
}


export interface IFieldCardRef {
  addSave: () => void;
  handleRecovery: () => void;
}

const FieldCard = forwardRef<IFieldCardRef, IProps>((props: IProps, ref) => {
  const {
    sceneDetailId: sceneDetailId,
    exerciseId: exerciseId,
    tableName: tableName,
    sceneId: sceneId,
  } = props;

  //存储查询到的字段信息
  const [data, setdata] = useState<QUESTION_BANK.TSceneFieldDisplay[]>([]);
  //新建表弹出框显示 
  const [editModalOpen, seteditModalOpen] = useState(false);
  //编辑框数据
  const [record, setrecord] = useState<QUESTION_BANK.TSceneFieldDisplay>();


  const [fieldLength, setfieldLength] = useState(null);

  const [form] = Form.useForm();

  const cRef = useRef({ tableName, sceneDetailId });
  
  useEffect(() => {
    initFieldInfo();
  }, [])


  useEffect(() => {
    let { tableName: prevA, sceneDetailId: prevB } = cRef.current;
    if (prevA !== tableName && (prevB===-1&&sceneDetailId===-1?true:prevB !== sceneDetailId)) {
      cRef.current = { tableName, sceneDetailId };
      initFieldInfo();
    }

  }, [tableName, sceneDetailId]);



  //重新初始化字段详情
  const initFieldInfo = () => {
    getDDLExerciseField({ sceneDetailId: sceneDetailId, exerciseId: exerciseId == undefined ? null : exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        if (result.obj.sceneFieldDisplays) {
          console.log("初始化field", result.obj.sceneFieldDisplays);
          setdata(result.obj?.sceneFieldDisplays);
        } else {
          setdata([]);
        }
      }
      else {
        message.error(result.message);
      }
    });
  };
  const columns: ColumnsType<QUESTION_BANK.TSceneFieldDisplay> = [
    {
      title: '字段',
      dataIndex: 'fieldName',
      key: 'fieldName',
      ellipsis: false,
      render: (text, record) => {
        if ((record.detail && record.detail.fieldName != text)) {
          return (<Tooltip title={text}>
            {record.detail.fieldName}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fieldName != record.fieldName||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.fieldType != text)) {
          return (<Tooltip title={text}>
            {record.detail.fieldType}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fieldType != record.fieldType||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }
    },
    {
      title: '字段长度',
      dataIndex: 'fieldLength',
      key: 'fieldLength',
      ellipsis: true,
      render: (text, record) => {
      if((record.detail && record.detail.fieldType||record && record.fieldType)==='char'||(record.detail && record.detail.fieldType||record && record.fieldType)==='varchar'){
        if ((record.detail && record.detail.fieldLength != text)) {
          return (<Tooltip title={text}>
            {record.detail.fieldLength}
          </Tooltip>);
        }
        return text;
      }
       
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fieldLength != record.fieldLength||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }
    },
    {
      title: '小数位数',
      dataIndex: 'decimalNum',
      key: 'decimalNum',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.decimalNum != text)) {
          return (<Tooltip title={text}>
            {record.detail.decimalNum}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.decimalNum != record.decimalNum||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }
    },
    {
      title: '默认值',
      dataIndex: 'fieldDefault',
      key: 'fieldDefault',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.fieldDefault != text)) {
          return (<Tooltip title={text}>
            {record.detail.fieldDefault}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fieldDefault != record.fieldDefault||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }
    },
    {
      title: '是否非空',
      dataIndex: 'fieldNonNull',
      key: 'fieldNonNull',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.fieldNonNull != text)) {
          return (<Tooltip title={text ? '是' : '否'}>
            {record.detail.fieldNonNull ? '是' : '否'}
          </Tooltip>);
        }
        return text ? '是' : '否';
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fieldNonNull != record.fieldNonNull||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }

    },
    {
      title: '字段描述',
      dataIndex: 'fieldComment',
      key: 'fieldComment',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.fieldComment != text)) {
          return (<Tooltip title={text}>
            {record.detail.fieldComment}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fieldComment != record.fieldComment||record.detail?.checkStatus==='DEL'))) {
          return (
            {
              style: {
                backgroundColor: treeColorCss(record.detail.checkStatus)
              }
            })
        } else {
          return ({
            style: {
              backgroundColor: ''
            }
          });
        }
      }
    },

    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => edit(record)}><SuperIcon type="icon-bianji1" />编辑</a>
          <a onClick={() => reset(record)}><SuperIcon type="icon-huifu" />恢复</a>
          <a onClick={() => del(record)}><SuperIcon type="icon-icon-cuowu21" />删除</a>
        </Space>
      )
    }
  ];

  //字段行数据编辑
  const edit = (record: QUESTION_BANK.TSceneFieldDisplay) => {
    if (record.detail && record.detail.checkStatus === 'DEL') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增字段无法进行编辑校验设置！");
      return;
    }
    console.log("edit=", record);
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("edit1=", record);
      seteditModalOpen(true);
      form.setFieldsValue({
        fieldName: record.detail?.fieldName || record.fieldName,
        fieldType: record.detail?.fieldType || record.fieldType,
        fieldLength: record.detail?.fieldLength || record.fieldLength,
        decimalNum: record.detail?.decimalNum || record.decimalNum,
        fieldDefault: record.detail?.fieldDefault || record.fieldDefault,
        fieldNonNull: record.detail?.fieldNonNull || record.fieldNonNull,
        fieldComment: record.detail?.fieldComment || record.fieldComment,
      });
      return record;
    });
  }
  //新增字段
  const addSave = () => {
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("addSave=", tableName);
      form.setFieldsValue({
        fieldName: undefined,
        fieldType: undefined,
        fieldLength: undefined,
        decimalNum: undefined,
        fieldDefault: undefined,
        fieldNonNull: undefined,
        fieldComment: undefined,
      });
      seteditModalOpen(true);
      return undefined;
    });
  }
  //一键恢复
  const handleRecovery = async () => {
    try {
      const result = await recovery({ recoverType: 'FIELD', exerciseId: exerciseId, sceneDetailId: sceneDetailId, tableName: tableName });
      if (result.success && result.obj) {
        await initFieldInfo();
        message.info("恢复成功");
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("恢复失败：" + error.message);
    }

  }



  // 将子组件的方法暴露给父组件
  useImperativeHandle(ref, () => ({
    addSave: addSave,
    handleRecovery: handleRecovery,
  }));
  //恢复
  const reset = async (record: QUESTION_BANK.TSceneFieldDisplay) => {
    console.log("reset=", record);
    if (!(record.detail && record.detail.id)) {
      message.error('该字段未进行校验设置，无需恢复！');
      return;
    }
    if (record.detail.exerciseId) {
      try {
        const result = await fieldRecovery(record.detail.exerciseId, record.detail.id);
        if (result.success && result.obj) {
          await initFieldInfo();
          message.info("恢复成功");
        } else {
          message.error(result.message);
        }
      } catch (error) {
        message.error("恢复失败：" + error.message);
      }
    }
  }
  //删除
  const del = (record: QUESTION_BANK.TSceneFieldDisplay) => {
    if (record.detail && record.detail.checkStatus === 'UPDATE') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增字段无法进行删除校验设置！");
      return;
    }
    console.log("del=", record);
    //设置删除变量
    let newRecord = { ...record };
    if (newRecord.detail) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = { ...newRecord, detail: { ...newRecord.detail, tableName: tableName, checkStatus: 'DEL', exerciseId: exerciseId, sceneFieldId: newRecord.id, sceneDetailId: sceneDetailId } };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      const { id, detail, ...partModel } = newRecord;
      newRecord = { ...newRecord, detail: { ...partModel, tableName: tableName, checkStatus: 'DEL', exerciseId: exerciseId, sceneFieldId: newRecord.id, sceneDetailId: sceneDetailId } };
    }
    //保存到数据库中
    saveCheckField({sceneId: sceneId, 'fields': [newRecord?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initFieldInfo();
          message.info("删除校验设置成功");
        } catch (error) {
          message.error('删除校验设置失败');
          console.error(error);
        }
      } else {
        message.error(result.message);
      }
    });

  }

  //保存
  const saveTable = () => {
    seteditModalOpen(false);
    console.log("record=====", record);
    //保存到数据库中
    saveCheckField({ sceneId: sceneId,'fields': [record?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initFieldInfo();
          message.info("校验设置成功");
        } catch (error) {
          message.error('校验设置失败');
          console.error(error);
        }
      } else {
        message.error(result.message);
      }
    });

  }
  //编辑取消
  const saveEditCancel = () => {
    form.resetFields();
    seteditModalOpen(false);
    setrecord(undefined);
  };


  const handleInputBlur = () => {
    if (fieldLength !== null && fieldLength < 0) {
      setfieldLength(null);
    }
  };


  //字段信息修改时触发
  const handleFormChange = () => {

    const formValues = form.getFieldsValue();
    let newRecord = { ...record };
    if (newRecord.id) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = { ...newRecord, detail: { ...newRecord.detail, ...formValues, tableName: tableName, checkStatus: 'UPDATE', exerciseId: exerciseId, sceneFieldId: newRecord.id, sceneDetailId: sceneDetailId } };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      newRecord = { ...newRecord, detail: { ...formValues, tableName: tableName, checkStatus: 'INSERT', exerciseId: exerciseId, sceneFieldId: newRecord.id, sceneDetailId: sceneDetailId } };
    }
    setrecord(newRecord);
  };



  return (
    <div className='ddl-card rightside'>
      {data && <Table columns={columns} dataSource={data} scroll={{ y: 240 }} pagination={false} onRow={() => ({})} />}
      {<Modal
        closeIcon={<img src={require('@/img/teacher/icon-close.svg')} width="16px" height="16px"></img>}
        title="编辑"
        open={editModalOpen}
        onOk={() => form.submit()}
        onCancel={saveEditCancel}>
        <Form initialValues={record} onFinish={saveTable} form={form} onValuesChange={handleFormChange}>
          <Form.Item key='fieldName' name='fieldName' label='字段' initialValue={record ? record.detail && record.detail.fieldName || record.fieldName : undefined}>
            <Input />
          </Form.Item>
          <Form.Item key='fieldType' name='fieldType' label='字段类型' initialValue={record ? record.detail && record.detail.fieldType || record.fieldType : undefined}>
            <Select showSearch placeholder='请输入字段类型'>
              {fieldType.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item key='fieldLength' name='fieldLength' label='字段长度'
          hidden={(record ? record.detail && record.detail.fieldType || record.fieldType : undefined)==='char'||(record ? record.detail && record.detail.fieldType || record.fieldType : undefined)==='varchar'?false:true}
           initialValue={record ? record.detail && record.detail.fieldLength || record.fieldLength : undefined}>
            <InputNumber placeholder='请输入字段长度' min={0} 
              onBlur={handleInputBlur}
            />
          </Form.Item>
          <Form.Item key='decimalNum' name='decimalNum' label='小数位数' initialValue={record ? record.detail && record.detail.decimalNum || record.decimalNum : undefined}>
            <InputNumber placeholder='请输入小数位数' min={0}
              onBlur={handleInputBlur}
              disabled={record ? !(record.detail && record.detail.fieldType && record.detail.fieldType === 'numeric' || record.detail && record.detail.fieldType && record.detail.fieldType === 'decimal') : undefined}
            />
          </Form.Item>
          <Form.Item key='fieldDefault' name='fieldDefault' label='默认值' initialValue={record ? record.detail && record.detail.fieldDefault || record.fieldDefault : undefined}>
            <Input />
          </Form.Item>
          <Form.Item key='fieldNonNull' name='fieldNonNull' label='是否非空' initialValue={record ? record.detail && record.detail.fieldNonNull || record.fieldNonNull : undefined}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item key='fieldComment' name='fieldComment' label='字段描述' initialValue={record ? record.detail && record.detail.fieldComment || record.fieldComment : undefined}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>}
    </div>

  );
});

export default FieldCard;