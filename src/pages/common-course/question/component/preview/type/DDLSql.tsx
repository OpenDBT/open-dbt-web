import React, { useState, useEffect } from 'react'
import './common.less';
import './sql.less';
import { forwardRef, useImperativeHandle } from 'react'
import { Divider } from 'antd';
import { getScene } from '@/services/teacher/course/scene';
import { API } from '@/common/entity/typings';
import { history, useParams } from 'umi';
import { QUESTION_BANK } from '@/common/entity/questionbank';
import ViewModal from '@/pages/common-course/scene/components/ViewModal';
interface IProps {
    onInit: QUESTION_BANK.QuestionExercise;
    compType?: string;
}
const DDLSql = forwardRef((props: IProps, ref) => {
    const { onInit, compType } = props;
    // 将父组件的方法暴露出来
    useImperativeHandle(ref, () => ({
        clickSave: clickEdit, // 点击跳入编辑页面
    }))
    const params: QUESTION_BANK.IParams = useParams();    // 获取路由参数
    // 弹框数据参数
    const [initialValues, setInitialValues] = useState<QUESTION_BANK.QuestionExercise>(onInit)   // 初始化数据
    const courseId = Number(params.courseId);
    const exerciseId = Number(params.exerciseId);
    const parentId = Number(initialValues?.parentId);
    const [currentScene, setCurrentScene] = useState<API.SceneListRecord>();//场景列表
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
    useEffect(() => {
        //查询场景
        initialValues.sceneId&&getScene(initialValues.sceneId).then((result) => {
            if(result&&result.obj)
            setCurrentScene(result.obj);
        });
    }, []);
    /**
     * @description 自定义提交表单事件
    */
    const clickEdit = () => {
        history.push(`/question-bank/edit/courseId/exerciseId/parentId/${courseId}/${exerciseId}/${parentId}`);
    }
    return (
        <>
            <div className='question-content-card'>
                <div className='title'>
                    <div className='title-type'>
                        {
                            compType != 'task-edit' && ' （DDLSQL编程题）'
                        }
                    </div>
                    <div className='title-name'>
                        {initialValues?.exerciseName}
                        {
                            compType == 'task-edit' && <span>（SQL编程题，{onInit?.exerciseScore}分）</span>
                        }
                    </div>
                </div>
                <div className='card-answser'>
                    <div style={{ fontWeight: 'bold', margin: '20px 0', display: 'inline-block' }}>题目场景：</div>
                    <a onClick={() => {
                        setViewModalVisible(true); setStepFormValues(currentScene)
                    }}>
                        {
                            currentScene?.sceneName
                        }
                    </a>
                </div>
                <div className='card-content'>
                    <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.stem }}></div>
                    <div className='card-answser'>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>答案：</div>
                        <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.standardAnswser }} style={{ fontWeight: 'normal' }}></div>
                    </div>
                    <Divider />
                    <div>
                        <div className='answser-analys'>
                            <div className='analys-label' style={{ whiteSpace: 'nowrap' }}>
                                答案解析：
                            </div>
                            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: initialValues?.exerciseAnalysis }}></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', marginRight: '20px' }}>
                        <span style={{ fontWeight: 'bold' }}>难易程度：</span><span>{initialValues?.exerciseLevel == 1 ? '简单' : (initialValues?.exerciseLevel == 2 ? '一般' : '困难')}</span>
                    </div>
                </div>
            </div>
            {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
                <ViewModal
                    onCancel={() => {
                        setViewModalVisible(false);
                    }}
                    viewModalVisible={viewModalVisible}
                    scene={stepFormValues}
                />
            ) : null}
        </>
    )
})

export default DDLSql