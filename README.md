# n-wiki
API & SDK 文档管理
使用mongodb作为数据库

## Start

```code
npm install
node server.js
```
#### 添加管理员
在config.json中添加用户,密码经过md5加密
```json
{
  "user": [
    {
      "name": "admin",
      "password": "1431350a1049653584759fc78725b8dc"
    }
  ]
}
```
#### 数据库
在config.js中配置mongodb数据地址，用户名和密码
