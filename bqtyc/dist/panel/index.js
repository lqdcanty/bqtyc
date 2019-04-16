Component({
    externalClasses: ['i-class'],

    properties: {
        title: {
            type: String,
            value: ''
        },
        // 标题顶部距离
        hideTop: {
            type: Boolean,
            value: false
        },
        hideBorder: {
            type: Boolean,
            value: false
        },
        zIndex: {
          type: Number,
          value: 0
        },
        titleSize: {
          type: Number,
          value: 0
        },
    }
});
