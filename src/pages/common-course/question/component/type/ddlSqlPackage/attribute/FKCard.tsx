import { QUESTION_BANK } from '@/common/entity/questionbank';
import '@/pages/common-course/course-common.less';
import '@/pages/common-course/question/component/type/common.less';
import { treeColorCss } from "@/pages/common-course/question/component/utils/Utils";
import SuperIcon from "@/pages/components/icons";
import { fkRecovery, getDDLExerciseField, getDDLExerciseTable, getForeignKeyList, recovery, saveCheckForeignKey } from '@/services/teacher/course/question-create';
import { Form, Input, Modal, Select, Space, Table, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { rule } from '../constants';
interface IProps {
  sceneDetailId: number;
  exerciseId: number;
  tableName: string;
  sceneId: number;
}


export interface IFKCardRef {
  addSave: () => void;
  handleRecovery: () => void;
}

const FKCard = forwardRef<IFKCardRef, IProps>((props: IProps, ref) => {
  const {
    sceneDetailId: sceneDetailId,
    exerciseId: exerciseId,
    tableName: tableName,
    sceneId: sceneId,
  } = props;
  //存储查询到的字段信息
  const [fields, setFields] = useState<QUESTION_BANK.TSceneField[]>([]);
  //存储查询到的表信息
  const [tables, setTables] = useState<QUESTION_BANK.TSceneDetail[]>([]);
  //选中的映射表的字段列表
  const [selectFields, setSelectFields] = useState<QUESTION_BANK.TSceneField[]>([]);
  //存储查询到的外键信息
  const [data, setdata] = useState<QUESTION_BANK.TSceneFKDisplay[]>([]);
  //新建表弹出框显示 
  const [editModalOpen, seteditModalOpen] = useState(false);
  //编辑框数据
  const [record, setrecord] = useState<QUESTION_BANK.TSceneFKDisplay>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (sceneDetailId) {
      initFKInfo();
      initTableInfo();
      initFieldInfo();

    }
  }, [sceneDetailId]);
  //获取字段列表
  const initFieldInfo = () => {
    getDDLExerciseField({ sceneDetailId: sceneDetailId, exerciseId: exerciseId == undefined ? null : exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        const updatedFields = [];
        if (result.obj.sceneFields) {
          console.log("初始化field", result.obj.sceneFields);
          updatedFields.push(...result.obj.sceneFields);
        }
        if (result.obj.checkFields) {
          result.obj.checkFields.forEach((checkField: QUESTION_BANK.TCheckField) => {
            // const existingField = updatedFields.find((field) => field.fieldName === checkField.fieldName);
            if (checkField.checkStatus === 'INSERT') {
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
  //查询表信息
  const initTableInfo = () => {
    getDDLExerciseTable({ sceneId: sceneId, exerciseId: exerciseId }).then((result) => {
      if (result.success) {
        const updatedTables = [];
        if (result.obj.sceneDetails) {
          console.log("初始化table", result.obj.sceneDetails);
          updatedTables.push(
            ...result.obj.sceneDetails.filter((detail: any) => detail.id !== sceneDetailId)
          );
        }
        if (result.obj.checkDetails) {
          result.obj.checkDetails.forEach((checkTable: QUESTION_BANK.TCheckDetail) => {
            if (checkTable.checkStatus === 'INSERT' && checkTable.tableName != tableName) {
              checkTable.tableName && updatedTables.push({ 'tableName': checkTable.tableName });
            }
          });
        }
        setTables(updatedTables);
        console.info("Tables===", updatedTables);
      } else {
        message.error(result.message);
      }
    });
  }


  //重新初始化外键详情
  const initFKInfo = () => {
    getForeignKeyList({ sceneDetailId: sceneDetailId, exerciseId: exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        if (result.obj.sceneFKDisplays) {
          console.log("初始化外键", result.obj.sceneFKDisplays);
          setdata(result.obj?.sceneFKDisplays);
        } else {
          setdata([]);
        }
      }
      else {
        message.error(result.message);
      }
    });
  };
  //外键类型转换
  const switchFKType = (valueName: any) => {
    const matchedType = rule.find((type) => type.value === valueName);
    return matchedType ? matchedType.label : valueName;
  }
  const columns: ColumnsType<QUESTION_BANK.TSceneFKDisplay> = [
    {
      title: '外键名称',
      dataIndex: 'fkName',
      key: 'fkName',
      ellipsis: false,
      render: (text, record) => {
        if ((record.detail && record.detail.fkName != text)) {
          return (<Tooltip title={text}>
            {record.detail.fkName}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fkName != record.fkName || record.detail?.checkStatus === 'DEL'))) {
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
      title: '外键字段',
      dataIndex: 'fkFields',
      key: 'fkFields',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.fkFields != text)) {
          return (<Tooltip title={text}>
            {record.detail.fkFields}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.fkFields != record.fkFields || record.detail?.checkStatus === 'DEL'))) {
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
      title: '参照表',
      dataIndex: 'reference',
      key: 'reference',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.reference != text)) {
          return (<Tooltip title={text}>
            {record.detail.reference}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.reference != record.reference || record.detail?.checkStatus === 'DEL'))) {
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
      title: '参照表字段',
      dataIndex: 'referenceFields',
      key: 'referenceFields',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.referenceFields != text)) {
          return (<Tooltip title={text}>
            {record.detail.referenceFields}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.referenceFields != record.referenceFields || record.detail?.checkStatus === 'DEL'))) {
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
      title: '更新规则',
      dataIndex: 'updateRule',
      key: 'updateRule',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.updateRule != text)) {
          return (<Tooltip title={switchFKType(text)}>
            {switchFKType(record.detail.updateRule)}
          </Tooltip>);
        }
        return switchFKType(text);
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.updateRule != record.updateRule || record.detail?.checkStatus === 'DEL'))) {
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
      title: '删除规则',
      dataIndex: 'deleteRule',
      key: 'deleteRule',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.deleteRule != text)) {
          return (<Tooltip title={switchFKType(text)}>
          {switchFKType(record.detail.deleteRule)}
        </Tooltip>);
      }
      return switchFKType(text);
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.deleteRule != record.deleteRule || record.detail?.checkStatus === 'DEL'))) {
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

  //外键行数据编辑
  const edit = (record: QUESTION_BANK.TSceneFKDisplay) => {
    if (record.detail && record.detail.checkStatus === 'DEL') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增外键无法进行编辑校验设置！");
      return;
    }
    console.log("edit=", record);
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("edit1=", record);
      seteditModalOpen(true);
      form.setFieldsValue({
        fkName: record.detail?.fkName || record.fkName,
        fkFields: record.detail?.fkFields?.split(',') || record.fkFields?.split(','),
        reference: record.detail?.reference || record.reference,
        referenceFields: record.detail?.referenceFields?.split(',') || record.referenceFields?.split(','),
        updateRule: record.detail?.updateRule || record.updateRule,
        deleteRule: record.detail?.deleteRule || record.deleteRule,
      });
      return record;
    });
  }
  //新增外键
  const addSave = () => {
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("addSave=", tableName);
      form.setFieldsValue({
        fkName: undefined,
        fkFields: undefined,
        reference: undefined,
        referenceFields: undefined,
        updateRule: undefined,
        deleteRule: undefined,
      });
      seteditModalOpen(true);
      return undefined;
    });
  }
  //一键恢复
  const handleRecovery = async () => {
    try {
      const result = await recovery({ recoverType: 'FOREIGN_KEY', exerciseId: exerciseId, sceneDetailId: sceneDetailId, tableName: tableName });
      if (result.success && result.obj) {
        await initFKInfo();
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
  const reset = async (record: QUESTION_BANK.TSceneFKDisplay) => {
    console.log("reset=", record);
    if (!(record.detail && record.detail.id)) {
      message.error('该外键未进行校验设置，无需恢复！');
      return;
    }
    if (record.detail.exerciseId) {
      try {
        const result = await fkRecovery(record.detail.exerciseId, record.detail.id);
        if (result.success && result.obj) {
          await initFKInfo();
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
  const del = (record: QUESTION_BANK.TSceneFKDisplay) => {
    if (record.detail && record.detail.checkStatus === 'UPDATE') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增外键无法进行删除校验设置！");
      return;
    }
    console.log("del=", record);
    //设置删除变量
    let newRecord = { ...record };
    if (newRecord.detail) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = {
        ...newRecord,
        detail: {
          ...newRecord.detail
          , tableName: tableName
          , checkStatus: 'DEL'
          , exerciseId: exerciseId
          , sceneFkId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      const { id, detail, ...partModel } = newRecord;
      newRecord = {
        ...newRecord
        , detail: {
          ...partModel
          , tableName: tableName
          , checkStatus: 'DEL'
          , exerciseId: exerciseId
          , sceneFkId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    }
    //保存到数据库中
    saveCheckForeignKey({sceneId: sceneId, 'checkFks': [newRecord?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initFKInfo();
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
    saveCheckForeignKey({ sceneId: sceneId,'checkFks': [record?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initFKInfo();
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





  //外键信息修改时触发
  const handleFormChange = () => {

    const formValues = form.getFieldsValue();
    const { fkFields, referenceFields, ...otherRecord } = formValues;
    let newRecord = { ...record };
    console.info("修改后的record=", newRecord);
    if (newRecord.id) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = {
        ...newRecord
        , detail: {
          ...newRecord.detail
          , ...otherRecord
          , fkFields: typeof fkFields === 'object' && Array.isArray(fkFields) ? fkFields.join(',') : fkFields
          , referenceFields: typeof referenceFields === 'object' && Array.isArray(referenceFields) ? referenceFields.join(',') : referenceFields
          , tableName: tableName
          , checkStatus: 'UPDATE'
          , exerciseId: exerciseId
          , sceneFkId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      newRecord = {
        ...newRecord, detail: {
          ...otherRecord
          , fkFields: typeof fkFields === 'object' && Array.isArray(fkFields) ? fkFields.join(',') : fkFields
          , referenceFields: typeof referenceFields === 'object' && Array.isArray(referenceFields) ? referenceFields.join(',') : referenceFields
          , tableName: tableName
          , checkStatus: 'INSERT'
          , exerciseId: exerciseId
          , sceneFkId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    }
    console.log('Updated record:', newRecord);
    setrecord(newRecord);
  };




  //切换映射表
  const referenceChange = (value: string, option: any) => {
    getFields(option.key, exerciseId, value);
  }
  const getFields = (sceneDetailId: any, exerciseId: any, tableName: any) => {
    getDDLExerciseField({ sceneDetailId: !sceneDetailId ? -1 : sceneDetailId, exerciseId: exerciseId == undefined ? null : exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        const updatedFields = [];
        if (result.obj.sceneFields) {
          console.log("初始化field", result.obj.sceneFields);
          updatedFields.push(...result.obj.sceneFields);
        }
        if (result.obj.checkFields) {
          result.obj.checkFields.forEach((checkField: QUESTION_BANK.TCheckField) => {
            if (checkField.checkStatus === 'INSERT') {
              checkField.fieldName && updatedFields.push({ 'fieldName': checkField.fieldName });
            }
          });
        }
        setSelectFields(updatedFields);
        console.info("fields===", updatedFields);
      }
      else {
        message.error(result.message);
      }
    });
  }
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
          <Form.Item key='fkName' name='fkName' label='外键名称' initialValue={record ? record.detail && record.detail.fkName || record.fkName : undefined} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item key='fkFields' name='fkFields' label='外键字段' rules={[{ required: true, message: '请选择外键字段!' }]}>
            <Select mode="multiple" placeholder='请选择外键字段' tokenSeparators={[',']}
              options={fields.map((option: any) => ({ label: option.fieldName, value: option.fieldName }))}
            >
            </Select>
          </Form.Item>
          <Form.Item key='reference' name='reference' label='映射表' initialValue={record ? record.detail && record.detail.reference || record.reference : undefined} rules={[{ required: true, message: '请选择映射表!' }]}>
            <Select showSearch placeholder='请选择映射表' onChange={referenceChange}>
              {tables.map((option: any) => (
                <Select.Option key={option.id} value={option.tableName}>
                  {option.tableName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item key='referenceFields' name='referenceFields' label='映射字段' rules={[{ required: true, message: '请选择映射字段!' }]}>
            <Select mode="multiple" placeholder='请选择外映射字段' tokenSeparators={[',']}
              options={selectFields.map((option: any) => ({ label: option.fieldName, value: option.fieldName }))}
            >
            </Select>
          </Form.Item>
          <Form.Item key='updateRule' name='updateRule' label='更新规则' initialValue={record ? record.detail && record.detail.updateRule || record.updateRule : undefined} rules={[{ required: true, message: '请选择更新规则!' }]}>
            <Select showSearch placeholder='请选择更新规则'>
              {rule.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item key='deleteRule' name='deleteRule' label='删除规则' initialValue={record ? record.detail && record.detail.deleteRule || record.deleteRule : undefined} rules={[{ required: true, message: '请选择删除规则!' }]}>
            <Select showSearch placeholder='请选择删除规则'>
              {rule.map((option: any) => (
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

export default FKCard;