import { defineStore } from 'pinia'

export const useNavStore = defineStore('nav', {
  state: () => ({
    isExpanded: false // 👉 这里改为 false，默认进入页面时是关闭/缩小状态
  }),
  actions: {
    toggleSidebar(state) {
      this.isExpanded = state
    }
  }
})