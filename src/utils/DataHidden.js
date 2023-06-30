/**
 * 姓名隐藏，只展示第一位，其余替换为 *
 */
export function getHiddenName(data){
  if (!data) return ''
  const surname = data.substr(0, 1)
  const star = '*'.repeat(data.length - 1)
  return surname + star
}

/**
 * 详细地址隐藏数字包含中文数字，替换为 *
 */
export function getHiddenDetailAddress(data){
  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  if (!data || data.length === 0){
    return ''
  }
  let tempResult = data.replace((/\d/g),'*')
  let result = ''
  for(let i=0;i<tempResult.length;i++){
    if (chineseNumbers.includes(tempResult[i])){
      result += '*'
    }else {
      result += tempResult[i]
    }
  }
  return result
}

