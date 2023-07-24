// @ts-ignore
/* eslint-disable */
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { API } from '@/common/entity/typings';

declare namespace QUESTION_BANK {
  // 地址栏传递参数param类型
  interface IParams {
    courseId?: string;
    exerciseId?: string;
    parentId?: string;
  }
  // 题库知识点对象
  interface Knowledge {
    knowledgeId: number;
    progress: number;
    name?: string;  // 可插入的文字名称定义
  }
  //题库表格请求参数
  type QuestionBankListParam = {
    orderBy: string,
    pageNum: number,
    pageSize: number,
    param: {
      parentId: number,
      courseIdList: number[],
      knowledgeIdList: number[],
      exerciseTypeList: number[]
    }
  }

  //查询习题列表
  type ExerciseRecord = {
    exerciseCount: number;//总共多少题，包含文件内
    pageList: API.PageHelper<QuestionBankRecord>;//分页后的习题列表
  }
  //题库表格内容
  type QuestionBankRecord = {
    current: number,//当前页
    pageSize: number,//每页数据量
    list: T[],
    id: number,//习题id
    courseId: number,//课程id
    parentId: number,//父类id
    sceneId: number,//场景id
    sceneName: string,//场景名称
    modelName: string;
    elementType: number,//类型:0:试题，1:文件夹
    exerciseName: string,//试题名称  /文件夹名称
    exerciseDesc: string,//试题描述
    authType: number,//试题权限：1：私有2：共享
    exerciseType: number,//试题类型：1：单选2：多选3：判断4：填空5：简答6：数据库题
    exerciseLevel: number,//试题难度 1：简单 2：一般3：困难
    stem: string,//题干
    standardAnswser: number,//选择题为prefix，多选逗号隔开。判断题答案只有true false,简答程序题答具体案描
    answer: string,//数据库答案（备用兼容历史数据）
    exerciseAnalysis: string,//答案解析
    createUser: string,//
    createTime: number,//
    knowledgeIdList: number,//知识点ID集合
    exerciseTypeList: number,//题型集合
    courseIdList: number,//课程id集合
    sortField: number,//排序字段
    sortType: number,//排序类型 asc desc	
    childCount: number,//如果是文件夹，子节点的题目总数
    publishStatus?: number // 是否已发布 1: 发布 0: 未发布(编辑作业库存在)
  }
  //习题详情
  type QuestionExercise = {
    id: number,  // 习题id
    courseId: number,//课程id
    parentId: number,//父类id
    sceneId: number,//场景id
    sceneName: string,//场景名称
    elementType: number,//类型:0:试题，1:文件夹
    exerciseName: string,//试题名称  /文件夹名称
    exerciseDesc: null,//--暂无--  
    authType: number,//试题权限：1：私有2：共享
    exerciseType: number,//试题类型：1：单选2：多选3：判断4：填空5：简答6：数据库题
    exerciseLevel: number,//试题难度 1：简单 2：一般3：困难
    stem: string,//题干editor
    standardAnswser: string,//选择题为prefix，多选逗号隔开。判断题答案只有true false,简答程序题答具体案描  "A"
    answer: null,//--暂无--   
    exerciseAnalysis: string,//答案解析
    sortNum: number, // 序号    
    createUser: number,//创建人 3 
    createTime: string;//创建时间   
    knowledge: unknown,//--暂无-- 
    exerciseTypeList: unknown,//--暂无-- 
    courseIdList: unknown,//--暂无-- 
    sortField: unknown,//--暂无-- 
    sortType: unknown,//--暂无-- 
    childrens: unknown,//--暂无-- 
    exerciseInfos: QuestionExerciseOption[],//习题选项
    knowledges: Knowledge[];//习题知识点
    exerciseScore: unknown,//--暂无-- 
    childCount: unknown,//--暂无-- 
    exerciseOrder: unknown,//--暂无--
    bandingModel: boolean,
    options: string[] | QuestionExerciseOption[];//临时项，转换exerciseInfos
    stemEditor: EditorState | string;//临时项，转换stem
    exerciseAnalysisEditor: EditorState | string;//临时项，转换exerciseAnalysis
    standardAnswserEditor: EditorState | string;//临时项，转换standardAnswser
    // prefix: string, // 选项前缀
    // content: string,  // 选项内容
    bandingModel: boolean;  // 是否已经引用
    exerciseScore?: string; // 习题分数
    modelId?: number; // 模板id
    verySql?: string;//校验语句


  }
  //题库习题选项
  type QuestionExerciseOption = {
    id: number,  // 自增id
    exerciseId: number,//习题id
    prefix: string,//选项
    content: string,//选项内容 "<p>a</p>"
  }
  // 题库习题设置为练习/取消练习
  type QuestionSettingParam = {
    ids: number[],
    exerciseStatus: number,
    showAnswer: number
  }

