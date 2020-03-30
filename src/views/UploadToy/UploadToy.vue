<template>
    <div class="UploadToy">
        <div class="add-form">
            <el-form :model="toyForm" ref="toyForm" :rules="toyRules" label-width="100px">
                <el-form-item label="玩具名称" prop="itemName">
                    <el-input v-model="toyForm.itemName"></el-input>
                </el-form-item>
                <el-form-item label="玩具介绍" prop="itemInfo">
                    <el-input v-model="toyForm.itemInfo"></el-input>
                </el-form-item>
                <el-form-item label="玩具分类" prop="catId">
                    <el-select v-model="toyForm.catId" placeholder="请选择">
                        <el-option
                            v-for="item in category"
                            :key="item.catId"
                            :label="item.catName"
                            :value="item.catId"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="玩具图片" prop="itemImage">
                    <upload drag ref="upload" v-model="toyForm.itemImage"></upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { getCategory, addToy } from '@/http/index';
import upload from '@/components/upload';

export default {
    name: 'UploadToy',
    data() {
        return {
            category: [],
            toyForm: {
                catId: '',
                itemImage: '',
                itemInfo: '',
                itemName: '',
            },
            toyRules: {
                itemName: { required: true, message: '请输入玩具名称', trigger: 'blur' },
                itemInfo: { required: true, message: '请输入玩具介绍', trigger: 'blur' },
                catId: { required: true, message: '请选择玩具分类', trigger: 'blur' },
                itemImage: { required: true, message: '请上传玩具图片', trigger: 'blur' },
            },
        };
    },
    components: {
        upload,
    },
    created() {
        this.getCategory();
    },
    methods: {
        async getCategory() {
            const [res, err] = await getCategory();
            if (err) {
                this.$message({
                    type: 'error',
                    message: '获取失败',
                });
                return false;
            }
            this.category = res.data;
            return true;
        },
        submitForm() {
            this.$refs.toyForm.validate(async (valid) => {
                if (valid) {
                    // eslint-disable-next-line no-unused-vars
                    const [res, err] = await addToy(this.toyForm);
                    if (err) {
                        this.$message.error('提交失败');
                        return false;
                    }
                    this.$message.success('提交成功');
                    this.$router.push('toys');
                    return true;
                }
                return false;
            });
        },
        resetForm() {
            const temp = this.toyForm;
            Object.entries(temp).forEach(([key]) => {
                temp[key] = '';
            });
            this.$refs.upload.clearFiles();
        },
    },
};
</script>

<style lang="scss" scoped>
@import './UploadToy';
</style>
