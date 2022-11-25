<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:16:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 09:46:18
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-center.vue
-->
<template>
  <Echart
    id="leftCenter"
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
import { graphic } from "echarts";

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
            label: { shadowColor: colors[0] },
          },
          {
            value: this.countUserNumData.onlineNum,
            name: "在线",
            label: { shadowColor: colors[2] },
          },
          {
            value: this.countUserNumData.offlineNum,
            name: "离线",
            label: { shadowColor: colors[1] },
          },
        ],
      };
      this.options = {
        color: ["#67F9D8", "#FFE434", "#56A3F1", "#FF917C"],
        title: { text: "" },
        tooltip: { show: true },
        legend: [],
        radar: [
          {
            indicator: [
              { text: "支付-优惠券接口", max: 100 },
              { text: "支付-电视端下单接口", max: 100 },
              { text: "支付-移动端下单接口", max: 100 },
              { text: "支付-自动续费刷新状态接口", max: 100 },
              { text: "电商-组合套餐页获取接口", max: 100 },
              { text: "电商-vipinfo接口", max: 100 },
              { text: "阿里云-电商-组合套餐页获取接口", max: 100 },
              { text: "阿里云-电商-vipinfo接口", max: 100 },
            ],
            center: ["50%", "50%"],
            radius: "70%",
            startAngle: 22.5,
            splitNumber: 4,
            shape: "polygon",
            axisName: {
              // formatter: "||{value}||",
              color: "#aaa",
            },
            // splitArea: {
            //   areaStyle: {
            //     color: ["#77EADF", "#26C3BE", "#64AFE9", "#428BD4"],
            //     shadowColor: "rgba(0, 0, 0, 0.3)",
            //     shadowBlur: 10,
            //   },
            // },
            axisLine: { lineStyle: { color: "rgba(211, 253, 250, 0.8)" } },
            splitLine: {
              lineStyle: { color: "rgba(211, 253, 250, 0.8)" },
            },
          },
        ],
        series: [
          {
            type: "radar",
            emphasis: {
              lineStyle: { width: 4 },
            },
            data: [
              {
                value: [100, 60, 40, 30, 10, 22, 52, 30],
                name: "接口响应时间",
                areaStyle: {
                  color: new graphic.RadialGradient(0.1, 0.6, 1, [
                    { color: "rgba(255, 145, 124, 0.1)", offset: 0 },
                    { color: "rgba(255, 145, 124, 0.9)", offset: 1 },
                  ]),
                },
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
<style lang="scss" scoped></style>
