<template>
    <div class="UserCenter">
        <div class="userForm">
            <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="100px">
                <el-form-item label="用户头像" prop="userImage">
                    <div class="avatar-con">
                        <my-avatar :user="userForm"></my-avatar>
                        <upload
                            :disabled="!isEdit"
                            ref="upload"
                            :show-file-list='false'
                            v-model="userForm.userImage"
                        ></upload>
                    </div>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input
                        type="password"
                        v-model="userForm.password"
                        autocomplete="off"
                        :disabled="!isEdit"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" plain @click="toogelEdit">{{
                        isEdit ? '取消' : '编辑'
                    }}</el-button>
                    <el-button v-if="isEdit" type="primary" @click="submitForm">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import upload from '@/components/upload';
import myAvatar from '@/components/myAvatar';
import { modifyUser } from '@/http';

export default {
    name: 'UserCenter',
    data() {
        return {
            userForm: {
                userId: '',
                username: '',
                password: '',
                userImage: '',
            },
            userRules: {
                userImage: { required: true, message: '请上传头像' },
                password: { required: true, message: '请输入密码' },
            },
            isEdit: false,
        };
    },
    components: {
        myAvatar,
        upload,
    },
    computed: {
        ...mapState(['user']),
    },
    watch: {
        user(val) {
            Object.assign(this.userForm, val);
        },
    },
    created() {
        Object.assign(this.userForm, this.user);
    },
    methods: {
        async submitForm() {
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    // eslint-disable-next-line no-unused-vars
                    const [res, err] = await modifyUser(this.userForm);
                    if (err) return this.$message.error('修改失败');
                    this.$message.success('提交成功');
                    this.$store.commit('setUser', Object.assign({}, this.userForm));
                    this.isEdit = false;
                    return true;
                }
                return false;
            });
        },
        toogelEdit() {
            this.isEdit = !this.isEdit;
        },
    },
};
</script>

<style lang="scss" scoped>
@import './UserCenter';
</style>
