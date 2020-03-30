<template>
    <div class="Toys">
        <div class="tabs">
            <el-tabs v-model="activeTab" type="card" @tab-click="tabClick">
                <el-tab-pane
                    v-for="item in category"
                    :key="item.catId"
                    :label="item.catName"
                ></el-tab-pane>
            </el-tabs>
        </div>
        <el-alert v-if="!toys.length" :closable="false" show-icon title="暂无内容" type="info">
        </el-alert>
        <toy-item-view :toys="toys" v-slot="{ item }">
            <el-button
                style="width: 80px"
                @click="showSelfToysDialog(item)"
                type="primary"
                size="small"
                >交换</el-button
            >
        </toy-item-view>
        <self-toys
            :visible.sync="isSelfToysDialog"
            @toyClick="selfToyClick"
            :toys="selfToys"
        ></self-toys>
        <el-dialog title="提示" :visible.sync="isConfirmDialog" width="30%">
            <span>是否确认交换</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isConfirmDialog = false">取 消</el-button>
                <el-button type="primary" @click="determineExchange">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    getCategory, getToys, getSelfToys, exchangeToy,
} from '@/http/index';
import { staticBaseURL } from '@/http/config';
import selfToys from '@/components/selfToys';
import toyItemView from '@/components/toyItemView';

export default {
    name: 'Toys',
    data() {
        return {
            activeTab: 0,
            category: [],
            toys: [],
            selfToys: [],
            staticBaseURL,
            isSelfToysDialog: false,
            isConfirmDialog: false,
        };
    },
    distToy: null,
    reqToy: null,
    components: {
        selfToys,
        toyItemView,
    },
    created() {
        this.getCategory();
        this.getSelfToys();
    },
    methods: {
        async getCategory() {
            const [res, err] = await getCategory();
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            // this.category = [{ catId: 0, catName: 'all' }].concat(res.data);
            this.category = res.data;
            this.getToys();
            return true;
        },
        tabClick() {
            this.getToys();
        },
        async getToys() {
            const item = this.category[this.activeTab];
            const [res, err] = await getToys(item);
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            this.toys = res.data;
            return true;
        },
        async getSelfToys() {
            const [res, err] = await getSelfToys();
            if (err) {
                this.$message.error('获取失败');
                return false;
            }
            this.selfToys = res.data;
            console.log(res.data);
            return true;
        },
        showSelfToysDialog(item) {
            this.distToy = item;
            this.isSelfToysDialog = true;
        },
        selfToyClick(index) {
            this.reqToy = this.selfToys[index];
            this.isConfirmDialog = true;
        },
        async determineExchange() {
            console.log(this.reqToy, this.distToy);
            this.isConfirmDialog = false;
            const distUserItemId = this.distToy.itemId;
            const reqUserItemId = this.reqToy.itemId;
            // eslint-disable-next-line no-unused-vars
            const [res, err] = await exchangeToy({ distUserItemId, reqUserItemId });
            if (err) {
                this.$message.error('请求失败');
                return false;
            }
            this.$message.success('发送请求成功');
            return true;
        },
    },
};
</script>

<style lang="scss" scoped>
@import './Toys';
</style>
