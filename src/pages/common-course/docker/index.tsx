import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Table, message, TablePaginationConfig } from 'antd';
import './index.less';
import SuperIcon from '@/pages/components/icons';
import { ColumnsType } from 'antd/lib/table';
import { EXPERIMENT_BANK } from './experimentbank';
import { listExperiment } from './experiment';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import AddExperiment from './addExperiment/newExperiment';
import ViewExperiment from './detailExperiment/viewExperiment';
interface IProps {
    courseId: string;
    studentCode: string;
}

type TableParams = {
    pagination?: TablePaginationConfig;
    orderBy?: string,
    pageNum?: number,
    pageSize?: number,
    param?: {
        courseId: string,
        experimentName: string,
    }
}
const defPage = {
    current: 1,
    pageSize: 10,
    total: 0
}
const ExperimentIndex = (props: IProps) => {
    const { courseId, studentCode } = props;
    const [experimentName, setExperimentName] = useState<string>('');  // 关键字
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: defPage
    });
    const [data, setData] = useState<{ count: number, list: EXPERIMENT_BANK.TExperiment[] }>({ count: 0, list: [] });
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [viewModalTwoVisible, setViewModalTwoVisible] = useState<boolean>(false);
    const [experimentId, setExperimentId] = useState<number>(0);
    const [order, setOrder] = useState<string>('');  // 排序关键字
    useEffect(() => {
        //查询实验列表
        getExperiments();
    }, []);

    useEffect(() => {
        getExperiments();
        console.log("刷新列表");
    }, [JSON.stringify(tableParams)]);

    useEffect(() => {
        courseId && order.length > 0 && getExperiments();
    }, [order])


    //获取在线实验列表
    const getExperiments = () => {
        const param = {
            courseId: courseId,
            experimentName: experimentName,
        }
        listExperiment(getRandomuserParams({ ...tableParams, param: param, orderBy: order })).then((res) => {
            setData({ count: res.count, list: res.list })
            setTableParams({ ...tableParams, ...res })
            console.info('tableParams', { ...tableParams, ...res });
        });
    }
    const getRandomuserParams = (params: TableParams) => ({
        pageSize: params.pagination?.pageSize,
        pageNum: params.pagination?.current,
        ...params,
    });

    /**
    * 新建实验
    */
    const clickCreateExperiment = () => {
        setExperimentId(0);
        setViewModalVisible(true);
    }

    /**
       * 实验名称关键字change
       * @param value 
       * @returns 
       */
    const onChangeKeyWord = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExperimentName(e.target.value.trim())
    };

    /**
   * 点击筛选按钮
   */
    const queryButtonClick = () => {
        //校验是否选择题型
        getExperiments();
    }

    const columnsExperiment: ColumnsType<EXPERIMENT_BANK.TExperiment> = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: '12%',
            render: (value, record, index) => {
                return (index + 1);
            },
        },
        {
            title: '实验名称',
            dataIndex: 'experimentName',
            align: 'center',
            key: 'experimentName',
            width: '150px',
            sorter: true,
        },
        {
            title: '镜像名称',
            dataIndex: 'imageName',
            align: 'center',
            key: 'imageName',
            width: '150px',
            sorter: true,

        },
        {
            title: '开关状态',
            dataIndex: 'releaseStatus',
            align: 'center',
            key: 'releaseStatus',
            width: '150px',
            sorter: true,
            render: (item, record) => {
                return record.releaseStatus == true ? '发布' : '未发布'
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            key: 'createTime',
            width: '200px',
            sorter: true,
        },

        {
            title: '更新时间',
            dataIndex: 'updateTime',
            align: 'center',
            key: 'updateTime',
            width: '200px',
            sorter: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
            width: '15%',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={(e) => edit(record,e)}><SuperIcon type="icon-bianji1" />编辑</a>
                    <a onClick={() => del(record)}><SuperIcon type="icon-icon-cuowu21" />删除</a>
                </Space>
            )
        },
    ];
    //编辑
    const edit = (record: any,e: any) => {
        e.stopPropagation(); // 阻止事件冒泡，确保只触发删除按钮的点击事件
        setExperimentId(record.id);
        setViewModalVisible(true);
    }
    //删除
    const del = (record: any) => {

    }
    //关闭
    const onCancel = () => {
        setViewModalVisible(false);
        getExperiments();
    }
    //查看页面关闭
    const onCancelTwo= () => {
        setViewModalTwoVisible(false);
    }
    //翻页
    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: SorterResult<EXPERIMENT_BANK.TExperiment>,
    ) => {
        if (JSON.stringify(pagination) != JSON.stringify(tableParams.pagination)) {
            //调用hook刷新,切换当前页、切换每页数量
            setTableParams({ ...tableParams, pageNum: pagination.current, pageSize: pagination.pageSize, pagination: pagination, ...filters, ...sorter, });
        } else {
            // 排序，order: "ascend" field: "createTime" ascend/descend
            const order = `${sorter.field} ${sorter.order ? sorter.order.substring(0, sorter.order.length - 3) : ''}`;
            setOrder(order);
        }
    };
    //行点击
    const rowClick=(record: any) => {
        console.log('执行了行点击');
        setExperimentId(record.id);
        setViewModalTwoVisible(true);
    }
    return (
        <div className="experiment">
            <div className='experiment-bank'>
                <div className="title-4">实验</div>
                <div>
                    <div className="flex experiment-tool">
                        <div className="row-1">
                            <div className='left'>
                                <Button type="primary" onClick={() => { clickCreateExperiment() }}><SuperIcon type="icon-icon-edit-3" />新建实验</Button>
                            </div>
                            <div className='right'>
                            </div>
                        </div>
                        <div className="row-2">
                            <label>实验名称</label>
                            <Input placeholder="实验名称" onChange={onChangeKeyWord} style={{ width: 130, marginRight: '20px' }} />
                            <Button type="primary" onClick={() => { queryButtonClick() }}>筛选</Button>
                        </div>
                    </div>
                </div>

                <div className="experiment-tool">

                    <Table
                        columns={columnsExperiment}
                        onRow={(record) => {return {onClick: event => {rowClick(record)},}}}
                        dataSource={data.list}
                        pagination={tableParams.pagination}
                        onChange={handleTableChange}
                    />
                </div>
            </div>
            <Modal
                bodyStyle={{ padding: "20px 20px 24px 20px" }}
                width="100%"
                style={{ position: 'fixed', top: '0', left: '0', maxWidth: '100vw' }} // 设置模态框的高度占满屏幕
                maskClosable={true}
                destroyOnClose
                title="新增实验"
                footer={null}
                open={viewModalVisible}
                onCancel={onCancel}
            >
                <AddExperiment courseId={courseId} onCancel={onCancel} studentCode={studentCode} experimentId={experimentId}></AddExperiment>
            </Modal>
            <Modal
                bodyStyle={{ padding: "20px 20px 24px 20px" }}
                width="100%"
                style={{ position: 'fixed', top: '0', left: '0', maxWidth: '100vw' }} // 设置模态框的高度占满屏幕
                maskClosable={true}
                destroyOnClose
                title="实验"
                footer={null}
                open={viewModalTwoVisible}
                onCancel={onCancelTwo}
            >
              { experimentId && <ViewExperiment courseId={courseId} onCancel={onCancelTwo} studentCode={studentCode} experimentId={experimentId}></ViewExperiment>}
            </Modal>
        </div>
    );
};

export default ExperimentIndex;
