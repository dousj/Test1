
import 'whatwg-fetch'
import 'es6-promise'
const Post = (url,params)=>{
    let str = ''
    for (var key in params) {
        str+='&'+key+'='+params[key]
    }
    str=str.slice(1)
    let result = fetch(url,{
        // credentials:'include',
        headers:{
            'Accept':'*/*',
            'Content-Type':'application/x-www-form-urlencoded'
        },
        method:'POST',
        body:str
    })
    return result
}

export default Post
