import React, { useState, useEffect } from 'react'
import { Button, Menu } from 'antd';
import '@/pages/common-course/course-common.less';
import SuperIcon from "@/pages/components/icons";
import { QUESTION_BANK } from '@/common/entity/questionbank';
import { getDDLExerciseTable } from '@/services/teacher/course/question-create';
interface IProps {
  selectSceneId: number | undefined | null;
  onInit: QUESTION_BANK.QuestionExercise | null;
}

const Verify = (props: IProps) => {
  // const [verificationList, setverificationList] = useState<QUESTION_BANK.VerificationList>();
  const {
    selectSceneId: selectSceneId,
    onInit: onInit,
  } = props;

  type tables = { id: number; label: string };
  const [buttons, setButtons] = useState<tables[]>([]);



  useEffect(() => {
    console.log("sceneid=" + selectSceneId);
    const myButtons: tables[] = [];
    if (selectSceneId) {
      getDDLExerciseTable({ sceneId: selectSceneId, exerciseId: onInit?.id == undefined ? null : onInit?.id }).then((result) => {

        console.log("setverificationList", result.obj);
        result.obj?.sceneDetailModels.map((item: QUESTION_BANK.TSceneDetailModel) => {
          console.log("id", item.id);
          myButtons.push({ id: item.id, label: item.tableName });
        })
      });

    }
    setButtons(myButtons);

  }, [selectSceneId])


  useEffect(() => {
    console.log("buttons", buttons);
  }, [buttons])




  //字段、索引、约束等
  const [activeMenu, setActiveMenu] = useState('1');
  //表切换
  const [activeKey, setActiveKey] = useState('');


  const handleMenuSelect = (key) => {
    setActiveMenu(key.key);
  };

  const handleButtonClick = (key: string) => {
    setActiveKey(key);
  };
  return (

    <div className='ddl-card'>
      {"ssss=" + buttons}
      {buttons.length>0 &&  buttons.map((btn, index) => {
        return <button
          key={btn.id}
          className={btn.label === activeKey ? 'dl-card check-button' : 'ddl-card uncheck-button'}
          onClick={() => handleButtonClick(btn.label)}
        >
          {btn.label}
        </button>
      })}
      <div className='ddl-card ddl-content'>
        <div className='ddl-card ddl-content-h'>
          <div className='ddl-card broadside' >
            <Menu
              selectedKeys={[activeMenu]}
              onSelect={handleMenuSelect}
              mode="inline"
            >
              <>
                <Menu.Item key="1">字段</Menu.Item>
                <Menu.Item key="2">约束</Menu.Item>
                <Menu.Item key="3">外键</Menu.Item>
                <Menu.Item key="4">索引</Menu.Item>
                <Menu.Item key="5">序列</Menu.Item>
              </>
            </Menu>

          </div>
          <div>

            {activeMenu === '1' && (
              <div>
                <Button><SuperIcon type="icon-jiahao" />新建字段</Button>
                <Button><SuperIcon type="icon-huifu" />一键恢复</Button>
              </div>
            )}
            {activeMenu === '2' && (

              <div>
                <Button><SuperIcon type="icon-jiahao" />新建约束</Button>
                <Button><SuperIcon type="icon-huifu" />一键恢复</Button>
              </div>
            )}
            {activeMenu === '3' && (
              <div>
                <Button><SuperIcon type="icon-jiahao" />新建外键</Button>
                <Button><SuperIcon type="icon-huifu" />一键恢复</Button>
              </div>
            )}
            {activeMenu === '4' && (
              <div>
                <Button><SuperIcon type="icon-jiahao" />新建索引</Button>
                <Button><SuperIcon type="icon-huifu" />一键恢复</Button>
              </div>
            )}
            {activeMenu === '5' && (
              <div>
                <Button><SuperIcon type="icon-jiahao" />新建序列</Button>
                <Button><SuperIcon type="icon-huifu" />一键恢复</Button>
              </div>
            )}


          </div>
        </div>
        <Button type='primary'><SuperIcon type="icon-jiahao" />新建表</Button>
        <Button><SuperIcon type="icon-bianji1" />重命名</Button>
        <Button><SuperIcon type="icon-huifu" />恢复表</Button>
        <Button><SuperIcon type="icon-icon-close1" />删除表</Button>
      </div>

    </div>
  );
};



export default Verify;