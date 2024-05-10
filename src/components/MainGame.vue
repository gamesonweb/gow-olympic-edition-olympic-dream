<template>
<div>
  <canvas></canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BasicScene } from '@/scenes/BasicScene';
import { SceneManager } from '@/scenes/SceneManager';
import { IntroScene } from '@/scenes/IntroScene';

export default defineComponent({
  name: 'MainGame',
  mounted(){
    const canvas = document.querySelector("canvas")!;
    canvas.focus();
    const sceneManager = new SceneManager(canvas);
    sceneManager.RegisterScene("intro", new IntroScene());
    sceneManager.RegisterScene("main", new BasicScene());
    
    sceneManager.Jump("intro");
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas{
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
}
</style>
