import { request } from "../../request/index.js"
Page({
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待收货",
        isActive:false
      },
      {
        id:3,
        value:"退货/退款",
        isActive:false
      }
    ]

  },
  onShow(options){
    wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
    const token=wx.getStorageSync("token")
    if(!token){wx.navigateTo({
      url: '/pages/auth/index',
    });return}
    //获取当前小程序的页面栈 -数组，长度最大是10页面
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    const {type}=currentPage.options;
    this.changeTitleByIndex(type-1)
    this.getOrders(type)
    
  },
  //获取订单列表的方法
  async getOrders(type){
    const res = await request({url:"/my/orders/all",data:{type}});
    console.log(res);
    this.setData({
      // orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  changeTitleByIndex(index){
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index+1);
  }
})