import React,{ useEffect, useState, useRef } from 'react';
import { Modal, message, Space, notification, Row, Col, Button } from 'antd';
import { getExerciseInfoList, getExerciseInfo } from '@/services/teacher/course/exercise';
import { submitAnswer, stuTestRunAnswer } from '@/services/teacher/course/score';
import './index.less';
import LeftColumn from '@/pages/stu/answer/left';
import RightColumn from '@/pages/stu/answer/right';
import CenterColumn from '@/pages/stu/answer/center';
import { LoadingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import StudentMenu from '../study/menu';
import ResultSetModal from '@/pages/course/exercise/components/ResultSetModal';
import { querySclass } from '@/services/teacher/clazz/sclass';
import Cookies from 'js-cookie';
import { exerciseAnswerNotifiedExcetion, exerciseAnswerNotifiedSucc, exerciseAnswerNotifiedFail } from '@/pages/components/exercise-answer-notification'
import { API } from '@/common/entity/typings';
import ResultSetModalFunction from '@/pages/common-course/question/component/type/components/ResultSetModalFunction';
import { QUESTION_BANK } from '@/common/entity/questionbank';
import SuperIcon from '@/pages/components/icons';
/**
 * 课程-SQL练习题-开始答题
 * @param props
 * @returns
 */
const Answer = (props: any) => {
  let courseId = -1;
  let clazzId = -1;
  let exerciseId = -1;
  let knowId = -1;
  try {
    exerciseId = Number(props.match!.params.exerciseId);
    courseId = Number(props.match!.params.courseId);
    clazzId = Number(props.match!.params.clazzId);
    knowId = Number(props.match!.params.knowId);
  } catch (error) {
    return;
  }


  const [classIsEndVisible, setClassIsEndVisible] = useState<boolean>(false); //课程结束提示弹窗
  const [isMessageInfoModalVisible, setIsMessageInfoModalVisible] = useState<boolean>(false); //答题提示弹窗
  const [isWaitModalVisible, setIsWaitModalVisible] = useState<boolean>(false);
  const [executeResult, setExecuteResult] = useState<API.SubmitResult>();
  const [submitType, setSubmitType] = useState<number>(0); //0提交；1测试
  const [exercise, setExercise] = useState<API.StuAnswerExerciseInfo>();
  const [exerciseList, setExerciseList] = useState<API.StuAnswerExerciseInfo[]>([]); //全部习题，用于上下题切换不再重复请求
  const [topButtonDisabled, setTopButtonDisabled] = useState<boolean>(true);
  const [nextButtonDisabled, setNextButtonDisabled] = useState<boolean>(true);
  const [isCanAnswer, setIsCanAnswer] = useState<boolean>(false);
  let timer: any = useRef(); //计时器
  const [usageTime, setUsageTime] = useState<number>(0);
  const [uploading, setUpLoading] = useState<boolean>(false);
  const [dowmloading, setDownLoading] = useState<boolean>(false);
  const [resultSetFunModalVisible, setResultSetFunModalVisible] = useState<boolean>(false);
  const [functionResult, setFunctionResult] = useState<QUESTION_BANK.ResultSetInfo[]>([]);
  // 清除定时器
  const stopTimer = () => {
    clearInterval(timer.current);
  };
  // 重新统计时间
  const restartTimer = () => {
    stopTimer();
    setUsageTime(0);
    timer.current = setInterval(() => {
      setUsageTime((n) => {
        const max = 60 * 5; //答题上限时间
        if (n >= max - 1) stopTimer(); //时间超过答题上限，那么暂停计时
        return n + 1;
      });
    }, 1000);
  };

  let messageInfoModalTimer: any = useRef(); //计时器
  let showTime = 6;

  useEffect(() => {
    //查询班级信息
    querySclass(clazzId).then((result) => {
      // ````
      if (result && result.success) {
        if (result.obj.isEnd === 1) {
          //isCanAnswer=false 不可以答题
          setIsCanAnswer(false);
          //课程结束，提示不可以答题
          setClassIsEndVisible(true);
        } else {
          //isCanAnswer=true 可以答题
          setIsCanAnswer(true);
          const showMeg = Cookies.get('show-answer');
          console.log('showMeg', showMeg);
          if (showMeg === undefined || showMeg === null) {
            //可以答题，给出答题提示
            setIsMessageInfoModalVisible(true);
            Cookies.set('show-answer', 'yes', { expires: 1 });
          }
          messageInfoModalTimer.current = setInterval(() => {
            showTime -= 1;
            if (showTime <= 0) {
              clearInterval(messageInfoModalTimer.current);
              setIsMessageInfoModalVisible(false);
            }
          }, 1000);
        }
      }
    });
    initFun(exerciseId);
    restartTimer();
  }, []);

  useEffect(() => {
    change(exerciseId);
  }, [exerciseId]);

  const initFun = (exerciseId: number) => {
    //根据课程id，查询全部习题，用于题目上下切换
    getExerciseInfoList(clazzId, courseId, knowId).then((result: any) => {
      console.log('initFun', result);
      if (result.obj) {
        setExerciseList(result.obj);
        const index = result.obj.findIndex(
          (item: API.StuAnswerExerciseInfo) => item.exerciseId === exerciseId,
        );
        console.log('result[index]', result[index]);
        setButtons(index, result.obj.length);
      }
    });
  };

  const QueryExercise = () => {
    getExerciseInfo(clazzId, courseId, exerciseId).then((result: any) => {
      if (result.obj) {
        setExercise(result.obj);
        setUpLoading(false);
        setDownLoading(false);
      }
    });
  };

  const change = (exerciseId: number) => {
    QueryExercise();
    const index = exerciseList.findIndex(
      (item: API.ExerciseRecord) => item.exerciseId === exerciseId,
    );
    setButtons(index, exerciseList.length);
    //清空评测结果
    setExecuteResult(undefined);
  };

  /**
   * 切换习题，上一题和下一题
   * @param next 是否下一题
   */
  const changeExercise = (next: boolean, direct: string) => {
    if (direct == 'up') {
      setUpLoading(true);
    } else {
      setDownLoading(true);
    }


    const index = exerciseList.findIndex(
      (item: API.ExerciseRecord) => item.exerciseId == exerciseId,
    );
    console.log('next index exerciseList', next, index, exerciseList.length);
    //校验题目是否可以上下题切换
    if (index === 0 && !next) {
      //如果是第一题，并且点击的上一题
      message.info('已经到顶了...');
      setButtons(index, exerciseList.length);
      return;
    } else if (exerciseList.length === index + 1 && next) {
      //如果是最后一题，并且点击了下一题
      message.info('已经到底了...');
      setButtons(index, exerciseList.length);
      return;
    }

    //重置答题耗时
    restartTimer();
    if (next) {
      history.push(
        `/stu/course/exercise/${courseId}/${clazzId}/${knowId}/${exerciseList[index + 1].exerciseId}`,
      );
    } else {
      history.push(
        `/stu/course/exercise/${courseId}/${clazzId}/${knowId}/${exerciseList[index - 1].exerciseId
        }`,
      );
    }
  };

  /**
   * 上下题目切换，对按钮的处理
   */
  const setButtons = (index: number, exerciseListLength: number) => {
    console.log('setButtons index,exerciseList', index, exerciseListLength);
    if (exerciseListLength <= 1) {
      //只有1道题，全部禁用
      setTopButtonDisabled(true);
      setNextButtonDisabled(true);
    } else if (index === 0) {
      setTopButtonDisabled(true);
      setNextButtonDisabled(false);
    } else if (exerciseListLength === index + 1) {
      setTopButtonDisabled(false);
      setNextButtonDisabled(true);
    } else {
      setTopButtonDisabled(false);
      setNextButtonDisabled(false);
    }
  };
  // 测试运行
  const testRunAnswer = async (value: { answer: string; usageTime: number; }) => {
    //wait窗口
    setIsWaitModalVisible(true);
    //显示窗口为测试运行
    setSubmitType(1);
    //测试提交答案
    stuTestRunAnswer({ ...value, exerciseId: exerciseId, exerciseType: exercise!.exerciseType }).then((result: any) => {
      setIsWaitModalVisible(false);
      if (result.success) {
        if (result.obj) {
          //函数
          if (exercise!.exerciseType == 9) {
            setFunctionResult(result.obj.functionResult);
            setResultSetFunModalVisible(true);
          } else if (exercise!.exerciseType == 9&&!result.obj.select) {
            message.success("运行成功");
            return;
          } else {
            //非函数
            setExecuteResult(result.obj);
            if (result.obj.executeRs && Object.keys(result.obj.studentResultMap).length == 3) {
              setColumnList(result.obj.studentResultMap.column);
              setDatatype(result.obj.studentResultMap.datatype);
              setResultSet(result.obj.studentResultMap.result);
              setResultSetModalVisible(true);
            }
          }

        }
      } else {
        message.error(result.message);
      }
    });
  };
  /**
   * 答题结果提示
   * @param type
   * @param scoreRs
   */
  const openNotification = (type: number, scoreRs: boolean) => {
    // type: -1=>出错,0=>答案错误,1=>答案正确
    if (type == -1) {
      exerciseAnswerNotifiedExcetion(`习题${exercise?.exerciseId} : 提交失败 ! 请稍后重试`);
    } else if (type == 0) {
      exerciseAnswerNotifiedFail(`习题${exercise?.exerciseId} : 评阅完成 , 回答错误`);
    } else {
      exerciseAnswerNotifiedSucc(`习题${exercise?.exerciseId} : 评阅完成 , 回答正确`);
    }
  };

  // 提交答案
  const onFinish = async (value: { answer: string; usageTime: number }) => {
    //wait窗口
    setIsWaitModalVisible(true);
    //显示窗口为测试运行
    setSubmitType(0);
    // 停止计时器
    clearInterval(timer.current);
    //提交答案

    submitAnswer({ ...value, exerciseId: exerciseId, sclassId: clazzId, exerciseType: exercise!.exerciseType }).then((result: any) => {
      setIsWaitModalVisible(false);
      if (result.success) {
        // if(!result.obj.select){
        //   message.success("提交成功");
        // return;
        // }
        setExecuteResult(result.obj);
        if (result.obj.scoreRs) {
          openNotification(1, true);
        } else {
          openNotification(0, false);
        }
      } else {
        message.error(result.message);
      }
      initFun(exerciseId);
      restartTimer();
    });
  };
  const menuProps = { active: 'exercise', clazzId: clazzId, courseId: courseId };

  const [resultSetModalVisible, setResultSetModalVisible] = useState<boolean>(false);
  const [columnList, setColumnList] = useState([]);
  const [datatype, setDatatype] = useState([]);
  const [resultSet, setResultSet] = useState([]);
  const backup=()=>{
     history.push(`/stu/course/knowledge/exercise/${courseId}/${clazzId}/${knowId}`)
     //history.go(-1);
  }
  const customCloseIcon = <SuperIcon type="icon-chehui" style={{fontSize: '24px',color: '#00CE9B', marginRight: '15px' }}/>;
  return (
    <div>
    <div style={{float: 'right',marginRight: '20px'}}>
    <a onClick={backup}>{customCloseIcon}</a>
    </div>
    <div className="flex stu-answer">
      <StudentMenu {...menuProps} />
      {(exercise?.exerciseType == 1 || exercise?.exerciseType == 2 || exercise?.exerciseType == 3 || exercise?.exerciseType == 4 || exercise?.exerciseType == 5) ?
        <Row className="content">
          <Col span={24} className="page-container">
            <CenterColumn
              clazzId={clazzId}
              courseId={courseId}
              exercise={exercise!}
              uploading={uploading}
              dowmloading={dowmloading}
              usageTime={usageTime}
              onFinish={(value: { answer: string; usageTime: number }) => onFinish(value)}
              changeExercise={(next: boolean, direct: string) => changeExercise(next, direct)}
              topButtonDisabled={topButtonDisabled}
              nextButtonDisabled={nextButtonDisabled}
            ></CenterColumn>
          </Col>
        </Row>
        :
        <Row className="content">
          <Col span={12} className="page-container">
            <LeftColumn
              courseId={courseId}
              exercise={exercise!}
              uploading={uploading}
              dowmloading={dowmloading}
              changeExercise={(next: boolean, direct: string) => changeExercise(next, direct)}
              topButtonDisabled={topButtonDisabled}
              nextButtonDisabled={nextButtonDisabled}
            />
          </Col>
          <Col span={12} className="page-container">
            <RightColumn
              testRunAnswer={(value: { answer: string; usageTime: number }) => testRunAnswer(value)}
              onFinish={(value: { answer: string; usageTime: number }) => onFinish(value)}
              submitType={submitType}
              executeResult={executeResult}
              usageTime={usageTime}
              stuAnswer={exercise?.stuAnswer || ''}
              isCanAnswer={isCanAnswer}
              exerciseId={exercise?.exerciseId}
            />
          </Col>
        </Row>
      }



      <Modal
        width={250}
        bodyStyle={{ top: 24, right: 0 }}
        closable={false}
        open={isWaitModalVisible}
        maskClosable={false}
        footer={null}
      >
        <Space>
          <LoadingOutlined />
          验证答案中，请稍后......
        </Space>
      </Modal>

      {/* 结果集 */}
      <ResultSetModal
        onCancel={() => {
          setResultSetModalVisible(false);
        }}
        resultSetModalVisible={resultSetModalVisible}
        columnList={columnList}
        datatype={datatype}
        resultSet={resultSet}
      />
      {/* 结果集 */}
      <ResultSetModalFunction
        onCancel={() => { setResultSetFunModalVisible(false) }}
        resultSetModalVisible={resultSetFunModalVisible}
        functionResult={functionResult}
      />
      <Modal
        width={600}
        title="答题注意事项"
        open={isMessageInfoModalVisible}
        onCancel={() => {
          setIsMessageInfoModalVisible(false);
        }}
        footer={null}
      >
        <div>
          <p>在使用平台进行SQL语句评测时请注意以下几点，以减少出现无法通过评测的情况：</p>
          <p>① 请严格按照题目要求提交SQL语句</p>
          <p>② 没有特别说明的，不可随意为结果字段起别名</p>
          <p>③ 严格按照题目中要求的结果字段顺序，不可随意改变结果字段顺序</p>
          <p>④ 没有特别说明的，不可随意为结果集排序</p>
        </div>
      </Modal>

      <Modal
        width={600}
        title="答题注意事项"
        open={classIsEndVisible}
        onCancel={() => {
          setClassIsEndVisible(false);
        }}
        footer={null}
      >
        <div>
          <p>课程已结束，不能再进行答题。</p>
        </div>
      </Modal>
    </div>
    </div>
  );
};

export default Answer;
