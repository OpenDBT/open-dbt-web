import React, { useState, useEffect } from 'react';
import './common.less';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-language_tools";
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { testRunAnswer } from '@/services/teacher/course/exercise';
import ResultSetModal from './components/ResultSetModal';
import CODE_CONSTANT from '@/common/code';
import SuperIcon from "@/pages/components/icons";
import BraftEditor from './components/editor/braft/braft';
import { useParams } from 'umi';
import { Button, Form, Input, Select, message, Divider, Modal } from 'antd';
import { saveExercise, generateDescriptions, generatesAnswer } from '@/services/teacher/course/question-create';

import { QUESTION_BANK } from '@/common/entity/questionbank';
import { API } from '@/common/entity/typings';
import { saveExerciseInfoByModel } from '@/services/teacher/task/task';
import KnowledgeModal from '../knowledge';
import Verify from './ddlSqlPackage/verify';
import { getCatalogueResourcesId } from '@/services/resources/upload';
import CustomBraftEditor from './components/editor/braft/CustomBraftEditor';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

import UpdateScene from '@/pages/common-course/scene_new/update_pop';
import AddIndex from '@/pages/common-course/scene_new/create_pop';
import { getScene, getShareScene } from '@/services/teacher/course/scene';
import ViewModal from '@/pages/common-course/scene/components/ViewModal';


const { Option } = Select;
interface IProps {
    onInit: QUESTION_BANK.QuestionExercise | null;
    compType?: string; // 在作业库编辑作业: task-edit
    clickTaskQuestion?: () => void; // 编辑提交
    resetClick?: () => void;  // 编辑取消
}

