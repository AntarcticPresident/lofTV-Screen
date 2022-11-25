<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:16:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 09:46:18
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-center.vue
-->
<template>
  <Echart
    id="rightbottom"
    :options="options"
    class="left_center_inner"
    v-if="pageflag"
    ref="charts"
  />
  <Reacquire v-else @onclick="getData" style="line-height: 200px">
    重新获取
  </Reacquire>
</template>

<script>
import { currentGET } from "api/modules";
export default {
  data() {
    return {
      options: {},
      countUserNumData: {
        lockNum: 0,
        onlineNum: 0,
        offlineNum: 0,
        totalNum: 0,
      },
      pageflag: true,
      timer: null,
    };
  },
  created() {
    // this.getData();
    this.init();
  },
  mounted() {},
  beforeDestroy() {
    this.clearData();
  },
  methods: {
    clearData() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    getData() {
      this.pageflag = true;
      // this.pageflag =false

      currentGET("big1").then((res) => {
        //只打印一次
        if (!this.timer) {
          console.log("设备总览", res);
        }
        if (res.success) {
          this.countUserNumData = res.data;
          this.$nextTick(() => {
            this.init();
            this.switper();
          });
        } else {
          this.pageflag = false;
          this.$Message({
            text: res.msg,
            type: "warning",
          });
        }
      });
    },
    //轮询
    switper() {
      if (this.timer) {
        return;
      }
      let looper = (a) => {
        this.getData();
      };
      this.timer = setInterval(
        looper,
        this.$store.state.setting.echartsAutoTime
      );
      let myChart = this.$refs.charts.chart;
      myChart.on("mouseover", (params) => {
        this.clearData();
      });
      myChart.on("mouseout", (params) => {
        this.timer = setInterval(
          looper,
          this.$store.state.setting.echartsAutoTime
        );
      });
    },
    init() {
      let total = this.countUserNumData.totalNum;
      let colors = ["#ECA444", "#33A1DB", "#56B557"];
      let piedata = {
        name: "用户总览",
        type: "pie",
        radius: ["42%", "65%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: "rgba(0,0,0,0)",
          borderWidth: 2,
        },

        color: colors,
        data: [
          // {
          //   value: 0,
          //   name: "告警",
          //   label: {
          //     shadowColor: colors[0],
          //   },
          // },
          {
            value: this.countUserNumData.lockNum,
            name: "锁定",
            label: {
              shadowColor: colors[0],
            },
          },
          {
            value: this.countUserNumData.onlineNum,
            name: "在线",
            label: {
              shadowColor: colors[2],
            },
          },
          {
            value: this.countUserNumData.offlineNum,
            name: "离线",
            label: {
              shadowColor: colors[1],
            },
          },
        ],
      };
      this.options = {
        axisPointer: {
          show: false,
        },
        tooltip: {
          show: true,
          // trigger: "axis",
          // axisPointer: {
          //   type: "shadow",
          // },
        },
        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "value",
          },
        ],
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false,
            },
            data: [
              {
                value: "支付-优惠券接口",
                textStyle: {
                  color: "gray",
                },
              },

              {
                value: "支付-电视端下单接口",
                textStyle: {
                  color: "gray",
                },
              },
              {
                value: "支付-移动端下单接口",
                textStyle: {
                  color: "gray",
                },
              },
              {
                value: "支付-自动续费刷新状态接口",
                textStyle: {
                  color: "gray",
                },
              },
              {
                value: "电商-组合套餐页获取接口",
                textStyle: {
                  color: "gray",
                },
              },
              {
                value: "电商-vipinfo接口",
                textStyle: {
                  color: "gray",
                },
              },
              {
                value: "阿里云-电商-组合套餐页获取接口",
                textStyle: {
                  color: "gray",
                },
              },
              {
                value: "阿里云-电商-vipinfo接口",
                textStyle: {
                  color: "gray",
                },
              },
            ],
          },
        ],
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "inside",
            },
            data: [9, 10, 14, -10, -3, 7, -4, 9],
          },
        ],
      };
    },
  },
};
</script>
<style lang="scss" scoped></style>
