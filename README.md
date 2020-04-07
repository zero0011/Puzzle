# 拼图游戏

## 实现功能有
1. 普通的拼图功能
2. 自动拼图功能(难点)

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