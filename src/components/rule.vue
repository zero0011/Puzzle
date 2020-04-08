<template>
  <div class="rule">
      <span class="rule_text">规则</span>
      <ul class="rule_ul">
          <li v-for="rule in rules" :key="rule" class="rule_li">{{rule.name}}</li>
      </ul>
  </div>
</template>

<script>
export default {
    data() {
        return {
            rules : [
                {
                    name : '1.右边是目标图形,你是否能把做左边的图片移到与左边一样呢'
                },
                {
                    name : '2.点击右边的一块方块,它将移动到附近的空格上'
                },
                {
                    name : '3.如果实在没有做出来,可能是重置出来的方块本身不合适,可以点击自动操作,便可自动执行游戏啦'
                }
            ]
        }
    },
}
</script>

<style>
.rule {
    position: absolute;
    left: 26rem;
    top:  9rem;
}
.rule_ul{
    list-style: none;
}
.rule_text {
    font-size: 25px;
    font-weight: 600;
    color: #ff0505;
}
.rule_li {
    font-size: 18px;
    font-weight: 550;
    text-align: start;
    width: 500px;
    margin-top: 5px;
    color:#030303ad;
}
</style>