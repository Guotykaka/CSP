    //全选
    export function selectAllPackage(val,allOptions,oldOptions,newOptions,selectAll_character) {
        //参数说明：val:传入的已选择值;allOptions:全部选项列表;oldOptions:旧的已选择值;newOptions:新的已选择值;selectAll_character:全选选项的id值.
        const allValues = []
        // 保留所有值
        for (const item of allOptions) {
        allValues.push(item.institutionCode)
        }
        // 用来储存上一次的值，可以进行对比
        const oldVal = oldOptions.length === 1 ? oldOptions[0] : []
        // 若是全部选择
        if (val.includes(selectAll_character)) newOptions = allValues
        // 取消全部选中 上次有 当前没有 表示取消全选
        if (oldVal.includes(selectAll_character) && !val.includes(selectAll_character)) newOptions = []
        // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (oldVal.includes(selectAll_character) && val.includes(selectAll_character)) {
        const index = val.indexOf(selectAll_character)
        val.splice(index, 1) // 排除全选选项
        newOptions = val
        }
        // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (!oldVal.includes(selectAll_character) && !val.includes(selectAll_character)) {
        if (val.length === allValues.length - 1) newOptions = [selectAll_character].concat(val)
        }
        // 储存当前最后的结果 作为下次的老数据
        oldOptions[0] = newOptions;
        return [oldOptions,newOptions];
      }
    //时间格式转换 年月日
    export function timestampToTime(timestamp) {
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
        return Y+M+D;
    }