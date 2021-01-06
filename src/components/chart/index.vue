<template>
  <div>
    <div style="text-align:center;color:#4491e0;width: 500px; font-size:14px;margin:20px">
      用户信息采集分析
      </div>
    <div style="height:400px" ref="chart" v-show="ishide">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      legend:[],
      date:[],
      series:[],
      ishide:false
    }
  },
  methods: {
    initCharts() {
      let myChart = this.$echarts.init(this.$refs.chart);
      myChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: this.legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.date
            },
            yAxis: {
                type: 'value'
            },
            series: this.series
              },true);
    },
  },
  // mounted() {
  //   this.initCharts();
  // },
  watch: {
    '$store.state.channel.currentSelected':async function(newVal){
       const {data} =await this.$request.get("/channel")
       let {children} = data.data[0];
       console.log('children',children);
       this.legend=[];
       this.date=[];
       this.series=[];
        if(newVal.length===0){
          this.ishide=false;
          this.$nextTick(()=>{
             this.initCharts()
          })
        }else{
           //  随便定个日期
           this.ishide=true
            const date = children[0].date;
            for(let i=0;i<7;i++){
              this.date.push(date)
            } 
       if(newVal.includes(0)){
        for(let i =0;i<children.length;i++){
          const total = `${children[i].name}总数`
          const success = `${children[i].name}成功总数`
          const failed = `${children[i].name}失败总数`
          this.legend.push(total,success,failed)
          const totalNum = children[i].total;
          const successNum = children[i].success;
          const failNum = children[i].fail;
          let totalCount = {
            name:total,
            type:'line',
            stack:'总量',
            data:[totalNum,totalNum,totalNum,totalNum,totalNum,totalNum,totalNum]
          }
          let successCount ={
            name:success,
             type:'line',
            stack:'成功总量',
            data:[successNum,successNum,successNum,successNum,successNum,successNum,successNum]
          }
           let failCount ={
            name:failed,
             type:'line',
            stack:'失败总量',
            data:[failNum,failNum,failNum,failNum,failNum,failNum,failNum]
          }
          this.series.push(totalCount,successCount,failCount)
        }
      }else if(!newVal.includes(0)){

         for(let i =0;i<newVal.length;i++){
          const total = `${children[newVal[i]-1].name}总数`
          this.legend.push(total);
          const success = `${children[newVal[i]-1].name}成功总数`
          this.legend.push(success)
          const failed = `渠道${children[newVal[i]-1].name}失败总数`
          this.legend.push(failed)
           const totalNum = children[newVal[i]-1].total;
          const successNum = children[newVal[i]-1].success;
          const failNum = children[newVal[i]-1].fail;
          let totalCount = {
            name:total,
            type:'line',
            stack:'总量',
            data:[totalNum,totalNum,totalNum,totalNum,totalNum,totalNum,totalNum]
          }
          let successCount ={
            name:success,
             type:'line',
            stack:'成功总量',
            data:[successNum,successNum,successNum,successNum,successNum,successNum,successNum]
          }
           let failCount ={
            name:failed,
             type:'line',
            stack:'失败总量',
            data:[failNum,failNum,failNum,failNum,failNum,failNum,failNum]
          }
          this.series.push(totalCount,successCount,failCount)
        }
      }
      this.$nextTick(()=>{
        this.initCharts();
      })
       
      }
    }
  }
};
</script>

<style>
</style>