import { QUESTION_BANK } from '@/common/entity/questionbank';
import '@/pages/common-course/course-common.less';
import '@/pages/common-course/question/component/type/common.less';
import { treeColorCss } from "@/pages/common-course/question/component/utils/Utils";
import SuperIcon from "@/pages/components/icons";
import { constraintRecovery, getConstraintList, getDDLExerciseField, recovery, saveCheckConstraint } from '@/services/teacher/course/question-create';
import { Form, Input, Modal, Select, Space, Table, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { constraintType, IndexType } from '../constants';
interface IProps {
  sceneDetailId: number;
  exerciseId: number;
  tableName: string;
  sceneId: number,
}


export interface IConstraintCardRef {
  addSave: () => void;
  handleRecovery: () => void;
}

const ConstraintCard = forwardRef<IConstraintCardRef, IProps>((props: IProps, ref) => {
  const {
    sceneDetailId: sceneDetailId,
    exerciseId: exerciseId,
    tableName: tableName,
    sceneId: sceneId,
  } = props;
  //存储查询到的字段信息
  const [fields, setFields] = useState<QUESTION_BANK.TSceneField[]>([]);

  //获取字段列表
  const initFieldInfo = () => {
    getDDLExerciseField({ sceneDetailId: sceneDetailId, exerciseId: exerciseId == undefined ? null : exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        const updatedFields = [...fields];
        if (result.obj.sceneFields) {
          console.log("初始化field", result.obj.sceneFields);
          updatedFields.push(...result.obj.sceneFields);
        }
        if (result.obj.checkFields) {
          result.obj.checkFields.forEach((checkField: QUESTION_BANK.TCheckField) => {
            const existingField = updatedFields.find((field) => field.fieldName === checkField.fieldName);
            if (!existingField) {
              checkField.fieldName && updatedFields.push({ 'fieldName': checkField.fieldName });
            }
          });
        }
        setFields(updatedFields);
        console.info("fields===", updatedFields);
      }
      else {
        message.error(result.message);
      }
    });
  };
  //存储查询到的约束信息
  const [data, setdata] = useState<QUESTION_BANK.TSceneConstraintDisplay[]>([]);
  //新建表弹出框显示 
  const [editModalOpen, seteditModalOpen] = useState(false);
  //编辑框数据
  const [record, setrecord] = useState<QUESTION_BANK.TSceneConstraintDisplay>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (sceneDetailId) {
      initConstraintInfo()
      initFieldInfo();
    }
  }, [sceneDetailId]);

  //重新初始化约束详情
  const initConstraintInfo = () => {
    getConstraintList({ sceneDetailId: sceneDetailId, exerciseId: exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        if (result.obj.sceneConstraintDisplays) {
          setdata(result.obj?.sceneConstraintDisplays);
        } else {
          setdata([]);
        }
      }
      else {
        message.error(result.message);
      }
    });
  };
  //约束类型转换
  const switchConstraintType = (valueName: any) => {
    const matchedType = constraintType.find((type) => type.value === valueName);
    return matchedType ? matchedType.label : valueName;
  }
  const columns: ColumnsType<QUESTION_BANK.TSceneConstraintDisplay> = [
    {
      title: '约束名称',
      dataIndex: 'crName',
      key: 'crName',
      ellipsis: false,
      render: (text, record) => {
        if ((record.detail && record.detail.crName != text)) {
          return (<Tooltip title={text}>
            {record.detail.crName}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record, rowIndex) => {
        if ((record.detail && (record.detail.crName != record.crName || record.detail?.checkStatus === 'DEL'))) {
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
      title: '约束字段',
      dataIndex: 'crFields',
      key: 'crFields',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.crFields != text)) {
          return (<Tooltip title={text}>
            {record.detail.crFields}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record, rowIndex) => {
        if ((record.detail && (record.detail.crFields != record.crFields || record.detail?.checkStatus === 'DEL'))) {
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
      title: '约束类型',
      dataIndex: 'crType',
      key: 'crType',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.crType != text)) {

          return (<Tooltip title={switchConstraintType(text)}>
            {switchConstraintType(record.detail.crType)}
          </Tooltip>);
        }
        return switchConstraintType(text);
      },
      onCell: (record, rowIndex) => {
        if ((record.detail && (record.detail.crType != record.crType || record.detail?.checkStatus === 'DEL'))) {
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
      title: '表达式',
      dataIndex: 'crExpression',
      key: 'crExpression',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.crExpression != text)) {
          return (<Tooltip title={text}>
            {record.detail.crExpression}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record, rowIndex) => {
        if ((record.detail && (record.detail.crExpression != record.crExpression || record.detail?.checkStatus === 'DEL'))) {
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
      title: '排他约束索引方法',
      dataIndex: 'crIndexType',
      key: 'crIndexType',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.crIndexType != text)) {
          return (<Tooltip title={text}>
            {record.detail.crIndexType}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record, rowIndex) => {
        if ((record.detail && (record.detail.crIndexType != record.crIndexType || record.detail?.checkStatus === 'DEL'))) {
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

  //约束行数据编辑
  const edit = (record: QUESTION_BANK.TSceneConstraintDisplay) => {
    if (record.detail && record.detail.checkStatus === 'DEL') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增约束无法进行编辑校验设置！");
      return;
    }
    console.log("edit=", record);
    setrecord(prevRecord => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("edit1=", record);
      seteditModalOpen(true);
      form.setFieldsValue({
        crName: record.detail?.crName || record.crName,
        crFields: record.detail?.crFields?.split(',') || record.crFields?.split(','),
        crType: record.detail?.crType || record.crType,
        crExpression: record.detail?.crExpression || record.crExpression,
        crIndexType: record.detail?.crIndexType || record.crIndexType
      });
      return record;
    });
  }
  //新增约束
  const addSave = () => {
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("addSave=", tableName);
      form.setFieldsValue({
        crName: undefined,
        crFields: undefined,
        crType: undefined,
        crExpression: undefined,
        crIndexType: undefined,
      });
      seteditModalOpen(true);
      return undefined;
    });
  }
  //一键恢复
  const handleRecovery = async () => {
    try {
      const result = await recovery({ recoverType: 'CONSTRAINT', exerciseId: exerciseId, sceneDetailId: sceneDetailId, tableName: tableName });
      if (result.success && result.obj) {
        await initConstraintInfo();
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
    handleRecovery: handleRecovery
  }));
  //恢复
  const reset = async (record: QUESTION_BANK.TSceneConstraintDisplay) => {
    console.log("reset=", record);
    if (!(record.detail && record.detail.id)) {
      message.error('该约束未进行校验设置，无需恢复！');
      return;
    }
    if (record.detail.exerciseId) {
      try {
        const result = await constraintRecovery(record.detail.exerciseId, record.detail.id);
        if (result.success && result.obj) {
          await initConstraintInfo();
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
  const del = (record: QUESTION_BANK.TSceneConstraintDisplay) => {
    if (record.detail && record.detail.checkStatus === 'UPDATE') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增约束无法进行删除校验设置！");
      return;
    }
    console.log("del=", record);
    //设置删除变量
    let newRecord = { ...record };
    if (newRecord.detail) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = { ...newRecord, detail: { ...newRecord.detail, tableName: tableName, checkStatus: 'DEL', exerciseId: exerciseId, sceneConstraintId: newRecord.id, sceneDetailId: sceneDetailId } };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      const { id, detail, ...partModel } = newRecord;
      newRecord = { ...newRecord, detail: { ...partModel, tableName: tableName, checkStatus: 'DEL', exerciseId: exerciseId, sceneConstraintId: newRecord.id, sceneDetailId: sceneDetailId } };
    }
    //保存到数据库中
    saveCheckConstraint({ sceneId: sceneId,'checkConstraints': [newRecord?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initConstraintInfo();
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
    if (!record?.detail) {
      message.error("校验未设置，无需保存");
      return;
    }
    //保存到数据库中
    saveCheckConstraint({ sceneId: sceneId,'checkConstraints': [record?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initConstraintInfo();
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





  //约束信息修改时触发
  const handleFormChange = (changedValues: any, allValues: any) => {

    const formValues = form.getFieldsValue();
    const { crFields, ...otherRecord } = formValues;
    let newRecord = { ...record };
    console.info("修改后的record=", newRecord);
    if (newRecord.id) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = { ...newRecord, detail: { ...newRecord.detail, ...otherRecord, crFields: typeof crFields === 'object' && Array.isArray(crFields) ? crFields.join(',') : crFields, tableName: tableName, checkStatus: 'UPDATE', exerciseId: exerciseId, sceneConstraintId: newRecord.id, sceneDetailId: sceneDetailId } };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      newRecord = { ...newRecord, detail: { ...otherRecord, crFields: typeof crFields === 'object' && Array.isArray(crFields) ? crFields.join(',') : crFields, tableName: tableName, checkStatus: 'INSERT', exerciseId: exerciseId, sceneConstraintId: newRecord.id, sceneDetailId: sceneDetailId } };
    }
    console.log('Updated record:', newRecord);
    setrecord(newRecord);
  };

  // 表达式校验规则函数
  const validateCrExpression = (_, vlue: any) => {
    if ((record?.detail?.crType === 'c' || record?.detail?.crType === 'x') && !vlue) {
      return Promise.reject('请输入表达式!');
    }
    return Promise.resolve();
  };


  //约束字段校验规则函数
  const validateCrField = (_, vlue: any) => {
    if (!(record?.detail?.crType === 'c' || record?.detail?.crType === 'x') && !vlue) {
      return Promise.reject('请选择约束字段!');
    }
    return Promise.resolve();
  };
  // 排他约束索引类型校验规则函数
  const validateCrIndexType = (_, vlue: any) => {
    if (record?.detail?.crType === 'x' && !vlue) {
      return Promise.reject('请选择排他约束索引类型!');
    }
    return Promise.resolve();
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
          <Form.Item key='crName' name='crName' label='约束名称' initialValue={record ? record.detail && record.detail.crName || record.crName : undefined} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item key='crFields' name='crFields' label='约束字段' rules={[{ validator: validateCrField },]}>
            <Select mode="multiple" placeholder='请选择约束字段' tokenSeparators={[',']}
              disabled={record ? (record.detail && (record.detail.crType && record.detail.crType === 'c' || record.detail.crType && record.detail.crType === 'x')) : false}
              options={fields.map((option: any) => ({ label: option.fieldName, value: option.fieldName }))}
            >
            </Select>
          </Form.Item>
          <Form.Item key='crType' name='crType' label='约束类型' initialValue={record ? record.detail && record.detail.crType || record.crType : undefined} rules={[{ required: true, message: '请选择约束类型!' }]}>
            <Select showSearch placeholder='请选择约束类型'>
              {constraintType.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item key='crExpression' name='crExpression' label='表达式' rules={[{ validator: validateCrExpression },]}
            initialValue={record ? record.detail && record.detail.crExpression || record.crExpression : undefined}>
            <Input placeholder='请输入表达式'
              disabled={record ? (record.detail && record.detail.crType && record.detail.crType === 'p' || record.detail && record.detail.crType && record.detail.crType === 'u') : false} />
          </Form.Item>
          <Form.Item key='crIndexType' name='crIndexType' label='排他约束索引类型'
            rules={[{ validator: validateCrIndexType },]}
            initialValue={record ? record.detail && record.detail.crIndexType || record.crIndexType : undefined}>
            <Select allowClear showSearch placeholder='请选择排他约束索引类型'
              disabled={record ? (record.detail && record.detail.crType && record.detail.crType === 'p' || record.detail && record.detail.crType && record.detail.crType === 'u' || record.detail && record.detail.crType && record.detail.crType === 'c') : false}>
              {IndexType.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>}
    </div>

  );
});

export default ConstraintCard;