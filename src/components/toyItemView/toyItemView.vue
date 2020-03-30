<template>
    <div class="toyItemView">
        <div class="content-item" v-for="item in toys" :key="item.itemId">
            <div class="content-item-left">
                <div class="content-item-left-top">
                    <el-popover placement="right-start" trigger="hover">
                        <div>
                            <el-button
                                @click="goMessage(item.ofUser)"
                                type="primary"
                                size="mini"
                                icon="el-icon-chat-line-round"
                                >联系</el-button
                            >
                            <span style="font-size: 13px;padding-left: 7px">联系他/她</span>
                        </div>
                        <my-avatar is-username slot="reference" :user="item.ofUser"></my-avatar>
                    </el-popover>
                    <div style="margin-left: 20px">
                        <h2 class="item-name">{{ item.itemName }}</h2>
                        <p class="item-info">{{ item.itemInfo }}</p>
                    </div>
                </div>
                <div class="content-item-left-bottom">
                    <slot :item="item"></slot>
                </div>
            </div>
            <div class="block">
                <el-image
                    class="img-view"
                    fit="scale-down"
                    :src="staticBaseURL + item.itemImage"
                    :preview-src-list="[staticBaseURL + item.itemImage]"
                >
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
            </div>
        </div>
    </div>
</template>
<script>
import { staticBaseURL } from '@/http/config';
import myAvatar from '@/components/myAvatar';
import { mapState } from 'vuex';

export default {
    name: 'toyItemView',
    props: {
        toys: Array,
    },
    computed: {
        ...mapState(['user']),
    },
    components: {
        myAvatar,
    },
    data() {
        return {
            staticBaseURL,
        };
    },
    methods: {
        goMessage(user) {
            if (this.user.userId === user.userId) {
                this.$message.warning('不能给自己发消息');
                return;
            }
            user.img = user.userImage;
            this.$router.push({ name: 'Message', params: user });
        },
    },
};
</script>

<style lang="scss" scoped>
.content-item {
    display: flex;
    justify-content: space-between;
    padding: 20px 30px;
    border-bottom: 1px solid rgba(238, 238, 238, 0.753);
    .block {
        width: 200px;
    }
    .img-view {
        width: 150px;
        height: 150px;
    }
}

.content-item-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.content-item-left-bottom {
    margin-bottom: 10px;
}

.content-item-left-top {
    display: flex;
    align-items: center;
    .item-name {
        margin: 0;
    }
    .item-info {
        margin: 0;
        padding: 10px 0;
    }
}
</style>
