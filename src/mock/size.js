import {
    getResResult
} from "@/mock/dealResCommon";

// 设置表格数据
// params res-res resolve-resolve
// resolve结果
const setTableData = (res,optionRes,resolve)=>{
    let typeArr1 = ['信息','尺寸信息']
    let result1 = getResResult(typeArr1, res, optionRes, 'size')
    let typeArr2 = ['面料','款式信息','特殊','体型补正','体型备注']
    let result2 = getResResult(typeArr2, res, optionRes, 'size')
    let typeArr3 = ['体型照片']
    let result3 = getResResult(typeArr3, res, optionRes, 'size')

    resolve([result1, result2, result3])
}

export {
    setTableData
}

