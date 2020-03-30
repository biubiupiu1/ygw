<template>
    <el-upload
        ref="upload"
        class="upload-demo"
        :drag="drag"
        :headers="{ token }"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :action="baseURL + 'upload'"
        :file-list="fileList"
        :on-remove="onRemove"
        :disabled="disabled"
        :show-file-list='showFileList'
        accept="image/*"
    >
        <template v-if="drag">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </template>
        <el-button v-else size="small" :disabled="disabled" type="primary" plain
            >上传<i class="el-icon-upload el-icon--right"></i
        ></el-button>
    </el-upload>
</template>
<script>
import { baseURL } from '@/http/config';

export default {
    name: 'upload',
    props: {
        value: String,
        drag: Boolean,
        showFileList: {
            default: true,
            type: Boolean,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            baseURL,
            token: localStorage.getItem('token'),
            fileList: [],
        };
    },
    methods: {
        uploadSuccess(response, fileList) {
            this.fileList.splice(0, 1, fileList);
            this.$emit('input', response);
        },
        uploadError() {
            this.$message.error('上传失败');
        },
        onRemove() {
            this.$emit('input', '');
        },
        clearFiles() {
            this.fileList = [];
        },
    },
};
</script>

<style lang="scss" scoped></style>
