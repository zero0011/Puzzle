# 拼图游戏

## 启动

1. 前端

 npm i

 npm run dev

2. 后端

cd server

npm i 

nodemon app.js

## 实现功能有

1. **普通的拼图功能**
2. **自动拼图功能(难点)**
3. **游戏聊天室的设计**

## 效果大概是下面这样的
(效果)[https://zero0011.github.io/puzzle_look/]


## 普通拼图功能

拼图的玩法是这样的 , 如果点击一个非空的块 ,如果它的周围有空的块, 被
点击的块就往空块的方向移动 .
如果最终的排列是 [1,2,3,4,5,6,7,8] , 则通关

于是我们总结一下 , 需要做的几个事情
- 使用 vue
- 页面布局
- 打乱
- 点击和移动
- 判断有没有过关

### 使用 vue
1. 安装 
    `npm install -g @vue/cli`
2. 创建一个项目
    `vue create puzzle`

### 页面布局

html

```html
<template>
    <div class="box">
        <transition-group name="cell" tag="div" class="container">
            <div
                @click.prevent="clickBlock(index)"
                v-for="(puzzle,index) in puzzles"
                :key="puzzle"
                v-text="puzzle"
                :class="puzzle === ''? 'cell cells':'cell'"
            ></div>
        </transition-group>
    </div>
</template>
```

css

```css
<style>
.box {
    width: 400px;
    margin: 60px auto 0;
}

.container {
    display: flex;
    flex-wrap: wrap;
    width: 306px;
    margin-top: 10px;
    border: 1px solid #ccc;
}
.cell {
    color: #fff;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    margin: 1px;
    -moz-box-shadow: 0px 0px 3px #333333;
    -webkit-box-shadow: 0px 0px 3px #333333;
    box-shadow: 0px 0px 3px #333333;
    background-color: #996666;
}
.cells {
    background-color: #fff;
    -moz-box-shadow: 0px 0px 0px #333333;
    -webkit-box-shadow: 0px 0px 0px #333333;
    box-shadow: 0px 0px 0px #333333;
    z-index: -999;
}
.cell-move {
    transition: transform 0.5s;
}
</style>
```

**note** : 有一点需要注意 : 在页面中使用了 `<transition-group>` 组件。 要使用 这个组件的功能 需要新增 `v-move` 特性, 它会在元素改变定位的过程中应用。 可以通过 `name` 属性来自定义前缀

```js
data() {
  return {
    puzzles: []
  };
},
rander() {
  this.puzzles = [1,2,3,4,5,6,7,8,'']
},
mounted() {
  this.rander();
}
```

### 打乱
现在给这个拼图加个打乱按钮

```html
<button @click="shuffle">重置</button>
```

然后在methods中定义一个‘`shuffle`’函数，负责打乱整个拼图

```js
shuffle() {
  this.puzzles = _.shuffle(this.puzzles);
},
```

其中`_.shuffle`是`lodash`的打乱数组函数

**手写洗牌算法**

```js
function shuffle(arr) {
  let len = arr.length;
  while(len) {
    let index = Math.floor(Math.random() * len--);
    [arr[index] , arr[len]] = [arr[len] , arr[index]];
  }
  return arr;
}
```

### 点击移动
 就是当点击某个块的时候获取点击快上下左右的值
 如果空白块在点击快的左边，并且点击快不是此列的第一个，则点击块往左侧和空白块交换位置，其实是交换值

 ```js
clickBlock(index) {
  let curIndex = this.puzzles[index];
  let leftIndex = this.puzzles[index - 1];
  let rightIndex = this.puzzles[index + 1];
  let topIndex = this.puzzles[index - 3];
  let bottomIndex = this.puzzles[index + 3];

  if (leftIndex === '' && index % 3) {
    this.$set(this.puzzles, index - 1, curIndex);
    this.$set(this.puzzles, index, '');
  } else if (rightIndex === '' && 2 !== index % 3) {
    this.$set(this.puzzles, index + 1, curIndex);
    this.$set(this.puzzles, index, '');
  } else if (topIndex === '') {
    this.$set(this.puzzles, index - 3, curIndex);
    this.$set(this.puzzles, index, '');
  } else if (bottomIndex === '') {
    this.$set(this.puzzles, index + 3, curIndex);
    this.$set(this.puzzles, index, '');
  }
}
```

### 判断有没有过关

条件
1. 最后一块是空
2. 前面8个是从 1- 8 顺序排列

```javascript
pass() {
  if (this.puzzles[8] === '') {
    const newPuzzles = this.puzzles.slice(0, 8);
    const isPass = newPuzzles.every((e, i) => e === i + 1);
    if (isPass) {
      alert('666！');
    }
  }
}
```

## 自动拼图功能

    本部分是这个项目的难点 , 讲的是实现自动拼图功能

### 原理
  这里就涉及到一些算法问题了。
  拼图游戏其实就是 :
  N数码问题 , 而我写的是 3 * 3 的 , 所以就是 8 数码问题的求解
  总结一下 , 我们需要做的事情 包括以下几个 :
  1. 判断8数码问题是否有解 (其实就是判断该拼图是否可以还原)
  2. 求解(寻找复原路径)
  3. 渲染(根据找出的复原路径在页面中渲染出来)


**note** : [需要详细资料的可以看看这篇文章](https://blog.csdn.net/u012283461/article/details/79078653),我们最基本的 BFS

#### 判断8数码问题是否有解

判断8数码问题是否有解可以利用 **原始状态(打乱之后的状态)**和 **结果状态(即拼好的状态)**的 **逆序数奇偶性是否相同**来判断。

**逆序定义:**
**求出除0之外所有数字的逆序数之和，也就是每个数字前面比它大的数字的个数的和，称为这个状态的逆序。**

我们假设结果状态如下
```html
1 2 3
4 5 6
7 8 0
````
将结果状态表示为一维状态, 结果如下

```
1 2 3 4 5 6 7 8 0
```

结果状态的逆序数为 **0**

原始状态如下:

```html
2  1  3  4  5  6  7  8  0
```

原始状态的逆序数为 **1**

表明此原始序列无解。


**那怎么求一个数组的逆序数呢?**

```js
/**
 *@description {求数组逆序数的基本方法}
 */
function Reverse_order_number(nums) {
    let count = 0;
    for(let i = 0 ; i < nums.length ; i ++) {
        for(let j =  i + 1; j < nums.length ; j ++) {
            if(nums[j] < nums[i]) count++;
        }
    }
    if(count & 1) return 1 // 奇数
    else return 0; // 偶数
}
```

**有没有更好的方法呢?**

我们这里将归并排序进行回顾
归并排序方法的主要思路是这样的 : 先拆分 , 后组合 , 在组合的过程中完成排序。拆分过程中 , 最终会拆分到元素级别 , 这时 , 在组合的过程中 , 只需要每次比较切分后的数组的前两个元素 , 可以完成归并排序。

如果我们在合并的时候 , 每次左边的数字大于右边的数字 , 这个时候 , 是不是

```js
/**
 * @description {求数组逆序数的改良方法}
 * @description {采取归并的改良求取版}
 */
```


#### 寻找复原的路径

**解决思路:本文我们采用最容易理解的BFS(广度优先搜索),虽然不是最优的,但是其他的我也不太会**
**也可以用map优化 , 曾经获取到的排列方式, 传入 map 中 , 每次循环检查 map 中是否存在 , 存在的话 跳出这次循环**

##### 结合8数码与广度优先搜索
现在我们已知BFS的相关概念 ,那么如何结合到8数码问题中呢？
1. 首先我们需要将 8 数码中 0 - 8 这 九个数每一种组合当做一种状态 ,那么按照排列组合定义 , 我们可以求出 可能存在的状态数 : 9! 
2. 对 8 数码的每一种状态转换为代码的表达方式 , 在此作者是通过 二维数组的形式
3. 为什么选择二维数组？因为对于0的移动限定是有一定空间边界的，比如0如果在第二行的最右边，那么0只能进行左上下三种移动方式。通过二维数组的两种下标可以很方便的来判断下一个状态的可选方向
4. 将每种状态转化为二维数组后，就可以配合广搜来进行遍历。初始状态可以设定为广搜中图的第一层，由初始状态通过判断0的移动方向可以得到不大于4中状态的子节点，同时需要维护一个对象来记录每个子节点的父节点是谁以此来反推出动画的运动轨迹及一个对象来负责判断当前子节点先前是否已出现过，出现过则无需再压入队。至此反复求出节点的子节点并无重复的压入队
5. 在遍历状态的过程中，可以将二维数组转化为数字或字符串，如123456780。在变为一维数组后便可以直接判断该状态是否等于最终状态，因为从数组变为了字符串或数字的基本类型就可以直接比较是否相等。如果相等那么从该节点一步步反推父节点至起始节点，得到动画路径

## 游戏聊天室

### 思路
- 由于是聊天室, 必须实现双向书记传递
  传统的 http 请求模拟双向数据传递的方式是 http + polling(轮询)
  但这种方式不仅浪费带宽资源 , 而且占用 CPU内存
- 这时,我们采用 webSocket方式, 它的最大特点是服务器可以主动向客户端推送消息,客户端也可以主动向服务器发送消息,是真正的双向的平等对话,属于服务器推送技术

### websocket 如何建立连接
简单来说 , 客户端通过 http 请求与 websocket 服务端协商升级协议。协议升级完成后 , 后续的数据交互则遵循 websocket协议

1. 客户端 : 申请协议升级
首先 , 客户端发起协议升级请求 。可以看到 , 采用的是标准的HTTP报文格式，且只支持GET方法。

**重点请求首部**
- Connection : Upgrade : 表示要升级协议
- Upgrade : websocket : 表示要升级到 websocket协议
- Sec-WebSocket-Key : 与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

2. 服务端：响应协议升级
服务端返回内容如下 : 状态代码 101 表示协议切换。

```html
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

3. Sec-WebSocket-Accept的计算
Sec-WebSocket-Accept 根据客户端请求首部的 Sec-WebSocket-key计算出来的

计算公式:
- 将Sec-WebSocket-Key跟258EAFA5-E914-47DA-95CA-C5AB0DC85B11拼接。
- 通过SHA1计算出摘要，并转成base64字符串。

### 安装 
- 服务端  npm install --save socket.io
- 客户端 npm install --save socket.io-client
### socket.io
  Socket.io不是Websocket，它只是将Websocket和轮询 （Polling）机制以及其它的实时通信方式封装成了通用的接口，并且在服务端实现了这些实时机制的相应代码。也就是说，Websocket仅仅是 Socket.io实现实时通信的一个子集。因此Websocket客户端连接不上Socket.io服务端，当然Socket.io客户端也连接不上Websocket服务端。
