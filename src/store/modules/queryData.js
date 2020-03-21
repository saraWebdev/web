/*
 * @Descripttion:  保存查询记录的数据
 * @version: 1.0
 * @Author: zengying
 * @Date: 2020-02-20 21:25:17
 * @LastEditors: zengying
 * @LastEditTime: 2020-03-18 16:55:41
 */
import { getAJXQ } from '@/apis/nres/grzx';

const state = {
  MYTEMPFLOWCOUNT: 0, // 我的暂存件记录总数
  MYEXTRAFLOWCOUNT: 0, // 我的待办件记录总数
  MYFINISHEDFLOWCOUNT: 0, // 我的已办件记录总数
  QUERYSQBH: '', // 当前业务编号
  FlOWDATA: [], // 业务号对应的数据信息记录
};

const getters = {
  // 获取指定sqbh的flowdata方法
  GET_FLOWDETAIL: state => sqbh => state.FlOWDATA.filter(p => p.sqbh === sqbh),
};

const mutations = {
  SET_MYTEMPFLOWCOUNT(state, count) {
    state.MYTEMPFLOWCOUNT = count;
  },
  SET_MYEXTRAFLOWCOUNT(state, count) {
    state.MYEXTRAFLOWCOUNT = count;
  },
  SET_MYFINISHEDFLOWCOUNT(state, count) {
    state.MYFINISHEDFLOWCOUNT = count;
  },
  SET_QUERYSQBH(state, sqbh) {
    state.QUERYSQBH = sqbh;
  },
  ADD_FLOWDATA(state, flowdata) {
    const index = state.FlOWDATA.findIndex(p => p.sqbh === state.QUERYSQBH);
    if (index < 0) {
      state.FlOWDATA.push(flowdata);
    } else {
      state.FlOWDATA[index] = flowdata;
    }
  },
};

const actions = {
  async  getAJXQ({ commit }, payload) {
    const { sqbh } = payload;
    try {
      const {
        code,
        msg,
        resData,
      } = await getAJXQ({ sqbh });
      if (code !== 0) {
        throw new Error(msg || '获取业务信息失败');
      }
      commit('ADD_FLOWDATA', { ...payload, flowdata: resData });
    } catch (err) {
      if (err.message.includes('timeout')) {
        throw new Error(`网络请求超时${err.message}`);
      } else {
        throw new Error(err.message);
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};