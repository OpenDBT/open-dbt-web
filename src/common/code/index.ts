var CODE_CONSTANT = {
    // 创建题目的列表排序
    questionType: ['单选题', '多选题', '判断题', '填空题', '简答题', 'DMLSQL编程题','DDLSQL编程题', 'DDL视图编程题', 'DDL函数编程题', 'DDL触发器编程题'],
    exerciseLevel: ['简单', '一般', '困难'],    // 难度显示文字
    //接口对应的题目类型索引名称
    typeName: {
        '1': '单选题',
        '2': '多选题',
        '3': '判断题',
        '4': '填空题',
        '5': '简答题',
        '6': 'DMLSQL编程题',
    },
    DDLType: ['DDLSQL编程题', 'DDL视图编程题', 'DDL函数编程题', 'DDL触发器编程题'],

    DDLName: [
        { value: 7, name: 'DDLSQL编程题' },
        { value: 8, name: 'DDL视图编程题' },
        { value: 9, name: 'DDL函数编程题' },
        { value: 10, name: 'DDL触发器编程题' },
    ],
    // 字母选择题排序
    arrList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    // 难易程度数组
    exerciseLevelList: [
        { name: '简单', value: 1 },
        { name: '一般', value: 2 },
        { name: '困难', value: 3 }
    ],
    //题目类型
typeList: [
    { id: 1, name: '单选题' },
    { id: 2, name: '多选题' },
    { id: 3, name: '判断题' },
    { id: 4, name: '填空题' },
    { id: 5, name: '简答题' },
    { id: 6, name: 'SQL编程题' },
    { id: 7, name: 'DDLSQL编程题' },
    { id: 8, name: 'DDL视图编程题' },
    { id: 9, name: 'DDL函数编程题' },
    { id: 10, name: 'DDL触发器编程题' }
  ]
};


export default CODE_CONSTANT;