  //学生练习提交
  type SubmitAnswer = {
    exerciseId: number,
    sclassId: number,
    exerciseType: number,
    verySql: string,
    sceneId: number,
    answer: string,
    usageTime: number,
  }

  type TSceneDetail = {
    id?: number,
    sceneId?: number,
    tableName?: string,
    tableDetail?: string,
    tableDesc?: string
  }

  type TCheckDetail = {
    id?: number,
    sceneDetailId?: number,
    exerciseId?: number,
    checkStatus?: string,
    tableName?: string,
    describe?: string

  }

  type TCheckDetailSave={
    detail?: TCheckDetail,
    sceneId?: number
  }
  //用户最终页面显示
  type TSceneDetailDisplay = {
    id: number,
    sceneId: number,
    tableName: string,
    tableDetail: string,
    tableDesc: string,
    detail: TCheckDetail
  }

  type TSceneField = {
    id?: number,
    sceneDetailId?: number,
    sortNum?: number,
    fieldType?: string,
    fieldLength?: number,
    fieldDefault?: string,
    fieldNonNull?: boolean,
    fieldComment?: string,
    fieldName?: string,
    autoIncrement?: boolean,
    decimalNum?: number,
    primaryKey?: boolean
  }

  type TCheckField = {
    id?: number,
    sceneFieldId?: number,
    checkStatus?: string,
    sortNum?: number,
    fieldType?: string,
    fieldLength?: number,
    fieldDefault?: string,
    fieldNonNull?: boolean,
    fieldComment?: string,
    fieldName?: string,
    autoIncrement?: boolean,
    decimalNum?: number,
    primaryKey?: boolean,
    tableName?: string,
    exerciseId?: number,
    sceneDetailId?: number
  }
  type TSceneFieldDisplay = {
    id?: number,
    sceneDetailId?: number,
    sortNum?: number,
    fieldType?: string,
    fieldLength?: number,
    fieldDefault?: string,
    fieldNonNull?: boolean,
    fieldComment?: string,
    fieldName?: string,
    autoIncrement?: boolean,
    decimalNum?: number,
    primaryKey?: boolean,
    detail?: TCheckField
  }
  //DDL类型题目 表信息查询
  type VerificationList = {
    sceneDetails: List<TSceneDetail>,
    checkDetails: List<TCheckDetail>,
    sceneFields: List<TSceneField>,
    checkFields: List<TCheckField>,
    sceneFks: List<TSceneFk>,
    checkFks: List<TCheckFk>,
    sceneSeqs: List<TSceneSeq>,
    checkSeqs: List<TCheckSeq>,
    sceneIndexList: List<TSceneIndex>,
    checkIndexList: List<TCheckIndex>
    sceneConstraints: List<TSceneConstraint>,
    checkConstraints: List<TCheckConstraint>
    sceneDetailDisplays: List<TSceneDetailDisplay>,
    sceneFieldDisplays: List<TSceneFieldDisplay>,
    sceneConstraintDisplays: List<TSceneConstraintDisplay>,
    sceneFKDisplays: List<TSceneFKDisplay>,
    sceneIndexDisplays: List<TSceneIndexDisplay>,
    sceneSeqDisplays: List<TSceneSeqDisplay>,
  }
  //恢复接口传参
  type RecoveryModel = {
    sceneDetailId?: number,
    exerciseId?: number,
    recoverType?: string,
    tableName?: string,
  }
  //删除新增表校验信息接口传参
  type NewTableInfoDel = {
    ids: list,
    exerciseId: number,
    types: string
  }

  //保存更新字段
  type CheckFieldsSave = {
    fields: List<TCheckField>,
    sceneId: number
  }
  //约束查询中间类
  type SearchModel = {
    sceneDetailId?: number,
    exerciseId?: number,
    tableName?: string,
  }
  //约束
  type TSceneConstraint = {
    id?: number,
    sceneDetailId?: number,
    crName?: string,
    crType?: string,
    crFields?: string,
    crExpression?: string,
    crIndexType?: string
  }

