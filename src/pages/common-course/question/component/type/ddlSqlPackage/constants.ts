export const fieldType = [
    { value: 'bigserial', label: 'bigserial' },
    { value: 'bit', label: 'bit' },
    { value: 'bool', label: 'bool' },
    { value: 'box', label: 'box' },
    { value: 'bytea', label: 'bytea' },
    { value: 'char', label: 'char' },
    { value: 'cidr', label: 'cidr' },
    { value: 'circle', label: 'circle' },
    { value: 'date', label: 'date' },
    { value: 'decimal', label: 'decimal' },
    { value: 'float4', label: 'float4' },
    { value: 'float8', label: 'float8' },
    { value: 'inet', label: 'inet' },
    { value: 'int2', label: 'int2' },
    { value: 'int4', label: 'int4' },
    { value: 'int8', label: 'int8' },
    { value: 'interval', label: 'interval' },
    { value: 'json', label: 'json' },
    { value: 'jsonb', label: 'jsonb' },
    { value: 'line', label: 'line' },
    { value: 'lseg', label: 'lseg' },
    { value: 'macaddr', label: 'macaddr' },
    { value: 'money', label: 'money' },
    { value: 'numeric', label: 'numeric' },
    { value: 'path', label: 'path' },
    { value: 'point', label: 'point' },
    { value: 'polygon', label: 'polygon' },
    { value: 'serial', label: 'serial' },
    { value: 'serial2', label: 'serial2' },
    { value: 'serial4', label: 'serial4' },
    { value: 'serial8', label: 'serial8' },
    { value: 'smallserial', label: 'smallserial' },
    { value: 'text', label: 'text' },
    { value: 'time', label: 'time' },
    { value: 'timestamp', label: 'timestamp' },
    { value: 'timestamptz', label: 'timestamptz' },
    { value: 'timetz', label: 'timetz' },
    { value: 'tsquery', label: 'tsquery' },
    { value: 'tsvector', label: 'tsvector' },
    { value: 'txid_snapshot', label: 'txid_snapshot' },
    { value: 'uuid', label: 'uuid' },
    { value: 'varbit', label: 'varbit' },
    { value: 'varchar', label: 'varchar' },
    { value: 'xml', label: 'xml' },
    { value: '(Domain)', label: '(Domain)' },
    { value: '(Type)', label: '(Type)' }
  ]

  export const seqDataType = [
   
    { value: 'int2', label: 'int2' },
    { value: 'int4', label: 'int4' },
    { value: 'int8', label: 'int8' },
  
  ]
//约束类型
  export const constraintType = [
    { value: 'c', label: '检查约束' },
    { value: 'x', label: '排他约束' },
    { value: 'p', label: '主键约束' },
    { value: 'u', label: '唯一约束' }
  ]


  //更新规则
  export const rule = [
    { value: 'r', label: 'RESTRICT' },
    { value: 'a', label: 'NO ACTION' },
    { value: 'c', label: 'CASCADE' },
    { value: 'n', label: 'SET NULL' },
    { value: 'd', label: 'SET DEFAULT' }
  ]

  //索引类型
  export const IndexType = [
    { value: 'btree', label: 'B-Tree' },
    { value: 'hash', label: 'Hash' },
    { value: 'gin', label: 'GIN' },
    { value: 'spgist', label: 'SP-GiST' },
    { value: 'brin', label: 'BRIN' }
  ]