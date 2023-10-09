import React, { useEffect, useState } from 'react';
import {  message } from 'antd';
import DockerTerminal from '../DockerTerminal';
import * as APP from '@/app';
import './index.less';
import { getExperiment,startContainer } from '../experiment';
import { EXPERIMENT_BANK } from '../experimentbank';
interface IProps {
    courseId: number;
    studentCode: string;
    experimentId: number | undefined;//实验id
    onCancel: () => void;
}



const ViewExperiment = (props: IProps) => {
    const { courseId, studentCode, experimentId } = props;

    const [data, setData] = useState<EXPERIMENT_BANK.TExperimentInfo>();
    const [dockerRun, setDockerRun] = useState(false);
    useEffect(() => {
        initExperiment(experimentId);//根据实验id查询实验详情
    }, []);

    useEffect(() => {
       data && initContainer(courseId, studentCode, data);
    }, [data]);

    const initContainer = async (courseId: number, studentCode: string, data: EXPERIMENT_BANK.TExperimentInfo) => {
        console.info(courseId, studentCode);
        const param = {
            courseId: courseId,
            imageName: data.imageName,
            imagePort: data.imagePort,
            studentCode: studentCode,
            imageId: data.imageId,
        }
        const result = await startContainer(param)
        if (result.success) {
            setDockerRun(true);
        } else {
            message.error(result.message);
            return;
        }
    };
    
    //查询实验信息
    const initExperiment = (experimentId: any) => {
        if (experimentId) {
            //调用后台接口查询表单信息
            getExperiment(experimentId,studentCode).then((res) => {
                if (res.success) {
                    const info = res.obj;
                    const content = { ...res.obj, experimentContent: info.experimentContent?.replace(`${APP.initialStateConfig.HOST}`, `${APP.request.prefix}`) };
                    setData(content);
                } else {
                    message.error(res.message);
                }
            }
            )
        }
    }
 

    return (
        <div className="experiment" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            <div className="showTerminal">
                <div className="left hide-scrollbar">
                    <div>
                        <h2>实验文档</h2>
                        {data && <div dangerouslySetInnerHTML={{ __html: data?.experimentContent }} />}
                    </div>
                </div>
                <div className="right hide-scrollbar">
                    {dockerRun&&<DockerTerminal containerId={data?.containerId}></DockerTerminal>}
                </div>

            </div>
        </div>
    );
};

export default ViewExperiment;
