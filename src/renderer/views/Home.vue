<template>
  <div>
    <section class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="block has-text-centered">
          <h1 class="title is-3" style="color: coral">
            使用说明
          </h1>
        </div>
        <div class="content">
          <p class="subtitle is-5" style="color:deepskyblue">
            1.点击菜单栏【视频平台】，选择一个平台网站并等待进入页面。
          </p>
          <img class="image is-128x158" style="margin:0 auto" alt="Placeholder image" src="../../../_icons/platform.png" />

          <p class="subtitle is-5" style="margin-top: 20px;color:deepskyblue">
            2.进入某个视频平台网站，例如"腾讯视频"，搜索选择想看的视频节目。
          </p>
          <img class="image is-1333x870" style="margin:0 auto" alt="Placeholder image" src="../../../_icons/videoP.png" />

          <p class="subtitle is-5" style="margin-top: 20px; color:deepskyblue">
            3.当视频节目有广告或需要VIP时，可点击菜单栏【破解源】并选择一个。
          </p>
          <img class="image is-1333x870" style="margin:0 auto" alt="Placeholder image" src="../../../_icons/video.png" />
          <img class="image is-1333x870" style="margin:0 auto" alt="Placeholder image" src="../../../_icons/crackS.png" />

          <p class="subtitle is-5" style="margin-top: 20px; color:deepskyblue">
            4.破解完成后，就可以爽快的观看视频了。
          </p>
          <img class="image is-1333x870" style="margin:0 auto" alt="Placeholder image" src="../../../_icons/crackVideo.png" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

enum TEST {}

export default Vue.extend({
  name: 'Home',
})
</script>

<style>
.hero-body {
  height: 630vh;
}
</style>
