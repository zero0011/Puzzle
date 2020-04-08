<template>
  <div class="box">
    <button @click="shuffle">重置</button>
    <button @click="autoplay">自动操作</button>
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

<script>
export default {
  data() {
    return {
      puzzles: []
    };
  },
  methods: {
    // 渲染
    render() {
      this.puzzles = [1, 2, 3, 4, 5, 6, 7, 8, ""];
      this.shuffle();
    },
    // 打乱, 洗牌算法
    shuffle() {
      this.puzzles = _.shuffle(this.puzzles);
    },
    // 点击方块
    clickBlock(index) {
      let curIndex = this.puzzles[index];
      let leftIndex = this.puzzles[index - 1];
      let rightIndex = this.puzzles[index + 1];
      let topIndex = this.puzzles[index - 3];
      let bottomIndex = this.puzzles[index + 3];

      if (leftIndex == 0 && index % 3) {
        this.$set(this.puzzles, index - 1, curIndex);
        this.$set(this.puzzles, index, "");
      } else if (rightIndex == 0) {
        this.$set(this.puzzles, index + 1, curIndex);
        this.$set(this.puzzles, index, "");
      } else if (topIndex == 0) {
        this.$set(this.puzzles, index - 3, curIndex);
        this.$set(this.puzzles, index, "");
      } else if (bottomIndex == 0) {
        this.$set(this.puzzles, index + 3, curIndex);
        this.$set(this.puzzles, index, "");
      }

      this.pass();
    },
    // 是否通过
    pass() {
      if (this.puzzles[8] === "") {
        const newPuzzles = this.puzzles.slice(0, 8);
        const isPass = newPuzzles.every((value, index) => value === index + 1);
        if (isPass) {
          alert("success");
        }
      }
    },
    // 自动操作
    autoplay() {
      let Setting = {
        // originalNode: [[1, 3, 2],[5, 8, 0],[7, 6, 4]],
        originalNode: _.chunk(this.puzzles, 3),
        resultNode: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 0]
        ],
        dalayTime: "500"
      };

      if (
        this.autoPuzzles(Setting).canReach(
          Setting.originalNode,
          Setting.resultNode
        )
      ) {
        // 搜索路径
        this.autoPuzzles(Setting).searchPath();
      } else {
        alert("这太乱了(自动重新打乱)");
        this.shuffle();
        setTimeout(() => {
          this.autoplay();
        }, 1000);
      }
    },
    // 自己实现操作
    autoPuzzles(Setting) {
      let that = this;
      let queueArr = []; // 队列
      let hashObj = {}; // hash
      let NodeObj = {}; // 记录节点
      let originalNode = Setting.originalNode; // 原始节点
      let originalNodeStr = originalNode
        .toString()
        .split(",")
        .join("");
      // 132580764
      let resultNode = Setting.resultNode; // 结果数组
      let resultNodeStr = resultNode
        .toString()
        .split(",")
        .join("");
      let isFind = false;
      let delay = Setting.dalayTime || 1000; //动画延迟

      return {
        // 是否可达
        canReach(originalNode, resultNode) {
          originalNode = originalNode.toString().split(",");
          resultNode = resultNode.toString().split(",");
          this.readerDom(originalNode);
          if(this.odevity(originalNode) === this.odevity(resultNode)) {
            return true;
          } else {
            return false;
          }
        },
        // 求逆序数奇偶性
        odevity(node) {
          let count = 0;
          node.splice(node.indexOf(""),1);
          for(let i = 0 ; i < node.length ; i ++) {
            for(let j = i + 1; j < node.length ; j ++) {
              if(node[j] < node[i]) count++;
            }
          }
          if(count & 1) return 1 // 奇数
          else return 0; // 偶数
        },
        // 渲染 dom
        readerDom(node) {
          let nodeArr = node.toString().split(",");
          that.puzzles = nodeArr;
          that.pass();
        },
        // 寻找路径
        searchPath() {
          let _this = this;
          queueArr.push(originalNode);
          hashObj[originalNodeStr] = originalNode;
          while(!isFind) {
            if(!queueArr.length) {
              alert('没有搜索到结果');
              return;
            }
            let currentNode = queueArr.shift(),
            currentNodeStr = currentNode.toString().split(",").join("");
            if(resultNodeStr === currentNodeStr) {
              let path = [];
              let pathLength = 0;
              let resultPath = [];
              for( let v = resultNodeStr; v != originalNodeStr; v = NodeObj[v]) {
                path.push(hashObj[v]);
              }
              path.push()
            }
          }
        }
      };
    }
  },
  mounted() {
    this.render();
  }
};
</script>

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
  color: #ffffff;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  margin: 1px;
  box-shadow: 0px 0px 3px #333;
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