import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    //商品是否被收藏
    isCollect: false
  },
  //商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;

    this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } })
    this.GoodsInfo = res.data.message
    //  //获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    //  //判断当前商品是否被收餐
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        //修改尾缀
        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.data.message.pics
      },
      isCollect
    })
  },
  //放大预览
  handlePreviewImage(e) {
    //预览图片的数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    //传递过来的图片的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  //加入购物车
  handleCartAdd(e) {
    //获取缓冲中的购物车（数组）
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    //购物车重新添加到缓存
    wx.setStorageSync("cart", cart)
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500,
      mask: true
    });
  },
  //点击收藏事件
  handleCollect() {
    let isCollect = false;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //判断改商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)

    if (index !== -1)//找到了,收藏过，从数组中删除
    {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {//否则，将其添加到收藏里
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //重新将数组存到缓存中
    wx.setStorageSync("collect", collect);
    //修改data中的属性
    this.setData({
      isCollect
    })
  }
})