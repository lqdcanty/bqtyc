Component({
    externalClasses: ['i-class'],
    options: {
        multipleSlots: true
    },
    relations : {
        '../sticky/index' : {
            type : 'parent'
        }
    },
    data : {
        top : 0,
        height : 0,
        isFixed : false,
        index : -1,
    },
    methods: {
        updateScrollTopChange(scrollTop){
          const data = this.data;
          const top = data.top;
          const height = data.height;
          if ( scrollTop < top && data.isFixed)  {
            console.log("sticky(0): ", scrollTop, top)
            this.setData({
              isFixed: false
            });
          }
          else {
            if (scrollTop > top && !data.isFixed) {
              console.log("sticky(1): ", scrollTop, top, data.isFixed)
              this.setData({
                isFixed: true
              });
            }
          }
        },
        updateDataChange(index) {
            const className = '.i-sticky-item';
            const query = wx.createSelectorQuery().in(this);
            query.select( className ).boundingClientRect((res)=>{
                    if( res ){
                        this.setData({
                            top : res.top,
                            height : res.height,
                            index : index
                        })
                    }
            }).exec()
        }
    }
})