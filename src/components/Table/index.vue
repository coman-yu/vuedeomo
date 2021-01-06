<template>
  <div>
    <el-dialog v-el-drag-dialog  :title="title" :visible.sync="dialogTableVisible" :fullscreen="isfull">
        <div slot="title" >
            {{title}}
            <i class="el-icon-full-screen" @click="fullchange"></i>
        </div>
        <div>
            <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
              <el-form-item label="渠道" prop="name">
                <el-input v-model="form.name" :disabled="isdisabled" />
              </el-form-item>
           
            <el-form-item label="总数" prop="total">
              <el-input v-model.number="form.total" :disabled="isdisabled"/>
            </el-form-item>
            <el-form-item label="日期" prop="date">
                        <el-date-picker
                        v-model="form.date"
                        type="date"
                        placeholder="选择日期"
                        :disabled="isdisabled"
                        >
                        </el-date-picker>
                   
            </el-form-item>
            <el-form-item label="成功" prop="success">
              <el-input v-model="form.success" :disabled="isdisabled"/>
            </el-form-item>
            <el-form-item label="失败" prop="fail">
                 <el-input v-model="form.fail" :disabled="isdisabled"/>
            </el-form-item>
          </el-form>
             </div>
          <div slot="footer" class="dialog-footer" v-show="showFoot">
            <el-button @click="cancel">取消</el-button>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
          </div>
    </el-dialog>
     <el-button
            type="primary"
            @click="showTable"
          >列表</el-button>
    <el-table
      :data="goodsList"
      :stripe="true"
       height="200"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-if="isshow"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="渠道"></el-table-column>
      <el-table-column prop="total" label="总数">
      </el-table-column>
      <el-table-column prop="success" label="渠道成功总数"></el-table-column>
      <el-table-column prop="fail" label="渠道失败总数"></el-table-column>
      <el-table-column prop="options" label="操作">
        <template v-slot:default="scope">
          <el-button
            type="text"
            @click="edit(scope.row.id)"
          >修改</el-button>
          <el-button
            type="text"
            @click="remove(scope.row.id)"
          >删除</el-button>
          <el-button
            type="text"
            @click="search(scope.row.id)"
          >预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class='page-container'>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="changePage"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        v-if="isshow">
    </el-pagination>
    </div>
  </div>
</template>
<script>
 import elDragDialog from '../DragDialog'
 import formateTime from '../../utils/formatTime'
