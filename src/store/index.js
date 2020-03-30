/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { getUser, getNewMsg } from '@/http';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        token: localStorage.getItem('token'),
        isNewMsg: false,
    },
    mutations: {
        setUser(state, payload) {
            state.user = payload;
        },
        setToken(state, payload) {
            state.token = payload;
        },
        setIsNewMsg(state, payload) {
            state.isNewMsg = payload;
        },
    },
    actions: {
        async getUser({ commit }) {
            const [res, err] = await getUser();
            if (err) {
                return false;
            }
            const { data } = res;
            console.log(data);
            commit('setUser', data);
            return true;
        },
        async getNewMsg({ commit }) {
            const [res, err] = await getNewMsg();
            if (err) {
                return false;
            }
            if (res.data) commit('setIsNewMsg', true);
        },
    },
    modules: {},
});
