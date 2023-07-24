import { QUESTION_BANK } from '@/common/entity/questionbank';
import '@/pages/common-course/course-common.less';
import '@/pages/common-course/question/component/type/common.less';
import { treeColorCss } from "@/pages/common-course/question/component/utils/Utils";
import SuperIcon from "@/pages/components/icons";
import { getDDLExerciseField, getDDLExerciseTable, getSequenceList, recovery, saveCheckSequence, seqRecovery } from '@/services/teacher/course/question-create';
import { Form, Input, InputNumber, Modal, Radio, Select, Space, Table, Tooltip, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { IndexType, seqDataType } from '../constants';
interface IProps {
  sceneDetailId: number;
  exerciseId: number;
  tableName: string;
  sceneId: number;
}


export interface ISeqCardRef {
  addSave: () => void;
  handleRecovery: () => void;
}

const SeqCard = forwardRef<ISeqCardRef, IProps>((props: IProps, ref) => {
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
  //存储查询到的序列信息
  const [data, setdata] = useState<QUESTION_BANK.TSceneSeqDisplay[]>([]);
  //新建表弹出框显示 
  const [editModalOpen, seteditModalOpen] = useState(false);
  //编辑框数据
  const [record, setrecord] = useState<QUESTION_BANK.TSceneSeqDisplay>();

  const [form] = Form.useForm();

  useEffect(() => {
    if (sceneDetailId) {
      initSeqInfo();
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


  //重新初始化序列详情
  const initSeqInfo = () => {
    getSequenceList({ sceneDetailId: sceneDetailId, exerciseId: exerciseId, tableName: tableName }).then((result) => {
      if (result.success) {
        if (result.obj.sceneSeqDisplays) {
          console.log("初始化序列", result.obj.sceneSeqDisplays);
          setdata(result.obj?.sceneSeqDisplays);
        } else {
          setdata([]);
        }
      }
      else {
        message.error(result.message);
      }
    });
  };
  //序列类型转换
  const switchIndexType = (valueName: any) => {
    const matchedType = IndexType.find((type) => type.value === valueName);
    return matchedType ? matchedType.label : valueName;
  }
  const columns: ColumnsType<QUESTION_BANK.TSceneSeqDisplay> = [
    {
      title: '序列名称',
      dataIndex: 'seqName',
      key: 'seqName',
      ellipsis: false,
      render: (text, record) => {
        if ((record.detail && record.detail.seqName != text)) {
          return (<Tooltip title={text}>
            {record.detail.seqName}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.seqName != record.seqName || record.detail?.checkStatus === 'DEL'))) {
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
      title: '步长',
      dataIndex: 'step',
      key: 'step',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.step != text)) {
          return (<Tooltip title={text}>
            {record.detail.step}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.step != record.step || record.detail?.checkStatus === 'DEL'))) {
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
      title: '最小值',
      dataIndex: 'minValue',
      key: 'minValue',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.minValue != text)) {
          return (<Tooltip title={switchIndexType(text)}>
            {switchIndexType(record.detail.minValue)}
          </Tooltip>);
        }
        return switchIndexType(text);
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.minValue != record.minValue || record.detail?.checkStatus === 'DEL'))) {
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
      title: '最大值',
      dataIndex: 'maxValue',
      key: 'maxValue',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.maxValue != text)) {
          return (<Tooltip title={text}>
            {record.detail.maxValue}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.maxValue != record.maxValue || record.detail?.checkStatus === 'DEL'))) {
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
      title: '最新值',
      dataIndex: 'latestValue',
      key: 'latestValue',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.latestValue != text)) {
          return (<Tooltip title={text}>
            {record.detail.latestValue}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.latestValue != record.latestValue || record.detail?.checkStatus === 'DEL'))) {
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
    }, {
      title: '开始值',
      dataIndex: 'startValue',
      key: 'startValue',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.startValue != text)) {
          return (<Tooltip title={text}>
            {record.detail.startValue}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.startValue != record.startValue || record.detail?.checkStatus === 'DEL'))) {
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
    }, {
      title: '缓存尺寸',
      dataIndex: 'cacheSize',
      key: 'cacheSize',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.cacheSize != text)) {
          return (<Tooltip title={text}>
            {record.detail.cacheSize}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.cacheSize != record.cacheSize || record.detail?.checkStatus === 'DEL'))) {
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
      title: '是否循环',
      dataIndex: 'cycle',
      key: 'cycle',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.cycle != text)) {
          return (<Tooltip title={text ? '是' : '否'}>
            {record.detail.cycle ? '是' : '否'}
          </Tooltip>);
        }
        return text ? '是' : '否';
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.cycle != record.cycle || record.detail?.checkStatus === 'DEL'))) {
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
    }, {
      title: '列拥有',
      dataIndex: 'field',
      key: 'field',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.field != text)) {
          return (<Tooltip title={text}>
            {record.detail.field}
          </Tooltip>);
        }
        return text;
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.field != record.field || record.detail?.checkStatus === 'DEL'))) {
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
    }, {
      title: '数据类型',
      dataIndex: 'typeName',
      key: 'typeName',
      ellipsis: true,
      render: (text, record) => {
        if ((record.detail && record.detail.typeName != text)) {
          return (<Tooltip title={switchIndexType(text)}>
            {switchIndexType(record.detail.typeName)}
          </Tooltip>);
        }
        return switchIndexType(text);
      },
      onCell: (record) => {
        if ((record.detail && (record.detail.typeName != record.typeName || record.detail?.checkStatus === 'DEL'))) {
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

  //序列行数据编辑
  const edit = (record: QUESTION_BANK.TSceneSeqDisplay) => {
    if (record.detail && record.detail.checkStatus === 'DEL') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增序列无法进行编辑校验设置！");
      return;
    }
    console.log("edit=", record);
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("edit1=", record);
      seteditModalOpen(true);
      form.setFieldsValue({
        seqName: record.detail?.seqName || record.seqName,
        step: record.detail?.step || record.step,
        minValue: record.detail?.minValue || record.minValue,
        maxValue: record.detail?.maxValue || record.maxValue,
        startValue: record.detail?.startValue || record.startValue,
        latestValue: record.detail?.latestValue || record.latestValue,
        cycle: record.detail?.cycle || record.cycle,
        field: record.detail?.field || record.field,
        typeName: record.detail?.typeName || record.typeName,
        cacheSize: record.detail?.cacheSize || record.cacheSize,
      });
      return record;
    });
  }
  //新增序列
  const addSave = () => {
    setrecord(() => {
      // 使用回调函数形式的setrecord来确保在更新record后立即使用它
      console.log("addSave=", tableName);
      form.setFieldsValue({
        seqName: undefined,
        step: undefined,
        minValue: undefined,
        maxValue: undefined,
        startValue: undefined,
        latestValue: undefined,
        cycle: undefined,
        field: undefined,
        remark: undefined,
        typeName: undefined,
        cacheSize: undefined,
      });
      seteditModalOpen(true);
      return undefined;
    });
  }
  //一键恢复
  const handleRecovery = async () => {
    try {
      const result = await recovery({ recoverType: 'SEQUENCE', exerciseId: exerciseId, sceneDetailId: sceneDetailId, tableName: tableName });
      if (result.success && result.obj) {
        await initSeqInfo();
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
  const reset = async (record: QUESTION_BANK.TSceneSeqDisplay) => {
    console.log("reset=", record);
    if (!(record.detail && record.detail.id)) {
      message.error('该序列未进行校验设置，无需恢复！');
      return;
    }
    if (record.detail.exerciseId) {
      try {
        const result = await seqRecovery(record.detail.exerciseId, record.detail.id);
        if (result.success && result.obj) {
          await initSeqInfo();
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
  const del = (record: QUESTION_BANK.TSceneSeqDisplay) => {
    if (record.detail && record.detail.checkStatus === 'UPDATE') {
      message.error("请恢复后进行删除校验设置");
      return;
    }
    if (record.detail && record.detail.checkStatus === 'INSERT') {
      message.error("新增序列无法进行删除校验设置！");
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
          , sceneSeqId: newRecord.id
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
          , sceneSeqId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    }
    //保存到数据库中
    saveCheckSequence({sceneId: sceneId, 'checkSeqs': [newRecord?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initSeqInfo();
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
    saveCheckSequence({sceneId: sceneId, 'checkSeqs': [record?.detail] }).then(async (result) => {
      if (result.success) {
        try {
          await initSeqInfo();
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





  //序列信息修改时触发
  const handleFormChange = () => {

    const formValues = form.getFieldsValue();
    const { field, ...otherRecord } = formValues;
    let newRecord = { ...record };
    console.info("修改后的record=", newRecord);
    if (newRecord.id) {
      // 如果已经存在 detail 对象，则更新其值
      newRecord = {
        ...newRecord
        , detail: {
          ...newRecord.detail
          , ...otherRecord
          , field: field
          , tableName: tableName
          , checkStatus: 'UPDATE'
          , exerciseId: exerciseId
          , sceneSeqId: newRecord.id
          , sceneDetailId: sceneDetailId
        }
      };
    } else {
      // 如果不存在 detail 对象，则创建新的 detail 对象并添加到 newRecord 中
      newRecord = {
        ...newRecord, detail: {
          ...otherRecord
          , field: field
          , tableName: tableName
          , checkStatus: 'INSERT'
          , exerciseId: exerciseId
          , sceneSeqId: newRecord.id
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
          <Form.Item key='seqName' name='seqName' label='序列名称' initialValue={record ? record.detail && record.detail.seqName || record.seqName : undefined} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item key='field' name='field' label='列拥有'initialValue={record ? record.detail && record.detail.field || record.field : undefined} >
            <Select  placeholder='请选择列拥有'
              options={fields.map((option: any) => ({ label: option.fieldName, value: option.fieldName }))}
            >
            </Select>
          </Form.Item>
          <Form.Item key='step' name='step' label='步长' initialValue={record ? record.detail && record.detail.step || record.step : undefined}>
            <InputNumber placeholder='请输入步长' min={0}
            />
          </Form.Item>
          <Form.Item key='minValue' name='minValue' label='最小值' initialValue={record ? record.detail && record.detail.minValue || record.minValue : undefined}>
            <InputNumber placeholder='请输入最小值' min={0}
            />
          </Form.Item>
          <Form.Item key='maxValue' name='maxValue' label='最大值' initialValue={record ? record.detail && record.detail.maxValue || record.maxValue : undefined}>
            <InputNumber placeholder='请输入最大值' min={0}
            />
          </Form.Item>
          {/* <Form.Item key='latestValue' name='latestValue' label='最新值' initialValue={record ? record.detail && record.detail.latestValue || record.latestValue : undefined}>
            <InputNumber placeholder='请输入最新值' min={0}
            />
          </Form.Item> */}
          <Form.Item key='startValue' name='startValue' label='开始值' initialValue={record ? record.detail && record.detail.startValue || record.startValue : undefined}>
            <InputNumber placeholder='请输入开始值' min={0}
            />
          </Form.Item>
          <Form.Item key='cacheSize' name='cacheSize' label='缓冲尺寸' initialValue={record ? record.detail && record.detail.cacheSize || record.cacheSize : undefined}>
            <InputNumber placeholder='请输入缓冲尺寸' min={0}
            />
          </Form.Item>
          {/* <Form.Item key='typeName' name='typeName' label='数据类型' initialValue={record ? record.detail && record.detail.typeName || record.typeName : undefined} >
            <Select placeholder='请选择数据类型'>
              {seqDataType.map((option: any) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item key='cycle' name='cycle' label='是否循环' rules={[{ required: true, message: '请选择是否循环!' }]} initialValue={record ? record.detail && record.detail.cycle || record.cycle : undefined}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>}
    </div>

  );
});

export default SeqCard;