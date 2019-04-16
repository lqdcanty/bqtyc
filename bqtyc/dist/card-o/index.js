Component({
  externalClasses: ['i-class'],
  options: {
    multipleSlots: true
  },
  data: {
    openStatus: false
  },
  properties: {
    turl:{
      type: String,
      value: ''
    },
    full: {
      type: Boolean,
      value: false
    },
    footerH: {
      type: Number,
      value: ""
    },
    thumb: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    subt: {
      type: String,
      value: ''
    },
    tag: {
      type: String,
      value: ''
    },
    extra: {
      type: String,
      value: ''
    },
    opendStatus: {
      type: Boolean,
      value: ""
    }
  },
  ready: function () {
    let _t = this.properties.title;
    this.setData({
      name: _t.substring(1, 0),
    })
  },
  methods: {
    onshow() {
      let newOpenStatus = !this.data.openStatus;
      this.setData({
        openStatus: newOpenStatus
      })
    },
    // 传递给父组件
    cancelBut: function (e) {
      var that = this;
      var myEventDetail = { pickerShow: false, type: 'cancel' } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail) //myevent自定义名称事件，父组件中使用
    },
  }
});
