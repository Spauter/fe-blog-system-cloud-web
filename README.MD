### 介绍

这是从fe-blog-system-cloud抽出来的前端项目，用npm运行，主要是修改后会立马反馈给服务器，就不需要重启Spring Boot,节省时间

### 运行方式：

打开js/common.js，修改这三个值：

​		ws：fe-blog-system-cloud-chat中netty监听地址+端口

​		baseUrl: 后台网关服务+端口

​		MINIO_BASE_URL：Minio地址

接下来可以选择两种方式

​	1.可以丢进某个模块的resources/static或者webapp目录中然后启动Spring Boot项目

​	2.打开build.js，修改host或port值,然后执行下面三条指令

```cmd
npm init
npm install lite--server --save-dev
npm start 
```

