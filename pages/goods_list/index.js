import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  //接口参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
    
  },
  //获取商品列表
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:"this.QueryParams"})
    const total=res.data.message.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
    //关闭下拉窗口
    wx.stopPullDownRefresh();
  },
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index}=e.detail;
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  //下滑触底事件
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wewx.showToast({title: '我是有底线的',});
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  }
  
})