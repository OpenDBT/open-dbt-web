  //新增修改删除三种颜色
  export const threeColor = (color?: string) => {
    if (color === 'INSERT') {
      return 'dl-card insert';
    }
   else if (color === 'UPDATE') {
      return 'dl-card update';
    }
    else if (color === 'DEL') {
      return 'dl-card del';
    }else{
        return '';
    }
  }


  export const treeColorCss=(color?: string)=>{
    if (color === 'INSERT') {
      return '#C8F0E6';
    }
   else if (color === 'UPDATE') {
      return '#FAEAAB';
    }
    else if (color === 'DEL') {
      return '#FFE9E9';
    }else{
        return '';
    }
  }