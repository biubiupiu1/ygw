import Vue from 'vue';

import {
    Button,
    Select,
    Form,
    FormItem,
    Input,
    Message,
    Menu,
    MenuItem,
    Avatar,
    Popover,
    TabPane,
    Tabs,
    Option,
    Upload,
    Image,
    Dialog,
    Tag,
    Alert,
    Badge,
} from 'element-ui';

Vue.use(Button);
Vue.use(Select);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Avatar);
Vue.use(Popover);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Upload);
Vue.use(Option);
Vue.use(Image);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Badge);

['success', 'warning', 'info', 'error'].forEach((type) => {
    Message[type] = (options) => {
        let temp = options;
        if (typeof temp === 'string') {
            temp = {
                message: options,
            };
        }
        temp.type = type;
        temp.duration = temp.duration || 1500;
        return Message(temp);
    };
});

Vue.prototype.$message = Message;

export default Vue;
