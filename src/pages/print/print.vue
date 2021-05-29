<template>
    <div class='order-container-table' style="display: flex; flex-wrap: nowrap;justify-content: center">
        <llTable style="display: inline" key="col1" width="400px" :table-data="col1llTableDataRef">
            <template v-slot:col_1="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_2="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_3="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
        </llTable>
        <llTable style="display: inline" key="col2" width="400px" :table-data="col2llTableDataRef">
            <template v-slot:col_1="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_2="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_3="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
        </llTable>
        <llTable style="display: inline" key="col3" width="400px" :table-data="col3llTableDataRef">
            <template v-slot:col_1="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_2="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_3="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_4="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_5="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_6="{item}">
                <tableUnit :title="item.title" :unit-data="item.unitData"></tableUnit>
            </template>
            <template v-slot:col_7="{item}">
                <tableUnit :title="item.title" :span-rows="2" :unit-data="item.unitData">
                    <template v-slot:item_whole="{item}">

                    </template>
                </tableUnit>
            </template>
        </llTable>
        <!--面料图片-->
        <div style="display: inline;width:400px;height:550px">
            <div style="width: 100%; height: 100%; display: flex; flex-wrap: wrap; margin: 10px">
                <template v-for="item in fabricImages">
                    <img width="100" height="100" :src="item" alt="">
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/common.css'

import tableUnit from '@/components/table/tableUnit.vue'
import llTable from '@/components/table/llTable.vue'

import {
    getTableData,
    getFabricImages
} from '@/mock/dealResCommon'

import {
    setTableData
} from '@/mock/print'


import {
    defineComponent,
    ref,
    inject,
    onMounted,
    watch,
} from 'vue';

export default defineComponent({
    components: {
        tableUnit,
        llTable,
    },
    setup() {
        const orderIdRef = inject('orderIdRef')
        const axios = inject('axios')

        const col1llTableDataRef = ref([])
        const col2llTableDataRef = ref([])
        const col3llTableDataRef = ref([])


        // 面料图片
        const fabricImages = ref([])

        // 加载数据
        const loadData = ()=>{
            getTableData(axios, orderIdRef, setTableData).then(res=>{
                let [technologyTableCol1, technologyTableCol2, technologyTableCol3] = res
                col1llTableDataRef.value = technologyTableCol1
                col2llTableDataRef.value = technologyTableCol2
                col3llTableDataRef.value = technologyTableCol3
            })

            getFabricImages(axios, orderIdRef).then(res=>{
                fabricImages.value = res
            })
        }

        onMounted(()=>{
            loadData()
        })

        watch(()=>orderIdRef.value, ()=>{
            loadData()
        })

        return {
            col1llTableDataRef,
            col2llTableDataRef,
            col3llTableDataRef,
            fabricImages,
        }
    },
});

</script>



