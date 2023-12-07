import { funcMap, operation } from './config.js';

// 比较操作符
export const ComparisonOperators = ['==', '<=', '>=', '!=', '>', '<'];
// 运算符
export const Operators = ['/', '+', '-', '*'];

/**
 * 获取比较操作符的正则
 * @returns {RegExp}
 */
export function getCompareReg(start = false) {
  return new RegExp(`${ start ? '^' : '' }[${ ComparisonOperators.join('|') }]+`, 'g');
}

/**
 * 获取运算符的正则
 * @returns {RegExp}
 */
export function getOperatorReg(start = false) {
  return new RegExp(`${ start ? '^' : '' }[/|+|\\-|*]+`, 'g');
}

/**
 * 获取提取操作函数的正则
 * @returns {RegExp}
 */
export function getFuncReg() {
  return new RegExp(`${ operation.join('|') }`, 'g')
}

/**
 * 获取字符串里的参数
 * @param str
 * @param comma
 */
export function getParamsByStr(str, comma = ',') {
  // const comma = ',';
  const commaIndexArr = [];
  const keys = ['(', ')', '#', '[', ']'];
  const sideKeyMap = {
    '(': ')',
    ')': '(',
    '#': '#',
    '[': ']',
    ']': '['
  };
  const obj = {};
  let prevKey = '';
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (keys.includes(s)) {
      if (obj[s]) {
        obj[s].push(i);
      } else {
        obj[s] = [i];
      }
      prevKey = s;
    } else if (s === comma) {
      const length = (obj[prevKey] || []).length;
      const sideKey = sideKeyMap[prevKey] || '';
      const sideLength = (obj[sideKey] || []).length;
      if (length === sideLength) {
        commaIndexArr.push(i);
      }
    }
  }
  const arr = [];
  let prevIndex = 0
  commaIndexArr.forEach(i => {
    arr.push(str.slice(prevIndex, i).trim());
    prevIndex = i + 1;
  })
  arr.push(str.slice(commaIndexArr[commaIndexArr.length - 1] + 1).trim())
  return arr;
}

/**
 * 获取括号里的信息
 * @param str
 */
function getConclusionInfo(str) {
  const keys = ['(', ')'];
  const obj = {
    '(': [],
    ')': []
  }
  let index = -1;
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (keys.includes(s)) {
      obj[s].push(i);
      if (obj['('].length === obj[')'].length) {
        index = i;
        break;
      }
    }
  }
  return index;
}

/**
 * 获取表达式信息
 * @param str
 */
export function getExpressionInfo(str) {
  if (str.startsWith('(')) {
    // 获取'('')'里面的表达式
    const index = getConclusionInfo(str);
    const expression = str.substring(1, index);
    // console.log('找到了：', expression);
    const res = getExpressionInfo(expression);
    // 处理剩下的字符串
    const lastStr = str.substring(index + 1, str.length);
    const lastRes = getNotFuncInfo(lastStr);
    return [...res, ...lastRes];
  } else {
    const { indexArr, resArr } = getFuncInfo(str);
    const length = str.length;
    // console.log('indexArr：', indexArr);
    // console.log('resArr：', resArr);
    indexArr.forEach((ii, i) => {
      let isNext = false;
      let d = '';
      if (i === 0) {
        if (ii[0] !== 0) { // 前面还有表达没处理
          d = str.substring(0, ii[0]);
        } else if (ii[1] === length) { // ???
          // d = str.substring(0, length);
          console.warn('这是啥情况，注意查收...');
        } else if (!indexArr[i + 1]) { // 如果第二项不存在
          d = str.substring(ii[1], length);
          isNext = true;
        }
      } else {
        d = str.substring(indexArr[i - 1][1], ii[0]);
      }
      d = d.trim();
      if (d !== '') {
        const res = getNotFuncInfo(d);
        resArr.splice(isNext ? (i + 1) : i, 0, ...(res || []))
      }
    })

    if (!indexArr.length) {
      resArr.push(...getNotFuncInfo(str));
    }
    console.log('resArr：', resArr);
    return resArr;
  }
}

/**
 * 获取非函数的表达式信息
 * @param str
 */
