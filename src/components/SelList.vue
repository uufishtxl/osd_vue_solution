<template>
    <div v-show="showHide">
        <div class="sel list-item" v-show="activeLevel == 3">
            <div :key="item.id" v-for="(item) in options">
                <div>
                    <input v-model="pickup" :name="getName" type="radio" :id="label + item.id" :value="item.label"> {{ item.label }}
                </div>
                
            </div>   
        </div>
        <div class="test" v-show="activeLevel == 4">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "SelList",
    props: ["options", "label", "id", "value", "activeLevel", "slevel", 'sup'],
    data() {
        return {
            pickup: this.value,
            show: true
        }
    },
    computed: {
        getName: function() {
            return this.label;
        },
        showHide: function() {
            return this.show && this.activeLevel >= 3
        }
    },
    methods: {
        updateSubNav() {
            this.$parent.updateSubNav();
        },
        updateQuadStatus() {
            var _this = this;
            var quads = this.$children.filter(function(item) {
                return item.$options.name === 'SelListQuad'
            })
            quads.forEach(function(item) {
              return item.show =  _this.value === item.label; 
            })
        }
    },
    watch: {
        label: function() {
            this.$parent.updateSubNav();
        }
    },
    mounted() {
        this.updateSubNav();
    }
}
</script>

<style scoped>

.sel {
    padding-left: 20px;
}

input[type=radio] {
    margin-right: 20px;
}

</style>