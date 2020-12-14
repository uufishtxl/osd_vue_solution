<template>
  <div class="menu">
    <MenuHeader />
    <MenuNavs :mclicked="clicked" :activeLevel="activeLevel" :clrActive="clrActive" />
    <MenuExit />
  </div>
</template>

<script>

import MenuHeader from "./layout/MenuHeader"
import MenuNavs from "./MenuNavs"
import MenuExit from "./layout/MenuExit"

export default {
  name: "Menu",
  components: {
    MenuHeader,
    MenuExit,
    MenuNavs
  },
  props: ["activeLevel", "clrActive", "clicked"],
  data() {
    return {
    }
  }
}
</script>

<style scoped>
</style>