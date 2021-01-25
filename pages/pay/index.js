import { showToast, requestPayment } from "../../utils/asyncWx"
import { request } from "../../request/index";
Page({
  data: {
    address: {},
    cart: [],
  },
  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  async handleOrderPay() {
    try {
      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      //请求头
      const header = { Authorization: token };
      //请求体
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      //准备发送请求，创建订单并获取订单号
      const res1 = await request({ url: "/my/orders/create", method: "post", data: orderParams, header: header })
      const { order_number } = res1.data.message;
      //发起微信支付
      const res2 = await request({ url: "/my/orders/req_unifiedorder", method: "post", header, data: { order_number } })
      const { pay } = res2.data.message
      await requestPayment(pay);
      const res3 = await request({ url: "/my/orders/chkOrder", method: "post", header, data: { order_number } })
      await showToast({ title: "支付成功" });
      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
        
      wx.navigateTo({
        url: '/pages/order/index',
      });
    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error);
    }
  

  }
})