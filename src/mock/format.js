import {
    getResResult
} from "@/mock/dealResCommon";

// 设置表格数据
// params res-res resolve-resolve
// resolve结果
const setTableData = (res,optionRes,resolve)=>{
    let typeArr1 = ['信息','类别','尺寸信息']
    let result1 = getResResult(typeArr1,res,optionRes)
    let typeArr2 = ['商标尺码','款式信息','工艺备注']
    let result2 = getResResult(typeArr2,res,optionRes)
    let typeArr3 = ['面料','撞色','款式照片']
    let result3 = getResResult(typeArr3,res,optionRes)

    resolve([result1, result2, result3])
}

export {
    setTableData
}

