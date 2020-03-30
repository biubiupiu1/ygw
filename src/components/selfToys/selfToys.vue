<template>
    <div class="selfToys">
        <el-dialog :visible="visible" @close="onClose" title="选择你想要交换的玩具">
            <div class="list">
                <div
                    v-for="(item, index) in toys"
                    @click="itemClick(index)"
                    :key="item.itemId"
                    class="list-item"
                >
                    <toy-simple-view :item="item"></toy-simple-view>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { staticBaseURL } from '@/http/config';
import toySimpleView from '@/components/toySimpleView';

export default {
    name: 'selfToys',
    props: {
        toys: Array,
        visible: {
            type: Boolean,
            default: false,
        },
    },
    components: { toySimpleView },
    data() {
        return {
            staticBaseURL,
        };
    },
    created() {},
    methods: {
        onClose() {
            this.$emit('update:visible', false);
        },
        itemClick(index) {
            this.$emit('toyClick', index);
        },
    },
};
</script>

<style lang="scss" scoped>
.list {
    max-height: 400px;
    overflow-y: auto;
}
.list-item {
    border-bottom: 1px solid rgb(231, 226, 226);
    padding: 10px;
    &:hover {
        background: rgb(228, 227, 227);
        cursor: pointer;
    }
}
</style>
