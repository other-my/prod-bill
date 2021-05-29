<template>
<!--    <div style="position: absolute; left: 20px; bottom: 100px">
        <router-link style="margin: 0 10px" to="/print">打印</router-link>
        <router-link style="margin: 0 10px" to="/technology">工艺</router-link>
        <router-link style="margin: 0 10px" to="/size">尺寸</router-link>
        <router-link style="margin: 0 10px" to="/format">版式</router-link>
        <button @click="doPrint">打印</button>
    </div>-->

    <!--startprint-->
    <div class='main'>
        <div class='order-container'>
            <div class='order-container-title'>
                <div class='title'>
                    {{titleRef}}
                    <div class='title-tip-container'>
                        <template v-for="item in tipsRef">
                            <div class='title-tip'>{{item}}</div>
                        </template>
                    </div>
                </div>
            </div>
            <div class='order-container-info' style="margin-bottom: 10px">
                <template v-for="item in orderInfo">
                    <div class='info-item'>
                        <span class='info-title'>{{item.name}} : </span>
                        <span class='info-content'>{{item.value}}</span>
                    </div>
                </template>
            </div>

            <RouterView></RouterView>

        </div>
    </div>
    <!--endprint-->

</template>
<script>
import {jsToolDoPrint,proxyExecutor} from '@/utils/jsTools'
import {axios} from '@/utils/http'
import vuex from '@/store/index'

import {
    defineComponent,
    ref,
    provide,
    onMounted,
    computed,
} from 'vue';
import {useStore} from "vuex";

export default defineComponent({
    props: {
        name: ''
    },
    name: 'myTable',
    setup() {

        // 打印
        const doPrint = ()=>{
            jsToolDoPrint('order-container-table')
        }

        const titleRef = ref('嘉誉工厂生产单')
        const tipsRef = ref([])
        // 订单信息
        const orderInfo = ref([])

        // 设置订单id
        const setOrderId = ()=>{
            let id = localStorage.getItem('orderId')
            vuex.commit('setOrderDetail', id)
        }

        // 加载订单详情
        const loadOrderInfo = ()=>{
            // 设置订单id
            setOrderId();

            // 重置
            orderInfo.value = [
                {name: '订单号', value: ''},
                {name: '过审', value: ''},
                {name: '交货日', value: ''},
            ]
            tipsRef.value = []

            // 请求订单信息
            axios.get('/api/order/getDetails', {
                params: {
                    orderId: orderIdRef.value
                }
            }).then(res=>{
                orderInfo.value = [
                    {name: '订单号', value: orderIdRef.value},
                    {name: '过审', value: proxyExecutor(res, 'res', String, 'res.data..reviewTime')},
                    {name: '交货日', value: proxyExecutor(res, 'res', String, 'res.data.receivedGoodsDate')},
                    /*{name: '工艺', value: '高定'},
                    {name: '编号', value: ''},
                    {name: '工艺', value: ''},
                    {name: '编号', value: ''},*/
                ]

                /*刺绣*/
                if (proxyExecutor(res,'res',Number,'res.data.embroideryList.length') > 0) {
                    tipsRef.value.push('刺绣')
                }

                /*0 不加急 1 加急*/
                if (proxyExecutor(res,'res','res.data.expedited') === 1) {
                    tipsRef.value.push('加急')
                }
            })
        }

        // 订单id
        const store = useStore()
        const orderIdRef = computed(()=>{
            return store.state.orderDetail
        })

        onMounted(()=>{
            // 加载订单信息
            loadOrderInfo()
        })

        provide('orderIdRef', orderIdRef)
        provide('axios', axios)

        return {
            doPrint,
            titleRef,
            tipsRef,
            orderInfo,
        }
    }
})
</script>



