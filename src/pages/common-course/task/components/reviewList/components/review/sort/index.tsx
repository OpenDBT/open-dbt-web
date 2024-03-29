import React, { useState } from 'react'
import CODE_CONSTANT from '@/common/code'
import { Button, Divider, message } from 'antd';
import { TASK } from '@/common/entity/task';
import BraftEditor from '@/pages/stu/study/task/component/braft/braft';
import SingleChoice from '../../questionType/singleChoice';
import Judge from '../../questionType/judge';
import Multiple from '../../questionType/multiple';
import Short from '../../questionType/shortAnswser';
import SpaceQeustion from '../../questionType/space';
import SqlQuestion from '../../questionType/sql';
import { API } from '@/common/entity/typings';
import ViewModal from '@/pages/common-course/scene/components/ViewModal';
import DDLSql from '../../questionType/ddlSql';
import DDLViewSql from '../../questionType/ddlViewSql';
import DDLFunctionSql from '../../questionType/ddlFunctionSql copy';
import DDLTriggerSql from '../../questionType/ddlTriggerSql copy';

const AnswserBySort = (props: any) => {
    const { changeAllScore } = props
    // let taskList = props.taskList
    const [taskList, setTaskList] = useState<any>(props.taskList); //点击更多存储当前行数据
    const commit = props.reviewCommit;  // 批阅详情内容
    const [examList, setExamList] = useState<TASK.TaskSumbitExerciseParam[]>(props.subExamList);  // 作业的习题参数列表
    const unSelectedGiven = props.unSelectedGiven
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [stepFormValues, setStepFormValues] = useState<API.SceneListRecord>();
    const editSumbit = async (item: any) => {
        item.isCorrect = 1
        item.exerciseScore = item.exerciseActualScore
        let objArr = taskList
        await setTaskList([...objArr])
        changeAllScore(taskList)
    }
    const editReset = async (item: any) => {
        item.isCorrect = 2
        item.exerciseScore = 0
        let objArr = taskList
        await setTaskList([...objArr])
        changeAllScore(taskList)
    }
    const editHalf = async (item: any) => {
        item.isCorrect = 3
        item.exerciseScore = item.exerciseActualScore / 2
        let objArr = taskList
        await setTaskList([...objArr])
        changeAllScore(taskList)
    }
    const onChangeScore = (e: any, index: number) => {
        // e.target.value = e.target.value.replace(/[^\d{1,}\.\d{1}|]/g,'')
        let arr = taskList;
        if (e.target.value > arr[index].exerciseActualScore) {
            message.error('输入值超出题目分数!')
            e.preventDefault();
        } else if (e.target.value < 0) {
            message.error('输入值不对!')
            e.preventDefault();
        } else {
            arr[index].exerciseScore = e.target.value
        }
        setExamList([...arr])
        changeAllScore(taskList)
    }
    const onChangeComment = (val: any) => {
        let obj = commit
        obj.comment = val
    }
    return (
        <div>
            {
                taskList && taskList.map((item: any, index: number) => {
                    return <div key={"list-sort" + index} id={"id-sort" + index}>
                        <div>
                            <span className='card-list-title task-title'>
                                {index + 1}. {item.exercise.exerciseName}
                                {[6, 7, 8, 9, 10].includes(item.exerciseType) ?
                                    <Button style={{ marginRight: 8, marginBottom: 10 }} className="gray-button button-radius continue-button" onClick={() => { setViewModalVisible(true); setStepFormValues(item.exercise.scene) }}>场景查看</Button>
                                    : null}
                            </span>
                            <span className='card-list-desc desc'>（{CODE_CONSTANT.questionType[item.exerciseType - 1]}，{item.exerciseActualScore}分）</span>
                        </div>
                        <div className='card-label'>
                            <div className='html-width-class' dangerouslySetInnerHTML={{ __html: item.exercise.stem }}></div>
                        </div>
                        {
                            item.exerciseType == 1 && <SingleChoice data={item} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} ></SingleChoice>
                        }
                        {
                            item.exerciseType == 2 && <Multiple editHalf={editHalf} data={item} unselectedGiven={unSelectedGiven} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} ></Multiple>
                        }
                        {
                            item.exerciseType == 3 && <Judge data={item} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} ></Judge>
                        }
                        {
                            item.exerciseType == 4 && <SpaceQeustion editHalf={editHalf} data={item} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></SpaceQeustion>
                        }
                        {
                            item.exerciseType == 5 && <Short data={item} editHalf={editHalf} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></Short>
                        }
                        {
                            item.exerciseType == 6 && <SqlQuestion data={item} editHalf={editHalf} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></SqlQuestion>
                        }
                        {
                            item.exerciseType == 7 && <DDLSql data={item} editHalf={editHalf} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></DDLSql>
                        }
                        {
                            item.exerciseType == 8 && <DDLViewSql data={item} editHalf={editHalf} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></DDLViewSql>
                        }
                        {
                            item.exerciseType == 9 && <DDLFunctionSql data={item} editHalf={editHalf} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></DDLFunctionSql>
                        }
                        {
                            item.exerciseType == 10 && <DDLTriggerSql data={item} editHalf={editHalf} current={examList[index]} taskList={taskList} changeAllScore={changeAllScore} editSumbit={(value: any) => editSumbit(value)} editReset={(value: any) => editReset(value)} onChangeScore={(val: any) => onChangeScore(val, index)}></DDLTriggerSql>
                        }
                        <Divider />
                    </div>
                })
            }
            <div className='header'>
                <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>作业评语：</span>
            </div>
            <BraftEditor className="border" placeholder="请输入正文内容" value={commit.comment} onChange={(val) => { onChangeComment(val) }} />
            {viewModalVisible && stepFormValues && Object.keys(stepFormValues).length ? (
                <ViewModal
                    onCancel={() => {
                        setViewModalVisible(false);
                    }}
                    viewModalVisible={viewModalVisible}
                    scene={stepFormValues}
                />
            ) : null}
        </div>
    )
}

export default AnswserBySort