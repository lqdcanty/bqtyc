// components/authorize/authorize.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sysType: {  //授权页面类型 
      type: String,
      value: 'bqbk'
    },
    sysTitle: { //授权页面标题
      type: String,
      value: '版权百科'
    },
    sysLogo: {  //授权页面logo
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    doLogin: function (e) {
      console.log(e,"eeeeeeeeeee")
      let _this=this;
      if (e.detail.userInfo == null) {
        console.log("未获取到授权");
      } else {
        console.log('获得授权')
        // myevent自定义名称事件，父组件中使用
        _this.triggerEvent('authorizeEvent', 1);
        
        
        //app.globalData.userInfoDetail=e.detail;//授权获取到的所有信息
      }
    }
  }
})
