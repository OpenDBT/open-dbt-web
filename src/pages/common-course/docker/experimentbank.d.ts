// @ts-ignore
/* eslint-disable */
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { API } from '@/common/entity/typings';

declare namespace EXPERIMENT_BANK {

  type TExperiment={
    id?: number,
    experimentName?: string,
    imagePort?: string,
    imageId?: number,
    imageName?: string,
    containerPort?: string,
    releaseStatus?: boolean,
    courseId?: string,
    updateTime: string,
    createTime: string
  }
  type TExperimentInfo={
    id?: number,
    experimentName?: string,
    imagePort?: string,
    imageId?: number,
    imageName?: string,
    containerId?: string,
    containerPort?: string,
    releaseStatus?: boolean,
    courseId?: string,
    experimentContent?: string,
    updateTime: string,
    createTime: string
  }
  type TExperimentParams = {
    courseId?: string;
    experimentName?: string; //初始化脚本
    pageSize?: number;
    current?: number;
    filter?: Record<string, React.ReactText[] | null>;
    sorter?: Record<string, any>;
    orderBy?: string;
  };

  type TImages={
    id?: number,
    imageName?: string,
    imagePort?: string,
    imagePath?: number,
  }

  type ContainerConfig={
    imageId?: number,
    imagePort?: string,
    imageName?: string,
    studentCode?: string,
    courseId?: number,
  }
 

  
  type ContainerModel={
    containerId?: string,
    containerPort?: string,
   
  }
}

