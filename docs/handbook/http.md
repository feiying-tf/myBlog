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

<!-- <LastUpdated /> -->
