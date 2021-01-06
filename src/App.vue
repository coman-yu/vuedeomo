<template>
  <el-container style="height:100%">
    <el-header class="header">
      <el-row>
        <el-col :span="12" class="logo">
          VueDemo
        </el-col>
        <el-col :span="12" style="text-align:right">
          你好，测试
         <i class="el-icon-arrow-down"></i>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu style="height:100%" :default-active="activeIndex" mode="vertical" background-color="#fff"
          text-color="#000" active-text-color="#409EFF" @select="changeMenu" :default-openeds="openMenu" router>
          <template v-for="item in menu">
            <el-menu-item :index="item.path" :key="item.path" v-if="!item.submenu">
              <i :class="item.icon" style="color:#000"></i>
              {{item.text}}
            </el-menu-item>
            <el-submenu :key="item.path" :index="item.path" v-else>
              <template v-slot:title>
                <i :class="item.icon" style="color:#000"></i>
                {{item.text}}
              </template>
              <div style="background:#e9e9e9">
                <el-menu-item :key="sub.path" :index="item.path+sub.path" v-for="sub in item.submenu" >{{sub.text}}
                </el-menu-item>
              </div>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
            <Bread/>
            <Tabs/>
        <div style="padding:15px 0;">
          <Channel/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  
  import Bread from './components/Bread/index.vue'
  import Tabs from './components/tabs/'
  import Channel from './components/channel'
  export default {
    name: "App",
    data() {
      return {
        activeIndex: "/menu1",
        openMenu: [],
        menu: [{
            text: "菜单一",
            path: "/menu1",
            icon: "el-icon-menu",
          },
          {
            text: "菜单二",
            path: "/menu2",
            icon: "el-icon-menu",
            submenu: [{
                text: "菜单2-1",
                path: "/menu2-1",
              },
              {
                text: "菜单2-2",
                path: "/menu2-2",
              },
              {
                 text: "菜单2-3",
                path: "/menu2-3",
              }
            ],
          },
           {
            text: "菜单三",
            path: "/menu3",
            icon: "el-icon-menu",
            submenu: [{
                text: "菜单3-1",
                path: "/menu3-1",
              },
              {
                text: "菜单3-2",
                path: "/menu3-2",
              },
            ],
          },
          {
            text: "菜单四",
            path: "/menu4",
            icon: "el-icon-menu",
            submenu: [{
                text: "菜单4-1",
                path: "/menu4-1",
              },
              {
                text: "菜单4-2",
                path: "/menu4-2",
              },
            ],
          },
        ],
        currentIndex: 0,
      };
    },

    methods: {
      goto(path, idx) {
        // console.log(this.$router);
        // this.$router.push(path);
        // this.$router.replace(path);
        this.currentIndex = idx;
      },
      back() {
        this.$router.back();
      },
      changeMenu(path) {
        this.activeIndex = path;
      }
    },
    components: {
      Bread,
      Tabs,
      Channel,
    
    },
 
  };
</script>


<style lang="scss" scoped>
  html {
    height: 100%;
  }

  body {
    margin: 0;
    height: 100%;
  }

  .header {
    line-height: 60px;
    color: #fff;
    background-color: #4491e0;

    .logo {
      font-size: 24px;
      color: #ffffff;

      i {
        font-size: 40px;
        vertical-align: middle;
        margin-right: 5px;
      }
    }

    .is-active {
      i {
        color: inherit !important;
      }
    }
  }
</style>