<template>
    <div class="avatar">
        <!-- 对数据延迟显示 -->
        <template v-if="user.username">
            <el-avatar
                v-if="/\.(png|jpeg|jpg)$/.test(user.userImage)"
                :size="40"
                :src="baseURL + user.userImage"
                :shape="shape"
                >{{ user.username.slice(0, 1) }}</el-avatar
            >
            <el-avatar :shape="shape" v-else :size="40">{{ user.username.slice(0, 1) }}</el-avatar>
            <span class="username" v-if="isUsername">{{ user.username }}</span>
        </template>
    </div>
</template>
<script>
import { staticBaseURL } from '@/http/config';

export default {
    name: 'my-avatar',
    props: {
        isUsername: {
            type: Boolean,
            default: false,
        },
        user: {
            username: String,
            userImage: String,
        },
        shape: {
            type: String,
            default: 'circle',
        },
    },
    data() {
        return {
            baseURL: staticBaseURL,
        };
    },
    created() {},
};
</script>

<style lang="scss" scoped>
.avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.username {
    padding: 10px;
    color: rgb(73, 71, 71);
}
</style>
