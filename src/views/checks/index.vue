<template>
  <template v-if="!getAdmin">
  </template>
  <Notfound v-else-if="!isAvailable()"/>
  <template v-else>
      <div class="w-full py-[9px] flex items-center gap-[17px] pl-[17px] bg-[#F9F9F9] shadow-md">
        <MyButton @onclick="()=>$router.push({ name: 'home' })" name="首页" :active="false"></MyButton>
        <MyButton name="查重管理" :active="false"></MyButton>
        <MyButton name="查重列表" :active="true"></MyButton>
      </div>
      <div class="flex flex-row gap-[6px] my-[30px] ml-[37px] ">
        <input type="text" v-model="search.platform_nickname" placeholder="平台账号" class="border solid border-gray-300 p-2 rounded-[12px] w-[200px] h-[41px]">
        <SelectBox @onchange="(value)=>{search.platform_id=value}" placeholder=" 选择平台"  :groups="platforms" :group="search.platform_id" class="w-[200px]"/>
        <IconMyButton icon="iconsearch" name="首页" @onclick="getChecks"></IconMyButton>
        <IconMyButton v-if="getAdmin.permissions[13]" ref="addbutton"  @onclick="()=>{showAddCheck()}" icon="circleplus" name="添加培训" ></IconMyButton>
      </div>
      <div class="w-full px-[37px] mb-[106px]">
        <table class="w-full p-[1px]">
            <thead>
              <tr>
                <th class="w-[55px]">序号</th>
                <th>业务组</th>
                <th>业务员</th>
                <th>平台</th>
                <th>平台账号</th>
                <th>客户姓名</th>
                <th>客户性别</th>
                <th>客户年龄</th>
                <!-- <th>平台账号</th> -->
                <th>客户状态</th>
                <th>新增日期</th>
                <th class="w-[172px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in checks" :key="item.id">
                <td >{{ index+1 }}</td>
                <td v-if="item">{{ item.group.name}}</td>
                
                <td v-if="item">{{ item.sale_man }}</td>
                
                <td v-if="item">{{ item.platform.name }}</td>
                
                <td v-if="item">{{ item.platform_nickname }}</td>
                
                <td v-if="item">{{ item.client_name }}</td>
                
                <td v-if="item">{{ item.client_sex==1?'男':'女' }}</td>
                
                <td v-if="item">{{ item.client_age }}</td>
                
                <!-- <td v-if="item">{{ item.platform_nickname }}</td>
                 -->
                <td v-if="item">{{ item.client_status.name }}</td>
                
                <td v-if="item">
                 {{moment().utc(new Date(item.added_date)).local().format("yyyy-MM-DD") }}
                </td>
                
                <td v-if="item" class="flex justify-around items-center text-[#0B88F9]">
                  <button ref="useredit"  @click="()=>goComment(item.id)">评论</button>
                  <button ref="useredit"  @click="showEditCheck(index)">编辑</button>
                  <button @click="()=>showDeleteCheck(index)">删除</button>
                </td>
                
              </tr>
            </tbody>
        </table>
        <Pagination v-if="totalPage" :index="index" :currentPage="currentPage" :totalItems="totalPage" @onClick="changepage" @onchangePage="onchangePage"/>
      </div>
      <div ref="dialog" class="fixed z-[99991] top-0 right-0 left-0 bottom-0 bg-[#000] opacity-[0.3]" v-if="showdialog">
      </div>
      <Register @onSuccess="refresh" v-if="itemid!=null" :class="{'hidden':!showdialog}" :item="checks[itemid]" />
      <Register @onSuccess="refresh" v-else :class="{'hidden':!showdialog}"  />
  </template>
</template>

<script>

