<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:16:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 09:46:18
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-center.vue
-->
<template>
  <Echart
    id="midtop"
    :options="options"
    v-if="pageflag"
    class="left_center_inner"
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
    this.init();
    // this.getData();
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
      const gaugeData = [
        {
          value: 20,
          name: "未更新过期时间数量",
          title: {
            offsetCenter: ["-80%", "80%"],
          },
          detail: {
            offsetCenter: ["-80%", "100%"],
          },
        },
        {
          value: 40,
          name: "未开通权益数量",
          title: {
            offsetCenter: ["80%", "80%"],
          },
          detail: {
            offsetCenter: ["80%", "100%"],
          },
        },
      ];
      this.options = {
        series: [
          {
            type: "gauge",
            anchor: {
              show: true,
              showAbove: true,
              size: 18,
              itemStyle: {
                color: "#FAC858",
              },
            },
            pointer: {
              icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
              width: 4,
              length: "80%",
              offsetCenter: [0, "10%"],
            },
            progress: {
              show: true,
              overlap: true,
              roundCap: true,
            },
            axisLine: {
              roundCap: true,
            },
            data: gaugeData,
            title: {
              fontSize: 14,
              color: "grey",
            },
            detail: {
              width: 80,
              height: 14,
              fontSize: 14,
              color: "white",
              backgroundColor: "auto",
              borderRadius: 3,
              formatter: "{value}单",
            },
          },
        ],
      };
      // setInterval(function () {
      //   const random = +(Math.random() * 60).toFixed(2);
      //   myChart.setOption({
      //     series: [
      //       {
      //         data: [
      //           {
      //             value: random,
      //           },
      //         ],
      //       },
      //       {
      //         data: [
      //           {
      //             value: random,
      //           },
      //         ],
      //       },
      //     ],
      //   });
      // }, 2000);
    },
  },
};
</script>
<style lang="scss" scoped></style>
