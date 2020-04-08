<template>
  <img :src="imgUrl" alt="" class="img">
</template>

<script>
export default {
  data() {
    return {
      imgUrl: require("../assets/target.png")
    };
  }
};
</script>

<style>
.img {
    position: absolute;
    left: 50px;
    top: 146px;
    width: 370px;
    height: 350px;
}
.img_bgc {
    background-image: url("../assets/target.png");
    width: auto;
    height: auto;
}
</style>