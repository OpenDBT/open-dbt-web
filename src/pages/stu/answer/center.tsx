import { Card, Button, message, Tag, Space } from 'antd';
import { isNotEmptyBraft } from '@/utils/utils';
import { getKnowledgeColor } from '@/utils/utils';
import Highlight from 'react-highlight';
import 'highlight.js/styles/magula.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Judge from './components/questionType/judge'
import Single from './components/questionType/single'
import Multiple from './components/questionType/multiple'
import React, { useEffect, useState } from 'react';
import Blanks from './components/questionType/blanks';
import ShortAnswer from './components/questionType/shortAnswer';
import BlanksExercise from './components/questionType/blanks';
import { submitAnswer, stuTestRunAnswer } from '@/services/teacher/course/score';
import { QUESTION_BANK } from '@/common/entity/questionbank';
import { API } from '@/common/entity/typings';
import { exerciseAnswerNotifiedExcetion, exerciseAnswerNotifiedSucc, exerciseAnswerNotifiedFail } from '@/pages/components/exercise-answer-notification'
interface IProp {
    courseId: number;
    changeExercise: (value: boolean) => void;
    exercise: API.StuAnswerExerciseInfo;
    topButtonDisabled: boolean;
    nextButtonDisabled: boolean;
    clazzId: number;
    onFinish: (value: { answer: string; usageTime: number }) => void;
    usageTime: number;

}
const areEqual = (prevProps, nextProps) => {
    //return false 刷新页面
    if (prevProps.exercise === nextProps.exercise
        && prevProps.topButtonDisabled === nextProps.topButtonDisabled
        && prevProps.nextButtonDisabled === nextProps.nextButtonDisabled
    ) {
        return true
    } else {
        return false
    }
}

export enum ExerciseType {
    "单选题" = 1,
    "多选题" = 2,
    "判断题" = 3,
    "填空题" = 4,
    "简答题" = 5,
    "DMLsql题" = 6,
    "DDLsql题" = 7,
    "DDL视图题" = 8,
    "函数题" = 9,
    "触发器题" = 10
}

const CneterColumn = (props: IProp) => {
    const {
        changeExercise,
        exercise,
        topButtonDisabled,
        nextButtonDisabled,
        onFinish,
        usageTime
    } = props;
    const [childData, setChildData] = useState<any>();

    const submitModel = (newValue: string) => {
        setChildData(newValue);
    }

    /**
 * 提交答案
 * @returns
 */
    const submit = () => {
        if (!childData||childData.length === 0) {
            message.info('请输入答案')
            return;
        }
        console.log('sdsdsd=' + childData);
        onFinish({ answer: childData, usageTime: usageTime })
    }


    const exerciseTypeMap = {
        "单选题": <Single data={exercise} childData={childData} beforeSubmitModel={submitModel}></Single>,
        "多选题": <Multiple data={exercise} childData={childData} beforeSubmitModel={submitModel}></Multiple>,
        "判断题": <Judge data={exercise} childData={childData} beforeSubmitModel={submitModel} ></Judge>,
        "填空题": <BlanksExercise data={exercise} childData={childData} beforeSubmitModel={submitModel}></BlanksExercise>,
        "简答题": <ShortAnswer data={exercise} childData={childData} beforeSubmitModel={submitModel}></ShortAnswer>
        // "DMLsql题": <Judge data={exercise}></Judge>,
        // "DDLsql题": <Judge data={exercise}></Judge>,
        // "DDL视图题": <Judge data={exercise}></Judge>,
        // "函数题": <Judge data={exercise}></Judge>,
        // "触发器题": <Judge data={exercise}></Judge>

    }

    return (
        <div className='left'>
            <div className="flex content-title">
                <div className="title-3">{exercise?.courseName}</div>
                <div className="tools">
                    <Button
                        style={{ marginRight: 12 }}
                        size="small"
                        className={topButtonDisabled ? 'disabled' : ''}
                        disabled={topButtonDisabled}
                        onClick={() => changeExercise(false)}
                    >
                        <LeftOutlined style={{ marginRight: -8 }} />上一题
                    </Button>
                    <Button
                        size="small"
                        className={nextButtonDisabled ? 'disabled' : ''}
                        disabled={nextButtonDisabled}
                        onClick={() => changeExercise(true)}
                    >
                        下一题<RightOutlined style={{ marginLeft: 3 }} />
                    </Button>
                </div>
            </div>

            <div className="markdown-body">
                <Card bordered={false}>
                    <Space size="middle">
                        <div className="exercise-id">#{exercise?.exerciseId}</div>
                        <div className="title-5">{exercise?.exerciseName}</div>

                        <span>[ {ExerciseType[`${exercise?.exerciseType}`]} ]</span>
                    </Space>
                    <div className="title-3" style={{ marginTop: 20 }}>习题描述</div>
                    {
                        isNotEmptyBraft(exercise?.exerciseDesc) ?
                            <div className="exercise-desc" dangerouslySetInnerHTML={{ __html: exercise?.exerciseDesc }} />
                            : <div className="exercise-desc">无</div>
                    }

                    <div>
                        {exerciseTypeMap[ExerciseType[`${exercise?.exerciseType}`]]}
                    </div>



                    <div style={{ clear: 'both' }} />

                    <div className="title-3" style={{ margin: '30px 0 16px 0' }}>相关知识点</div>
                    <div>
                        {exercise?.knowledgeNames.map((ele: string, index: number) => {
                            return <Tag key={index} color={getKnowledgeColor()[index]}>{ele}</Tag>
                        })}
                    </div>
                    <div style={{ clear: 'both', }} />
                    <Button type="primary" size="small"
                        style={{ float: 'right' }}
                        className="right-title-button"
                        onClick={() => submit()}
                    >
                        提交答案
                    </Button>
                </Card>
            </div>
        </div>
    )
}
export default React.memo(CneterColumn, areEqual)
