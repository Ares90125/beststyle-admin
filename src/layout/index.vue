<template>
  <div class="flex font-sans h-full min-h-screen ">
    <div class="w-[206px] min-w-[206px] bg-[#494B52]" :class="{'w-[70px] min-w-[70px]':!append}">
      <div class="text-white bg-[#2E313B] leading-1 p-5 flex items-center justify-between">
        <span class="admin-header flex items-center">
          <BIconPersonCircle class="text-[30px] align-middle mr-2 text-[#FFFFFF] inline-block" />
          <span class="mr-[7px] text-[14px]" :class="{'hidden':!append}">
            admin
          </span>
        </span>
        <BIconPower @click="signOut" class="float-right text-[25px] text-[#BAA372] inline-block" :class="{'hidden':!append}"/>
      </div>
      <router-link :to="{name:'home'}" class="flex items-center text-center bg-[#494B52] px-[24px]  nav-link py-4 text-[16px]" active-class="active-nav-link">
        <img :src="currentUrl.includes('home')?'/assets/icons/chome.svg':'/assets/icons/home.svg'"  class="icon mr-[12px] font-bold text-[22px] " />
        <p class="font-bold leading-none"  :class="{'hidden':!append}">
            首页
        </p>
      </router-link>
      <template  v-if="getAdmin" v-for="(item, index) in menu">
        <MainMenu v-if="isAvailable(item)" :value="item" :append="append"/>
      </template>
      
    </div>
    <div class="h-auto min-w-980 bg-white w-full min-w-[980px] relative">
      <div class="w-full py-[18.2px] px-[17px] flex items-center">
        <img :src="append?'/assets/icons/indent-left.svg':'/assets/icons/indent-right.svg'"  class="w-[29px] h-[29px]" @click="()=>append=!append"/>
        <p class="font-bold text-[#B2B2B2] text-[22px] ml-[14px]">面板</p>
      </div>
      <router-view />
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue'
import { BIconPersonCircle, BIconPower} from 'bootstrap-icons-vue';
import Content from './components/Content/index.vue';
import { useAuthStore } from '@/pinia/modules/useAuthStore';
import { mapState, mapActions } from 'pinia'
import { Howl, Howler } from 'howler';
import Pusher from 'pusher-js';
import MainMenu from '../components/MainMenu.vue';
import menu from './menu.json';
export default defineComponent({
  name: 'layout',
  components: {
    BIconPersonCircle,
    BIconPower,
    MainMenu,
  },
  data: () => ({
    menu,
    append:true,
    currentUrl : window.location.href
  }),
  watch: {
    $route(to, from) {
      console.log(to.path);
      this.currentUrl = to.path;
    }
  },
  computed: {
      ...mapState(useAuthStore, ['getAdmin']),
  },
  mounted() {
  },
  methods: {
    ...mapActions(useAuthStore,['logout']),
   isAvailable(item){
    for(let i=0;i<item.submenu.length; i++){
      if(this.getAdmin.permissions[item.submenu[i].id]){
        return true;
      }
    }
    return false;
   },
   signOut(){
    this.logout();
    this.$router.push({name:'login'});
   }
  }
});
</script>