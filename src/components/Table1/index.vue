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
     <el-tabs v-model="activeName" @tab-click="handleClick" >
          <el-tab-pane v-for="(item) in tabIndex" :key="item.name" :label="item.label" :name="item.name" > 
            <!-- 切换到LEG时 -->
             <el-table v-loading="logRoLoading" 
             element-loading-text="拼命加载中..." 
             element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0,0,0, 0.3)" 
              :data="logLegData" 
              border 
              fit 
              stripe 
              highlight-current-row  
              style="width:100%" ref="sysMenuTable" 
              v-show="item.name==='first'"
              :span-method="mergeTables"
              >
              <el-table-column v-for="item in tableIndexLeg" :key="item.dataKey " :prop="item.dataKey " :label="item.name " :min-width="item.width" >
                <el-table-column v-for="item_WIBE in item.children" :key="item_WIBE.dataKey" :prop="item_WIBE.dataKey" :label="item_WIBE.name " :min-width="item_WIBE.width" v-show="item.children.length>0">
                      <template slot-scope="scopeWibe">
                         {{scopeWibe.row.leg.wibe.originList}}
                      </template>
                   </el-table-column>
                 <!-- <template slot-scope="scope">
                   {{scope.row[item.dataKey]}}
                 </template> -->
              </el-table-column>
            </el-table> 
            <!-- 切换到SEG时 -->
             <el-table v-loading="logRoLoading" 
             element-loading-text="拼命加载中..." 
             element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0,0,0, 0.3)" 
              :data="logRegData" 
              border 
              fit 
              stripe 
              highlight-current-row  
              style="width:100%" ref="sysMenuTable" 
              v-show="item.name==='second'"
              :span-method="mergeTables"
              >
              <!-- 渲染WIBE -->
              <!-- <el-table v-show="item.children.length>0 && item.dataKey==='WIBE'" :data="logWibeData">
                  <el-table-column v-for="item_WIBE in item.children" :key="item_WIBE.dataKey" :prop="item.dataKey" :label="item.name " :min-width="item.width">

                  </el-table-column>
              </el-table> -->
              <el-table-column v-for="item in tableIndexReg" :key="item.dataKey " :prop="item.dataKey " :label="item.name " :min-width="item.width" >
                <el-table-column v-for="iitem in item.children" :key="iitem.dataKey"  :label="iitem.name " :min-width="iitem.width" v-show="item.children.length>0">
                      <template slot-scope="scope1">
                         <span v-for="iiitem in scope1.row.leg[item.dataKey][iitem.datakey]" :key="iiitem">{{iiitem}}</span>
                      </template>
                   </el-table-column>
                 <!-- <template slot-scope="scope">
                   {{scope.row[item.dataKey]}}
                 </template> -->
              </el-table-column>
            </el-table> 
             </el-tab-pane>
        </el-tabs>
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
        logRoLoading:false,
        logLegData:[],
        tableIndexReg: [
          {
            dataKey: "flightDate",
            name: "日期",
            width: 200,
            children:[]
          },
          {
            dataKey: "origin",
            name: "航段",
            width: 100,
            children:[]
          },
          {
            dataKey: "wibe",
            name: "wibe",
            width: 500,
            children:[{
              dataKey: "smallCabins",
              name: "子舱位",
              width: 100
            },{
              // 订座数，暂时不获取
              dataKey: "orders",
                name: "订座数",
                width: 100
            },
            {
              // 限制销售数，暂时不获取
              dataKey: "limit1",
              name: "限制销售数",
              width: 100
            },
            {
              dataKey: "segDatas",
                name: "最大可销售数",
                width: 100
            }
            ]
          },
          {
            dataKey: "dataBase",
            name: "数据库",
            width: 500,
            children:[{
              dataKey: "classCode",
              name: "子舱位",
              width: 100
            },{
              // 订座数，暂时不获取
              dataKey: "orders",
                name: "订座数",
                width: 100
            },{
              // 暂时不获取
              dataKey: "limit2",
              name: "限制销售数",
              width: 100
            },
            {
              // 剩余座位数，暂时不获取
              dataKey: "seatsAvailable",
                name: "最大可销售数",
                width: 100
            }]
          },
        ],
         tabIndex:[
           {
             label:'LEG',
             name:"first"
          },{
            label:"SEG",
            name:"second"
          },
         ],
         activeName:"first",
         tableIndexLeg: [
         {
          dataKey: "flightDate",
          name: "日期",
          width: 200,
          children:[]
        },
        {
          dataKey: "origin",
          name: "始发地",
          width: 100,
          children:[]
        },
        {
          dataKey: "WIBE",
          name: "WIBE",
          width: 500,
          children:[{
            dataKey: "compartmentCode",
            name: "舱位",
            width: 100
          },{
            dataKey: "operatingCapacity",
            name: "物理座位数",
            width: 100
          },{
            // 订座数，暂时不获取
             dataKey: "orders",
              name: "订座数",
              width: 100
          },
          {
            // 剩余座位数，暂时不获取
             dataKey: "grossAvailability",
              name: "剩余座位数",
              width: 100
          }
          ]
        },
        {
          dataKey: "dataBase",
          name: "数据库",
          width: 500,
          children:[{
            dataKey: "compartmentCode",
            name: "舱位",
            width: 100
          },{
            dataKey: "operatingCapacity",
            name: "物理座位数",
            width: 100
          },{
            // 订座数，暂时不获取
             dataKey: "orders",
              name: "订座数",
              width: 100
          },
          {
            // 剩余座位数，暂时不获取
             dataKey: "grossAvailability",
              name: "剩余座位数",
              width: 100
          }]
        },
      ],
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