import { defineComponent } from 'vue'
import {BIconArrowRepeat } from 'bootstrap-icons-vue';
import IEcharts from 'vue3-echarts-v3/src/full.js';
import MyButton from '@/components/Button.vue'
import IconMyButton from '@/components/IconButton.vue'
import Pagination from '@/components/Pagination.vue'
import SelectBox from '@/components/SelectBox.vue'
import { useAuthStore } from '@/pinia/modules/useAuthStore';
import Register from './register.vue'
import { mapState, mapActions } from 'pinia'
import Notfound from '@/views/notfound/index.vue'
import axios from 'axios'
import moment from 'moment'
export default defineComponent({
  name: 'checks',
  components: {
    BIconArrowRepeat,
    IEcharts,
    MyButton,
    IconMyButton,
    Pagination,
    SelectBox,
    Register,
    Notfound
  },
  data:()=>({
    showdialog:false,
    list:Array(15).fill(0),
    checks:[],
    itemid:null,
    currentPage:1,
    totalPage:null,
    platforms:[],
    index:15,
    search:{
      platform_nickname:'',
      platform_id:''
    },
    itemid:null,
  }),
  mounted() {
    this.getChecks();
    this.getList();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeRouteLeave(to, from, next) {
    document.removeEventListener('click', this.handleClickOutside);
    next();
  },
  computed: {
      ...mapState(useAuthStore, ['getAdmin']),
  },
  methods:{
    moment: function () {
        return moment;
    },
    ...mapActions(useAuthStore, ['fetchAdmin']),
    showAddCheck(){
      this.showdialog=true;
      this.itemid=false;
    },
    showEditCheck(index){
      this.itemid=index;
      this.showdialog=true;
    },
    async getList() {
      try {
        const response = await axios.get(`/checkplatform`);
        if(response.data.status==1){
          this.platforms = response.data.platforms;
        }else{
          this.fetchAdmin();
        }
      }
      catch (error) {
        console.log(error);
      };
    },
    async getChecks() {
      try {
        const response = await axios.get(`/checks?page=${this.currentPage}&count=${this.index}&platform_id=${this.search.platform_id}&platform_nickname=${this.search.platform_nickname}`);
        if(response.data.status==1){
          this.checks = response.data.checks.data;
          this.totalPage=response.data.checks.total;
        }else{
          this.fetchAdmin();
        }
      }
      catch (error) {
        console.log(error);
      };
    },
    isAvailable(){
        if(this.getAdmin.permissions[13]!=null){
            return true;
        }
        return false;
    },
    handleClickOutside(event) {
      if(this.showdialog){
        if(this.$refs.dialog.contains(event.target)){
          this.showdialog=false;
        }
      }
    },
    goComment(value){
      this.$router.push({ name: 'checkcomments', params: { id:value, }});
    },
    showDeleteCheck(index){
      layer.config({
        skin: ''
      })
      layer.open({
        title:`删除查重`,
        content: `<i class="layui-layer-ico layui-layer-ico3 "></i><span class='ml-[40px]'>删除后无法恢复</span>`,
        btn:['确定','取消'],
        closeBtn: 0,
        shadeClose: 1,
        yes: (i, layero) => {
          this.deletecheck(index);
          layer.close(i);
        },
      });
    },
    async deletecheck(index) {
      try {
        const response = await axios.get(`/deletecheck/${this.checks[index].id}`);
        if(response.data.status==1){
          layer.config({
            skin: ''
          })
          layer.msg("操作成功");
          this.checks.splice(index,1);
        }else{
          this.message='网络错误';
          this.showDialog();
        }
      }
      catch (error) {
        console.log(error);
      };
    },
    changepage(value){
      this.currentPage=value;
      this.getChecks();
    },
    onchangePage(value){
        this.index=value;
        this.changepage(1);
        this.list=Array(Number(value)).fill(0);
    },
    refresh(){
      this.showdialog=false;
      this.currentPage=1;
      this.getChecks();
    },
    showDialog(){
        layer.config({
          skin: 'login-class'
        })
        layer.open({
            type:1,
            offset:'b',
            title:false,
            content: this.message,
            closeBtn: 0,
            shadeClose:1,
        });
    },
    showSucss(){
      layer.config({
        skin: 'success-class'
      })
      layer.open({
        title:false,
        content: '成功',
        btn:'确定',
        btnAlign: 'c',
        closeBtn: 0,
        shadeClose:1,
      });
    },
  }
})
</script>