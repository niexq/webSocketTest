
## webSocketTest
使用node.js+socket.io+koa+reactjs搭建WebSocket简单的实时通信，服务端代码

#### 本篇相关github代码地址

服务端地址：https://github.com/niexq/webSocketTest

客户端地址：https://github.com/niexq/websocketClientTest

#### 1.服务器端相关配置
1.1 安装[koa](https://github.com/koajs/koa)
~~~
npm install --save koa
~~~

1.2 安装[socket.io](https://github.com/socketio/socket.io)
~~~
npm install --save socket.io
~~~

1.3 index.js简略代码
~~~
require('colors');
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);


io.of('/chat').on('connection', function(socket) {
    
    ...
    
    socket.emit('request', /* */); // emit an event to the socket
    
    socket.on('reply', function(){ /* */ }); // listen to the event
    
    socket.emit('news', { hello: 'world' });
    
    socket.on('my other event', function (data) {
        console.log(data);
    });

});

server.listen(8899);
console.error('websocket test server start'.green);
~~~

##### 2.客户端相关配置
2.1 可直接用[create-react-app](https://github.com/facebook/create-react-app)或[ant方式](https://ant.design/docs/react/use-with-create-react-app-cn)
~~~
npx create-react-app websocket-client-test

cd websocket-client-test

npm start
~~~

2.2. 安装[socket.io-client](https://github.com/socketio/socket.io-client)
~~~
npm install --save socket.io-client
~~~

2.3 封装WebSocket，在应用入口js中引入

WebSocket.js
~~~
export default class WebSocket extends Component {
    ...
}
~~~
App.js
~~~
export default class App extends Component {

    ...
    
    render () {
        return (
            <div>
                ...
                <WebSocket />
            </div>
        )
    }
}
~~~

lib/websocket.js,websocket相关方法封装
~~~

import io from 'socket.io-client';
import _ from 'lodash';
import { getCurrentUser } from './utils';

import { Socket } from 'dgram';

const env = process.env.NODE_ENV || 'development';
const config = require(`./config.${env}`);

export const CHATWEBSOCKET = 'CHATWEBSOCKET'
export const NEWSWEBSOCKET = 'NEWSWEBSOCKET'


const chatWebSocket = io(config.chatWebSocket,{
  autoConnect: false
});


const newsWebSocket = io(config.newsWebSocket,{
  autoConnect: false
});

export function chatSocketBind(cb){
  console.error('~~~~~chatWebSocket', chatWebSocket);
  if(!chatWebSocket.connected) chatWebSocket.open();

  // 把当前用户名称发给服务器缓存下来，然后服务器给指定用户发信息(按业务需要，可以把当前用户信息包括token信息发给服务器缓存下来，然后服务器给指定用户发信息)
  const { id, token } = getCurrentUser();
  if(!id || !token) return;
  chatWebSocket.emit('chatSocketBind', id, token);

  // 绑定chat服务器发来的notify消息
  if(_.isFunction(cb)) chatWebSocket.on('notify', (...args) => cb(...args));

  // chatWebSocket.emit('firstMessageType', '嗨，我要建立websocket协议，需要chat服务')
}

export function newsSocketBind(cb){
  if(!newsWebSocket.connected) newsWebSocket.open();

  // 把当前用户名称发给服务器缓存下来，然后服务器给指定用户发信息
  const { id, token } = getCurrentUser();
  if(!id || !token) return;
  newsWebSocket.emit('newsSocketBind', id, token);

  // 绑定news服务器发来的notify消息
  if(_.isFunction(cb)) newsWebSocket.on('notify', (...args) => cb(...args));
}

export function sendMessage({ serviceType, messageType, message }) {
  const { id, name, token } = getCurrentUser();
  if(!id || !token) return;

  switch(serviceType) {
    case CHATWEBSOCKET:
      chatWebSocket.emit(messageType, id, name, message);
      break;
    case NEWSWEBSOCKET:
      newsWebSocket.emit(messageType, id, name, message);
      break;
    default:
      break;
  }
}

~~~

3.最终操作效果图
![png1](https://github.com/niexq/niexqStatic/blob/master/websocket/websocketTest.png?raw=true)



#### 篇外：HTML5 WebSocket
WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

现在，很多网站为了实现推送技术，所用的技术都是 Ajax 轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

![png](http://www.runoob.com/wp-content/uploads/2016/03/ws.png)

##### 有关更多详细信息，请参阅：

[socket.io](https://socket.io/docs)

[HTML5 WebSocket](http://www.runoob.com/html/html5-websocket.html)




