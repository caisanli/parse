// 比较操作符
import { operation } from './func.js';

export const ComparisonOperators = ['==', '<=', '>=', '!=', '>', '<'];

/**
 * 获取比较操作符的正则
 * @returns {RegExp}
 */
export function getCompareReg() {
  return new RegExp(`${ ComparisonOperators.join('|') }`, 'g');
}

/**
 * 获取提取操作函数的正则
 * @returns {RegExp}
 */
export function getReg() {
  return new RegExp(`(${ operation.join('|') })\\((.*)\\)`, 'g');
}

/**
 * 获取提取操作函数的正则(懒惰模式)
 * @returns {RegExp}
 */
export function getRefLen() {
  return new RegExp(`(${ operation.join('|') })\\(([^\\)]*)\\)`, 'g');
}

/**
 * 按指定逻辑切割并移除空白
 * @param str
 * @param separator
 * @returns {string[]}
 */
export function split(str, separator = ',') {
  return str.split(separator).map(str => str.trim())
}
const replaceStr = '@1#蔡!%';
/**
 * 切割比较操作符，并将操作符按顺序插入
 * @param str
 */
export function splitComp(str) {
  const reg = getCompareReg();
  str = str.replace(reg, d => {
    return replaceStr + d + replaceStr;
  });
  return split(str, replaceStr);
}

/**
 * 获取字符串里的参数
 * @param str
 */
export function getParamsByStr(str) {
  const comma = ',';
  const commaIndexArr = [];
  const keys = ['(', ')', '#', '[', ']'];
  const sideKeyMap = {
    '(': ')',
    ')': '(',
    '#': '#',
    '[': ']',
    ']': '['
  }
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
    arr.push(str.slice(prevIndex, i));
    prevIndex = i + 1;
  })
  arr.push(str.slice(commaIndexArr[commaIndexArr.length - 1] + 1))
  return arr;
}
