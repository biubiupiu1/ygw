<template>
    <div class="Request">
        <el-alert v-if="isNone" :closable="false" show-icon title="暂无内容" type="info">
        </el-alert>
        <div class="list">
            <div v-for="item in reqArr" :key="item.itemId" class="list-item">
                <template v-if="item.reqList.length">
                    <div class="item-top">
                        <toy-simple-view :item="item"></toy-simple-view>
                    </div>
                    <div class="content">
                        <div class="content-item" v-for="cur in item.reqList" :key="cur.itemId">
                            <div class="content-item-left">
                                <div class="content-item-left-top">
                                    <el-popover placement="right-start" trigger="hover">
                                        <div>
                                            <el-button
                                                type="primary"
                                                size="mini"
                                                @click="goMessage(cur)"
                                                icon="el-icon-chat-line-round"
                                                >联系</el-button
                                            >
                                            <span style="font-size: 13px;padding-left: 7px"
                                                >联系他/她</span
                                            >
                                        </div>
                                        <my-avatar
                                            slot="reference"
                                            :user="{
                                                userImage: cur.reqUserName,
                                                username: cur.reqUserName,
                                            }"
                                        ></my-avatar>
                                    </el-popover>
                                    <div style="margin-left: 20px">
                                        <h2 class="item-name">{{ cur.reqUserItemName }}</h2>
                                    </div>
                                </div>
                                <div class="content-item-left-bottom">
                                    <el-button
                                        style="width: 80px"
                                        @click="agreedClick(cur.reqId)"
                                        type="primary"
                                        size="small"
                                        >同意交换</el-button
                                    >
                                </div>
                            </div>
                            <div class="block">
                                <el-image
                                    fit="scale-down"
                                    class="img-view"
                                    :src="staticBaseURL + cur.reqUserItemImg"
                                    :preview-src-list="[staticBaseURL + cur.reqUserItemImg]"
                                >
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="isConfirmDialog" width="30%">
            <span>是否同意交换？确认后将生成订单。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isConfirmDialog = false">取 消</el-button>
                <el-button type="primary" @click="determineExchange">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getRequest, agreeExchange } from '@/http';
import { staticBaseURL } from '@/http/config';
import myAvatar from '@/components/myAvatar';
import toySimpleView from '@/components/toySimpleView';
import { mapState } from 'vuex';

export default {
    name: 'Request',
    data() {
        return {
            reqArr: [],
            staticBaseURL,
            isConfirmDialog: false,
            isNone: false,
        };
    },
    computed: {
        ...mapState(['user']),
    },
    reqId: null,
    components: { myAvatar, toySimpleView },
    created() {
        this.getRequest();
    },
    methods: {
        async getRequest() {
            const [res, err] = await getRequest();
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            this.reqArr = res.data;
            this.isNone = true;
            this.reqArr.forEach((element) => {
                if (element.reqList.length) this.isNone = false;
            });
            console.log(this.reqArr);
            return true;
        },
        agreedClick(reqId) {
            this.reqId = reqId;
            this.isConfirmDialog = true;
            console.log(reqId);
        },
        async determineExchange() {
            this.isConfirmDialog = false;
            // eslint-disable-next-line no-unused-vars
            const [res, err] = await agreeExchange(this.reqId);
            if (err) {
                this.$message.error('提交失败');
                return false;
            }
            this.$message.success('提交成功');
            this.getRequest();
            return true;
        },
        goMessage(cur) {
            console.log(cur);
            const user = {
                username: cur.reqUserName,
                userId: cur.reqUserId,
                img: cur.reqUserImage,
            };
            if (this.user.userId === user.userId) {
                this.$message.warning('不能给自己发消息');
                return;
            }
            this.$router.push({ name: 'Message', params: user });
        },
    },
};
</script>

<style lang="scss" scoped>
@import './Request';
</style>
