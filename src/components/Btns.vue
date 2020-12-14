<template>
  <div>
    <div class="btnpanel" :class="panelCls()">
      <div :class="isPointer()" class="btnup" @click="handleUp"><i class="fas fa-angle-up"></i></div>
      <div :class="isPointer()" class="btnleft"  @click="handleLeft"><i class="fas fa-angle-left"></i></div>
      <div :class="isPointer()" class="btnok" @click="handleOK"><i class="fas fa-check"></i></div>
      <div :class="isPointer()" class="btnright" @click="handleRight"><i class="fas fa-angle-right"></i></div>
      <div :class="isPointer()" class="btndown" @click="handleDown"><i class="fas fa-angle-down"></i></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Btns",
  props: ["active"],
  methods: {
    panelCls() {
      return [
        'btnpanel',
        {
          'btn-action': this.active
        },
        {
          'btnpanel-guide': !this.active
        }
      ]
    },
    isPointer() {
      return {
        'button-active': this.active
      }
    },
    handleOK() {
      if (this.active) this.$parent.handleOK();
    },
    handleLeft() {
      if (this.active) this.$parent.handleLeft();
    },
    handleRight() {
      if (this.active) this.$parent.handleRight();
    },
    handleUp() {
      if (this.active) this.$parent.handleUp();
    },
    handleDown(){
      if (this.active) this.$parent.handleDown();
    }
  }
}
</script>

<style scoped>

</style>