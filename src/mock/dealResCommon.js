import {proxyExecutor} from '@/utils/jsTools'

// 获取表格数据
// params axios-axios 订单id-orderId 处理数据方法-setTableData
// 异步方法
const getTableData = async (axios, orderIdRef, setTableData)=>{
    return new Promise((resolve, reject)=>{
        // 请求列表
        let reqArr = [
            // 详情请求
            axios.get('/api/order/getDetails', {
                params: {
                    orderId: orderIdRef.value
                }
            }),
            // 待选项请求
            axios.get('/api/order/orderSettingAll', {
                params: {
                    merchantId: '',
                    _: '',
                }
            })
        ]
        // 请求
        axios.all(reqArr).then(axios.spread((res,res1)=>{
            setTableData(res,res1,resolve)
        }))
    })
}

// 获取面料图片
const getFabricImages = async (axios, orderIdRef)=>{
    return new Promise((resolve,reject)=>{
        axios.get('/api/order/getDetails', {
            params: {
                orderId: orderIdRef.value
            }
        }).then(res=>{
            let resultArr = proxyExecutor(res,'res',Array,'res.data.fabrics').map(n=>n.images)
            resolve(resultArr)
        })
    })
}

// 映射
const typeMap = (typeName)=>{
    switch (typeName){
        case '领子辑线':
            return 10
        case '领子辑线号':
            return ''
        case '下领形状':
            return ''
        case '门襟辑线':
            return 11
        case '门襟辑线号':
            return ''
        case '肩缝':
            return ''
        case '里巾':
            return ''
        case '袖口辑线':
            return 12
        case '袖叉式样':
            return 14
        case '袖口辑线号':
            return ''
        case '扣子':
            return 4
        case '领角纽扣':
            return 5
        case '第一纽扣间距':
            return 6
        case '门襟扣数量':
            return 7
        case '横眼位置':
            return 8
        case '锁眼颜色':
            return 9
        case '钉扣方法':
            return ''
        case '钉扣颜色':
            return 3
        case '袖口锁眼':
            return ''
        case '袖口钉扣':
            return ''
        case '暗扣位置':
            return 15

    }
}

/*
        1  袖口褶
        2  钉扣
        3  钉扣线色
        4  扣子
        5  领角扣子
        6  第一扣间距
        7  门襟扣数量
        8  横眼位置
        9  锁眼颜色
        10  领子压线
        11  门襟压线
        12  袖口压线
        13  加绒
        14  袖叉式样
        15  暗扣位置
*/
const dealCraftType = (keyName,res)=>{
    let result = ''
    if (typeMap(keyName) !== '') {
        proxyExecutor(res,'res',Array,'res.data.crafts').forEach(n=>{
            if (n.craftId == typeMap(keyName)) {
                switch (n.craftType) {
                    case 1:
                    case 3:
                        result = proxyExecutor(n,'n',String, 'n.data')
                        break;
                    case 2:
                        result = proxyExecutor(n,'n',String,'n.detail.serialNumber')
                        break;
                }
            }
        })
    }
    return result
}

