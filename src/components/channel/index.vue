<!--  -->
<template>
 <div class="app-container">
    <el-row :gutter="20">
       <!--侧边渠道数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
        </div>
        
        <el-tree
          :load="getchannel"
          :props="defaultProps"
          :expand-on-click-node="false"
          show-checkbox
          draggable
            @node-drag-start="handleDragStart"
             @node-drop="handleDrop"
            :allow-drop="allowDrop"
            :allow-drag="allowDrag"
          ref="tree"
          @check-change="changeSelect"
          node-key="id"
          lazy
        />
       
      </el-col>

       <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
         <div class="head-container">
             <Search @resetChecked="reset"/>
             <!-- 区域七 -->
            <Chart/>
            <Editor/>
            <!-- 表格区域 -->
              <!--表格渲染-->
           <Table1/>
           </div>
       </el-col>
    </el-row>
 </div>
</template>

<script>
import Editor from '../Editor'
import Chart from '../chart'
import Table1 from '../Table1'
import Search from '../Search'
export default {
data() {
return {
  allowDrop(draggingNode, dropNode, type) {
    return false;
    },
    allowDrag(draggingNode) {
        return true;
    },
   defaultProps: {
        label: 'name',
        children: '123',
        isLeaf: 'leaf'
    },
    selected:[],
    select:''
}
},
//生命周期 - 创建完成（访问当前this实例）
async created() {
  this.$root.eventBus.$on('update',()=>{
      const node = this.$refs.tree.getNode(0);
      node.loaded = false;
      node.expand()
  })
},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {
  
},
methods:{
  handleDragStart(node,ev){
    console.log('node.data',node.data);
    let dt = ev.dataTransfer;
    ev.dataTransfer.effectAllowed = 'copy';
    dt.setData('text/plain',JSON.stringify(node.data))
    console.log('dt',dt);
  },
  handleDrop(){

  },
  reset(){
    this.$refs.tree.setCheckedKeys([]);
  },
 async getchannel(node,resolve){
    const {data} = await this.$request.get('channel');
    if(node.level===0){
      return resolve([{name:'全部渠道',id:0}])
    }
    if(node.level>1){
      return resolve([])
    }
    resolve(data.data[0].children)
      // setTimeout(() => {
      //     const data = [{
      //       name: 'leaf',
      //       leaf: true
      //     }, {
      //       name: 'zone',
      //       leaf:true
      //     }];

      //     resolve(data);
      //   }, 500);
  },
  changeSelect(obj,selected,child){
    const nodeList = this.$refs.tree.getCheckedKeys()
    this.$store.commit('channel/SELECT_CHANNEL', {
      current:nodeList
    })
  },
 
},
components: {
  Chart,
  Table1,
  Search,
  Editor
}
}
</script>
<style scoped>
/* @import url(); 引入css类 */

</style>