<template>
    <div class="sub" v-show="show">
        <div class="sub-left list-item" :class="getPaneStyle(2)">
            <!-- Brightness/Contrast时是Brightness的Adjustable Component，否则则是列表 -->
            <div :key="index" v-for="(item,index) in subNavs">
                {{ item.label }}
            </div>
        </div>
        <div class="sub-right" :class="getPaneStyle(3)">
            <!-- Brightness/Contrast时是Contrast的PB Component, 三级菜单的时候是三级的Sel或者Pb，四级菜单的时候是 -->
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    name: "NavContentG",
    props: ["icon", "label", "id", "activeLevel", "simpSels", "activeNav"],
    data() {
        return {
            show: true,
            subNavs: []
        }
    },
    methods: {
        getPaneStyle: function(id) {
            return {
                'hili-pane': this.activeLevel == id
            }
        },
        updateNav() {
            this.$parent.updateNav();
        }
    },
    watch: {
        label() {
            this.updateNav();
        }
    },
    mounted() {
        this.updateNav();
        this.subNavs = [];
        this.subNavs = this.subNavs.concat(this.simpSels);
    }
}
</script>

<style scoped>

.sub {
    display: grid;
    grid-template-columns: 50% 50%;
}

.sub-left {
    padding-left: 40px;
} 

</style>

