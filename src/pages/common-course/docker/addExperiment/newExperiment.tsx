import React, { useEffect, useState } from 'react';
import { Button, Input, message, Form, Select, Switch } from 'antd';
import './index.less';
import * as APP from '@/app';
import TinyMCEEditor from '../tinymceFolder/TinyMCEEditor';
import { getExperiment, getImages, saveExperiment } from '../experiment';
import { EXPERIMENT_BANK } from '../experimentbank';
interface IProps {
    courseId: string;//课程id
    studentCode: string;//学号
    experimentId: number | undefined;//实验id
    onCancel: () => void;
}


const AddExperiment = (props: IProps) => {
    const { courseId, studentCode, experimentId, onCancel } = props;
    const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 8 } };
    const [form] = Form.useForm();
    const [formVals, setFormVals] = useState<EXPERIMENT_BANK.TExperimentInfo>();
    const [editorContent, setEditorContent] = useState(''); // 用于存储编辑器内容的状态
    const [editorContentValue, setEditorContentValue] = useState('');
    const [images, setImages] = useState<EXPERIMENT_BANK.TExperimentInfo[]>([{}]);//镜像列表
    useEffect(() => {
        listImages();//查询镜像列表
        initExperiment(experimentId);//根据实验id查询实验详情
    }, []);

    //监控内容变化
    useEffect(() => {
        const repEditorContent = editorContentValue;
        const newContent = repEditorContent.replace(`${APP.request.prefix}`, `${APP.initialStateConfig.HOST}`);
        form.setFieldsValue({
            experimentContent: newContent
        });
    }, [editorContentValue]);



    //编辑时初始化实验信息
    const initExperiment = (experimentId: any) => {
        if (experimentId) {
            //调用后台接口查询表单信息
            getExperiment(experimentId,studentCode).then((res) => {
                if (res.success) {
                    const info = res.obj;
                    const content = { ...res.obj, experimentContent: info.experimentContent?.replace(`${APP.initialStateConfig.HOST}`, `${APP.request.prefix}`) };
                    console.log("resForm", content);
                    setFormVals(content);
                    form.setFieldsValue(content);
                    content.experimentContent && setEditorContent(content.experimentContent);
                } else {
                    message.error(res.message);
                }
            }
            )
        }
    }
    //查询镜像列表
    const listImages = () => {
        getImages().then((res) => {
            if (res.success) {
                setImages(res.obj);
            } else {
                message.error(res.message);
            }
        })
    }

//富文本编辑器内容发生变化
    const handleEditorChange = (content: any) => {
        setEditorContentValue(content); // 当编辑器内容发生变化时更新状态
    };



    // TinyMCE 编辑器的配置项
    const editorConfig = {
        initialValue: editorContent, // 初始化编辑器的内容
        onEditorChange: handleEditorChange, // 编辑器内容变化时的回调函数
        experimentId: experimentId,//实验id作为key

        // 更多配置项可以添加在这里
    };
    //镜像选中时触发
    const handleImageSelect = (value) => {
        // 根据选中的值查找对应的镜像对象
        const selectedImage = images.find((image) => image.id === value);

        if (selectedImage) {
            // 将其他属性值放入表单字段中
            form.setFieldsValue({
                imagePort: selectedImage.imagePort,
                courseId: courseId,
                imageName: selectedImage.imageName
            });
        }
    }
    //表单提交
    const handleSubmit = (values: any) => {
        // 在这里执行提交操作，可以将数据发送到服务器等
        const newformValus = { ...formVals, ...values }
        saveExperiment(newformValus).then((res) => {
            if (res.success) {
                message.success('保存成功');
                onCancel();

            } else {
                message.error(res.message);
            }
        })

    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    //取消
    const cancleSave = () => {
        onCancel();
    }
    return (
        <div className="experiment" style={{ height: 'calc(100vh - 100px)', width: '100%' }} >
            <div className="showTerminal">
                <div className="left hide-scrollbar">
                    <div>
                        <h2>新增实验</h2>
                        <div>
                            <Form
                                {...formLayout}
                                initialValues={formVals}
                                form={form}
                                onFinish={handleSubmit}
                            >
                                <Form.Item label="实验名称" name="experimentName" rules={[{ required: true, message: '实验名称必填！' }]} >
                                    <Input placeholder="请输入实验名称" />
                                </Form.Item>
                                <Form.Item label="镜像" name="imageId" rules={[{ required: true, message: '请选择镜像！' }]} >
                                    <Select placeholder="请选择镜像" onChange={handleImageSelect}>
                                        {images.map(item => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.imageName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="开放" name="releaseStatus" required valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                                <Form.Item name="imagePort" >
                                    <Input hidden />
                                </Form.Item>
                                <Form.Item name="imageName" >
                                    <Input hidden />
                                </Form.Item>
                                <Form.Item name="experimentContent" >
                                    <Input hidden />
                                </Form.Item>
                                <Form.Item name="courseId" >
                                    <Input hidden />
                                </Form.Item>
                                <Form.Item {...tailLayout}>
                                    <Button htmlType="submit" type="primary">
                                        保存
                                    </Button>
                                    <Button htmlType="button" style={{ margin: '0 8px' }} onClick={cancleSave}>
                                        取消
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>

                <div className="right hide-scrollbar" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                <TinyMCEEditor {...editorConfig} />
                </div>

            </div>

        </div>
    );
};

export default AddExperiment;
