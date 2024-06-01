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
import { BowChallengeScene } from '@/scenes/competitions/BowChallengeScene';

import { MainMenuScene } from '@/scenes/menu/MainMenuScene';
import { SettingMenuScene } from '@/scenes/menu/SettingMenuScene';
import { HelpMenuScene } from '@/scenes/menu/HelpMenuScene';
import { CreditMenuScene } from '@/scenes/menu/CreditMenuScene';
import { EndingMenuScene } from '@/scenes/menu/EndingMenuScene';

export default defineComponent({
  name: 'MainGame',
  mounted(){
    const canvas = document.querySelector("canvas")!;
    canvas.focus();
    const sceneManager = new SceneManager(canvas);
    sceneManager.InitPhysic().then(() => {
      sceneManager.RegisterScene("intro", new IntroScene());
      sceneManager.RegisterScene("main", new BasicScene());
      sceneManager.RegisterScene("challenge_bow", new BowChallengeScene());

      sceneManager.RegisterScene("menu_main", new MainMenuScene());
      sceneManager.RegisterScene("menu_setting", new SettingMenuScene());
      sceneManager.RegisterScene("menu_help", new HelpMenuScene());
      sceneManager.RegisterScene("menu_credit", new CreditMenuScene());

      sceneManager.RegisterScene("end", new EndingMenuScene());
    
      sceneManager.Jump("menu_main");
    });
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
