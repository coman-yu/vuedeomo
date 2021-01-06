<template>
<div>
  <el-form ref="form" :model="form" label-width="80px" :inline='true' :rules="rules" >
    <el-form-item prop="selectVal">
       <el-select v-model="form.selectVal" placeholder="渠道" >
      <el-option
        v-for="item in options"
        :key="item.label"
        :label="item.label"
        :value="item.value">
      </el-option>
      </el-select>
    </el-form-item>
  
  <el-form-item prop="date">
   <el-date-picker
      style="margin-left:20px"
      v-model="form.date"
      type="daterange"
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间">
    </el-date-picker>
  </el-form-item>
    <el-button @click="reset">重置</el-button>
    <el-button type="primary" @click="search">查询</el-button>
    <el-button type="primary" plain @click="add">添加</el-button>
    </el-form>
    </div>
    
</template>

<script>
  export default {
    data() {
      return {
         rules:{
          selectVal:[{required:true,message:'请选择渠道'}],
          date:[{required:true,message:'请选择日期'}],
      },
        form:{
          selectVal:'',
          date:""
        },
        options:[],
        
      }
    },
    async created () {
      const res = await this.$request.get('channel');
      const {data} = res.data;
      this.options.push({
        value:0,
        label:'全局渠道'
      })
       data[0].children.forEach(item=>{
         let obj = {}
          obj.value = item.id;
          obj.label = item.label;
          this.options.push(obj)
       })
  },
  methods: {
    add(){
      this.$root.eventBus.$emit('add');
    },
    reset(){
      this.$store.commit('channel/SELECT_CHANNEL', {
      current:[]
    })
     this.$emit('resetChecked');
     Object.assign(this.form,{
       selectVal:'',
        date:""
     })
    },
    search(){
      this.$refs.form.validate(async (valid)=>{
        if(valid){
          try{
            this.form.date=this.form.date.map(item=>item.format('yyyy-MM-dd'))
          }catch(err){
            console.log(1);
          }
          const startDate = this.form.date[0];
          const endDate = this.form.date[1];
          const selectVal = this.form.selectVal;
          const res = await this.$request.post('/channel/search',{
            startDate,
            endDate,
            selectVal
          })
         const {data} = res.data;
         this.$store.commit('channel/SELECT_CHANNEL', {
              current:data
            })
        }else{
         return false
        }
      })
    }
  }
  }

</script>