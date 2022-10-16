<!-- ---
title: http
author: 绯影
date: '2022-10-15'
--- -->

> 作者：绯影

## http 三次握手

参考：[https://www.zhihu.com/question/24853633](https://www.zhihu.com/question/24853633)

1. 三次握手之后，双方交换了 Initial Sequence number（也是 seq，只不过是握手的时候首次传递的 seq）。后面发送的数据都以此进行编号，每个字节对应 + 1。
2. 三次握手的目的就是为了来约定确定双方的 ISN。（如果只有两次握手，那么 B 将无法确定 A 是否正确收到自己的 seq，那么 B 返回数据将是没有意义的。两次握手如果不需要接受数据，那么也是可以的）
3. 同时三次握手可以避免旧复用链接（报文滞留）的情况。
   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b13e4e2bc4924ebaa96668182a4be4ea~tplv-k3u1fbpfcp-watermark.image?ynotemdtimestamp=1665837259419)

4. 握手时的规则

- isn 是随机产生的，这种随机来源于生成器，这个生成器会用一个 32 位长的时钟，差不多 4µs 增长一次，因此 ISN 会在大约 4.55 小时循环一次。而一个段(包)在网络中并不会比最大分段寿命（Maximum Segment Lifetime (MSL) ，默认使用 2 分钟）长，所以我们可以认为 ISN 是唯一的。
- 握手时，应答 ack 为 seq + 1
  ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3096e60d6deb4e1594945692009eadb4~tplv-k3u1fbpfcp-watermark.image?ynotemdtimestamp=1665837259419)

5. 传递数据时的规则  
   应答 ack 为 seq + 纯数据长度(不包括各种头) + 1  
   [来源](https://blog.csdn.net/weijuqie0697/article/details/81362158)

6. 在 3 次握手期间，如果有一次握手失败对应的处理方式

- 第一个包，即 A 发给 B 的 SYN 中途被丢，没有到达 B
  处理：A 会周期性超时重传，直到收到 B 的确认
- 第二个包，即 B 发给 A 的 SYN +ACK 中途被丢，没有到达 A
  处理：B 会周期性超时重传，直到收到 A 的确认
- 第三个包，即 A 发给 B 的 ACK 中途被丢，没有到达 B
  处理：
  - 假定此时双方都没有数据发送，B 会周期性超时重传，直到收到 A 的确认，收到之后 B 的 TCP 连接，也为 Established 状态，双向可以发包。
  - 假定此时 A 有数据发送，B 收到 A 的 Data + ACK，自然会切换为 established 状态，并接受 A 的 Data
  - 假定 B 有数据发送，数据发送不了，会一直周期性超时重传 SYN + ACK，直到收到 A 的确认才可以，发送数据

**注意**：前面两种情况都是谁丢了，谁周期性发送，而最后一种情况，跟要做的事情有关。

## http 四次挥手

参考图
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae02d5fb533d4497a2aba4e8f392d184~tplv-k3u1fbpfcp-watermark.image?)

1.  客户端或服务器均可主动发起挥手动作。
2.  收到一个 FIN 只意味着在这一方向上没有数据流动。客户端执行主动关闭并进入 TIME_WAIT 是正常的，服务端通常执行被动关闭，不会进入 TIME_WAIT 状态。
3.  为什么第 2 次和第 3 次挥手不在一起完成？  
    因为服务端的报文可能没有发完，先回复一个 ACK 报文，等报文都发完了，再发送 FIN 报文
4.  TIME_WAIT（也称为 2MSL 等待状态）
    MSL 是 Maximum Segment Lifetime 的英文缩写，可译为“最长报文段寿命”，它是任何报文在网络上存在的最长时间，超过这个时间报文将被丢弃。。
    TCP 报文段以 IP 数据报在网络内传输，而 IP 数据报则有限制其生存时间的 TTL 字段。
5.  等待 2mSL 的意义？  
    （1）目的是为了防止最后一个 ACK 报文丢失的情况。如果丢失，会导致服务端无法收到客户端对 FIN-ACK 的确认报文，服务器会超时重传这个 FIN-ACK，接着客户端再重传一次确认，重新启动时间等待计时器，最后客户端和服务器都能正常的关闭。假设客户端不等待 2MSL，而是在发送完 ACK 之后直接释放关闭，一但这个 ACK 丢失的话，服务器就无法正常的进入关闭连接状态  
    （2）可以使本连接持续的时间内所产生的所有报文段都从网络中消失，使下一个新的连接中不会出现这种旧的连接请求报文段。
