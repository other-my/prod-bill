<template>
    <div class="ll-table-container" :style=" width ? 'width: ' + width : 'width: 100%'">
        <template v-for="(item,index) in tableData">
            <slot :name="'col_' + (index + 1)" :item="item">
                <tableUnit :title="item.title" :span-rows="item.spanRows" :unit-data="item.unitData"></tableUnit>
            </slot>
        </template>
    </div>
</template>
<script>

import tableUnit from '@/components/table/tableUnit.vue'

import {
    defineComponent,
    reactive,
    ref,
} from 'vue';

export default defineComponent({
    components: {
        tableUnit
    },
    props: {
        width: String,
        // 表格数据
        /*
            [
                {
                    // 单元标题
                    title: '',
                    // 单元宽度
                    width: '',
                    // 单元数据
                    unitData: '',
                }
            ]
        */
        tableData: [Object]
    },
    name: 'myTable',
    setup() {

        return {

        }
    }
})
</script>

<style>
    .ll-table-container {
        display: flex;
        flex-wrap: wrap;
    }
</style>



