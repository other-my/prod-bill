<template>
    <!--网格容器-->
    <div class='unit-container' ref="containerRef">
        <!--网格第一列-->
        <div class="grid-item unit-title">{{title}}</div>
        <!--网格第二列-->
        <template v-if="spanRows">
            <!--整体-->
            <div class="grid-item whole">
                <template v-if="unitData && unitData.length > 0">
                    <template v-for="item in unitData">
                        <template v-if="item.type === 'whole'">
                            <!--第二列是一个整体-->
                            <div :style="item.style">
                                <!--第二列的项目-->
                                <slot name="item_whole" :item="item">

                                </slot>
                            </div>
                        </template>
                    </template>
                </template>
            </div>
        </template>
        <template v-else-if="unitData && unitData.length > 0">
            <template v-for="item in unitData">
                <template v-if="item.type === 'enum'">
                    <!--枚举-->
                    <div class="grid-item secondCol" :style="item.style">
                        <!--第二列的项目-->
                        <div class="grid-children" v-for="(en,index) in item.enums">
                            <template v-if="en.IOFormat.active">
                                <template v-if="en.IOFormat.type === 'input'">
                                    <el-input v-model="item.enums[index].value" placeholder="请输入" class="my-el-input"></el-input>
                                </template>
                                <template v-if="en.IOFormat.type === 'select'">
                                    <el-select
                                        v-model="item.enums[index].value"
                                        filterable
                                        allow-create
                                        clearable
                                        placeholder="请选择">
                                        <el-option
                                            v-for="OP in en.IOFormat.selectList"
                                            :key="OP.value"
                                            :label="OP.label"
                                            :value="OP.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </template>
                            <template v-else>
                                {{en.label}}
                            </template>
                        </div>
                    </div>
                </template>
                <template v-else-if="item.type === 'attribute'">
                    <!--键值对-->
                    <div class="grid-item secondCol" :style="item.style">
                        <!--第二列的项目-->
                        <div class="grid-children">{{item.attributes.key}}</div>
                        <div class="grid-children">
                            <template v-if="item.IOFormat.active">
                                <template v-if="item.IOFormat.type === 'input'">
                                    <el-input v-model="item.attributes.value" placeholder="请输入" class="my-el-input"></el-input>
                                </template>
                                <template v-else-if="item.IOFormat.type === 'select'">
                                    <el-select
                                        v-model="item.attributes.value"
                                        filterable
                                        allow-create
                                        clearable
                                        placeholder="请选择">
                                        <el-option
                                            v-for="OP in item.IOFormat.selectList"
                                            :key="OP.value"
                                            :label="OP.label"
                                            :value="OP.label">
                                        </el-option>
                                    </el-select>
                                </template>
                            </template>
                            <template v-else>
                                {{item.attributes.value}}
                            </template>
                        </div>
                    </div>
                </template>
            </template>
        </template>
    </div>
