import { QUESTION_BANK } from '@/common/entity/questionbank';
import '@/pages/common-course/course-common.less';
import '@/pages/common-course/question/component/type/common.less';
import { treeColorCss } from "@/pages/common-course/question/component/utils/Utils";
import SuperIcon from "@/pages/components/icons";
import { getDDLExerciseField, getDDLExerciseTable, getIndexList, indexRecovery, recovery, saveCheckIndex } from '@/services/teacher/course/question-create';
import { Form, Input, Modal, Radio, Select, Space, Table, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { IndexType } from '../constants';
interface IProps {
  sceneDetailId: number;
  exerciseId: number;
  tableName: string;
  sceneId: number;
}


export interface IIndexCardRef {
  addSave: () => void;
  handleRecovery: () => void;
}

const IndexCard = forwardRef<IIndexCardRef, IProps>((props: IProps, ref) => {
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
  //存储查询到的索引信息
  const [data, setdata] = useState<QUESTION_BANK.TSceneIndexDisplay[]>([]);
  //新建表弹出框显示 
  const [editModalOpen, seteditModalOpen] = useState(false);
  //编辑框数据
  const [record, setrecord] = useState<QUESTION_BANK.TSceneIndexDisplay>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (sceneDetailId) {
      initIndexInfo();
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


  //重新初始化索引详情
  const initIndexInfo = () => {
    getIndexList({ sceneDetailId: sceneDetailId, exerciseId: exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        if (result.obj.sceneIndexDisplays) {
          console.log("初始化索引", result.obj.sceneIndexDisplays);
          setdata(result.obj?.sceneIndexDisplays);
        } else {
          setdata([]);
        }
      }
      else {
        message.error(result.message);
      }
    });
  };
  //索引类型转换
  const switchIndexType = (valueName: any) => {
    const matchedType = IndexType.find((type) => type.value === valueName);
    return matchedType ? matchedType.label : valueName;
  }
  const columns: ColumnsType<QUESTION_BANK.TSceneIndexDisplay> = [
    {
      title: '索引名称',
      dataIndex: 'indexName',
      key: 'indexName',
      ellipsis: false,
      render: (text, record) => {
        if ((record.detail && record.detail.indexName != text)) {
          return (<Tooltip title={text}>
            {record.detail.indexName}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.indexName != record.indexName || record.detail?.checkStatus === 'DEL'))) {
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
      title: '索引字段',
      dataIndex: 'indexFields',
      key: 'indexFields',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.indexFields != text)) {
          return (<Tooltip title={text}>
            {record.detail.indexFields}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.indexFields != record.indexFields || record.detail?.checkStatus === 'DEL'))) {
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
      title: '索引类型',
      dataIndex: 'indexType',
      key: 'indexType',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.indexType != text)) {
          return (<Tooltip title={switchIndexType(text)}>
            {switchIndexType(record.detail.indexType)}
          </Tooltip>);
        }
        return switchIndexType(text);
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.indexType != record.indexType || record.detail?.checkStatus === 'DEL'))) {
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
      title: '是否唯一索引',
      dataIndex: 'indexUnique',
      key: 'indexUnique',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.indexUnique != text)) {
          return (<Tooltip title={text ? '是' : '否'}>
            {record.detail.indexUnique ? '是' : '否'}
          </Tooltip>);
        }
        return text ? '是' : '否';
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.indexUnique != record.indexUnique || record.detail?.checkStatus === 'DEL'))) {
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.description != text)) {
          return (<Tooltip title={text}>
            {record.detail.description}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.description != record.description || record.detail?.checkStatus === 'DEL'))) {
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

  //索引行数据编辑
  const edit = (record: QUESTION_BANK.TSceneIndexDisplay) => {
    if (record.detail && record.detail.checkStatus === 'DEL') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增索引无法进行编辑校验设置！");
      return;
    }
    console.log("edit=", record);
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("edit1=", record);
      seteditModalOpen(true);
      form.setFieldsValue({
        indexName: record.detail?.indexName || record.indexName,
        indexFields: record.detail?.indexFields?.split(',') || record.indexFields?.split(','),
        indexType: record.detail?.indexType || record.indexType,
        indexUnique: record.detail?.indexUnique || record.indexUnique,
        description: record.detail?.description || record.description,
      });
      return record;
    });
  }
  //新增索引
  const addSave = () => {
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("addSave=", tableName);
      form.setFieldsValue({
        indexName: undefined,
        indexFields: undefined,
        indexType: undefined,
        indexUnique: undefined,
        description: undefined,
      });
      seteditModalOpen(true);
      return undefined;
    });
  }
  //一键恢复
  const handleRecovery = async () => {
    try {
      const result = await recovery({ recoverType: 'INDEX', exerciseId: exerciseId, sceneDetailId: sceneDetailId, tableName: tableName });
      if (result.success && result.obj) {
        await initIndexInfo();
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
  const reset = async (record: QUESTION_BANK.TSceneIndexDisplay) => {
    console.log("reset=", record);
    if (!(record.detail && record.detail.id)) {
      message.error('该索引未进行校验设置，无需恢复！');
      return;
    }
    if (record.detail.exerciseId) {
      try {
        const result = await indexRecovery(record.detail.exerciseId, record.detail.id);
        if (result.success && result.obj) {
          await initIndexInfo();
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
  const del = (record: QUESTION_BANK.TSceneIndexDisplay) => {
    if (record.detail && record.detail.checkStatus === 'UPDATE') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增索引无法进行删除校验设置！");
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
          , sceneIndexId: newRecord.id
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
          , sceneIndexId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    }
    //保存到数据库中
    saveCheckIndex({sceneId: sceneId, 'indexList': [newRecord?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initIndexInfo();
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
    saveCheckIndex({sceneId: sceneId, 'indexList': [record?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initIndexInfo();
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





  //索引信息修改时触发
  const handleFormChange = () => {

    const formValues = form.getFieldsValue();
    const { indexFields, ...otherRecord } = formValues;
    let newRecord = { ...record };
    console.info("修改后的record=", newRecord);
    if (newRecord.id) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = {
        ...newRecord
        , detail: {
          ...newRecord.detail
          , ...otherRecord
          , indexFields: typeof indexFields === 'object' && Array.isArray(indexFields) ? indexFields.join(',') : indexFields
          , tableName: tableName
          , checkStatus: 'UPDATE'
          , exerciseId: exerciseId
          , sceneIndexId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      newRecord = {
        ...newRecord, detail: {
          ...otherRecord
          , indexFields: typeof indexFields === 'object' && Array.isArray(indexFields) ? indexFields.join(',') : indexFields
          , tableName: tableName
          , checkStatus: 'INSERT'
          , exerciseId: exerciseId
          , sceneIndexId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    }
    console.log('Updated record:', newRecord);
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
          <Form.Item key='indexName' name='indexName' label='索引名称' initialValue={record ? record.detail && record.detail.indexName || record.indexName : undefined} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item key='indexFields' name='indexFields' label='索引字段' rules={[{ required: true, message: '请选择索引字段!' }]}>
            <Select mode="multiple" placeholder='请选择索引字段' tokenSeparators={[',']}
              options={fields.map((option: any) => ({ label: option.fieldName, value: option.fieldName }))}
            >
            </Select>
          </Form.Item>
          <Form.Item key='indexType' name='indexType' label='索引类型' initialValue={record ? record.detail && record.detail.indexType || record.indexType : undefined} rules={[{ required: true, message: '请选择索引类型!' }]}>
            <Select  placeholder='请选择索引类型'>
              {IndexType.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item key='indexUnique' name='indexUnique' label='是否唯一索引' rules={[{ required: true, message: '请选择是否唯一索引!' }]}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item key='description' name='description' label='描述' initialValue={record ? record.detail && record.detail.description || record.description : undefined} >
          <Input />
          </Form.Item>
        </Form>
      </Modal>}
    </div>

  );
});

export default IndexCard;