<template>
    <div v-show="showHide">
        <div class="sel list-item">
            <div :key="item.id" v-for="(item) in options" >
                <div class="grid">
                    <div :class="tickCls(item)"><i class="fas fa-check"></i></div>
                    <div class="column-2"><input v-model="pickup" :name="getName" type="radio" :id="label + item.id" :value="item.label"></div>
                    <div class="column-3">{{ item.label }}</div>
                </div>
                
            </div>   
        </div>
        <div class="test">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "SelListQuad",
    props: ["options", "label", "id", "value", "activeLevel", "slevel"],
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
            return this.show && this.activeLevel == 4
        }
    }
    ,
    methods: {
        tickCls: function(item) {
            return [
                'tick',
                {
                    'show-it': item.label == this.value
                }
            ]
        },
        updateQuadStatus() {
            this.$parent.updateQuadStatus();
        }
    },
    watch: {
        label: function() {
            this.$parent.updateQuadStatus();
        }
    },
    mounted() {
        this.updateQuadStatus();
    }
}
</script>

<style scoped>

.sel {
    padding-left: 20px;    
}

.grid {
    display: grid;
    grid-template-columns: 15px 30px auto;
}

.column-2 {
    grid-column: 2 / 3;
}

.column-3 {
    grid-column: 3 / 4;
}

input[type=radio] {
    margin-right: 20px;
}

</style>