import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Tooltip } from 'antd';
// import type { ProColumns } from '@ant-design/pro-table';
import * as APP from '@/app';
import { QUESTION_BANK } from '@/common/entity/questionbank';

const areEqual = (prevProps, nextProps) => {
  //return false 刷新页面
  // console.log( prevProps, nextProps)
  if (prevProps.resultSetModalVisible === nextProps.resultSetModalVisible
  ) {
    return true
  } else {
    return false
  }
}

interface TableColumns {
  title: React.ReactNode | string;
  dataIndex: number;
  key: number;
  align: string;
  width?: number;
};

interface UserFormProps {
  onCancel: (flag?: boolean, formVals?: any) => void;
  resultSetModalVisible: boolean;
  // columnList: string[];
  // datatype: any;
  functionResult: QUESTION_BANK.ResultSetInfo[];
};

const ResultSetModalFunction: React.FC<UserFormProps> = (props) => {
  const {
    onCancel: setResultSetModalVisible,
    resultSetModalVisible,
    // columnList,
    // datatype,
    functionResult,
  } = props;

  const [columns, setColumns] = useState<TableColumns[]>([]);//table columns

  useEffect(() => {
    handleButtonClick(0);
  }, [props]);

  const setTableContent = () => {
    if (functionResult[selectedTableIndex]?.columnList.length > 0) {
      console.log('setTableContent columnList = ', functionResult[selectedTableIndex]?.columnList);
      console.log('setTableContent datatype = ', functionResult[selectedTableIndex]?.dataTypeAndImgList);

      let tableColumns: TableColumns[] = [];
      functionResult[selectedTableIndex]?.columnList.map((item: string, index: number) => {
        const title = (
          <Tooltip title={functionResult[selectedTableIndex]?.dataTypeAndImgList[index].dataType}>
            {
              functionResult[selectedTableIndex]?.dataTypeAndImgList[index].imgUrl ? <span><img src={`${APP.request.prefix}${functionResult[selectedTableIndex]?.dataTypeAndImgList[index].imgUrl}`} />&nbsp;</span> : null
            }
            {item}
          </Tooltip>
        );

        tableColumns.push({
          title: title,
          dataIndex: index,
          key: index,
          align: 'center',
          width: 100
        });
      });
      setColumns(tableColumns);
    }

  };
  const [selectedTableIndex, setSelectedTableIndex] = useState(0);
  const handleButtonClick = (index) => {
    setSelectedTableIndex(index);
    setTableContent();
  };
  return (
    <Modal
      className="exercise-result"
      width={1000}
      title="结果集"
      open={resultSetModalVisible}
      onCancel={() => { setResultSetModalVisible(false) }}
      footer={[<Button key='closeButton' onClick={() => { setResultSetModalVisible(false) }}>关闭</Button>]}
    >
      <div>
        <div>
          {functionResult.map((label, index) => (
            <Button
              key={index}
              type={selectedTableIndex === index ? 'primary' : 'default'}
              onClick={() => handleButtonClick(index)}
            >
              {"结果集"+(index+1)}
            </Button>
          ))}
        </div>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={functionResult[selectedTableIndex]?.dataList}
        pagination={false}
        rowKey={(record: any) => record[0]}
        scroll={{ x: 850, y: 350 }}
      />
    </Modal>
  );
}

// export default ResultSetModal;
export default React.memo(ResultSetModalFunction, areEqual)
