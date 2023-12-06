import { getCompareReg, getParamsByStr, getRefLen, getReg, split, splitComp } from './utils.js';
import { funcObj } from './func.js';

const oStr = `COUNTIFS(TO_DATE(#row.完结日期_日#) < TO_DATE(#df.转正日期#), #df.判断# == '88VIP', #df.诉求单完成类型# == '诉求单新建完结量')`;
// const oStr =  `SUMIFS(#["税收","工资"]#,#df.运营中心# == #row.运营中心#,#data.运营中心# == "重庆") `
// const oStr =  `SUMIFS(#re__#appoint_date##,“上”,转正日期,It)`
// const oStr =  `COUNTIFS(#re__#appoint_date##,”上”,转正日期,before)`
// const oStr =  `IF((EOMONTH(TODAY(),-1)- DATE(YEAR(入职日期),MONTH(入职日期),DAY(入职日期)))/30>=12,100,IF((EOMONTH(TODAY(),-1)- DATE(YEAR(入职日期),MONTH(入职日期),DAY(入职日期)))/30>=6,50,0))`

/**
 * 解析出单个公式的值
 */
export function parse(str) {
  const result = getReg().exec(str);
  if (!result) {
    console.log('匹配没成功：', str);
    return getVarVal(str);
  }
  // 获取运算符和参数
  const [, name, params] = result;
  const func = funcObj[name];
  if (!func) {
    console.warn(`未实现：${ name } 方法`);
    return ;
  }
  return func(getParamsByStr(params));
}

/**
 * 获取表达式的值
 * @param str
 * @returns {*}
 */
export function getVal(str) {
  const reg = getRefLen();
  const execResArr = [];
  let execRes;
  let index = -1;
  console.log('str：', str);
  // 处理执行函数
  // while ((execRes = reg.exec(str)) !== null) {
  //   console.log('execRes[0]：', execRes)
  //   const val = parse(execRes[0].trim());
  //   if (index === -1) {
  //     index = reg.lastIndex;
  //   } else {
  //     execResArr.push(execRes.input.slice(index, execRes.index).trim())
  //     index = reg.lastIndex;
  //   }
  //   execResArr.push(val);
  // }
  // 处理比较操作符或剩余表达式
  const lastStr = str.slice(index === -1 ? 0 : index, str.length);
  console.log('lastStr：', lastStr);
  if (lastStr) {
    const compareResArr = splitComp(lastStr);
    execResArr.push(...compareResArr);
  }
  console.log('execResArr：', execResArr);
  if (!execResArr.length) {
    // 没有操作函数，就直接取值
    return parse(str);
  }
  const valArr = execResArr.map(str => {
    return getVarVal(str);
  })
  if (valArr.length === 1) {
    // 仅有一个值
    return valArr[0];
  }
  // 开始获取表达式的值
  return getArrVal(valArr);
}

/**
 * 获取变量的值
 * @param str
 */
function getVarVal(str) {
  if (str === undefined) {
    return str;
  }
  // 排除变量
  if (!str.startsWith('#') && !str.startsWith('[')) {
    return str;
  }
  return parseVar(str);
}

/**
 * 处理变量
 * @param str
 */
function parseVar(str) {
  return undefined;
}

/**
 * 获取运算的值
 * @param arr
 * @returns {*}
 */
function getArrVal(arr) {
  // const [first, operator, two] = arr.splice(0, 3);
  // let res = Function(`return ${ first } ${ operator } ${ two }`)();
  // if (res.length) {
  //   arr.unshift(res);
  //   res = getArrVal(arr);
  // }
  // return res;
  return undefined;
}

const result = parse(oStr);
console.log('result：', result);