// 处理res方法
// params res-res  需要的表格标题类型数组 typeArr, 待选项详情对象 optionRes,  页面类型 pageType (可选)
// 返回 数组: [llTable表格组件数据]
const getResResult = (typeArr, res, optionRes, pageType)=>{
    /*
        所有标题可选:
            信息，类别，款式信息，刺绣，商标尺码， 工艺， 领子， 门里巾， 袖口， 锁定，
             备注， 面料， 撞色， 工艺图片， 尺寸信息，工艺备注，款式照片，
             体型照片， 特殊， 体型补正， 体型备注

         所有pageType可选:
            technology，size，print，format

    */
    let resultArr = []
    typeArr.forEach(n=>{
        switch (n) {
            case '信息': {
                /*customers*/
                let unitData = []
                // 判断页面类型
                switch (pageType) {
                    case 'size':{
                        unitData = [
                            {
                                type: 'attribute',
                                IOFormat: {
                                    active: false,
                                },
                                style: '',
                                attributes: {
                                    key: '客户姓名',
                                    value: proxyExecutor(res,'res',String, 'res.data.customers[0].customerName')
                                }
                            },
                            {
                                type: 'attribute',
                                IOFormat: {
                                    active: false,
                                },
                                style: '',
                                attributes: {
                                    key: '类别',
                                    value:  (proxyExecutor(res,'res',String,'res.data.sex') == 1 ? '男士' : proxyExecutor(res,'res',String,'res.data.sex') == 2 ? '女生' : '未识别') +
                                        (proxyExecutor(res,'res',String, 'res.data.lengthType') == 1 ? '长袖' : proxyExecutor(res,'res',String, 'res.data.lengthType') == 2 ? '短袖' : '未识别')
                                }
                            },
                            {
                                type: 'enum',
                                style: '',
                                enums: [
                                    {
                                        label:'件数',
                                        value: '件数',
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        label: proxyExecutor(res,'res',Number, 'res.data.customers[0].num'),
                                        value: proxyExecutor(res,'res',Number, 'res.data.customers[0].num'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        label: '年龄',
                                        value: '年龄',
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        label: proxyExecutor(res,'res',Number, 'res.data.customers[0].customerSex'), // TODO label
                                        value: proxyExecutor(res,'res',Number, 'res.data.customers[0].customerSex'),
                                        IOFormat: {
                                            active: false,
                                        }
                                    }
                                ],
                            },
                            {
                                type: 'enum',
                                style: '',
                                enums: [
                                    {
                                        label: '身高',
                                        value: '身高',
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        label: proxyExecutor(res,'res',String,'res.data.customers[0].height'),
                                        value: proxyExecutor(res,'res',String,'res.data.customers[0].height'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        label: '体重',
                                        value: '体重',
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        label: proxyExecutor(res,'res',String, 'res.data.customers[0].weight]'),
                                        value: proxyExecutor(res,'res',String, 'res.data.customers[0].weight]'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                ],
                            },{
                                type: 'attribute',
                                IOFormat: {
                                    active: false,
                                },
                                style: '',
                                attributes: {
                                    key: '穿衣偏好',
                                    value: proxyExecutor(res,'res',String, 'res.data.customers[0].clothesHobbyName')
                                }
                            },
                        ]
                        break;
                    }
                    default:{
                        unitData = [
                            {
                                type: 'attribute',
                                IOFormat: {
                                    active: false,
                                },
                                style: '',
                                attributes: {
                                    key: '定制商',
                                    value: proxyExecutor(res,'res',String,'res.data.merchant.store')
                                }
                            },
                            {
                                type: 'attribute',
                                IOFormat: {
                                    active: false,
                                },
                                style: '',
                                attributes: {
                                    key: '客户姓名',
                                    value: proxyExecutor(res, 'res', String, 'res.data.customers[0].customerName')
                                }
                            }
                        ]
                        break;
                    }
                }
                resultArr.push({
                    title: '信息',
                    unitData: unitData
                },)
                break;
            }
            case '类别': {
                /*customers*/
                let unitData = [
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: '类别',
                            value: (proxyExecutor(res,'res',String,'res.data.sex') == 1 ? '男士' : proxyExecutor(res,'res',String,'res.data.sex') == 2 ? '女生' : '未识别') +
                                (proxyExecutor(res,'res',String, 'res.data.lengthType') == 1 ? '长袖' : proxyExecutor(res,'res',String, 'res.data.lengthType') == 2 ? '短袖' : '未识别')
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: '件数',
                            value: proxyExecutor(res,'res', Number, 'res.data.customers[0].num')
                        }
                    }
                ]

                resultArr.push({
                    title: '类别',
                    unitData: unitData
                },)
                break;
            }
            case '款式信息': {
                /*designDetails*/
                // 获取待选项数据
                //
                let unitData = []

                proxyExecutor(res,'res', Array,'res.data.designDetails').forEach(n=>{
                    let options = []
                    proxyExecutor(optionRes, 'optionRes', Array, 'optionRes.data.designDetail').forEach(m=>{
                        if (n.designDetailId === m.id || n.designDetailId === m.originalId) {
                            options = m.options.map(n=>{
                                return {
                                    label: n.name,
                                    value: n.id
                                }
                            })
                        }
                    })
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options
                        },
                        style: '',
                        attributes: {
                            key: proxyExecutor(n,'n',String,'n.designDetailName'),
                            value: proxyExecutor(n,'n',String,'n.value')
                        }
                    })
                })

                resultArr.push({
                    title: '款式信息',
                    unitData: unitData
                },)
                break;
            }
            case '刺绣': {
                /*embroideryList*/
                let unitData = []

                proxyExecutor(res,'res',Array, 'res.data.embroideryList').forEach(n=>{
                    // 位置
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: proxyExecutor(n,'n',String,'n.positionData.embroideryName'),
                            value: proxyExecutor(n,'n',String,'n.positionData.embroideryId')
                        }
                    })
                    // 字体
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: proxyExecutor(n,'n',String,'n.targetData.embroideryName'),
                            value: proxyExecutor(n,'n',String,'n.targetData.embroideryId')
                        }
                    })
                    // 颜色
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: '颜色',
                            value: proxyExecutor(n,'n',String,'n.accessoriesColorData.serialNumber')
                        }
                    })
                })
                resultArr.push({
                    title: '刺绣',
                    unitData: unitData
                },)
                break;
            }
            case '商标尺码': {
                /*marks*/
                let unitData = []
                proxyExecutor(res,'res',Array,'res.data.marks').forEach(n=>{
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: proxyExecutor(n,'n',String,'n.markName'),
                            value: proxyExecutor(n,'n',String,'n.name')
                        }
                    })
                })

                resultArr.push({
                    title: '商标尺码',
                    unitData: unitData
                },)
                break;
            }
            case '工艺': {
                /*crafts*/
                let unitData = []

                unitData = [
                    {
                        type: 'enum',
                        style: '',
                        enums: [
                            {
                                label: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            }
                        ]
                    },
                ]

                resultArr.push({
                    title: '工艺',
                    unitData: unitData
                },)
                break;
            }
            case '领子': {
                let unitData = []

                let options1 = [],options2 = [],options3 = [];
                proxyExecutor(optionRes, 'optionRes', Array, 'optionRes.data.craft').forEach(n=>{
                    if (typeMap('领子辑线') === n.id || typeMap('领子辑线') === n.originalId) {
                        options1 = n.options
                    }
                    if (typeMap('领子辑线号') === n.id || typeMap('领子辑线号') === n.originalId) {
                        options2 = n.options
                    }
                    if (typeMap('下领形状') === n.id || typeMap('下领形状') === n.originalId) {
                        options2 = n.options
                    }
                })

                unitData = [
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options1
                        },
                        style: '',
                        attributes: {
                            key: '领子辑线',
                            value: dealCraftType('领子辑线',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options2
                        },
                        style: '',
                        attributes: {
                            key: '领子辑线号',
                            value: dealCraftType('领子辑线号',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options3
                        },
                        style: '',
                        attributes: {
                            key: '下领形状',
                            value: dealCraftType('下领形状',res)
                        }
                    },
                ]

                resultArr.push({
                    title: '领子',
                    unitData: unitData
                },)
                break;
            }
            case '门里巾': {
                let unitData = []

                let options1=[],options2=[],options3=[],options4=[];
                proxyExecutor(optionRes, 'optionRes', Array, 'optionRes.data.craft').forEach(n=>{
                    if (typeMap('门襟辑线') === n.id || typeMap('门襟辑线') === n.originalId) {
                        options1 = n.options
                    }
                    if (typeMap('门襟辑线号') === n.id || typeMap('门襟辑线号') === n.originalId) {
                        options2 = n.options
                    }
                    if (typeMap('肩缝') === n.id || typeMap('肩缝') === n.originalId) {
                        options3 = n.options
                    }
                    if (typeMap('里巾') === n.id || typeMap('里巾') === n.originalId) {
                        options4 = n.options
                    }
                })

                unitData = [
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options1
                        },
                        style: '',
                        attributes: {
                            key: '门襟辑线',
                            value: dealCraftType('门襟辑线',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options2
                        },
                        style: '',
                        attributes: {
                            key: '门襟辑线号',
                            value: dealCraftType('门襟辑线号',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options3
                        },
                        style: '',
                        attributes: {
                            key: '肩缝',
                            value: dealCraftType('肩缝',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options4
                        },
                        style: '',
                        attributes: {
                            key: '里巾',
                            value: dealCraftType('里巾',res)
                        }
                    },
                ]

                resultArr.push({
                    title: '门里巾',
                    unitData: unitData
                },)
                break;
            }
            case '袖口': {
                let unitData = []

                let options1=[],options2=[],options3=[],options4=[];
                proxyExecutor(optionRes, 'optionRes', Array, 'optionRes.data.craft').forEach(n=>{
                    if (typeMap('袖口辑线') === n.id || typeMap('袖口辑线') === n.originalId) {
                        options1 = n.options
                    }
                    if (typeMap('袖叉式样') === n.id || typeMap('袖叉式样') === n.originalId) {
                        options2 = n.options
                    }
                    if (typeMap('袖口辑线号') === n.id || typeMap('袖口辑线号') === n.originalId) {
                        options3 = n.options
                    }
                })

                unitData = [
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options1
                        },
                        style: '',
                        attributes: {
                            key: '袖口辑线',
                            value: dealCraftType('袖口辑线',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options2
                        },
                        style: '',
                        attributes: {
                            key: '袖叉式样',
                            value: dealCraftType('袖叉式样',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options3
                        },
                        style: '',
                        attributes: {
                            key: '袖口辑线号',
                            value: dealCraftType('袖口辑线号',res)
                        }
                    },
                ]

                resultArr.push({
                    title: '袖口',
                    unitData: unitData
                },)
                break;
            }
            case '锁定': {
                let unitData = []

                let options1=[],options2=[],options3=[],options4=[],options5=[],options6=[],
                    options7=[],options8=[],options9=[],options10=[],options11=[];
                proxyExecutor(optionRes, 'optionRes', Array, 'optionRes.data.craft').forEach(n=>{
                    if (typeMap('扣子') === n.id || typeMap('扣子') === n.originalId) {
                        options1 = n.options
                    }
                    if (typeMap('领角纽扣') === n.id || typeMap('领角纽扣') === n.originalId) {
                        options2 = n.options
                    }
                    if (typeMap('第一纽扣间距') === n.id || typeMap('第一纽扣间距') === n.originalId) {
                        options3 = n.options
                    }
                    if (typeMap('门襟扣数量') === n.id || typeMap('门襟扣数量') === n.originalId) {
                        options4 = n.options
                    }
                    if (typeMap('横眼位置') === n.id || typeMap('横眼位置') === n.originalId) {
                        options5 = n.options
                    }
                    if (typeMap('锁眼颜色') === n.id || typeMap('锁眼颜色') === n.originalId) {
                        options6 = n.options
                    }
                    if (typeMap('钉扣方法') === n.id || typeMap('钉扣方法') === n.originalId) {
                        options7 = n.options
                    }
                    if (typeMap('钉扣颜色') === n.id || typeMap('钉扣颜色') === n.originalId) {
                        options8 = n.options
                    }
                    if (typeMap('袖口锁眼') === n.id || typeMap('袖口锁眼') === n.originalId) {
                        options9 = n.options
                    }
                    if (typeMap('袖口钉扣') === n.id || typeMap('袖口钉扣') === n.originalId) {
                        options10 = n.options
                    }
                    if (typeMap('暗扣位置') === n.id || typeMap('暗扣位置') === n.originalId) {
                        options11 = n.options
                    }
                })

                unitData = [
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options1
                        },
                        style: '',
                        attributes: {
                            key: '扣子',
                            value: dealCraftType('扣子',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options2
                        },
                        style: '',
                        attributes: {
                            key: '领角纽扣',
                            value: dealCraftType('领角纽扣',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options3
                        },
                        style: '',
                        attributes: {
                            key: '第一纽扣间距',
                            value: dealCraftType('第一纽扣间距',res)
                        }
                    },
                    {
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options4
                        },
                        style: '',
                        attributes: {
                            key: '门襟扣数量',
                            value: dealCraftType('门襟扣数量',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options5
                        },
                        style: '',
                        attributes: {
                            key: '横眼位置',
                            value: dealCraftType('横眼位置',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options6
                        },
                        style: '',
                        attributes: {
                            key: '锁眼颜色',
                            value: dealCraftType('锁眼颜色',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options7
                        },
                        style: '',
                        attributes: {
                            key: '钉扣方法',
                            value: dealCraftType('钉扣方法',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options8
                        },
                        style: '',
                        attributes: {
                            key: '钉扣颜色',
                            value: dealCraftType('钉扣颜色',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options9
                        },
                        style: '',
                        attributes: {
                            key: '袖口锁眼',
                            value: dealCraftType('袖口锁眼',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options10
                        },
                        style: '',
                        attributes: {
                            key: '袖口钉扣',
                            value: dealCraftType('袖口钉扣',res)
                        }
                    },{
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                            type: 'select',
                            selectList: options11
                        },
                        style: '',
                        attributes: {
                            key: '暗扣位置',
                            value: dealCraftType('暗扣位置',res)
                        }
                    },
                ]

                resultArr.push({
                    title: '锁定',
                    unitData: unitData
                },)
                break;
            }
            case '备注': {
                let unitData = []

                // 假数据
                unitData = [
                    {
                        type: 'whole',
                        style: '',
                        enums: [
                            {
                                key: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                key: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            }
                        ]
                    },
                ]

                resultArr.push({
                    title: '备注',
                    unitData: unitData
                },)
                break;
            }
            case '面料': {
                /*fabrics*/
                let unitData = []

                switch (pageType) {
                    case 'size':{
                        unitData = [
                            {
                                type: 'enum',
                                style: '',
                                enums: [
                                    {
                                        label: proxyExecutor(res,'res','res.data.fabrics[0].fabricPattern'),
                                        value: proxyExecutor(res,'res','res.data.fabrics[0].fabricPattern'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    }
                                ]
                            },
                        ]
                        break;
                    }
                    default:{
                        unitData = [
                            {
                                type: 'enum',
                                style: '',
                                enums: [
                                    {
                                        label: proxyExecutor(res,'res','res.data.fabrics[0].fabricNumber'),
                                        value: proxyExecutor(res,'res','res.data.fabrics[0].fabricNumber'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    }
                                ]
                            },
                            {
                                type: 'enum',
                                style: '',
                                enums: [
                                    {
                                        label: proxyExecutor(res,'res','res.data.fabrics[0].fabricPattern'),
                                        value: proxyExecutor(res,'res','res.data.fabrics[0].fabricPattern'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    }
                                ]
                            },
                            {
                                type: 'enum',
                                style: '',
                                enums: [
                                    {
                                        label: proxyExecutor(res,'res','res.data.fabrics[0].fabricColor'),
                                        value: proxyExecutor(res,'res','res.data.fabrics[0].fabricColor'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        key: proxyExecutor(res,'res','res.data.fabrics[0].fabricPattern'),
                                        value: proxyExecutor(res,'res','res.data.fabrics[0].fabricPattern'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                    {
                                        key: proxyExecutor(res,'res','res.data.fabrics[0].wireNumber'),
                                        value: proxyExecutor(res,'res','res.data.fabrics[0].wireNumber'),
                                        IOFormat: {
                                            active: false,
                                        },
                                    },
                                ]
                            },
                        ]
                    }
                }

                resultArr.push({
                    title: '面料',
                    unitData: unitData
                },)
                break;
            }
            case '撞色': {
                /*contrasts*/
                let unitData = []

                proxyExecutor(res,'res',Array, 'res.data.contrasts').forEach(n=>{
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: '撞色部位',
                            value: proxyExecutor(n,'n',String,'n.partName')
                        }
                    })
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: '撞色材质',
                            value: proxyExecutor(n,'n',String,'n.detail.materialMes.type') + proxyExecutor(n,'n',String,'n.detail.materialMes.serialNumber')
                        }
                    })
                })

                resultArr.push({
                    title: '撞色',
                    unitData: unitData
                },)
                break;
            }
            case '工艺图片': {
                let unitData = []

                unitData = [
                    {
                        type: 'whole',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        enums: proxyExecutor(res,'res',Array,'res.data.crafts').map(n=>{
                            return n.images
                        })
                    },
                ]

                resultArr.push({
                    title: '工艺图片',
                    unitData: unitData
                },)
                break;
            }
            case '尺寸信息': {
                /*sizes*/
                let unitData = []

                unitData.push({
                    type: 'attribute',
                    IOFormat: {
                        active: false,
                    },
                    style: '',
                    attributes: {
                        key: '号型',
                        value: '',
                    }
                })
                unitData.push({
                    type: 'enum',
                    IOFormat: {
                        active: false,
                    },
                    style: '',
                    enums: [
                        {
                            label: '部位',
                            value: '部位',
                            IOFormat: {
                                active: false,
                            },
                        },
                        {
                            label: '尺寸',
                            value: '尺寸',
                            IOFormat: {
                                active: false,
                            },
                        },
                        {
                            label: '复尺',
                            value: '复尺',
                            IOFormat: {
                                active: false,
                            },
                        }
                    ]
                })

                proxyExecutor(res,'res',Array, 'res.data.sizes').forEach(n=>{
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: n.measureName,
                            value: `${n.netSize } ${n.unit}`
                        }
                    })
                })

                resultArr.push({
                    title: '尺寸信息',
                    unitData: unitData
                },)
                break;
            }
            case '工艺备注': {
                let unitData = []

                unitData = [
                    {
                        type: 'whole',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        enums: [proxyExecutor(res,'res',String,'res.data.craftRemark')]
                    },
                ]

                resultArr.push({
                    title: '工艺备注',
                    unitData: unitData
                },)
                break;
            }
            case '款式照片': {
                let unitData = []

                unitData = [
                    {
                        type: 'whole',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        enums: proxyExecutor(res,'res',Array,'res.data.designChoose.images')
                    },
                ]

                resultArr.push({
                    title: '款式照片',
                    unitData: unitData
                },)
                break;
            }
            case '体型照片': {
                let unitData = []
                unitData = [
                    {
                        type: 'enum',
                        style: '',
                        enums: JSON.parse(proxyExecutor(res,'res',String, 'res.data.customers[0].images') || '[]').map(n=>{
                            return {
                                label: n.url,
                                value: n.url,
                                IOFormat: {
                                    active: false,
                                }
                            }
                        })
                    },
                ]

                resultArr.push({
                    title: '体型照片',
                    unitData: unitData
                },)
                break;
            }
            case '特殊': {
                let unitData = []

                // 假数据
                unitData = [
                    {
                        type: 'enum',
                        style: '',
                        enums: [
                            {
                                label: '肩部',
                                value: '肩部',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                label: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                label: '手臂',
                                value: '手臂',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                label: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            }
                        ]
                    },
                    {
                        type: 'enum',
                        style: '',
                        enums: [
                            {
                                label: '脖颈',
                                value: '脖颈',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                label: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                label: '肚子',
                                value: '肚子',
                                IOFormat: {
                                    active: false,
                                },
                            },
                            {
                                label: '',
                                value: '',
                                IOFormat: {
                                    active: false,
                                },
                            }
                        ]
                    },
                ]

                resultArr.push({
                    title: '特殊',
                    unitData: unitData
                },)
                break;
            }
            case '体型补正': {
                let unitData = []

                proxyExecutor(res,'res',Array,'res.data.customers[0].corrects').forEach(n=>{
                    unitData.push({
                        type: 'attribute',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        attributes: {
                            key: n.correctName,
                            value: n.correctValue
                        }
                    })
                })

                resultArr.push({
                    title: '体型补正',
                    unitData: unitData
                },)
                break;
            }
            case '体型备注': {
                let unitData = []

                unitData = [
                    {
                        type: 'whole',
                        IOFormat: {
                            active: false,
                        },
                        style: '',
                        enums: [proxyExecutor(res,'res',String,'res.data.customers[0].remark')]
                    },
                ]

                resultArr.push({
                    title: '体型备注',
                    unitData: unitData
                },)
                break;
            }
        }
    })

    return resultArr
}

export {
    getTableData,
    getResResult,
    getFabricImages,
}
