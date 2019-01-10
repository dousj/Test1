
import 'whatwg-fetch'
import 'es6-promise'
const Get = (url,params)=>{

    let symbol = url.indexOf('?')>-1?'&':'?'
    let str = ''
    for (var key in params) {
        str+='&'+key+'='+params[key]
    }
    
    str=str.slice(1)

    url+=symbol+str
    let result = fetch(url,{
        credentials:'include',
        headers:{
            'Accept':'*/*'
        }
    })
    return result
}

export default Get
