import { Card, Button, Tag, Space } from 'antd';
import { isNotEmptyBraft } from '@/utils/utils';
import { getKnowledgeColor } from '@/utils/utils';
import Highlight from 'react-highlight';
import 'highlight.js/styles/magula.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Judge from './components/questionType/judge'
import Single from './components/questionType/single'
import Multiple from './components/questionType/multiple'
import React from 'react';
interface IProp {
    courseId: number;
    changeExercise: (value: boolean) => void;
    exercise: API.StuAnswerExerciseInfo;
    topButtonDisabled: boolean;
    nextButtonDisabled: boolean;
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

const CneterColumn = (props: IProp) => {
    const {
        changeExercise,
        exercise,
        topButtonDisabled,
        nextButtonDisabled
    } = props;
    console.log('exercise:',exercise)
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
                        <span>[ 单选题 ]</span>
                    </Space>
                    <div className="title-3" style={{ marginTop: 20 }}>习题描述</div>
                    {
                        isNotEmptyBraft(exercise?.exerciseDesc) ?
                            <div className="exercise-desc" dangerouslySetInnerHTML={{ __html: exercise?.exerciseDesc }} />
                            : <div className="exercise-desc">无</div>
                    }
                    <div style={{ clear: 'both' }}></div>
                    {/* <Single data={exercise}></Single> */}
                    <Multiple data={exercise}></Multiple>
            
                    <div style={{ clear: 'both' }} />

                    <div className="title-3" style={{ margin: '30px 0 16px 0' }}>相关知识点</div>
                    <div>
                        {exercise?.knowledgeNames.map((ele: string, index: number) => {
                            return <Tag key={index} color={getKnowledgeColor()[index]}>{ele}</Tag>
                        })}
                    </div>
                    <div style={{ clear: 'both', }} />
                    <Button type="primary" size="small"
                    style={{float: 'right'}}
                                className="right-title-button"
                                onClick={() => {}}
                            >
                                提交答案
                            </Button>
                </Card>
            </div>
        </div>
    )
}
export default React.memo(CneterColumn, areEqual)