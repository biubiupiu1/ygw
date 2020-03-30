import axios from 'axios';
import router from '../router';

import { baseURL } from './config';

function handle(promise) {
    return promise
        .then(data => [data, undefined])
        .catch(error => Promise.resolve([undefined, error]));
}

const instance = axios.create({
    baseURL,
    timeout: 7000,
});

let $token = null;

instance.interceptors.request.use(
    (config) => {
        const temp = config;
        if (!$token) $token = localStorage.getItem('token');
        temp.headers.token = $token;
        return temp;
    },
    error => Promise.reject(error),
);

instance.interceptors.response.use(
    (response) => {
        const { status, config } = response;
        if (status === 200 && config.url === 'user/login') {
            const { token } = response.data.data;
            $token = token;
            localStorage.setItem('token', token);
        }
        return response;
    },
    (error) => {
        if (+error.response.status === 401) {
            localStorage.removeItem('token');
            router.push({ name: 'Login', params: { reload: true } });
        }
        return Promise.reject(error);
    },
);

const login = ({ username, password }) => handle(
    instance.post('user/login', {
        username,
        password,
    }),
);

const getUser = () => handle(instance.get('/user'));

const modifyUser = data => handle(instance.put('/user', data));

const getCategory = () => handle(instance.get('/cat/all'));

const getToys = ({ catId, catName }) => handle(
    instance.post('/item/cat', {
        catId,
        catName,
    }),
);

const addToy = ({
    catId, itemImage, itemInfo, itemName,
}) => handle(
    instance.post('/item', {
        catId,
        itemImage,
        itemInfo,
        itemName,
    }),
);

const getSelfToys = () => handle(instance.get('/item'));

const exchangeToy = ({ distUserItemId, reqUserItemId }) => handle(
    instance.post('/req', {
        distUserItemId,
        reqUserItemId,
    }),
);

const agreeExchange = reqId => handle(
    instance.post('/order', {
        reqId,
    }),
);

const getRequest = () => handle(instance.get('/item/req'));

const getOrderList = () => handle(instance.get('/order/list'));

const delOrder = orderId => handle(
    instance.request({
        method: 'DELETE',
        url: '/order',
        data: {
            orderId,
        },
    }),
);

const getNewMsg = () => handle(instance.get('/msg/new'));

const sendMsg = ({ distUserId, msg }) => handle(
    instance.post('msg', {
        distUserId,
        msg,
    }),
);

const getMsgList = () => handle(instance.get('/msg/new/list'));

const readMsg = arr => handle(instance.post('/msg/read', { msgIds: arr }));

export {
    instance,
    login,
    getCategory,
    getToys,
    addToy,
    getUser,
    modifyUser,
    getSelfToys,
    exchangeToy,
    getRequest,
    agreeExchange,
    getOrderList,
    delOrder,
    getNewMsg,
    sendMsg,
    getMsgList,
    readMsg,
};
