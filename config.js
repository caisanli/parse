import { parseExpression } from './utils.js';

/**
 * 函数配置实现
 */
export const funcMap = {
  COUNTIFS(args) {
    const firstVal = parseExpression(args[0]);
    const twoVal = parseExpression(args[1]);
    // console.log('COUNTIFS args：', args)
    // console.log('COUNTIFS val：', firstVal, twoVal)
    return 'COUNTIFS';
  },
  TO_DATE(args) {
    //
    // console.log('TO_DATE args：', args)
    return 'TO_DATE';
  },
  MID(args) {
    // console.log('MID args：', args)
    return 'MID';
  },
  TODAY(args) {
    // console.log('TODAY args：', args)
    return Date.now();
  },
  YEAR(args) {
    // console.log('YEAR args：', args)
    return 'YEAR';
  },
  MONTH(args) {
    // console.log('MONTH args：', args)
    return 'MONTH';
  },
  DAY(args) {
    // console.log('DAY args：', args)
    return 'DAY';
  },
  IF(args) {
    console.log('IF args：', args)
    const firstVal = parseExpression(args[0]);
    if (firstVal === true) {
      return parseExpression(args[1]);
    } else {
      return parseExpression(args[2]);
    }
  },
  ROUNDUP(args) {
    // console.log('ROUNDUP args：', args)
    return 'ROUNDUP';
  },
  ROUNDDOWN(args) {
    // console.log('ROUNDDOWN args：', args)
    return 'ROUNDDOWN';
  },
  ROUND(args) {
    // console.log('ROUND args：', args)
    return 'ROUND';
  },
  AND(args) {
    // console.log('AND args：', args)
    return 'AND';
  },
  OR(args) {
    // console.log('OR args：', args)
    return 'OR';
  },
  MIN(args) {
    // console.log('MIN args：', args)
    return 'MIN';
  },
  MAX(args) {
    // console.log('MIMAXN args：', args)
    return 'MAX';
  },
  INT(args) {
    // console.log('INT args：', args)
    return 'INT';
  },
  DATE(args) {
    // console.log('DATE args：', args)
    return 'DATE';
  },
  TREND(args) {
    // console.log('TREND args：', args)
    return 'TREND';
  },
  ABS(args) {
    // console.log('ABS args：', args)
    return 'ABS';
  },
  TEXT(args) {
    // console.log('TEXT args：', args)
    return 'TEXT';
  },
  IFS(args) {
    // console.log('IFS args：', args)
    return 'IFS';
  },
  SUMIFS(args) {
    // console.log('SUMIFS args：', args)
    const firstVal = parseExpression(args[0]);
    const twoVal = parseExpression(args[1]);
    const threeVal = parseExpression(args[2]);
    return 'SUMIFS';
  },
  FILTER(args) {
    // console.log('FILTER args：', args)
    return 'FILTER';
  },
  CROSS_JOIN(args) {
    // console.log('CROSS_JOIN args：', args)
    return 'CROSS_JOIN';
  },
  UNION(args) {
    // console.log('UNION args：', args)
    return 'UNION';
  },
  RANK(args) {
    // console.log('RANK args：', args)
    return 'RANK';
  },
  EOMONTH(args) {
    const val = parseExpression(args[0]);
    // console.log('EOMONTH args：', args)
    return 'EOMONTH';
  },
  DATE_ADD(args) {
    // console.log('DATE_ADD args：', args)
    return 'DATE_ADD';
  },
  DATEDIF(args) {
    // console.log('DATEDIF args：', args)
    return 'DATEDIF';
  },
  special_exp(args) {
    // console.log('special_exp args：', args)
    return 'special_exp';
  },
  layer_exp(args) {
    // console.log('layer_exp args：', args)
    return 'layer_exp';
  },
  assign_exp(args) {
    // console.log('assign_exp args：', args)
    return 'assign_exp';
  }
}


// 运算符
export const operation = Object.keys(funcMap);
