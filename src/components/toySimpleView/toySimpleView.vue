<template>
    <div class="toySimpleView">
        <div class="item-left">
            <h2 class="item-name">{{ item.itemName }}</h2>
            <span class="item-info">{{ item.itemInfo }}</span>
        </div>
        <div class="item-right">
            <img
                class="item-img"
                :style="{ width: imgWidth + 'px', height: imgHeight + 'px' }"
                :src="staticBaseURL + item.itemImage"
                alt=""
            />
        </div>
    </div>
</template>
<script>
import { staticBaseURL } from '@/http/config';

export default {
    name: 'toySimpleView',
    props: {
        item: Object,
        imgWidth: {
            type: Number,
            default: 100,
        },
        imgHeight: {
            type: Number,
            default: 100,
        },
    },
    data() {
        return {
            staticBaseURL,
        };
    },
};
</script>

<style lang="scss" scoped>
.toySimpleView {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.item-img {
    object-fit: scale-down;
}

.item-name,
.item-info {
    margin: 0;
}
</style>
