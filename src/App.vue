<template>
    <div id="app">
        <el-menu
            v-if="isLoginPage"
            :default-active="activeIndex"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
        >
            <el-menu-item index="/toys">玩具中心</el-menu-item>
            <el-menu-item index="/uploadToy">上传玩具</el-menu-item>
            <el-menu-item index="/orderList">订单中心</el-menu-item>
            <el-menu-item index="/request">请求中心</el-menu-item>
            <el-menu-item index="/message">
                <div class="message-tip" v-show="isNewMsg"><el-badge value="new"></el-badge></div>
                我的消息
            </el-menu-item>
            <el-menu-item index="/userCenter">用户中心</el-menu-item>
            <div class="avatar-btn">
                <el-popover placement="bottom" :close-delay="0" width="50" trigger="click">
                    <div class="exit-panel">
                        <span>退出登录？</span>
                        <el-button type="danger" size="mini" @click="exitLogin">退出</el-button>
                    </div>
                    <my-avatar slot="reference" :user="user"></my-avatar>
                </el-popover>
            </div>
        </el-menu>
        <keep-alive include="Message">
            <router-view />
        </keep-alive>
    </div>
</template>

<script>
import myAvatar from '@/components/myAvatar';
import { mapState } from 'vuex';

export default {
    name: 'App',
    data() {
        return {};
    },
    timer: null,
    watch: {
        user() {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.$store.dispatch('getNewMsg');
            }, 1000);
        },
    },
    components: { myAvatar },
    computed: {
        isLoginPage() {
            return this.$route.path !== '/login';
        },
        activeIndex() {
            return this.$route.path;
        },
        ...mapState(['user', 'isNewMsg']),
    },
    created() {
        this.$store.dispatch('getUser');
    },
    methods: {
        exitLogin() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'Login', params: { reload: true } });
        },
    },
};
</script>

<style lang="scss">
body,
html {
    margin: 0;
    padding: 0;
}

.avatar-btn {
    float: right;
    margin: 10px;
    outline: none;
}

.exit-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message-tip {
    position: absolute;
    right: 0;
    top: -20px;
}
</style>