const DDLSql = forwardRef((props: IProps, ref) => {
    const { onInit, compType, clickTaskQuestion, resetClick } = props;
    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: sumbitClick, // 保存事件
        continueAnswer: sumbitFlash   // 继续出题
    }))
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    const [form] = Form.useForm();      // 获取表格数据
    const courseId = Number(params.courseId);   // 课程id
    //const exerciseId = params.exerciseId ? Number(params.exerciseId) : (compType == 'task-edit' ? Number(onInit?.id) : -1); // 习题id
    let parentId = params.parentId ? Number(params.parentId) : (compType == 'task-edit' ? Number(onInit?.parentId) : 0); // 上级id（所在文件夹id）
    const modelId = Number(onInit?.modelId);
    // 弹框数据参数
    const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
    const [columnList, setColumnList] = useState([]);
    const [datatype, setDatatype] = useState([]);
    const [resultSet, setResultSet] = useState([]);
    const [allScene, setAllScene] = useState<API.SceneListRecord[]>([]);//场景列表
    const [knowModelVisible, setKnowModelVisible] = useState<boolean>(false)    // 知识点弹框显示变量
    const [knowList, setKnowList] = useState<QUESTION_BANK.Knowledge[]>([]);   // 知识点对象数组列表
    const [knowListId, setKnowListId] = useState<number[]>([]);   // 知识点id数组列表
    const [initialValues, setInitialValues] = useState(getOptions(onInit));   // 初始化
    const [score, setScore] = useState(onInit?.exerciseScore);  // 分数
    //const [sceneId, setsceneId] = useState(Number);  // 选中的场景id
    const editorRef = useRef(null);
    const editAceRef = useRef(null);
    const [exerciseId, setexerciseId] = useState(params.exerciseId ? Number(params.exerciseId) : (compType == 'task-edit' ? Number(onInit?.id) : -1));
    // 选中的场景id
    const [selectSceneId, setselectSceneId] = useState<number>(-1);

    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [sceneId, setSceneId] = useState(onInit?.sceneId);
   
    /**
   * 对选项值进行处理
   * @param init 
   * @returns 
   */
    function getOptions(values: QUESTION_BANK.QuestionExercise | null) {
        if (values) {
            parentId = values.parentId
            values.stemEditor = values.stem;
            values.exerciseAnalysisEditor = values.exerciseAnalysis;
            return { ...values };
        } else {
            return {
                knowledges: [] as QUESTION_BANK.Knowledge[],
                exerciseLevel: CODE_CONSTANT?.exerciseLevelList[0].value,
                bandingModel: false,
                stemEditor: '',
                standardAnswser: '',
            }
        }
    }
    useEffect(() => {
        initKnowledgeForm();
        //查询场景列表,下拉列表使用
        getShareScene(courseId).then((result) => {
            setAllScene(result.obj);
        });
        //新建题目生成一个exerciseId
        if (!exerciseId || exerciseId === -1) {
            getCatalogueResourcesId().then((res) => {
                if (res.success) {
                    setexerciseId(res.obj);
                }
            })
        }
        setInitialValues(getOptions(onInit));
        onInit && onInit.sceneId && setselectSceneId(onInit.sceneId);
    }, []);
    /**
     * 初始化知识点数据
     */
    const initKnowledgeForm = () => {
        if (initialValues.knowledges && initialValues.knowledges.length != 0) {
            let knowledges: QUESTION_BANK.Knowledge[] = [];
            let knowledgesId: number[] = [];
            initialValues.knowledges.map((item: QUESTION_BANK.Knowledge) => {
                knowledges.push({ knowledgeId: item.knowledgeId, progress: item.progress, name: item.name });
                knowledgesId.push(item.knowledgeId)
            })
            setKnowList(knowledges)
            setKnowListId(knowledgesId)
        }
    }
    /**
     * @description 提交表单
     * @param value 表格数据
    */
    const onFinish = (values: QUESTION_BANK.QuestionExercise) => {
        // 不经过验证，直接返回return
        if (!onValidateData(values)) return
        // 赋值
        if (typeof (values.stemEditor) != 'string') {
            values.stem = values.stemEditor.toHTML();
        }
        if (typeof (values.exerciseAnalysisEditor) != 'string' && values.exerciseAnalysisEditor != null) {
            values.exerciseAnalysis = values.exerciseAnalysisEditor.toHTML();
        } else values.exerciseAnalysis = values.exerciseAnalysisEditor
        values.id = exerciseId
        values.parentId = Number(parentId)
        values.courseId = courseId
        values.elementType = 0;
        values.exerciseType = 7;
        if (knowListId.length != 0) {
            let arr: QUESTION_BANK.Knowledge[] = []
            knowListId.map((item, index) => {
                arr.push({
                    knowledgeId: item,
                    progress: index
                })
            })
            values.knowledges = arr
        }
        return values
    };
    /**
      * 
      * @param values 表单数据
      * @param continueBol 判断是否继续出题
      */
    const bolUseSave = (values: QUESTION_BANK.QuestionExercise, continueBol: boolean) => {
        if (initialValues.bandingModel) {
            Modal.confirm({
                title: '修改确认框',
                content: '已经在使用中，确定要修改吗？',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    saveExerciseFun(values, continueBol)
                },
                onCancel() {
                    return
                }
            });
        } else {
            saveExerciseFun(values, continueBol)
        }
    }
    // 调用保存题库接口
    const saveExerciseFun = (values: QUESTION_BANK.QuestionExercise, continueBol: boolean) => {
        if (compType != 'task-edit') {
            console.log('valuesL:', values)
            saveExercise(values).then((res) => {
                if (res.success) {
                    message.success('保存成功');
                    localStorage.setItem('refresh-question', '1')
                    if (continueBol) {
                        history.go(0)
                    } else {
                        setTimeout(() => window.close(), 1000)
                    }
                } else {
                    return false;
                }
            })
        } else {
            values.exerciseScore = score
            values.modelId = modelId
            console.log("Taskvalues:", values)
            saveExerciseInfoByModel(values).then((res) => {
                if (res.success) {
                    message.success('保存成功');
                    if (clickTaskQuestion)
                        clickTaskQuestion()
                } else {
                    return false;
                }
            })
        }
    }
    /**
     * @description 提交失败
    */
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    /**
     * 点击取消按钮
     */
    const resetClickButton = () => {
        if (resetClick)
            resetClick()
    }
    /**
  * 
  * 点击继续做题。保存，并刷新表单数据
  */
    const sumbitFlash = () => {
        sumbitClick(true)

    }
    /**
     * @description 自定义提交表单事件
    */
    const sumbitClick = (bol: boolean = false) => {
        form
            .validateFields()
            .then(values => {
                const data = onFinish(values)
                if (data) bolUseSave(data, bol)
            })
            .catch(() => {
                return false
            })
    }
    /**
     * @description 测试运行函数
     */
    const testRunClick = async () => {
        const values: QUESTION_BANK.QuestionExercise = await form.validateFields();
        if (values) {
            // if (!values.sceneId) {
            //     message.warning(`请选择题目场景`);
            //     return
            // }
            if (!values.standardAnswser) {
                message.warning(`请填写正确答案内容`);
                return
            }
            setLoading(true);
            const result = await testRunAnswer({ sceneId: values.sceneId ? values.sceneId : -1, exerciseId: exerciseId, standardAnswer: values.standardAnswser, exerciseType: 7 });
            console.log('result == ', result);
            if (result.success) {
                if (result.obj.isSelect) {
                    setColumnList(result.obj.column);
                    setDatatype(result.obj.datatype)
                    setResultSet(result.obj.result);
                    setResultSetModalVisible(true);
                    setLoading(false);
                } else {
                    setLoading(false);
                    message.success(`运行成功`);

                }
            } else {
                setLoading(false);
                message.error(result.message);
            }
        }
    };
    //生成描述,并赋值
    const descriptions = () => {
        generateDescriptions({ sceneId: selectSceneId, exerciseId: exerciseId }).then((result) => {
            if (result.success) {
                if (editorRef.current) {
                    editorRef.current.setValue(result.obj);
                }
            }
            else {
                message.error(result.message);
            }
        });
    };
    //生成答案
    const generatorRunClick = () => {
        generatesAnswer(selectSceneId, exerciseId).then((result) => {
            if (result.success) {
                if (editAceRef.current) {
                    editAceRef.current.editor.setValue(result.obj);
                }
            }
            else {
                message.error(result.message);
            }
        });
    }


    /**
      * 自定义验证表单数据
      * @param value 表单数据 
      */
    const onValidateData = (value: QUESTION_BANK.QuestionExercise) => {
        debugger;
        if (!value.stemEditor || value.stemEditor == '<p></p>' || (typeof value.stemEditor != 'string' && value.stemEditor.isEmpty())) {
            message.warning('请填写题目描述')
            return
        } else if (!value.standardAnswser) {
            message.warning('请填写正确答案')
            return
        } else if (!value.exerciseLevel) {
            message.warning('请选择难易程度')
            return
        } else if (!value.exerciseName) {
            message.warning('请输入题目名称')
            return
        }
        // else if (!value.sceneId) {
        //     message.warning('请选择题目场景')
        //     return
        // }
        return true
    }
    /**
    * 修改分数
    */
    const onChangeScore = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setScore(e.target.value.trim())
    };

    //场景表切换
    const handleChange = (value) => {
        console.log("触发了场景切换", value);
        setSceneId(value);
        if (value  != undefined){
            setselectSceneId(value);
        }
            
    }
    //清空选择框
    const clearSelect = () => {
        setselectSceneId(-1);

    }

    //新增页面关闭
    const closeModal = () => {
        setShowModal(false);
    }
    // 处理点击新增按钮
    const handleAddScene = () => {
        setShowModal(true);
    };
    //关闭编辑页面
    const closeEditModal = () => {
        setShowEditModal(false);
    }
    // 处理点击查看按钮
    const handleViewScene = (sceneId: number) => {
        // 执行查看场景的逻辑，例如打开一个模态框或导航到场景详情页面
        console.log('查看场景:', sceneId);
        setButtonLoading(true);
        sceneId&&getScene(sceneId).then((result) => {
            if (result.success) {
                setButtonLoading(false);
                setStepFormValues(result.obj);
                setViewModalVisible(true);

            } else {
                setButtonLoading(false);
                message.error(result.message);
            }
        }
        )
    };
    //编辑打开新页面
    const handEditScene = () => {
        setShowEditModal(true);
    }
    //刷新场景
    const refreshAllScene = (sceneId) => {
        //清理场景选中
        clearSelect();
        //查询场景列表,下拉列表使用
        getShareScene(courseId).then((result) => {
            setAllScene(result.obj);
            if (sceneId) {
                form.setFieldsValue({ sceneId });
                setSceneId(sceneId);
                setselectSceneId(sceneId);
            }
        });
    }
    return (
        <>
            <div className='question-content-card'>
                <div className='title'>
                    SQL编程题
                    {
                        compType == 'task-edit' && <> <Input placeholder="" value={score} style={{ width: '50px', margin: '0 10px' }} onChange={onChangeScore} />分</>
                    }
                </div>
                <div className='card-content'>
                    <Form
                        name="basic"
                        form={form}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={initialValues}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item name="stem" hidden={true}><Input /></Form.Item>
                        <Form.Item name="exerciseAnalysis" hidden={true}><Input /></Form.Item>
                        <Form.Item
                            label="题目名称"
                            name="exerciseName"
                        >
                            <Input placeholder="输入题目名称" />
                        </Form.Item>
                        <div style={{ display: 'flex' }}>
                            <Form.Item label="题目场景" name="sceneId">
                                <Select onClear={clearSelect} placeholder="请选择" allowClear style={{ maxWidth: '200px' }} onChange={handleChange}>
                                    {
                                        allScene && allScene.map((item) => {
                                            return <Select.Option key={item.sceneId} value={item.sceneId}>{item.sceneName}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            {sceneId && <Button type="text" icon={<EyeOutlined />} loading={buttonLoading} style={{ marginLeft: 8 }} onClick={() => handleViewScene(form.getFieldValue('sceneId'))} />}
                            {sceneId && <Button type="text" icon={<EditOutlined />} style={{ marginLeft: 2 }} onClick={handEditScene} />}
                            <Button type="text" icon={<PlusOutlined />} onClick={handleAddScene}></Button>
                        </div>
                        <Form.Item label="校验设置">
                            <Verify selectSceneId={selectSceneId} onInit={onInit} exerciseId={exerciseId} />
                        </Form.Item>
                        <div style={{ display: 'flex' }}>
                            <Form.Item label="题目描述" name="stemEditor" style={{ flex: '1' }}>
                                <CustomBraftEditor ref={editorRef} />
                            </Form.Item>
                            <Button type="primary" onClick={() => descriptions()} style={{ marginLeft: '20px' }}>生成描述</Button>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Form.Item name="standardAnswser" style={{ position: 'relative', width: '100%', flex: '1' }} label="正确答案">
                                {/* <TextArea style={{ marginRight: 14 }} allowClear placeholder={"请输入正确答案"} rows={3} /> */}
                                <AceEditor
                                    ref={editAceRef}
                                    style={{ width: '100%', height: '200px', fontSize: '1rem', marginRight: 14, border: '1px' }}
                                    // placeholder="Placeholder Text1"
                                    mode="mysql"
                                    theme="github"
                                    name="stu-answer"
                                    fontSize={18}
                                    showPrintMargin={true} //打印边距
                                    showGutter={true}//行号
                                    highlightActiveLine={true}//突出显示活动线
                                    editorProps={{ $blockScrolling: true }} //自动补全
                                    setOptions={{
                                        enableBasicAutocompletion: true,//自动补全
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                        useWorker: false //自动补全
                                    }} />
                            </Form.Item>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Button type="primary" onClick={() => generatorRunClick()} style={{ marginLeft: '20px', marginBottom: '12px' }}>生成答案</Button>
                                <Button type="primary" loading={loading} onClick={() => testRunClick()} style={{ marginLeft: '20px' }}>测试运行</Button>
                            </div>

                        </div>

                        <Form.Item name="knowledges" label="知识点">

                            <Button type="dashed" style={{ marginBottom: '20px' }} onClick={() => setKnowModelVisible(true)}>
                                <SuperIcon type="icon-icon-add-2" />关联知识点
                            </Button>
                            <div>

                                <div className="flex wrap" style={{ height: 'auto', lineHeight: '30px', marginBottom: 6 }}>
                                    已绑定：
                                    {
                                        knowList.length != 0 && knowList.map((item: QUESTION_BANK.Knowledge, index: number) => {
                                            return <div key={index}
                                                style={{ backgroundColor: '#FDDF66', padding: '0 10px 0 10px', margin: '0 10px 6px 0' }}>
                                                {item.name}</div>
                                        })
                                    }
                                </div>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="答案解析"
                            name="exerciseAnalysisEditor"
                        >
                            <BraftEditor courseId={courseId}  className="border" placeholder="请输入正文内容" />
                        </Form.Item>
                        <Form.Item label="难易程度" name="exerciseLevel">
                            <Select placeholder="请选择" allowClear style={{ maxWidth: '200px' }}>
                                {
                                    CODE_CONSTANT?.exerciseLevelList.map((item, index) => {
                                        return <Option value={item.value} key={index}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        {
                            compType == 'task-edit' &&
                            <div style={{ textAlign: 'right' }}>
                                <Button style={{ borderRadius: '5px', marginRight: '20px' }} onClick={() => { resetClickButton() }}>
                                    <SuperIcon type="icon-chehui" />取消
                                </Button>
                                <Button type="primary" style={{ borderRadius: '5px', marginRight: '40px' }} onClick={() => { sumbitClick() }}>
                                    <SuperIcon type="icon-baocun" />完成
                                </Button>
                            </div>
                        }
                    </Form>
                </div>
            </div>
            {/* 结果集 */}
            <ResultSetModal
                onCancel={() => { setResultSetModalVisible(false) }}
                resultSetModalVisible={resultSetModalVisible}
                columnList={columnList}
                datatype={datatype}
                resultSet={resultSet}
            />
            <KnowledgeModal
                onCancel={() => {
                    setKnowModelVisible(false);
                }}
                onSubmit={(arr: QUESTION_BANK.Knowledge[], arrId: number[]) => {
                    setKnowList(arr)
                    setKnowListId(arrId)
                    setKnowModelVisible(false);
                }}
                selectIds={knowListId}
                moveModelVisible={knowModelVisible}></KnowledgeModal>

            {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
                <ViewModal
                    onCancel={() => {
                        setViewModalVisible(false);
                    }}
                    viewModalVisible={viewModalVisible}
                    scene={stepFormValues}
                />
            ) : null}
            <Modal open={showModal} onCancel={closeModal} footer={null} width={900} centered={true}>
                <AddIndex courseId={courseId} refresh={refreshAllScene}/>
            </Modal>;
            <Modal open={showEditModal} onCancel={closeEditModal} footer={null} width={900} centered={true}>
                <UpdateScene courseId={courseId} sceneId={form.getFieldValue('sceneId')} refresh={refreshAllScene}/>
            </Modal>;

        </>
    )
})

export default DDLSql