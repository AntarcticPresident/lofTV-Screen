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
export default {
  data() {
    return {
      options: {
        color: ["#67F9D8", "#FFE434", "#56A3F1", "#FF917C"],
        title: {
          text: "",
        },
        tooltip: {
          show: true,
        },
        legend: [],
        radar: [
          {
            indicator: [],
            center: ["50%", "50%"],
            radius: "70%",
            startAngle: 22.5,
            splitNumber: 4,
            shape: "polygon",
            axisName: {
              formatter: "{value}",
              color: "#aaa",
            },
            axisLine: {
              lineStyle: {
                color: "rgba(211, 253, 250, 0.8)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(211, 253, 250, 0.8)",
              },
            },
          },
        ],
        series: [
          {
            type: "radar",
            emphasis: {
              lineStyle: {
                width: 4,
              },
            },
            data: [
              {
                value: [],
                name: "接口可用性-分钟级",
                areaStyle: {
                  color: "rgba(72, 255, 66, 0.7)",
                },
              },
            ],
          },
        ],
      },
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
    this.getData();
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

      currentGET("mock4").then((res) => {
        //只打印一次
        if (!this.timer) {
          console.log("接口可用性-分钟及", res);
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
    init() {},
  },
};
</script>
<style lang="scss" scoped></style>
