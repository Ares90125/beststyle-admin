<template>
  <div class="w-full py-[9px] flex items-center gap-[17px] pl-[17px] bg-[#F9F9F9] shadow-md">
    <MyButton @onclick="()=>$router.push({ name: 'home' })" name="首页" :active="false"></MyButton>
     <MyButton name="账号管理" :active="false"></MyButton>
     <MyButton name="管理设置" :active="true"></MyButton>
  </div>
  <div class="flex flex-row gap-[6px] my-[30px] ml-[37px] ">
    <input type="text" placeholder="用户ID" class="border solid border-gray-300 p-2 rounded-[12px] w-[200px] h-[41px]">
    <input type="text" placeholder="IP地址" class="border solid border-gray-300 p-2 rounded-[12px] w-[200px] h-[41px]">
    <SelectBox placeholder="部门"  :groups="departments" :group="department"/>
    <IconMyButton icon="iconsearch" name="首页" ></IconMyButton>
    <IconMyButton ref="addbutton"  @onclick="()=>showdialog=true" icon="circleplus" name="添加用户" ></IconMyButton>
  </div>
  <div class="w-full px-[37px] mb-[106px]">
    <table class="w-full p-[1px]">
        <thead>
          <tr>
            <th class="w-[55px]">序号</th>
            <th>用户名</th>
            <th>姓名</th>
            <th>部门</th>
            <th>状态</th>
            <th>角色</th>
            <th>管理员</th>
            <th>IP地址</th>
            <th>地区</th>
            <th class="w-[211px]">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in list" :key="item.id">
            <td >{{ index+1 }}</td>
            <td v-if="Itemlist[index]">用户名</td>
            
            <td v-if="Itemlist[index]">姓名</td>
            
            <td v-if="Itemlist[index]">部门</td>
            
            <td v-if="Itemlist[index]">状态</td>
            
            <td v-if="Itemlist[index]">角色</td>
            
            <td v-if="Itemlist[index]">管理员</td>
            
            <td v-if="Itemlist[index]">IP地址</td>
            
            <td v-if="Itemlist[index]">地区</td>
            
            <td v-if="Itemlist[index]" class="flex justify-around items-center text-[#0B88F9]">
              <button ref="useredit"  @click="editUser(1)">编辑</button>
              <button >删除</button>
            </td>
            
          </tr>
        </tbody>
    </table>
    <Pagination :index="index" :currentPage="currentPage" :totalItems="totalPage" @onClick="changepage" @onchangePage="onchangePage"/>
  </div>
  <div class="fixed z-[99991] top-0 right-0 left-0 bottom-0 bg-[#000] opacity-[0.3]" v-if="showdialog">
  </div>
  <Register ref="dialog" :class="{'hidden':!showdialog}"/>
</template>


<script>

import { defineComponent } from 'vue'
import {BIconArrowRepeat } from 'bootstrap-icons-vue';
import IEcharts from 'vue3-echarts-v3/src/full.js';
import MyButton from '@/components/Button.vue'
import IconMyButton from '@/components/IconButton.vue'
import Pagination from '@/components/Pagination.vue'
import SelectBox from '@/components/SelectBox.vue'
import Register from './register.vue'
import axios from 'axios'
import moment from 'moment'
export default defineComponent({
  name: 'admin',
  components: {
    BIconArrowRepeat,
    IEcharts,
    MyButton,
    IconMyButton,
    Pagination,
    SelectBox,
    Register
  },
  data:()=>({
    showdialog:false,
    list:Array(15).fill(0),
    Itemlist:Array(4).fill(1),
    currentPage:1,
    totalPage:50,
    index:15,
    department:'',
    departments:[
      {
        id:1,
        name:'first'
      },
      {
        id:2,
        name:'twice'
      },
      {
        id:3,
        name:'third'
      }
    ],
  }),
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeRouteLeave(to, from, next) {
    document.removeEventListener('click', this.handleClickOutside);
    next();
  },

  methods:{
    handleClickOutside(event) {
      if(this.showdialog){
        if((this.$refs.useredit && `${this.$refs.useredit[0]}`==`${event.target}`) || this.$refs.addbutton.$el.contains(event.target) || this.$refs.dialog.$el.contains(event.target)){
        }else{
          this.showdialog=false;
        }
      }
    },
    changepage(value){
      this.currentPage=value;
    },
    onchangePage(value){
        this.index=value;
        this.list=Array(Number(value)).fill(0);
    },
    editUser(value){
      this.showdialog=true
    }
  }
})
</script>