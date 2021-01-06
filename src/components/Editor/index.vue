<template>
<div style="margin:30px 0">
  <el-button
    type="primary"
    @click="showEditor"

  >自定义表单</el-button>
  <div class="app-container" v-show='isshow'>
      <div ref="editor" class="text" @drop="handleTargetDrop" @dragover="handleTargetDragOver" style="zIndex:1;position:relative"/>
  </div>
</div>

</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Editor',
  data() {
    return {
      isshow:false
    }
  },
  computed: {
   
  },
  mounted() {
    const _this = this
    var editor = new E(this.$refs.editor)
    // 自定义菜单配置
    editor.create()
  },
  methods: {
    showEditor(){
      this.isshow=!this.isshow
    },
    handleTargetDrop(e){
      // const table = document.querySelector('table');
      const el = this.$refs.editor.querySelectorAll('table>tbody>tr>td')[1]
      const elName = this.$refs.editor.querySelectorAll('table>tbody>tr>th')[1]
     let data = e.dataTransfer;
      let content = JSON.parse(data.getData("text/plain"));
      console.log('content',content.name);
      el.innerHTML=content.name;
      elName.innerHTML = '渠道名称'
      e.preventDefault();
      e.stopPropagation();
    },
    handleTargetDragOver(e){
      e.preventDefault();
    }
  }
}
</script>

<style scoped>
.app-container{
  margin-top: 20px;
}
  .text {
    text-align:left;
  }
 ::v-deep .w-e-text-container {
    height: 420px !important;
  }
</style>
