import { request } from 'umi';
import { API } from '@/common/entity/typings';
import { EXPERIMENT_BANK } from './experimentbank';


//在线实验列表查询
export async function listExperiment(params: EXPERIMENT_BANK.TExperimentParams) {
    const rs = await request<API.Result<API.PageHelper<EXPERIMENT_BANK.TExperiment>>>('/experiment/listExperiment', { method: 'POST', data: { ...params, } });
    if (rs.success) {
        return {
            ...rs.obj,
            count: rs.obj.total,
            list: rs.obj.list,
            pagination: { current: rs.obj.pageNum, pageSize: rs.obj.pageSize, total: rs.obj.total },
        }
    } else {
        return {
            pageNum: 0,
            pageSize: 0,
            count: 0,
            list: [],
            pagination: { current: 1, total: 0, pageSize: 10 },
        }

    }
}
//实验详情查询
export async function getExperiment(id: number,code: string) {
    return request<API.Result<EXPERIMENT_BANK.TExperimentInfo>>(`/experiment/getExperiment/${id}/${code}`);
}

//镜像列表查询
export async function getImages() {
    return request<API.Result<EXPERIMENT_BANK.TImages[]>>(`/experiment/getImages`);
}


//新建实验保存
export async function saveExperiment(data: EXPERIMENT_BANK.TExperimentInfo) {
    return request<API.Result<boolean>>(`/experiment/saveExperiment`, { method: 'POST', data: data });
}


//容器创建
export async function startContainer(data: EXPERIMENT_BANK.ContainerConfig) {
    return request<API.Result<EXPERIMENT_BANK.ContainerModel>>(`/experiment/container`, { method: 'POST', data: data });
}
