> 作者：绯影

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d82f98464d6547e0a689d508ab45082c~tplv-k3u1fbpfcp-watermark.image"/>

### Blob

Blob 全称为 binary large object ，即二进制大对象。blob 对象本质上是 js 中的一个对象，里面可以储存大量的二进制编码格式的数据。Blob 对象表示一个不可变、原始数据的类文件对象

#### 构造函数

```js
new Blob(array, options)
```

> array: 是一个由 ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array  
> options:
>
> - type: 默认值为 ""，表示将会被放入到 blob 中的数组内容的 MIME 类型。
> - endings: 不常用。

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2afce50ff317475bacffda87af277a8d~tplv-k3u1fbpfcp-watermark.image" style="width: 350px"/>

#### 实例属性和方法

- Blob.prototype.size: Blob 对象中所包含数据的大小（字节）
- Blob.prototype.type：字符串，认为该 Blob 对象所包含的 MIME 类型。如果类型未知，则为空字符串。

* Blob.prototype.slice([byteStart], [byteEnd], [contentType])
  > - byteStart —— 起始字节，默认为 0。
  >
  > * byteEnd —— 最后一个字节（不包括，默认为最后）。
  > * contentType —— 新 blob 的 type，默认与源 blob 相同。
* Blob.prototype.arrayBuffer()
  > 返回一个 promise，其会兑现一个包含 Blob 所有内容的二进制格式的 ArrayBuffer。
* Blob.prototype.stream()
  > 返回一个能读取 Blob 内容的 ReadableStream。
* Blob.prototype.text()
  > 返回一个 promise，其会兑现一个包含 Blob 所有内容的 UTF-8 格式的字符串

### File

File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的 context 中

在 JavaScript 中，主要有两种方法来获取 File 对象：

- `<input>`元素上选择文件后返回的 FileList 对象；

```js
e.target.files
```

- 文件拖放操作生成的 DataTransfer 对象；

```js
e.dataTransfer.files
```

#### 构造函数

```js
var myFile = new File(bits, name[, options]);
```

> bits：一个包含 ArrayBuffer，ArrayBufferView，Blob，或者 string 对象的 Array — 或者任何这些对象的组合。这是 UTF-8 编码的文件内容。  
> name：表示文件名称，或者文件路径。  
> options：
>
> - type: DOMString，表示将要放到文件中的内容的 MIME 类型。默认值为 ""
> - lastModified: 数值，表示文件最后修改时间的 Unix 时间戳（毫秒）。默认值为 Date.now()。

示例

```js
var file = new File(['foo'], 'foo.txt', {
  type: 'text/plain',
})
```

### FileReader

Blob 中读取内容，使用 File 或 Blob 对象指定要读取的文件或数据

#### 构造函数

```js
new FileReader()
```

#### 属性

- readyState

| 常量名  | 值  | 描述                   |
| ------- | --- | ---------------------- |
| EMPTY   | 0   | 还没有加载任何数据。   |
| LOADING | 1   | 数据正在被加载。       |
| DONE    | 2   | 已完成全部的读取请求。 |

- result
  > 文件的内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

#### 事件处理

- onabort

  > 处理 abort 事件。该事件在读取操作被中断时触发。

- onload
  > 处理 load 事件。该事件在读取操作完成时触发

#### 方法

- abort()
  > 中止读取操作。在返回时，readyState 属性为 DONE

* readAsArrayBuffer(blob)

  > 开始读取指定的 Blob 中的内容，一旦完成，result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象。

* readAsDataURL(blob)
  > 开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 data: URL 格式的 Base64 字符串以表示所读取文件的内容。
* readAsText(blob[, encoding])
  > 开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个字符串以表示所读取的文件内容。  
  > encoding: 传入一个字符串类型的编码类型，如缺省，则默认为“utf-8”类型

示例

```html
<input type="file" name="" id="fileId" />
<script>
  let inputDom = document.querySelector('input')
  inputDom.onchange = function (e) {
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file) // 将文件读取为base64
    reader.onload = function () {
      console.log('base64', reader.result)
    }
  }
</script>
```

### ArrayBuffer

用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个字节数组，不能直接操作 ArrayBuffer 中的内容。

