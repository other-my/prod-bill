/*表格数据格式实例*/
const exampleTableData = [
    {
        title: '种类',
        unitData: [
            {
                type: 'enum',
                IOFormat: {
                    active: false,
                    type: 'input',
                },
                style: '',
                enums: ['红色','蓝色','绿色'],
            },
            {
                type: 'attribute',
                IOFormat: {
                    active: false,
                    type: 'select',
                    selectList: ['小明','小王']
                },
                style: '',
                attributes: {
                    key: '客户姓名',
                    value: '小明'
                }
            },
            {
                type: 'enum',
                IOFormat: {
                    active: true,
                    type: 'select',
                    selectList: ['蓝色','红色']
                },
                style: '',
                enums: ['蓝色','红色'],
            },
        ]
    },
    {
        title: '种类',
        unitData: [
            {
                type: 'enum',
                IOFormat: {
                    active: true,
                    type: 'input',
                },
                style: '',
                enums: ['红色','蓝色'],
            },
            {
                type: 'attribute',
                IOFormat: {
                    active: true,
                    type: 'select',
                    selectList: ['小明','小王']
                },
                style: '',
                attributes: {
                    key: '客户姓名',
                    value: '小明'
                },

            },
            {
                type: 'enum',
                IOFormat: {
                    active: true,
                    type: 'select',
                    selectList: ['蓝色','红色']
                },
                style: '',
                enums: ['蓝色','红色'],
            },
        ]
    },
    /*整体类型的数据格式，根据spanRows来判断，且项目的type都为 'whole' */
    {
        title: '备注',
        spanRows: 2,
        unitData: [
            {
                type: 'whole',
                IOFormat: {
                    active: false,
                },
                style: '',
                enums: ['','']
            },
            {
                type: 'whole',
                IOFormat: {
                    active: false,
                },
                style: '',
                enums: ['','']
            }
        ]
    },
]