export function getNotFuncInfo(str) {
  const arr = [];
  const length = str.length;
  // 校验开头是否是比较运算符
  const comReg = getCompareReg(true);
  const comRes = comReg.exec(str);
  if (comRes) {
    arr.push({
      type: 'com',
      val: str.substring(comRes.index, comReg.lastIndex)
    })
    const lastStr = str.substring(comReg.lastIndex, length).trim();
    arr.push(...getNotFuncInfo(lastStr))
    return arr;
  }

  // 校验开头是否是运算符
  const opeReg = getOperatorReg(true);
  const opeRes = opeReg.exec(str);
  if (opeRes) {
    arr.push({
      type: 'ope',
      val: str.substring(opeRes.index, opeReg.lastIndex)
    })
    const lastStr = str.substring(opeReg.lastIndex, length).trim();
    arr.push(...getNotFuncInfo(lastStr))
    return arr;
  }

  // 检验开头是否是变量
  if (str.startsWith('#')) {
    const varIndex = getVarInfo(str);
    if (varIndex === length - 1) {
      arr.push({ type: 'var', val: str });
    } else {
      const lastStr = str.substring(varIndex, length);
      arr.push(
        { type: 'var', val: str.substring(0, varIndex) },
        ...getNotFuncInfo(lastStr)
      )
    }
    return arr;
  }

  const comReg2 = getCompareReg();
  const opeReg2 = getOperatorReg();
  if (comReg2.test(str) || opeReg2.test(str)) {
    const { resArr, indexArr } = getOpeInfo(str);
    indexArr.forEach((ii, i) => {
      let item;
      if (i === 0) {
        item = {
          val: str.substring(0, ii[0]),
          type: 'str'
        }
      } else {
        item = {
          val: str.substring(indexArr[i - 1][1], ii[0]),
          type: 'str'
        }
      }
      resArr.splice(i, 0, item);
    })
    // 说明还没处理完
    const last = indexArr[indexArr.length - 1];
    if (last[1] < str.length - 1) {
      resArr.push({ type: 'str', val: str.substring(last[1]) });
    }
    return resArr;
  }

  return [{ type: 'str', val: str }];
}

/**
 * 获取操作符信息
 */
function getOpeInfo(str) {
  const opes = [...ComparisonOperators, ...Operators];
  const reg = new RegExp(`[${ opes.join('|') }]+`, 'g');
  let execRes;
  const resArr = [];
  const indexArr = [];
  while ((execRes = reg.exec(str)) !== null) {
    const val = execRes[0];
    resArr.push({
      type: Operators.includes(val) ? 'ope' : 'com',
      val
    })
    indexArr.push([execRes.index, reg.lastIndex])
  }
  return { resArr, indexArr }
}

/**
 * 获取变量信息
 * @param str
 */
function getVarInfo(str) {
  const key = '#';
  let count = 0;
  let index = -1;
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (s === key) {
      count++;
    } else if ([...Operators].includes(s)) {
      if (count % 2 === 0) {
        index = i;
        break;
      }
    } else if (
      ComparisonOperators.map(str => str.substring(0, 1)).includes(s)
    ) {
      if (count % 2 === 0) {
        index = i;
        break;
      }
    }
  }
  return index === -1 ? str.length - 1 : index;
}

/**
 * 提取函数信息
 * @param str
 */
function getFuncInfo(str) {
  const reg = getFuncReg();
  let execRes;
  const indexArr = [];
  const resArr = [];
  let prevLastIndex = -1;
  while ((execRes = reg.exec(str)) !== null) {
    const funcName = execRes[0];
    const startIndex = execRes.index;
    // 如果上一次lastIndex大于这次的index，就说明冲突了
    if (prevLastIndex !== -1 && prevLastIndex > startIndex) {
      continue;
    }
    const d = str.substring(reg.lastIndex, str.length);
    const endIndex = getConclusionInfo(d);
    const newEndIndex = endIndex + reg.lastIndex + 1;
    const params = getParamsByStr(str.substring(reg.lastIndex + 1, newEndIndex - 1));
    prevLastIndex = newEndIndex;
    // reg.lastIndex = execRes.index;
    // 执行函数
    const val = funcMap[funcName](params);
    indexArr.push([startIndex, newEndIndex]);
    resArr.push({ val: val, type: 'str' });
  }
  return { indexArr,  resArr }
}

/**
 * 解析表达式
 * @param str
 * @returns {*|*[]}
 */
export function parseExpression(str = '') {
  return getExpressionInfo(str);
}

// console.log('getFuncInfo：', getFuncInfo('EOMONTH(TODAY(),-1)- DATE(YEAR(入职日期),MONTH(入职日期),DAY(入职日期)'));
