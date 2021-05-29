<template>
    <loading :show="true"></loading>
    <RouterView v-if="isRouterAlive"></RouterView>
</template>
<script>
    import loading from "@/components/loading/loading.vue";

    import {useStore} from "vuex";

    import {
        computed,
        defineComponent,
        ref,
        provide,
        nextTick,
    } from 'vue';

    export default defineComponent({
        components: {
            loading,
        },
        setup() {
            const isRouterAlive = ref(true)

            const nextFunction = async (before, after)=>{
                before()
                await nextTick()
                after()
            }
            const reload = ()=> {
                nextFunction(()=>{
                    isRouterAlive.value = false;   // 先关闭
                },()=>{
                    isRouterAlive.value = true   // 再打开
                })
            }

            provide('reload', reload)

            // 遮罩层
            const store = useStore()
            const loadingShow = computed(()=>{
                return store.state.loadingShow
            })

            return {
                loadingShow,
                isRouterAlive,
                reload
            }
        },

    })

</script>

