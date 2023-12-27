import React, { useEffect, useState } from 'react'
import { TASK } from "@/common/entity/task";
import { forwardRef } from "react";
import Table, { ColumnsType } from 'antd/lib/table';
import SuperIcon from '@/pages/components/icons';
interface IProps {
    similarityList: [TASK.duplicateCheckModel];//某个学生和其他学生的相似度列表
    withdraw: () => void;
    homeworkId: number;
}
const Similarity = forwardRef((props: IProps, ref) => {
    const {
        similarityList,
        withdraw: withdraw,
        homeworkId,
    } = props;


    const columns: ColumnsType<TASK.duplicateCheckModel> = [
        {
            title: '序号',
            align: 'center',
            dataIndex: '',
            render: (dom, record, index) => {
                return (index + 1);
            },
        },
        {
            title: '学生1',
            align: 'center',
            dataIndex: 'studentName',
        },
        {
            title: '学生2',
            align: 'center',
            dataIndex: 'otherStudentName',
        },
        {
            title: '相似度',
            align: 'center',
            dataIndex: 'similarity',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record: { key: React.Key }) =>
            (
                <>
                    <a style={{ marginRight: '10px' }} onClick={() => handleView(record, homeworkId)}>查看</a>
                </>
            ),
        },
    ];
    //相似度作业查看
    const handleView = (row: any, homeworkId: number) => {
        console.info("homeworkId=",homeworkId);
        debugger;
        window.open(`/task-bank/task/review/duplicate/studentId/otherStudentId/homeworkId/${row.studentId}/${row.otherStudentId}/${homeworkId}`)
    }
   
    return (
        <div>
            <a style={{ fontSize: '24px' }} onClick={withdraw}><SuperIcon type="icon-chehui" /></a>
            <Table
                columns={columns}
                dataSource={similarityList}
                pagination={false}
            />
        </div>
    )
});
export default Similarity;