import { createStore } from 'vuex'

export default createStore({
    state: {
        // 是否显示加载遮罩层
        loadingShow: false,
        // 订单详情
        orderDetail: ''
    },
    mutations: {
        // mutation的载荷payload
        closeLoading(state, payload) {
            state.loadingShow = false
        },
        showLoading(state, payload) {
            state.loadingShow = true
        },

        // 设置订单id
        setOrderDetail(state, payload) {
            state.orderDetail = payload
        }
    },
});