</template>
<script>
    import {
        defineComponent,
        createApp,
        ref,
        reactive,
        computed,
        readonly,
        watch,
        watchEffect,
        toRef,
        toRefs,
        toRaw,
        onBeforeUpdate,
        onMounted,
        onBeforeMount,
        onUpdated,
        onBeforeUnmount,
        onUnmounted,
        onErrorCaptured,
        onRenderTracked,
        onRenderTriggered,
        getCurrentInstance,
        provide,
        inject,
        h
    } from 'vue';

    export default defineComponent({
        props: {
            // 标题
            title: '',
            /*
                容器行数，不传则为第二列的unitData数组长度
                传入则表示此网格容器是个整体的类型
            */
            spanRows: Number,
            // 标题对应内容
            /*
                {
                    // 内容类型，枚举类型 'enum' 属性类型 'attribute'
                    // 可选 'enum', 'attribute'
                    type: 'enum',
                    // 输入
                    IOFormat: {
                        // 可选 'input', 'select'
                        type: 'select'
                        // 是否激活
                        active: true,
                    }
                    // 样式(第二列作为网格容器也是网格布局)
                    style: '',
                    // 枚举类型数据
                    enums: [],
                    // 属性类型数据
                    attributes: {
                        key: '',
                        value: ''
                    }
                }
            */
            unitData: [Object],
        },
        setup(props, context) {

            // 参数默认值
            const config = reactive({
                /*标题列宽(第一列的宽度)*/
                titleColWidth: '30px',
                /*第二列的宽度*/
                secondColWidth: '80px',

            })

            // 渲染表格
            const renderUnitTable = ()=>{
                // key-value类型的key的列宽
                const keyValueWidth = ref('150px')

                // 计算行数
                if (props.unitData && props.unitData.length > 0) {
                    // 设置网格容器行数
                    if (props.spanRows) {
                        containerRef._rawValue.style.setProperty('--row-count', props.spanRows)
                    } else {
                        let count = props.unitData.length
                        containerRef._rawValue.style.setProperty('--row-count', count)
                    }
                }
                // 为每一行配置网格容器的样式参数-判断列数
                // 若为key-value类型 为2列；若为enum类型，为length列
                if (props.unitData && props.unitData.length > 0) {
                    props.unitData.forEach(item=>{
                        if (item.type === 'attribute') {
                            // key-value 类型
                            item.style = {
                                display: 'grid',
                                gridTemplateColumns: `${keyValueWidth.value} 1fr`,
                                border: '1px solid #404040',
                                marginLeft: '-1px',
                                marginTop: '-1px'
                            }
                        } else if (item.type === 'enum') {
                            // enum类型
                            // 获取列数
                            let colNum = item.enums.length
                            item.style = {
                                display:'grid',
                                gridTemplateColumns: `repeat(${colNum}, 1fr)`,
                                border: '1px solid #404040',
                                marginLeft: '-1px',
                                marginTop: '-1px'
                            }
                        } else if (item.type === 'whole') {

                        }
                    })
                }

            }

            // 网格容器
            const containerRef = ref(null)

            // 传入参数改变时更新视图
            watch([()=> props.title, ()=> props.unitData, ()=> props.spanRows], ()=>{
                renderUnitTable()
            })

            onMounted(()=>{
                renderUnitTable()
            })

            return {
                containerRef,
            }
        }
    });
</script>

<style scoped>
    /*网格容器*/
    .unit-container {
        /*网格容器总宽*/
        --container-width: 100%;
        /*标题列宽*/
        --title-colwidth: 30px;
        /*第二列的宽度*/
        --second-colwidth: calc(var(--container-width) - var(--title-colwidth));
        /*第二列占用的行数*/
        --jsSet-secondColRows: '';

        /*行高*/
        --grid-rowheight: 28px;
        /*行数*/
        --row-count: 1;

        display: grid;
        grid-template-columns: var(--title-colwidth) var(--second-colwidth);
        grid-template-rows: repeat(var(--row-count), var(--grid-rowheight));
        /*项目拉伸至格子大小*/
        place-items: stretch stretch;
        width: var(--container-width);
        height: calc(var(--row-count) * var(--grid-rowheight));
    }

    /*子项目*/
    .unit-container .grid-item {
        margin-left: -1px;
        margin-top: -1px;
        padding-left: 4px;

    }

    /*标题*/
    .unit-container .unit-title {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #404040;
        /*跨行为一到行数加一*/
        grid-row: 1 / calc(var(--row-count) + 1);
        padding: 0 4px;
        /*文字竖排列*/
        line-height: 16px;
        font-size: 16px;
        word-wrap: break-word;
    }

    /*第二列(普通单个)*/
    .grid-item.secondCol {
        border: 1px solid #404040;
    }
    /*第二列是一个整体*/
    .grid-item.whole {
        border: 1px solid #404040;
        grid-row: 1 / calc(var(--row-count) + 1);
    }

    /*第二列内的网格布局-项目*/
    .grid-children {
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #404040;
        margin-right: -1px;
    }
</style>