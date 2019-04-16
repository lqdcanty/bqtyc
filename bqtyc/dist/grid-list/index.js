Component({
    externalClasses: ['i-class'],

    relations: {
        '../grid-item/index': {
            type: 'child',
            linked () {
                this.setGridItemWidth();
            },
            linkChanged () {
                this.setGridItemWidth();
            },
            unlinked () {
                this.setGridItemWidth();
            }
        }
    },
    options:{
      multipleSlots: true
    },
    data:{
      opendStatus:true
    },
    properties: {
      border_top: {
        type: Number,
        value: 1
      },
      lengthR:{
        type:Number,
        value:1
      }
    },

    methods: {
        onshow(){
          let newOpenStatus = !this.data.opendStatus;
          this.setData({
            opendStatus: newOpenStatus
          })
          console.log(this.data.opendStatus)
        },
        setGridItemWidth () {
            const nodes = this.getRelationNodes('../grid-item/index');

            // const len = nodes.length;
            // if (len < 3) {
            //     nodes.forEach(item => {
            //         item.setData({
            //             'width': '33.33%'
            //         });
            //     });
            // } else {
            //     const width = 100 / nodes.length;
            //     nodes.forEach(item => {
            //         item.setData({
            //             'width': width + '%'
            //         });
            //     });
            // }
            const width = 100 / nodes.length;
            nodes.forEach(item => {
                item.setData({
                    'width': width + '%'
                });
            });
        }
    },

    ready () {
        this.setGridItemWidth();
    }
});
