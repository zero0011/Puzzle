<template>
  <div id="app">
    <Img/>
    <rule/>
    <HelloWorld/>
    <Talk/>
  </div>
</template>

<script>
import rule from './components/rule.vue'
import HelloWorld from './components/auto.vue'
import Img from './components/img.vue'
import Talk from './components/talk.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    rule,
    Img,
    Talk
  }
}
</script>

<style>

</style>
