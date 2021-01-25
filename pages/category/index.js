// pages/category/index.js
import { request } from "../../request/index.js"
Page({

  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0//右菜单距离顶部的距离
  },
  //接口反回数据
  Cates: [],
  onLoad: function (options) {
    //判断是否有缓存
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.getCates();
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    // this.getCates();
  },
  //获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     this.Cates = res.data.message;
    //     //接口数据存储到本地
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     let rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })
    //使用es7的async await来发送请求
    const res = await request({ url: "/categories" })
    this.Cates = res.data.message;
    //接口数据存储到本地
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})