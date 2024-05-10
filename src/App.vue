<template>
  <HelloWorld/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/MainGame.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html, body {
  width:  100%;
  height: 100%;
  margin: 0;
}
</style>
