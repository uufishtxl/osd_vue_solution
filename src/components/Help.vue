<template>
  <div class="help">
      <div>
        <div class="checkbox-group">
          <input checked="hSwtch" type="checkbox" id="radio_1" @click="hSwtch = !hSwtch">
          <label for="radio_1">Help</label>       
        </div>
      </div>
    
    <div class="help_info">
      {{ help }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Help",
  props: ["helpS", "help"],
  data() {
    return {
      hSwtch: this.helpS,
      helpdesk: this.help
    }
  },
  watch: {
    hSwtch: function(val) {
      this.$emit('switch-change', val);
    }
  }
}
</script>

<style scoped>

</style>