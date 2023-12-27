import React, { useState, useEffect } from 'react'
import './index.less'
import { Divider } from 'antd';
import { review } from '@/services/student/task/task';
import { TASK } from '@/common/entity/task';
import SortContnet from '../sort/index'
import TypeContnet from '../type/index'
import SuperIcon from '@/pages/components/icons';

type IStuParam = {
    avatar: string;
    studentName: string;
    className: string;
    code: string;
}
type ICommitParam = {
    comment: any; // 编辑器对象或者string字符串
}
const DetailComparison = (props: any) => {
    if (!props.match!.params.homeworkId) {
        return;
    }
    const studentId = props.match!.params.studentId
    const otherStudentId = props.match!.params.otherStudentId
    const homeworkId = props.match!.params.homeworkId
    const [subExamList, setSubExamList] = useState<TASK.TaskTeacherSumbitExerciseParam[]>([]);  // 作业的习题参数列表
    const [taskData, setTaskData] = useState<TASK.ReviewData>();
    const [taskList, setTaskList] = useState<TASK.ReviewSortExercises[]>([]);    // 作业列表数据

    const [otherTaskList, setOtherTaskList] = useState<TASK.ReviewSortExercises[]>([]);    // 作业列表数据
    const [otherTaskTypeList, setOtherTaskTypeList] = useState<TASK.ReviewClassifyExercises[]>([]);    // 作业类型列表数据
    const [otherWhetherAnswer, setOtherWhetherAnswer] = useState<number>(-1);  // 是否允许查看答案
    const [otherSubExamList, setOtherSubExamList] = useState<TASK.TaskTeacherSumbitExerciseParam[]>([]);  // 作业的习题参数列表
    const [otherReviewCommit, setotherReviewCommit] = useState<ICommitParam>({ comment: '' });  // 批阅详情
    const [otherUnSelectedGiven, setOtherUnSelectedGiven] = useState<number>(-1);  // 是否有半对
    const [otherCurrentStu, setOtherCurrentStu] = useState<IStuParam>();  // 总分
    const [otherBolClassify, setOtherBolClassify] = useState<boolean>(false);
    let otherArr: TASK.TaskTeacherSumbitExerciseParam[] = []

    const [bolClassify, setBolClassify] = useState<boolean>(false);
    const [taskTypeList, setTaskTypeList] = useState<TASK.ReviewClassifyExercises[]>([]);    // 作业类型列表数据
    const [whetherAnswer, setWhetherAnswer] = useState<number>(-1);  // 是否允许查看答案
    const [reviewCommit, setReviewCommit] = useState<ICommitParam>({ comment: '' });  // 批阅详情
    const [currentStu, setCurrentStu] = useState<IStuParam>();  // 总分
    const [unSelectedGiven, setUnSelectedGiven] = useState<number>(-1);  // 是否有半对
    let arr: TASK.TaskTeacherSumbitExerciseParam[] = []



    useEffect(() => {
        fetchData();
        otherFetchData()
    }, []);


    const fetchData = () => {
        let param = {
            homeworkId: homeworkId,
            studentId: studentId,
            flag: 2
        }
        review(param).then((res) => {
            if (res.success) {
                setWhetherAnswer(res.obj.whetherAnswer)
                setCurrentStu({
                    avatar: res.obj.avatar,
                    studentName: res.obj.studentName,
                    className: res.obj.className,
                    code: res.obj.code
                })
                setReviewCommit({ comment: res.obj.comments })
                if (res.obj.classifyExercises.length != 0) {
                    setBolClassify(true)
                    res.obj.classifyExercises.map((item: TASK.ReviewClassifyExercises, index: number) => {
                        item.collect.map((cItem: TASK.ReviewCollectData, cIndex: number) => {
                            let param = {
                                exerciseId: cItem.exerciseId,
                                exerciseResult: cItem.exerciseResult != null ? cItem.exerciseResult : '',
                                exerciseScore: cItem.exerciseScore,
                                isCorrect: cItem.isCorrect,
                                exerciseActualScore: cItem.exerciseActualScore,
                            }
                            if (!param.exerciseResult && item.exercise?.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
                                item.exercise.exerciseInfos.map((eItem: any, eIndex: number) => {
                                    param.exerciseResult += '@_@'
                                })
                            }
                            arr.push(param)
                        })
                    })
                    setSubExamList(arr)
                    setTaskData(res.obj)
                    setUnSelectedGiven(res.obj.unselectedGiven)
                    setTaskTypeList(res.obj.classifyExercises)
                    let taskArr: any = []
                    res.obj.classifyExercises.map((item: any, index: number) => {
                        taskArr = taskArr.concat(item.collect)
                    })
                    setTaskList(taskArr)
                } else {
                    setBolClassify(false)
                    res.obj.exercises.map((item: TASK.ReviewSortExercises, index: number) => {
                        let param = {
                            exerciseId: item.exerciseId,
                            exerciseResult: item.exerciseResult != null ? item.exerciseResult : '',
                            exerciseScore: item.exerciseScore,
                            isCorrect: item.isCorrect,
                            exerciseActualScore: item.exerciseActualScore,
                        }
                        if (!param.exerciseResult && item.exercise?.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
                            item.exercise.exerciseInfos.map((eItem: any, eIndex: number) => {
                                param.exerciseResult += '@_@'
                            })
                        }
                        arr.push(param)
                    })
                    setSubExamList(arr)
                    setTaskData(res.obj)
                    setTaskList(res.obj.exercises)
                    setUnSelectedGiven(res.obj.unselectedGiven)
                }
            } else {
                console.log('失败')
            }
        })
    }



    const otherFetchData = () => {
        let param = {
            homeworkId: homeworkId,
            studentId: otherStudentId,
            flag: 2
        }
        review(param).then((res) => {
            if (res.success) {
                setOtherWhetherAnswer(res.obj.whetherAnswer)
                setotherReviewCommit({ comment: res.obj.comments })
                setOtherCurrentStu({
                    avatar: res.obj.avatar,
                    studentName: res.obj.studentName,
                    className: res.obj.className,
                    code: res.obj.code
                })
                if (res.obj.classifyExercises.length != 0) {
                    setOtherBolClassify(true)
                    res.obj.classifyExercises.map((item: TASK.ReviewClassifyExercises, index: number) => {
                        item.collect.map((cItem: TASK.ReviewCollectData, cIndex: number) => {
                            let param = {
                                exerciseId: cItem.exerciseId,
                                exerciseResult: cItem.exerciseResult != null ? cItem.exerciseResult : '',
                                exerciseScore: cItem.exerciseScore,
                                isCorrect: cItem.isCorrect,
                                exerciseActualScore: cItem.exerciseActualScore,
                            }
                            if (!param.exerciseResult && item.exercise?.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
                                item.exercise.exerciseInfos.map((eItem: any, eIndex: number) => {
                                    param.exerciseResult += '@_@'
                                })
                            }
                            otherArr.push(param)
                        })
                    })

                    setOtherSubExamList(otherArr)
                    setOtherTaskTypeList(res.obj.classifyExercises)
                    setOtherUnSelectedGiven(res.obj.unselectedGiven)
                    let taskArr: any = []
                    res.obj.classifyExercises.map((item: any, index: number) => {
                        taskArr = taskArr.concat(item.collect)
                    })
                    setOtherTaskList(taskArr)
                } else {
                    setOtherBolClassify(false)
                    res.obj.exercises.map((item: TASK.ReviewSortExercises, index: number) => {
                        let param = {
                            exerciseId: item.exerciseId,
                            exerciseResult: item.exerciseResult != null ? item.exerciseResult : '',
                            exerciseScore: item.exerciseScore,
                            isCorrect: item.isCorrect,
                            exerciseActualScore: item.exerciseActualScore,
                        }
                        if (!param.exerciseResult && item.exercise?.exerciseInfos && item.exercise.exerciseInfos.length != 0 && item.exerciseType == 4) {
                            item.exercise.exerciseInfos.map((eItem: any, eIndex: number) => {
                                param.exerciseResult += '@_@'
                            })
                        }
                        otherArr.push(param)
                    })
                    setOtherSubExamList(otherArr)
                    setOtherTaskList(res.obj.exercises)
                    setOtherUnSelectedGiven(res.obj.unselectedGiven)
                }
            } else {
                console.log('失败')
            }
        })
    }
    //关闭当前页面
    const withdraw = () => {
        window.close(); // 关闭当前页面
    }
    return (
        <div className='custom-single '>
            <div className='question-create-div'>
                <div className='content'>
                    <div className='question-create-card content-top'>
                        <div style={{display: 'flex'}}>
                        <div className='title'>
                            {taskData?.homeworkName}
                        </div>
                        <div style={{marginLeft: 'auto'}}> <a style={{ fontSize: '24px' }} onClick={withdraw}><SuperIcon type="icon-icon-close1" /></a></div>
                        </div>
                      
                        <div className='desc'>
                            <span>题量：{taskData?.exerciseCount}</span>
                            <span>满分：{taskData?.score}</span>
                            <span>作答时间：{taskData?.startTime} 至 {taskData?.endTime}</span>
                        </div>
                        <Divider></Divider>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                            <div className="content-left">
                                <div className='studentName'>姓名：{currentStu?.studentName}，学号：{currentStu?.code}</div>
                                {
                                    bolClassify == false && taskList.length != 0 && whetherAnswer != -1 &&
                                    <SortContnet unSelectedGiven={unSelectedGiven} taskList={taskList} subExamList={subExamList} whetherAnswer={whetherAnswer} reviewCommit={reviewCommit} changeAllScore={(val: any) => { changeAllScore(val) }}></SortContnet>
                                }
                                {
                                    bolClassify == true && taskTypeList.length != 0 && whetherAnswer != -1 &&
                                    <TypeContnet unSelectedGiven={unSelectedGiven} taskList={taskTypeList} subExamList={subExamList} whetherAnswer={whetherAnswer} reviewCommit={reviewCommit} changeAllScore={(val: any) => { changeAllScore(val) }}></TypeContnet>
                                }
                            </div>
                            <div className="content-right">
                                <div className='studentName'>姓名：{otherCurrentStu?.studentName}，学号：{otherCurrentStu?.code}</div>
                                {
                                    otherBolClassify == false && otherTaskList.length != 0 && otherWhetherAnswer != -1 &&
                                    <SortContnet unSelectedGiven={otherUnSelectedGiven} taskList={otherTaskList} subExamList={otherSubExamList} whetherAnswer={otherWhetherAnswer} reviewCommit={otherReviewCommit} changeAllScore={(val: any) => { changeAllScore(val) }}></SortContnet>
                                }
                                {
                                    otherBolClassify == true && otherTaskTypeList.length != 0 && otherWhetherAnswer != -1 &&
                                    <TypeContnet unSelectedGiven={otherUnSelectedGiven} taskList={otherTaskTypeList} subExamList={otherSubExamList} whetherAnswer={otherWhetherAnswer} reviewCommit={otherReviewCommit} changeAllScore={(val: any) => { changeAllScore(val) }}></TypeContnet>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default DetailComparison