Component({
    externalClasses: ['i-class'],

    relations: {
        '../grid-item/index': {
            type: 'parent'
        }
    },
    properties: {
      size: {
        type: Number,
        value: 28
      },
      isIndex:{
        type: Boolean,
        value: false
      },
      textLeft:{
        type: Boolean,
        value: false
      },
      weight: {
        type: String,
        value: ""
      },
      height: {
        type: String,
        value: ""
      },      
    }
});
