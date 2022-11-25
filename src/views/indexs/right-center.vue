<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:16:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 09:46:18
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-center.vue
-->
<template>
  <Echart
    id="rightcenter"
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
        axisPointer: {
          show: false,
        },
        tooltip: {
          show: true,
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
            data: [],
          },
        ],
        series: [
          {
            name: "",
            type: "bar",
            label: {
              show: true,
              position: "inside",
            },
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      },
      pageflag: true,
      timer: null,
    };
  },
  created() {
    this.getData();
    // this.init();
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
          console.log("接口级QPS环比昨天", res);
        }
        if (res.success) {
          this.options.series[0].data = [];
          this.options.yAxis[0].data = [];
          for (let el in res.data) {
            this.options.series[0].data.push(res.data[el]);
            this.options.yAxis[0].data.push({
              value: el,
              textStyle: {
                color: "gray",
              },
            });
          }
          this.switper();
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
      // let myChart = this.$refs.charts.chart;
      // myChart.on("mouseover", (params) => {
      //   this.clearData();
      // });
      // myChart.on("mouseout", (params) => {
      //   this.timer = setInterval(
      //     looper,
      //     this.$store.state.setting.echartsAutoTime
      //   );
      // });
    },
    // init() {
    //   this.options.series[0].data = [];
    // },
  },
};
</script>
<style lang="scss" scoped></style>
