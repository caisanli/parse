import { getExpressionInfo } from './utils.js';

// const oStr = `COUNTIFS(TO_DATE(#row.完结日期_日#)<TO_DATE(#df.转正日期#), #df.判断#=='88VIP', #df.诉求单完成类型# == '诉求单新建完结量')`;
// const oStr =  `SUMIFS(#["税收","工资"]#,#df.运营中心# == #row.运营中心#,#data.运营中心# == "重庆") `
// const oStr =  `SUMIFS(#re__#appoint_date##,“上”,转正日期,It)`
// const oStr =  `COUNTIFS(TODAY()-#re__#appoint_date##,”上”,转正日期,before)`
// const oStr =  `IF((EOMONTH(TODAY(),-1)- DATE(YEAR(入职日期),MONTH(入职日期),DAY(入职日期)))/30>=12,100,IF((EOMONTH(TODAY(),-1)- DATE(YEAR(入职日期),MONTH(入职日期),DAY(入职日期)))/30>=6,50,0))`
const oStr =  `IF((EOMONTH(TODAY(),-1)- DATE(YEAR(入职日期),MONTH(入职日期),DAY(入职日期)))/30>=12,100, 20)`;

/**
 * 解析出单个公式的值
 */
export function parse(str) {
  const res = getExpressionInfo(str);
  console.log('parse result：', res);
  return undefined;
}

parse(oStr);