6.  客户端和服务端都可以发起，发起方均会有 TIME_WAIT 状态
7.  总结：挥手过程其实就是一个发送关闭标志，另外一个应答的过程。  
     A 发送，B 应答；  
     B 发送，A 应答（然后 B 的应答和发送不能合并到一起，就形成了四次挥手）；  
     FIN 标志：希望断开连接

## options 请求

1.  为什么会有 options？

- 浏览器的同源策略，就是出于安全考虑，浏览器会限制从脚本发起的跨域 HTTP 请求（比如异步请求 GET, POST, PUT, DELETE,OPTIONS 等等）。
- 浏览器在处理跨域请求之前，会先对跨域请求做一个分析，将跨域请求分为 2 种：简单请求，和非简单请求

  - 简单请求：
    > HTTP 请求头限制这几种字段：Accept、Accept-Language、Content-Language、Content-Type、Last-Event-ID
    > Content-type 只能取：application/x-www-form-urlencoded、multipart/form-data、text/plain

  * 非简单请求
    > 我们通常会把 token 放到 header 中，并且根据情况把请求头的 content-type 设置成 `application/json;charset=UTF-8`，所以此时就是非简单请求，需要发送 OPTIONS 请求。（注意 axios 的默认请求方法为 `application/json`）

- OPTIONS 方法会返回允许访问的方法。  
  `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- 浏览器会根据允许访问的方法决定是否发起第二次请求

2.  怎样避免 options？  
    请后端的同学为 options 方法设置 `Access-Control-Max-Age` 属性，比如

```java
response.addHeader( "Access-Control-Max-Age", "3000" ) // 3000s
```

在指定的时间内，不会再次发起 OPTIONS 预请求，这样只有在第一次请求的时候会有 OPTIONS ，之后浏览器会从缓存里读取响应，也就不会再发送 OPTIONS 请求了。

3. 勾选 devtools 中的 disable cache 后的表现？  
   勾选了以后，`Access-Control-Max-Age` 将失效，每次都会发出 options 请求

## http 缓存策略

参考：https://os.51cto.com/article/625277.html

1. cache-control（强缓存），etag/if-none-match（协商缓存）
2. 首先是强缓存，假如设置了`cache-control: max-age=60`，那么在 60s 内再次请求就会直接使用缓存里面的内容。
3. expires 是 http1.0 的内容，cache-control 是 2.0 的内容，cache-control 的优先级高于 expires
4. 如果超过 60s 就会采用协商缓存进行处理。协商缓存是第二次请求才会发生的，因为第一次请求会把 etag 或者 last-modified 返回回来。
5. etag/if-none-match 优先级 > last-modified/if-Modified-Since

## SSL/TLS

1. https = http + SSL/TLS
2. TLS 由记录协议、握手协议、警告协议、变更密码规范协议、扩展协议等几个子协议组成，综合使用了对称加密、非对称加密、身份认证等许多密码学前沿技术
3. 套件组成：密钥交换算法 + 签名算法 + 对称加密算法 + （分组模式）+ 摘要算法(hash 算法)
   > 摘要算法：把任意长度的数据“压缩”成固定长度、而且独一无二的“摘要”字符串
4. 数字证书的目的：为了解决公钥的信任问题
   > 数字证书 = 服务器公钥 + 序列号、用途、颁发者、有效时间等等
5. 如果黑客把证书换成自己的了，那么在证书验证这一步，会检出证书里面的内容，服务器地址不是自己想要的。所以就会不信任。
6. 服务器公钥在 ECDHE 中只是用解密 server params。而在 RSA 握手中，会用来加密 pre-master
7. 保证数据的完整性，摘要算法
8. 数字签名 = 私钥 + 摘要 + RSA（是一种非对称加密）
9. 1 -- client_write_MAC_secret 客户端 MAC 密钥，生成消息的认证码，对方用其验证消息
   2 -- server_write_MAC_secret 服务器 MAC 密钥，生成消息的认证码，对方用其验证消息
   3 -- client_write_key 客户端加密密钥，加密客户端发送的消息，对方用其解密
   4 -- server_write_key 服务器加密密钥，服务器加密发送的消息，对方用其解密
   5 -- client_write_IV 客户端 IV，与客户端加密密钥配合使用(分组密码算法)
   6 -- server_write_IV 服务器 IV，与服务器加密密钥配合使用(分组密码算法)

再发 Finished 的时候，把之前所有发送的数据做个摘要，再加密一下，让服务器做个验证。（这时采用的是摘要算法），验证了完整性。
