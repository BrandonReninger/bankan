import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from '../router/index'

Vue.use(Vuex)

//Allows axios to work locally or live
let base = window.location.host.includes('localhost') ? '//localhost:3000/' : '/'

let api = Axios.create({
  baseURL: base + "api/",
  timeout: 3000,
  withCredentials: true
})

export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    activeBoard: {},
    list: [],
    activeList: {},
    tasks: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setBoards(state, boards) {
      state.boards = boards
    },
    setActiveBoard(state, board) {
      state.activeBoard = board
    },
    setList(state, list) {
      state.list = list
    },
    setActiveList(state, list) {
      state.activeList = list
    },
    setTasks(state, tasks) {
      state.tasks = tasks
    }
  },
  actions: {
    //#region -- AUTH STUFF --
    setBearer({}, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      debugger
      api.defaults.headers.authorization = "";
    },
    async getProfile({
      commit
    }) {
      try {
        let res = await api.get("/profile")
        commit("setUser", res.data)
      } catch (err) {
        console.error(err)
      }
    },
    //#endregion


    //#region -- BOARDS --
    getBoards({
      commit,
      dispatch
    }) {
      api.get('boards')
        .then(res => {
          commit('setBoards', res.data)
          console.log(res.data);

        })
    },
    addBoard({
      commit,
      dispatch
    }, boardData) {
      console.log(boardData);
      api.post('boards', boardData)
        .then(serverBoard => {
          dispatch('getBoards')
        })
    },

    getBoard({
      commit,
      dispatch
    }, boardId) {
      api.get('boards/' + boardId)
        .then(res => {
          commit('setActiveBoard', res.data)
          console.log(res.data);

        })
    },
    //#endregion


    //#region -- LISTS --

    getList({
      commit,
      dispatch
    }, boardId) {
      api.get('boards/' + boardId + '/list')
        .then(res => {
          commit('setList', res.data)
          console.log(res.data);
        })
    },

    addList({
      commit,
      dispatch
    }, listId) {
      console.log(listId.boardId, "this from the store");
      api.post('list/', listId)
        .then(serverBoard => {
          dispatch('getList')
        })
    },


    //#endregion
  }
})