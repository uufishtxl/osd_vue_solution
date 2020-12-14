<template>
  <div class="connectors">
      <div :key="index" v-for="(item,index) in connectors">
        <div class="connector-item">{{ item }}</div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Connectors",
  props: ["connectors"]
}
</script>

<style scoped>

.connectors {
  display: flex;
  flex-flow: column nowrap;
  padding-top: 10px;
}
.connector-item {
  padding: 20px;
  font-size: 1.5rem;
  border: none;
  background: none;
  margin: 7px 0 8px 0;
}

.connector-item:hover {
    background: skyblue;
}

.connectors > div:last-child {
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    padding: 0;
}

</style>