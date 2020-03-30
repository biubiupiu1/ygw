<template>
    <div class="Message">
        <div class="msg-left">
            <div
                :class="['left-item', item.isCheck ? 'checked' : '']"
                @click="selectItem(index)"
                v-for="(item, index) in messages"
                :key="item.userId"
            >
                <my-avatar
                    class="item-left"
                    shape="square"
                    :user="{ username: item.username, userImage: item.img }"
                ></my-avatar>
                <div class="item-right">
                    <div class="item-right-top">
                        <span class="nickname">{{ item.username }}</span>
                        <span class="time">{{ formatDate(item.lately.createDate) }}</span>
                    </div>
                    <span class="near-chat">{{ item.lately.msgContent }}</span>
                </div>
            </div>
        </div>
        <div class="msg-right">
            <div class="right-main" ref="chats">
                <template v-for="(item, index) in chatList">
                    <div class="chat-item from" v-if="!item.isTo" :key="index">
                        <my-avatar
                            class="user-img"
                            shape="square"
                            :user="{ username: item.username, userImage: item.img }"
                        ></my-avatar>
                        <div class="triangle"></div>
                        <div class="user-chat">{{ item.msgContent }}</div>
                    </div>
                    <div class="chat-item to" v-else :key="index">
                        <div class="user-chat">{{ item.msgContent }}</div>
                        <div class="triangle"></div>
                        <my-avatar
                            class="user-img"
                            shape="square"
                            :user="{ username: item.username, userImage: item.img }"
                        ></my-avatar>
                    </div>
                </template>
            </div>
            <div class="right-input" v-show="curId !== null">
                <textarea
                    v-focus
                    @keydown.enter.exact.prevent="sendClick"
                    v-model="msg"
                    class="textarea"
                ></textarea>
                <div class="send"><div class="send-btn" @click="sendClick">发送</div></div>
            </div>
        </div>
    </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { sendMsg, getMsgList, readMsg } from '@/http';
import { mapState } from 'vuex';
import myAvatar from '@/components/myAvatar';

export default {
    name: 'Message',
    data() {
        return {
            msg: '',
            messages: [],
            chatList: [],
            curId: null,
        };
    },
    computed: { ...mapState(['user', 'isNewMsg']) },
    watch: {
        user(val) {
            if (val.userId && this.unFormatMsg) this.formatMsg();
        },
        isNewMsg(val) {
            if (val) {
                this.getMsgList();
            }
        },
    },
    components: { myAvatar },
    // 未处理的 msg
    unFormatMsg: null,
    created() {
        // this.getMsgList();
        this.getMsgList();
        console.log('created');
    },
    activated() {
        console.log('activated');
        this.$refs.chats.scrollTop = this.$refs.chats.scrollHeight;
        this.initMessageList();
    },
    updated() {
        console.log('updated');
        this.$refs.chats.scrollTop = this.$refs.chats.scrollHeight;
    },
    methods: {
        // 初始化对于有参数的路径
        initMessageList() {
            const { userId } = this.$route.params;
            if (userId === undefined) return false;
            const index = this.messages.findIndex(item => item.userId === userId);
            if (index !== -1) {
                this.selectItem(index);
            } else {
                console.log(this.$route.params);
                this.messages.unshift({
                    ...this.$route.params,
                    lately: { createDate: this.genenateDate() },
                    list: [],
                });
                this.selectItem(0);
            }
        },
        // 对于重新获取数据需要动态更新右边内容
        initChatList() {
            if (this.curId === null) return;
            const index = this.messages.findIndex(item => this.curId === item.userId);
            this.selectItem(index);
        },
        async getMsgList() {
            const [res, err] = await getMsgList();
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            this.$store.commit('setIsNewMsg', false);
            this.unFormatMsg = res.data;
            console.log(this.unFormatMsg);
            const arr = this.unFormatMsg.map(item => item.list.map(cur => cur.msgId));
            this.readMsg(arr.flat());
            if (this.user.userId) this.formatMsg();
        },
        formatMsg() {
            this.unFormatMsg.forEach((item) => {
                const temp = item;
                const { userId } = this.user;
                const lately = item.list[item.list.length - 1];
                item.lately = lately || {};
                item.isCheck = false;
                temp.list = temp.list.map((cur) => {
                    const isTo = cur.senderUserId === userId;
                    const obj = { isTo };
                    obj.userId = cur.senderUserId;
                    obj.username = cur.senderUserUsername;
                    obj.img = cur.senderUserImg;
                    obj.msgContent = cur.msgContent;
                    return obj;
                });
                const index = this.messages.findIndex(cur => cur.userId === item.userId);
                if (index === -1) {
                    this.messages.push(temp);
                } else {
                    this.messages[index] = temp;
                }
            });
            this.messages.sort((a, b) => {
                const { createDate: dateA } = a.lately;
                const { createDate: dateB } = b.lately;
                for (let i = 0; i < 6; i += 1) {
                    if (dateA[i] - dateB[i] !== 0) {
                        return dateB[i] - dateA[i];
                    }
                }
                return 0;
            });
            console.log(this.messages);
            this.messages.splice(0, 0);
            this.initChatList();
        },
        async sendMsg({ distUserId, msg }) {
            const [res, err] = await sendMsg({ distUserId, msg });
            if (err) {
                this.$message.error('发送失败');
                return false;
            }
            console.log(res);
            return true;
        },
        readMsg(arr) {
            readMsg(arr).catch(() => {
                this.readMsg(arr);
            });
        },
        sendClick(e) {
            e.preventDefault();
            const index = this.messages.findIndex(item => this.curId === item.userId);
            const curItem = this.messages[index];
            const { userId, username, userImage: img } = this.user;
            this.sendMsg({ distUserId: curItem.userId, msg: this.msg });
            const obj = {
                userId,
                username,
                img,
                msgContent: this.msg,
                createDate: this.genenateDate(),
                isTo: true,
            };
            curItem.list.push(obj);
            [this.messages[0], this.messages[index]] = [this.messages[index], this.messages[0]];
            curItem.lately = obj;
            this.msg = '';
        },
        selectItem(index) {
            this.curId = this.messages[index].userId;
            this.messages.forEach((item) => {
                item.isCheck = false;
            });
            this.messages[index].isCheck = true;
            this.chatList = this.messages[index].list;
        },
        formatDate(arr) {
            const cur = new Date();
            const curM = cur.getMonth() + 1;
            const curD = cur.getDate();
            const curY = cur.getFullYear();
            if (!arr) {
                return [cur.getHours(), cur.getMinutes()]
                    .map(item => item.toString().padStart(2, '0'))
                    .join(':');
            }
            const [Y, M, D, H, Min] = arr;
            if (D === curD && M === curM && Y === curY) {
                return [H, Min].map(item => item.toString().padStart(2, '0')).join(':');
            }
            return [Y, M, D].join('/');
        },
        genenateDate() {
            const cur = new Date();
            const M = cur.getMonth() + 1;
            const D = cur.getDate();
            const Y = cur.getFullYear();
            const H = cur.getHours();
            const Min = cur.getMinutes();
            const S = cur.getSeconds();
            return [Y, M, D, H, Min, S];
        },
    },
    directives: {
        focus: {
            // 指令的定义
            componentUpdated(el) {
                el.focus();
            },
        },
    },
};
</script>

<style lang="scss" scoped>
@import './Message';
</style>
