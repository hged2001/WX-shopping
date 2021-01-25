//Page Object
import { request } from "../../request/index.js"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    catesList:[],
    floorList:[]
  },
  //options(Object)
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
   
  },
  getSwiperList(){
    request({ url: '/home/swiperdata' })
    .then(result => {
      this.setData({
        swiperList: result.data.message
      })
    })
  },
  getCatesList(){
    request({ url: '/home/catitems' })
    .then(result => {
      this.setData({
        catesList: result.data.message
      })
    })
  },
  getFloorList(){
    request({ url: '/home/floordata' })
    .then(result => {
      this.setData({
        floorList: result.data.message
      })
    })
  },
});