// import pagnation from '../Pagination'
export default {
  directives: { elDragDialog },
  data() {
    return {
      totalNum:0,
      rules:{
          date:[{required:true,message:'请选择日期'}],
          name:[{required:true,message:'请输入编号'}],
          total:[{required:true,message:'请输入总数'}],
          success:[{required:true,message:'请输入成功的数量'}],
          fail:[{required:true,message:'请输入失败的数量'}]
      },
      id:0,
      showFoot:true,
      currentId:0,
      isfull:false,
      isshow:false,
      isdisabled:false,
        initData:{
        date:'',
        name:'',
        total:0,
        success:0,
        fail:0
        },
      form:{
        date:'',
        name:'',
        total:0,
        success:0,
        fail:0
      },
        title:'',
        dialogTableVisible: false,
        goodsList: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        multiDeleteVisible: false,
        multipleSelectionFlag: false,
        removeCount: 0,
        removeArr: [],
        idArr: [],
        value: 5,
        showPage: true,
        currentSelect:[]
      };
  },
  methods: {
   async submit(id){
     this.$refs.form.validate(async (valid)=>{
       if(valid){
         if(this.title==='修改'){
            try{
              this.form.date = this.form.date.format("yyyy-MM-dd");
            }catch(err){
              console.log(1);
            }
            const res = await this.$request.put(`/channel/modify/${this.id}`,{
              ...this.form,
              currentId:this.currentId
            })
            if(res.data.code===1001){
              this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.dialogTableVisible=false;
            const {data} = await this.$request.get('/channel');
            const {children} = data.data[0]
              if(this.currentSelect.includes(0)){
                this.goodsList=children
              }else if(!this.currentSelect.includes(0)){
                for(let i = 0;i<this.currentSelect.length;i++){
                  this.goodsList = children.filter(item=>this.currentSelect.includes(item.id)
                  )
                }
          }
            }
      }
      if(this.title==='添加'){
            try{
              this.form.date = this.form.date.format("yyyy-MM-dd");
            }catch(err){
              console.log('');
            }
            const res = await this.$request.post(`/channel/add/${this.id}`,{
              ...this.form
            })
            if(res.data.code===1001){
              this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.dialogTableVisible=false;
            this.$root.eventBus.$emit('update');
            }
      }
       }else{
         return false;
       }
     })
    
    },
    showTable(){
      this.isshow=!this.isshow
    },
    cancel(){
      this.dialogTableVisible=!this.dialogVisible
    },
    reset(){
      if(this.title==='修改'){
         Object.assign(this.form,this.initData)
      }
      if(this.title==='添加'){
        Object.assign(this.form,this.initData)
      }
    },
      fullchange(){
          this.isfull=!this.isfull
      },
    dialogVisible() {
      this.multiDeleteVisible = false;
    },
    
    async handleSizeChange(){

    },
    remove(id) {
      this.$confirm("确定删除这条数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const result = await this.$request.put(`/channel/${this.id}`,{
          currentId:id
        });
        if (result.data.code === 1001) {
          this.$message({
            type: "success",
            message: "成功移除一条数据",
          });
          this.goodsList = this.goodsList.filter(item=>item.id!==id);
           this.$root.eventBus.$emit('update');
        }
      });
    },
   async edit(id) {
      this.isdisabled=false
      this.showFoot = true
        const res = await this.$request.get('/channel');
        const {data} =res.data;
        const {children} = data[0];
        let item = children.filter(item=>item.id===id)
        item = item[0];
        Object.assign(this.initData,item)
        Object.assign(this.form,item);
        this.title='修改';
        this.currentId = id
        this.dialogTableVisible=true
    },
    async search(id){
       const res = await this.$request.get('/channel');
        const {data} =res.data;
        const {children} = data[0];
        let item = children.filter(item=>item.id===id);
         item = item[0];
         console.log('item',item);
         Object.assign(this.initData,item);
         Object.assign(this.form,item);
         this.title="预览";
         this.dialogTableVisible=true;
         this.isdisabled=true
         this.showFoot=false
    },
    handleSelectionChange(val) {
      if (val.length !== 0) {
        this.multipleSelectionFlag = true;
      } else {
        this.multipleSelectionFlag = false;
      }
      this.removeCount = val.length;
      this.removeArr = [];
      val.forEach((item) => {
        this.removeArr.push(item);
      });
    },
  },
  async created() {
    this.$root.eventBus.$on('add',()=>{
        this.isdisabled=false
        this.showFoot = true
        this.title='添加';
        Object.assign(this.form,{
           date:'',
            name:'',
            total:0,
            success:0,
            fail:0
        })
        this.dialogTableVisible=true
    })
     const {data} = await this.$request.get('/channel');
       this.id = data.data[0]._id; //要查找的id
  },
  components: {
   
  },
  watch: {
    '$store.state.channel.currentSelected':async function(newVal){
      this.currentSelect = newVal;
      const {data} = await this.$request.get('/channel');
       this.id = data.data[0]._id; //要查找的id
      const {children} = data.data[0]
      //  this.goodsList=data.data[0].children
       this.goodsList=[];
       if(newVal.includes(0)){
         this.goodsList=children
      }else if(!newVal.includes(0)){
        for(let i = 0;i<newVal.length;i++){
          this.goodsList = children.filter(item=>newVal.includes(item.id)
          )
        }
      }
      this.totalNum = this.goodsList.length
      }
  }
};

</script>
<style lang="scss">
// .el-dialog{
//   margin: 0 auto !important;
// }
.el-dialog__header{
  background: #4491e0;
  color:#fff
}
.el-dialog__headerbtn .el-dialog__close{
   color:#fff !important
}
.page-container{
    float: right;
}
.el-icon-full-screen{
  position:absolute;
  right:50px;
  cursor: pointer;
}
</style>