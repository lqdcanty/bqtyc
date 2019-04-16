Component({
    externalClasses: ['i-class'],

    relations: {
        '../grid/index': {
            type: 'parent'
        },
        '../grid-icon/index': {
            type: 'child'
        }
    },

    data: {
        width: '33.33%'
    },

    properties: {
      border_bottom: {
        type: Number,
        value: 1
      },
      padding_l:{
        type: Number,
        value: 10
      },
      margin_t: {
        type: Number,
        value: 0
      },
      margin_b: {
        type: Number,
        value: 0
      },
      border_right:{
        type: Number,
        value: 1
      },
      width: {
        type: String,
        value: "33.33%"
      },
      scale: {
        type: String,
        value: ""
      },
      bindtap: {
        type: String,
        value: ""
      },
      data: {
        type: String,
        value: ""
      },
    },
    methods: {
      handleTap(e) {
        if (this.data.disabled) return false;
        let details = e.detail;
        const myEventDetail = e.detail; // detail对象，提供给事件监听函数
        const myEventOption= {};// 触发事件的选项
        this.triggerEvent('myevent', myEventDetail, myEventOption)
        console.log("handleTap", e);
        // this.triggerEvent('handleTap', details);
      },
    }
});
