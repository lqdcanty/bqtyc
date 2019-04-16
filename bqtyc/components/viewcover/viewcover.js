// components/viewcover/viewcover.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      default: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function () {
    let _t = this.properties.title;
    this.setData({
      name: _t.substring(1, 0),
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