而是要通过 TypedArray（类型化数组）对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

#### 构造函数

```js
new ArrayBuffer(bytelength)
```

> bytelength，表示要创建数组缓冲区的大小（以字节为单位。）

#### TypedArray

```
Int8Array、Uint8Array、Uint8ClampedArray、
Int16Array、Uint16Array、
Int32Array、Uint32Array、
Float32Array、Float64Array、
BigInt64Array、BigUint64Array、
```

示例

通过 TypedArray

```js
let buffer = new ArrayBuffer(32)
let newBuffer = new Int8Array(buffer)
```

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/477d27e1c993478688823f8ef0863def~tplv-k3u1fbpfcp-watermark.image" style="width: 500px"/>

#### DataView

TypedArray 与 DataView 不同的地方在于，前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型。

使用

```
new DataView(buffer)
new DataView(buffer, byteOffset)
new DataView(buffer, byteOffset, byteLength)
```

##### 实例方法

通过下面的方法读取内容，参数都是一个字节序号，表示开始读取的字节位置

```
DataView.prototype.getInt8() // 返回一个带符号 8 位整数
DataView.prototype.getUint8() // 无符号 8 位整数
DataView.prototype.getInt16() // 带符号 16 位整数
DataView.prototype.getUint16() // 无符号 16 位整数
DataView.prototype.getInt32() // 带符号 32 位整数
DataView.prototype.getUint32() // 无符号 32 位整数
DataView.prototype.getFloat32() // 带符号 32 位浮点数
DataView.prototype.getFloat64() // 带符号 64 位浮点数
DataView.prototype.getBigInt64() // 带符号 64 位整数
DataView.prototype.getBigUint64() // 无符号 64 位整数
```

通过下面的方法写入内存，两个参数，第一个表示开始写入数据的字节序号，第二个为写入的数据

```
DataView.prototype.setInt8() // 存储一个带符号 8 位整数
DataView.prototype.setUint8() // 存储一个无符号 8 位整数
DataView.prototype.setInt16() // 存储一个带符号 16 位整数
DataView.prototype.setUint16() // 存储一个无符号 16 位整数
DataView.prototype.setInt32() // 存储一个带符号 32 位整数
DataView.prototype.setUint32() // 存储一个无符号 32 位整数
DataView.prototype.setFloat32() // 存储一个带符号 32 位浮点数
DataView.prototype.setFloat64() // 存储一个带符号 64 位浮点数
DataView.prototype.setBigInt64() // 存储一个带符号 64 位 BigInt
DataView.prototype.setBigUint64() // 存储一个无符号 64 位 BigInt
```

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fc52084997a4a05acb22864dde9f30e~tplv-k3u1fbpfcp-watermark.image" width="300px"/>

### Object URL

> 它是一个用来表示 File Object 或 Blob Object 的 URL

```js
URL.createObjectURL(file)
```

结果示例：`blob:null/f4d38074-4522-44e3-81af-3ba99c21252f`

### base64

在 JavaScript 中，有两个函数被分别用来处理解码和编码 base64 字符串：

atob()

> 解码，解码一个 Base64 字符串；

btoa()

> 编码，从一个字符串或者二进制数据编码一个 Base64 字符串。

#### base64 的主要用法

1. 将 canvas 画布内容生成 base64 的图片，使用 `canvas.toDataURL()` 的方式

2. 将 input 框获取的图片文件，生成 base64 图片，使用 `FileReader` 的 `readAsDataURL` 方式

### 总结

1.  ArrayBuffer 与 Blob 的区别： ArrayBuffer 和 Blob 的特性，Blob 作为一个整体文件，适合用于传输；当需要对二进制数据进行操作时（比如要修改某一段数据时），就可以使用 ArrayBuffer。
2.  通过 ArrayBuffer 创建 Blob，然后通过 FileReader 读取里面的内容

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/496ba36c103b46948ff5d371d70f7e80~tplv-k3u1fbpfcp-watermark.image" style="width: 600px"/>

参考文档：  
[https://blog.csdn.net/qq_35577655/article/details/127169333?spm=1001.2014.3001.5502](https://blog.csdn.net/qq_35577655/article/details/127169333?spm=1001.2014.3001.5502)
[https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
