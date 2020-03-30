<template>
    <div class="OrderList">
        <el-alert v-if="!orderList.length" :closable="false" show-icon title="暂无内容" type="info">
        </el-alert>
        <div class="order-item" v-for="item in orderList" :key="item.orderId">
            <div class="item-left">
                <div class="item-line">
                    <el-tag style="margin-right: 30px">我的玩具</el-tag>
                    <toy-simple-view
                        :item="{ itemName: item.itemSrcName, itemImage: item.itemSrcImg }"
                    ></toy-simple-view>
                </div>
                <div class="item-line">
                    <el-tag type="success" style="margin-right: 30px">对方玩具</el-tag>
                    <toy-simple-view
                        :item="{ itemName: item.itemDistName, itemImage: item.itemDistImg }"
                    ></toy-simple-view>
                </div>
                <div class="item-time">创建时间：{{ formatDate(item.orderDate) }}</div>
            </div>
            <el-button
                type="danger"
                @click="deleteClick(item.orderId)"
                icon="el-icon-delete"
                circle
            ></el-button>
        </div>
        <el-dialog title="提示" :visible.sync="isConfirmDialog" width="30%">
            <span>是否删除订单？删除后不可恢复！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isConfirmDialog = false">取 消</el-button>
                <el-button type="primary" @click="determineDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getOrderList, delOrder } from '@/http';
import toySimpleView from '@/components/toySimpleView';

export default {
    name: 'OrderList',
    data() {
        return {
            orderList: [],
            isConfirmDialog: false,
        };
    },
    delOrderId: null,
    components: {
        toySimpleView,
    },
    created() {
        this.getOrderList();
    },
    methods: {
        async getOrderList() {
            const [res, err] = await getOrderList();
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            this.orderList = res.data;
            console.log(this.orderList);
            return true;
        },
        formatDate(arr) {
            return `${arr.slice(0, 3).join('/')}--${arr.slice(3, 5).join(':')}`;
        },
        async determineDelete() {
            const [res, err] = await delOrder(this.delOrderId);
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            if (res) {
                this.$message.success('删除成功');
            }
            this.isConfirmDialog = false;
            this.getOrderList();
            return true;
        },
        deleteClick(id) {
            this.isConfirmDialog = true;
            this.delOrderId = id;
        },
    },
};
</script>

<style lang="scss" scoped>
@import './OrderList';
</style>
