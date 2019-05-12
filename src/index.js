function createStore(reducer) {
    let state = null
    const listeners = []
    const subscribe = (listener) => listeners.push(listener)
    const getState = () => state
    const dispatch = (action) => {
        state=reducer(state, action)//覆盖原对象
        listeners.forEach((listener) => listener())
    }
    dispatch({}) //初始化state
    return {
        getState,
        dispatch,
        subscribe
    }
}

function renderApp(newAppState,oldAppState={}) {//防止oldAppState没有传入,所以令oldAppState={}
    if(newAppState === oldAppState)return //数据没有变化就不渲染 了
    console.log('render app ...')
    renderTitle(newAppState.title,oldAppState.title)
    renderContent(newAppState.content,oldAppState.content)
}
function renderTitle (newTitle, oldTitle = {}) {
    if (newTitle === oldTitle) return // 数据没有变化就不渲染了
    console.log('render title...')
    const titleDOM = document.getElementById('title')
    titleDOM.innerHTML = newTitle.text
    titleDOM.style.color = newTitle.color
  }
  
  function renderContent (newContent, oldContent = {}) {
    if (newContent === oldContent) return // 数据没有变化就不渲染了
    console.log('render content...')
    const contentDOM = document.getElementById('content')
    contentDOM.innerHTML = newContent.text
    contentDOM.style.color = newContent.color
  }

// let newAppState={
//     ...appState,//复制appState里的内容
//     title:{ //用一个新对象覆盖原来的title属性
//         ...appState.title,//复制原来title对象里面的内容
//         text:`<<React 小书>>` //覆盖text属性
//     }
// }

function reducer(state, action) {
    if(!state){
        return{
            title: {
                text: 'React.js 嘿嘿标题',
                color: 'red',
            },
            content: {
                text: 'React.js 嘻嘻内容',
                color: 'blue',
            }
        }
    }
    switch (action.type) {
        case 'UPDATE_TITLE_TEXT':
            return { // 构建新的对象并且返回
                ...state,
                title:{
                    ...state.title,
                    text:action.text
                }
            }
        case 'UPDATE_TITLE_COLOR':
             return { // 构建新的对象并且返回
                ...state,
                title:{
                    ...state.title,
                    color:action.color
            }
        }
        default:
            return state //没有修改,返回原来的对象
    }
}


const store = createStore(reducer)
let oldState = store.getState() // 缓存旧的state

store.subscribe(() =>{ 
    const newState = store.getState() //数据可能变化,获取新的state
    renderApp(newState,oldState) // 把新旧state传禁区渲染
    oldState = newState//渲染完以后,新的newState变成旧的oldState,等待下一次数据变化重新渲染
}) 

renderApp(store.getState())//首次渲染页面
store.dispatch({
    type: 'UPDATE_TITLE_TEXT',
    text: '《React.js 小书》'
}) // 修改标题文本
store.dispatch({
    type: 'UPDATE_TITLE_COLOR',
    color: 'blue'
}) // 修改标题颜色