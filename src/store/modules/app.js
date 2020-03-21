/**
 * @File: 状态管理app模块
 * @Author: qiwei
 * @Date: 2020-02-12 15:38:52
 * @Last Modified by: qiwei
 * @Last Modified time: 2020-03-17 14:11:12
 */
import { TICKET_KEY, TICKET_TIME_KEY, AREA_KEY } from '@/libs/authTypes';
import {
  setItem, getItem, setLSItem, getLSItem,
} from '@/libs/common';
import { getTicketForThird } from '@/apis/auth/appExtend';

const state = {
  ticket: getItem(TICKET_KEY),
  ticketTime: getItem(TICKET_TIME_KEY),
  sidebar: {
    opened: getItem('sidebarStatus') ? !!+getItem('sidebarStatus') : true,
    withoutAnimation: false,
  },
  device: 'desktop',
  portal: {},
  portalCenter: [],
  portletcfgList: [],
  menus: [],
  activeCenter: null,
  area: getLSItem(AREA_KEY),
};

const mutations = {
  CHANGE_PORTALCOLLAPSERIGHT(state) {
    state.portal.portalCollapseright = state.portal.portalCollapseright === '是' ? '否' : '是';
  },
  SET_AREA(state, area) {
    state.area = area;
    setLSItem(AREA_KEY, area);
  },
  SET_TICKET(state, ticket) {
    state.ticket = ticket;
    setItem(TICKET_KEY, ticket);
  },
  SET_PORTAL(state, portal) {
    state.portal = portal;
    const { portalCollapseleft } = portal;
    state.sidebar.opened = state.device === 'desktop' ? portalCollapseleft !== '是' : false;
  },
  SET_PORTALCENTER(state, portalCenter) {
    state.portalCenter = portalCenter;
  },
  SET_PORTLETCFGLIST(state, portletcfgList) {
    state.portletcfgList = portletcfgList;
  },
  SET_MENUS(state, menus) {
    state.menus = menus;
  },
  SET_ACTIVECENTER(state, center) {
    state.activeCenter = center;
  },
  SET_TICKET_TIME(state, ticketTime) {
    state.ticketTime = ticketTime;
    setItem(TICKET_TIME_KEY, ticketTime);
  },
  TOGGLE_SIDEBAR(state) {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      setItem('sidebarStatus', 1);
    } else {
      setItem('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    setItem('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
};

const actions = {
  async getTicket({ commit }, payload) {
    const {
      code,
      msg,
      resData: {
        ticket,
      } = {},
    } = await getTicketForThird(payload) || {};
    if (code !== 0 || !ticket) {
      throw new Error(msg || '获取票据失败');
    }
    commit('SET_TICKET', ticket);
    commit('SET_TICKET_TIME', new Date().getTime());
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  setPortal({ commit }, portal) {
    commit('SET_PORTAL', portal);
  },
  setPortalcenter({ commit }, portalcenter) {
    if (!Array.isArray(portalcenter)) {
      return;
    }
    commit('SET_PORTALCENTER', portalcenter);
    let activeCenter = null;
    for (let i = 0; i < portalcenter.length; i += 1) {
      const { configIsdefault } = portalcenter[i];
      if (configIsdefault === '是') {
        activeCenter = portalcenter[i];
        break;
      }
    }
    commit('SET_ACTIVECENTER', activeCenter || portalcenter[0]);
  },
  setPortletcfglist({ commit }, portletcfglist) {
    commit('SET_PORTLETCFGLIST', portletcfglist);
  },
  setMenus({ commit }, menus) {
    commit('SET_MENUS', menus);
  },
  setActiveCenter({ commit }, center) {
    commit('SET_ACTIVECENTER', center);
  },
  setArea({ commit }, area) {
    commit('SET_AREA', area);
  },
  changePortalCollapseright({ commit }) {
    commit('CHANGE_PORTALCOLLAPSERIGHT');
  },
};

const getters = {
  sideMenus(state) {
    if (!state.activeCenter) {
      return [];
    }
    if (!state.activeCenter.centercfgMenus) {
      return state.menus;
    }
    return state.menus.filter(menu => state.activeCenter.centercfgMenus.split(';')
      .includes(menu.id));
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};