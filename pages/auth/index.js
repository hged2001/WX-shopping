import { request } from "../../request/index"
import { login } from "../../utils/asyncWx"
Page({
  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      const { encryptedData, rawData, iv, signature } = e.detail;
      //小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code }
      //发送请求，获取用户token
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, method: "post" })
      console.log(token);
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }


  }
})