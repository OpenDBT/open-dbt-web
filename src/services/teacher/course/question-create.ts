import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { QUESTION_BANK } from '@/common/entity/questionbank';
/**
 * 题库-习题保存接口
 * @param courseId 课程id
 * @param parentId： 父级课程目录id
 * @param ，catalogueName：目录名称
 * @returns 
 */
 export async function saveExercise(data: QUESTION_BANK.QuestionExercise) {
    return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/saveExercise`, { method: 'POST', data: data });
  }
/**
 * 题库-习题详情查询接口
 * @param exerciseId 习题id
 * @returns 
 */
 export async function getExerciseInfo(exerciseId: number) {
  return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/getExerciseInfo/${exerciseId}`);
}
// 复制题目
export function copyExercise(exerciseId: number) {
  return request<API.Result<QUESTION_BANK.QuestionExercise>>(`/exercise/copyExercise/${exerciseId}`);
}
// 删除习题
export function deleteExercise(exerciseId: number) {
  return request<API.Result<boolean>>(`/exercise/deleteExercise/${exerciseId}`);
}

// 文件夹保存
export function saveExerciseCatalogue(data:{ courseId: number, parentId: number | undefined, elementType: number, exerciseName: string, id: string | number }) {
  return request<API.Result<boolean>>(`/exercise/saveExerciseCatalogue`,  { method: 'POST', data: data });
}

// 文件夹目录
export function getExerciseCatalogueTree(data: { courseIdList: number []}) {
  return request<API.Result<QUESTION_BANK.QuestionExercise []>>(`/exercise/getExerciseCatalogueTree`,  { method: 'POST', data: data });
}
//
/**
 * 题库习题位置调整
 * @param id  原始id
 * @param tid 目标id
 * @returns 
 */
export async function moveExercise(oid: number, tid: number) {
  return await request<API.Result<boolean>>(`/exercise/moveExercise/${oid}/${tid}`, { method: 'GET' });
}
// 一键导出
export function exportExercise(courseId: number) {
  return request<API.Result<any>>(`/exercise/exportExercise/${courseId}`);
}

// ddl类型题目根据场景id和习题id查询场景表信息和校验信息
export async function getDDLExerciseTable(data: {sceneId: number, exerciseId: any}) {
  return await request<API.Result<QUESTION_BANK.VerificationList>>(`/verificationSetup/getSceneDetailList`,  { method: 'POST', data: data });
}

// ddl类型题目根据场景详情id和习题id查询场景表字段信息和校验信息
export async function getDDLExerciseField(data: {sceneDetailId: number, exerciseId: any,tableName: any}) {
  return await request<API.Result<QUESTION_BANK.VerificationList>>(`/verificationSetup/getFieldList`,  { method: 'POST', data: data });
}

// 重命名保存
export async function saveCheckDetail(data: QUESTION_BANK.TCheckDetailSave) {
  return await request<API.Result<number>>(`/verificationSetup/saveCheckDetail`,  { method: 'POST', data: data });
}

// 一键恢复
export async function recovery(data: QUESTION_BANK.RecoveryModel) {
  return await request<API.Result<number>>(`/verificationSetup/recovery`,  { method: 'POST', data: data });
}
// 删除新增的校验信息
export async function deleteNewTableInfo(data: QUESTION_BANK.NewTableInfoDel) {
  return await request<API.Result<number>>(`/verificationSetup/deleteNewTableInfo`,  { method: 'POST', data: data });
}
//字段保存更新
export async function saveCheckField(data: QUESTION_BANK.CheckFieldsSave) {
  return await request<API.Result<boolean>>(`/verificationSetup/saveCheckField`,  { method: 'POST', data: data });
}
//字段恢复
export async function fieldRecovery(exerciseId: number, id: number) {
  return await request<API.Result<boolean>>(`/verificationSetup/fieldRecovery/${exerciseId}/${id}`, { method: 'GET' });
}

//约束查询
export async function getConstraintList(data: QUESTION_BANK.SearchModel) {
  return await request<API.Result<QUESTION_BANK.VerificationList>>(`/verificationSetup/getConstraintList`,  { method: 'POST', data: data });
}
//约束保存
export async function saveCheckConstraint(data: QUESTION_BANK.CheckConstraintsSave) {
  return await request<API.Result<boolean>>(`/verificationSetup/saveCheckConstraint`,  { method: 'POST', data: data });
}

//约束恢复
export async function constraintRecovery(exerciseId: number, id: number) {
  return await request<API.Result<boolean>>(`/verificationSetup/constraintRecovery/${exerciseId}/${id}`, { method: 'GET' });
}
//外键查询
export async function getForeignKeyList(data: QUESTION_BANK.SearchModel) {
  return await request<API.Result<QUESTION_BANK.VerificationList>>(`/verificationSetup/getForeignKeyList`,  { method: 'POST', data: data });
}
//外键恢复
export async function fkRecovery(exerciseId: number, id: number) {
  return await request<API.Result<boolean>>(`/verificationSetup/fkRecovery/${exerciseId}/${id}`, { method: 'GET' });
}
//外键保存
export async function saveCheckForeignKey(data: QUESTION_BANK.CheckFksSave) {
  return await request<API.Result<boolean>>(`/verificationSetup/saveCheckForeignKey`,  { method: 'POST', data: data });
}



//索引查询
export async function getIndexList(data: QUESTION_BANK.SearchModel) {
  return await request<API.Result<QUESTION_BANK.VerificationList>>(`/verificationSetup/getIndexList`,  { method: 'POST', data: data });
}
//索引恢复
export async function indexRecovery(exerciseId: number, id: number) {
  return await request<API.Result<boolean>>(`/verificationSetup/indexRecovery/${exerciseId}/${id}`, { method: 'GET' });
}
//索引保存
export async function saveCheckIndex(data: QUESTION_BANK.CheckIndexListSave) {
  return await request<API.Result<boolean>>(`/verificationSetup/saveCheckIndex`,  { method: 'POST', data: data });
}


//序列查询
export async function getSequenceList(data: QUESTION_BANK.SearchModel) {
  return await request<API.Result<QUESTION_BANK.VerificationList>>(`/verificationSetup/getSequenceList`,  { method: 'POST', data: data });
}

//序列恢复
export async function seqRecovery(exerciseId: number, id: number) {
  return await request<API.Result<boolean>>(`/verificationSetup/seqRecovery/${exerciseId}/${id}`, { method: 'GET' });
}

//序列保存
export async function saveCheckSequence(data: QUESTION_BANK.CheckSequensSave) {
  return await request<API.Result<boolean>>(`/verificationSetup/saveCheckSequence`,  { method: 'POST', data: data });
}
//生成描述
export async function generateDescriptions(data: {sceneId: number,exerciseId: number}) {
  return await request<API.Result<string>>(`/verificationSetup/generateDescriptions`,  { method: 'POST', data: data });
}

//生成答案
export async function generatesAnswer(sceneId: number, exerciseId: number) {
  return await request<API.Result<string>>(`/verificationSetup/generatesAnswer/${sceneId}/${exerciseId}`, { method: 'GET' });
}