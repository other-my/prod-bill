
//将base64转换为blob
function dataURLtoFile(dataURI, type) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type:type });
}

// 代替执行的工具函数
// params 根数据 rootObj, 根对象名称, 要执行的语句字符串
// 返回执行结果
// 若报错,根据结果类型返回对应空值
const proxyExecutor = (rootObj, rootName, resultType, execStr,)=>{
    try{
        let result = eval(`var ${rootName}=${JSON.stringify(rootObj)};${execStr}`)
        if (result === undefined || result === null) {
            switch (resultType) {
                case Array:
                    return []
                case String:
                    return ''
                case Number:
                    return 0
                case Object:
                    return {}
            }
        } else {
            return result
        }
    }catch (e) {
        switch (resultType) {
            case Array:
                return []
            case String:
                return ''
            case Number:
                return 0
            case Object:
                return {}
        }
    }
}

// 打印
function jsToolDoPrint(className) {
    //获取整个打印前页面，作用是打印后恢复。
    let bdhtml = window.document.body.innerHTML;
    let sprnstr = "<!--startprint-->"; //标记打印区域开始
    let eprnstr = "<!--endprint-->";//标记打印区域结束
    //获取要打印的区域, 从标记开始处向下获取。
    let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);//17表示光标右移17个单位
    //删除结束标记后面的内容。
    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
    //将页面显示要打印的内容。
    window.document.body.innerHTML = prnhtml;
    //打印整个页面
    window.print(prnhtml);
    //恢复打印前的页面
    // window.document.body.innerHTML = bdhtml;
    location.reload()

}

export {jsToolDoPrint, proxyExecutor, dataURLtoFile}