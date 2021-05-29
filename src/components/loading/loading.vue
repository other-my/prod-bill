<template>
    <div class=loader-container :style="{display: show ? 'flex' : 'none'}">
        <div class='loader'></div>
    </div>
</template>
<script>
import {
    defineComponent,
} from 'vue';

export default defineComponent({
    props: {
        show: Boolean
    },
    name: 'loadding',
    setup() {

        return {

        }
    }
})
</script>

<style>
    .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
    .loader{
        border:3px solid #f3f3f3;
        border-radius:90%;
        border-top:3px solid #2e8e9a;
        width:100px;
        height:100px;
        /* animation-name:load; */
        /*animation:load 1s linear infinite;*/
    }
    @keyframes load{
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform:rotate(360deg);
        }
    }
</style>