  //约束校验
  type TCheckConstraint = {
    id?: number,
    checkStatus?: string,
    sceneConstraintId?: number,
    crName?: string,
    crType?: string,
    crFields?: string,
    crExpression?: string,
    crIndexType?: string,
    tableName?: string,
    exerciseId?: number,
    sceneDetailId?: number
  }
  //约束显示
  type TSceneConstraintDisplay = {
    id?: number,
    sceneDetailId?: number,
    crName?: string,
    crType?: string,
    crFields?: string,
    crExpression?: string,
    crIndexType?: string,
    detail?: TCheckConstraint
  }
  //保存更新约束
  type CheckConstraintsSave = {
    checkConstraints: List<TCheckConstraint>,
    sceneId: number
  }
  type TSceneFk = {
    id?: number,
    sceneDetailId?: number,
    fkName?: string,
    fkFields?: string,
    reference?: string,
    referenceFields?: string,
    updateRule?: string,
    deleteRule?: string,
    sortNum?: number,
  }
  type TCheckFk = {
    id?: number,
    sceneFkId?: number,
    checkStatus?: string,
    sceneDetailId?: number,
    fkName?: string,
    fkFields?: string,
    reference?: string,
    referenceFields?: string,
    updateRule?: string,
    deleteRule?: string,
    sortNum?: number,
    tableName?: string,
    exerciseId?: number
  }
  //外键
  type TSceneFKDisplay = {
    id?: number,
    sceneDetailId?: number,
    fkName?: string,
    fkFields?: string,
    reference?: string,
    referenceFields?: string,
    updateRule?: string,
    deleteRule?: string,
    sortNum?: number,
    detail?: TCheckFk
  }
  //外键保存
  type CheckFksSave = {
    checkFks: List<TCheckFk>,
    sceneId: number
  }
  type TSceneIndex = {
    id?: number,
    sceneDetailId?: number,
    indexName?: string,
    indexFields?: string,
    indexType?: string,
    sortNum?: number,
    indexUnique?: boolean,
    description?: string,
  }
  type TCheckIndex = {
    id?: number,
    sceneIndexId?: number,
    checkStatus?: string,
    sceneDetailId?: number,
    indexName?: string,
    indexFields?: string,
    indexType?: string,
    sortNum?: number,
    indexUnique?: boolean,
    description?: string,
    tableName?: string,
    exerciseId?: number
  }
  type TSceneIndexDisplay = {
    id?: number,
    sceneDetailId?: number,
    indexName?: string,
    indexFields?: string,
    indexType?: string,
    sortNum?: number,
    indexUnique?: boolean,
    description?: string,
    detail?: TCheckIndex
  }
  //索引保存
  type CheckIndexListSave = {
    indexList: List<TCheckIndex>,
    sceneId: number
  }
  type TSceneSeq = {
    id?: number,
    sceneDetailId?: number,
    sortNum?: number,
    seqName?: string,
    step?: number,
    minValue?: number,
    maxValue?: number,
    latestValue?: number,
    cycle?: boolean,
    field?: string,
    remark?: string,
    typeName?: string,
    startValue?: number,
    cacheSize?: number,
  }
  type TCheckSeq = {
    id?: number,
    sceneSeqId?: number,
    checkStatus?: string,
    sceneDetailId?: number,
    sortNum?: number,
    seqName?: string,
    step?: number,
    minValue?: number,
    maxValue?: number,
    latestValue?: number,
    cycle?: boolean,
    field?: string,
    remark?: string,
    typeName?: string,
    startValue?: number,
    cacheSize?: number,
    tableName?: string,
    exerciseId?: number
  }
  type TSceneSeqDisplay = {
    id?: number,
    sceneDetailId?: number,
    sortNum?: number,
    seqName?: string,
    step?: number,
    minValue?: number,
    maxValue?: number,
    latestValue?: number,
    cycle?: boolean,
    field?: string,
    remark?: string,
    typeName?: string,
    startValue?: number,
    cacheSize?: number,
    detail?: TCheckSeq
  }
  //序列保存
  type CheckSequensSave = {
    checkSeqs: List<TCheckSeq>,
    sceneId: number
  }

  type ResultSetInfo={
    columnNumber?: number,
    rowNumber?: number,
    columnList?: List<String>,
    dataTypeAndImgList?: List<DataTypeAndImg>,
    dataList?: List<Map<Object, Object>>

  }
}

