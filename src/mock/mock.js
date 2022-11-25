import Mock from "mockjs";
//延时200-600毫秒请求到数据
Mock.setup({
  timeout: "200-600",
});

const Random = Mock.Random;
// 接口级QPS环比昨天
function apiqpshuanbizuotian() {
  const a = Mock.mock({
    success: true,
    data: {
      "支付-优惠券接口": "@integer(-100, 100)",
      "支付-电视端下单接口": "@integer(-100, 100)",
      "支付-移动端下单接口": "@integer(-100, 100)",
      "支付-自动续费刷新状态接口": "@integer(-100, 100)",
      "电商-组合套餐页获取接口": "@integer(-100, 100)",
      "电商-vipinfo接口": "@integer(-100, 100)",
      "阿里云-电商-组合套餐页获取接口": "@integer(-100, 100)",
      "阿里云-电商-vipinfo接口": "@integer(-100, 100)",
    },
  });
  return a;
}

// 接口，第一个参数url，第二个参数请求类型，第三个参数响应回调
Mock.mock(new RegExp("countUserNum"), "get", apiqpshuanbizuotian);

// /设备总览

function countDeviceNum() {
  const a = Mock.mock({
    success: true,
    data: {
      alarmNum: "@integer(100, 1000)",
      offlineNum: "@integer(0, 50)",
      totalNum: 698,
    },
  });
  a.data.onlineNum = a.data.totalNum - a.data.offlineNum;

  return a;
}

Mock.mock(new RegExp("countDeviceNum"), "get", countDeviceNum);

// /设备总览

function sbtx() {
  const a = Mock.mock({
    success: true,
    data: {
      "list|20": [
        {
          provinceName: "@province()",
          cityName: "@city()",
          countyName: "@county()",
          createTime: "@datetime('yyyy-MM-dd HH:mm:ss')",
          deviceId: "6c512d754bbcd6d7cd86abce0e0cac58",
          "gatewayno|+1": 10000,
          "onlineState|1": [0, 1],
        },
      ],
    },
  });
  return a;
}

Mock.mock(new RegExp("sbtx"), "get", sbtx);

//中间地图

function centermap(options) {
  let params = parameteUrl(options.url);
  if (params.regionCode && params.regionCode != -1) {
    const a = Mock.mock({
      success: true,
      data: {
        "dataList|30": [
          {
            name: "@city()",
            value: "@integer(1, 1000)",
          },
        ],
        regionCode: params.regionCode, //-代表中国
      },
    });
    return a;
  } else {
    const a = Mock.mock({
      success: true,
      data: {
        "dataList|8": [
          {
            name: "@province()",
            value: "@integer(1, 1000)",
          },
        ],
        regionCode: -1, //-代表中国
      },
    });
    return a;
  }
}

Mock.mock(new RegExp("centermap"), "get", centermap);

// 报警次数

function cneterTop() {
  const a = Mock.mock({
    success: true,
    data: {
      dateList: [
        "2021-11",
        "2021-12",
        "2022-01",
        "2022-02",
        "2022-03",
        "2022-04",
      ],
      "numList|6": ["@integer(0, 1000)"],
      "numList2|6": ["@integer(0, 1000)"],
    },
  });
  return a;
}
Mock.mock(new RegExp("cneterTop"), "get", cneterTop);

// 实时预警

function ssyj() {
  const a = Mock.mock({
    success: true,
    data: {
      "list|40": [
        {
          alertdetail: "@csentence(5,10)",
          "alertname|1": ["水浸告警", "各种报警"],
          alertvalue: "@float(60, 200)",
          createtime: "2022-04-19 08:38:33",
          deviceid: null,
          "gatewayno|+1": 10000,
          phase: "A1",
          sbInfo: "@csentence(10,18)",
          "terminalno|+1": 100,
          provinceName: "@province()",
          cityName: "@city()",
          countyName: "@county()",
        },
      ],
    },
  });
  return a;
}
Mock.mock(new RegExp("ssyj"), "get", ssyj);
//安装计划
function installationPlan() {
  let num = RandomNumBoth(26, 32);
  const a = Mock.mock({
    ["category|" + num]: ["@city()"],
    ["barData|" + num]: ["@integer(10, 100)"],
  });
  let lineData = [],
    rateData = [];
  for (let index = 0; index < num; index++) {
    let lineNum = Mock.mock("@integer(0, 100)") + a.barData[index];
    lineData.push(lineNum);
    let rate = a.barData[index] / lineNum;
    rateData.push((rate * 100).toFixed(0));
  }
  a.lineData = lineData;
  a.rateData = rateData;
  return {
    success: true,
    data: a,
  };
}
Mock.mock(new RegExp("installationPlan"), "get", installationPlan);

//报警排名
function ranking() {
  //多生成几个避免重复 重复会报错
  let num = Mock.mock({
    "list|48": [{ value: "@integer(50,1000)", name: "@city()" }],
  }).list;
  //   console.log(num);
  let newNum = [],
    numObj = {};
  num.map((item) => {
    if (!numObj[item.name] && newNum.length < 8) {
      numObj[item.name] = true;
      newNum.push(item);
    }
  });
  let arr = newNum.sort((a, b) => {
    return b.value - a.value;
  });
  let a = {
    success: true,
    data: arr,
  };
  return a;
}
Mock.mock(new RegExp("ranking"), "get", ranking);
/**
 * @description: min ≤ r ≤ max  随机数
 * @param {*} Min
 * @param {*} Max
 * @return {*}
 */
function RandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
/**
 * @description: 获取路径参数
 * @param {*} url
 * @return {*}
 */
function parameteUrl(url) {
  var json = {};
  if (/\?/.test(url)) {
    var urlString = url.substring(url.indexOf("?") + 1);
    var urlArray = urlString.split("&");
    for (var i = 0; i < urlArray.length; i++) {
      var urlItem = urlArray[i];
      var item = urlItem.split("=");
      console.log(item);
      json[item[0]] = item[1];
    }
    return json;
  }
  return {};
}
