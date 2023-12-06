import { getVal, parse } from './index.js';

export const funcObj = {
  COUNTIFS(args) {
    const firstVal = parse(args[0]);
    const twoVal = parse(args[1]);
    console.log('COUNTIFS args：', args)
    console.log('COUNTIFS val：', firstVal, twoVal)
    return undefined;
  },
  TO_DATE(args) {
    //
    console.log('TO_DATE args：', args)
    return undefined;
  },
  MID(args) {
    console.log('MID args：', args)
    return undefined;
  },
  TODAY(args) {
    console.log('TODAY args：', args)
    return undefined;
  },
  YEAR(args) {
    console.log('YEAR args：', args)
    return undefined;
  },
  MONTH(args) {
    console.log('MONTH args：', args)
    return undefined;
  },
  DAY(args) {
    console.log('DAY args：', args)
    return undefined;
  },
  IF(args) {
    console.log('IF args：', args)
    const firstVal = parse(args[0]);
    const twoVal = parse(args[1]);
    const threeVal = parse(args[2]);
    return undefined;
  },
  ROUNDUP(args) {
    console.log('ROUNDUP args：', args)
    return undefined;
  },
  ROUNDDOWN(args) {
    console.log('ROUNDDOWN args：', args)
    return undefined;
  },
  ROUND(args) {
    console.log('ROUND args：', args)
    return undefined;
  },
  AND(args) {
    console.log('AND args：', args)
    return undefined;
  },
  OR(args) {
    console.log('OR args：', args)
    return undefined;
  },
  MIN(args) {
    console.log('MIN args：', args)
    return undefined;
  },
  MAX(args) {
    console.log('MIMAXN args：', args)
    return undefined;
  },
  INT(args) {
    console.log('INT args：', args)
    return undefined;
  },
  DATE(args) {
    console.log('DATE args：', args)
    return undefined;
  },
  TREND(args) {
    console.log('TREND args：', args)
    return undefined;
  },
  ABS(args) {
    console.log('ABS args：', args)
    return undefined;
  },
  TEXT(args) {
    console.log('TEXT args：', args)
    return undefined;
  },
  IFS(args) {
    console.log('IFS args：', args)
    return undefined;
  },
  SUMIFS(args) {
    console.log('SUMIFS args：', args)
    return undefined;
  },
  FILTER(args) {
    console.log('FILTER args：', args)
    return undefined;
  },
  CROSS_JOIN(args) {
    console.log('CROSS_JOIN args：', args)
    return undefined;
  },
  UNION(args) {
    console.log('UNION args：', args)
    return undefined;
  },
  RANK(args) {
    console.log('RANK args：', args)
    return undefined;
  },
  EOMONTH(args) {
    console.log('EOMONTH args：', args)
    return undefined;
  },
  DATE_ADD(args) {
    console.log('DATE_ADD args：', args)
    return undefined;
  },
  DATEDIF(args) {
    console.log('DATEDIF args：', args)
    return undefined;
  },
  special_exp(args) {
    console.log('special_exp args：', args)
    return undefined;
  },
  layer_exp(args) {
    console.log('layer_exp args：', args)
    return undefined;
  },
  assign_exp(args) {
    console.log('assign_exp args：', args)
    return undefined;
  }
}


// 运算符
export const operation = Object.keys(funcObj);
