const state={
    currentSelected:[]
}
const mutations ={
    SELECT_CHANNEL:(state,payload)=>{
        state.currentSelected=payload.current;
        console.log('statechange',state.currentSelected);
    }
}
export default {
    namespaced: true,
    state,
    mutations
}