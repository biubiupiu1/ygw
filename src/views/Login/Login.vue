<template>
    <div class="Login">
        <div class="userForm">
            <el-form :model="userForm" :rules="userRules" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="userForm.password"
                        autocomplete="off"
                    ></el-input>
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
import { login } from '@/http/index';

export default {
    name: 'Login',
    data() {
        return {
            userForm: {
                username: '',
                password: '',
            },
            userRules: {
                username: { required: true, message: '请输入用户名', trigger: 'blur' },
                password: { required: true, message: '请输入密码', trigger: 'blur' },
            },
        };
    },
    created() {
        const { reload } = this.$route.params;
        // eslint-disable-next-line no-restricted-globals
        if (reload) location.reload();
    },
    methods: {
        async submitForm() {
            if (!this.userForm.username || !this.userForm.username) {
                return false;
            }
            const [res, err] = await login(this.userForm);
            if (err) {
                console.log(err);
                this.$message.error('登录失败');
                return false;
            }
            console.log(res);
            const { data } = res.data;
            if (res.status === 200 && data && data.token) {
                this.$router.push('toys');
                this.$store.dispatch('getUser');
                this.$message.success('登录成功');
            }
            return true;
        },
        resetForm() {
            this.userForm.username = '';
            this.userForm.password = '';
        },
    },
};
</script>

<style lang="scss" scoped>
@import './Login';
</style>
