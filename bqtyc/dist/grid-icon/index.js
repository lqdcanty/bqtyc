Component({
    externalClasses: ['i-class'],

    relations: {
        '../grid-item/index': {
            type: 'parent'
        }
    },

    properties: {
      scale: {
        type: String,
        value: ""
      },
    }
});
