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
    arr.push(
      createItem(str.substring(comRes.index, comReg.lastIndex), 'com')
    )
    const lastStr = str.substring(comReg.lastIndex, length).trim();
    arr.push(...getNotFuncInfo(lastStr))
    return arr;
  }

  // 校验开头是否是运算符
  const opeReg = getOperatorReg(true);
  const opeRes = opeReg.exec(str);
  if (opeRes) {
    arr.push(
      createItem(str.substring(opeRes.index, opeReg.lastIndex), 'ope')
    );
    const lastStr = str.substring(opeReg.lastIndex, length).trim();
    arr.push(...getNotFuncInfo(lastStr))
    return arr;
  }

  // 检验开头是否是变量
  if (str.startsWith('#')) {
    const { index } = getVarInfo(str);
    if (index === -1) {
      arr.push(createItem(str, 'var'));
    } else {
      const lastStr = str.substring(index, length);
      arr.push(
        createItem(str.substring(0, index), 'var'),
        ...getNotFuncInfo(lastStr)
      )
    }
    return arr;
  }

  // 判断剩下的字符串是否有"比较符"或者"运算符"
  const comReg2 = getCompareReg();
  const opeReg2 = getOperatorReg();
  if (comReg2.test(str) || opeReg2.test(str)) {
    const { resArr, indexArr } = getOpeInfo(str);
    indexArr.forEach((ii, i) => {
      let item;
      if (i === 0) {
        item = createItem(str.substring(0, ii[0]));
      } else {
        item = createItem(str.substring(indexArr[i - 1][1], ii[0]));
      }
      resArr.splice(i, 0, item);
    })
    // 说明还没处理完
    const last = indexArr[indexArr.length - 1];
    if (last[1] < str.length - 1) {
      resArr.push(createItem(str.substring(last[1])));
    }
    return resArr;
  }

  return [createItem(str)];
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
    resArr.push(createItem(val, Operators.includes(val) ? 'ope' : 'com'))
    indexArr.push([execRes.index, reg.lastIndex])
  }
  return { resArr, indexArr }
}

/**
 * 获取变量信息
 * @param str
 * @param isChild 为ture的话，遇到#的次数为偶数就结束
 */
function getVarInfo(str, isChild = false) {
  const key = '#';
  let count = 0;
  // 变量开始的下标
  let startIndex = -1;
  // 变量结束的下标
  let index = -1;
  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (s === key) {
      if (startIndex === -1) {
        startIndex = i;
      }
      count++;
      if (isChild === true) {
        if (count % 2 === 0) {
          index = i;
          break;
        }
      }
    } else if ( // 如果遇到运算符或者操作符，就判断count是否是偶数，偶数表示变量结束
      [...Operators].includes(s)
      // 这里将类似 "<=" 切成 '<' 对比，因为只能对比一个字符
      || ComparisonOperators.map(str => str.substring(0, 1)).includes(s)
    ) {
      if (count % 2 === 0) {
        index = i;
        break;
      }
    }
  }
  return { index, startIndex };
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
    // 执行函数
    const val = funcMap[funcName](params);
    indexArr.push([startIndex, newEndIndex]);
    resArr.push(createItem(val));
  }
  return { indexArr,  resArr }
}

/**
 * 创建列表项
 * @param type
 * @param val
 * @returns {{val, type}}
 */
function createItem(val, type = 'str') {
  return { val, type }
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
