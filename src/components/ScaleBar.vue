<template>
    <div class="scale" v-show="show">
        <div class="bar-title" :style="getColor">
            <h3 v-html="icon"></h3>
        </div>
        <div class="bar">
            <div class="progress" :style="getScaleStyle"></div>
        </div>
        <div class="bar-val" :style="getColor">
            <h3>{{ value }} {{ unit }}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ScaleBar',
    props: ["qid","label", "min", "max", "value", "unit", "icon", "activeLevel", "slevel", "sclicked"],
    data() {
        return {
            currentValue: this.value,
            show: true,
            id: this.qid
        }
    },
    computed: {
        getColor: function() {
            return {
                color: this.activeLevel == this.slevel ? '#3399ff' : 'gray'
            }
        },
        getScaleStyle: function() {
            return {
                background: this.activeLevel == this.slevel ?  '#3399ff' : '#ccc',
                height: 100 * Number(this.currentValue) / (Number(this.max) - Number(this.min)) + '%'
            }
        }
    },
    methods: {
        updateSubNav() {
            if (this.$store.state.nav_active != 1) {
                this.$parent.updateSubNav();
            }
        },
        up() {
            if (this.show && Number(this.activeLevel) == Number(this.slevel)) {
                
                if (this.currentValue < this.max) {
                    this.currentValue += 1;
                }
            }
        },
        down() {
            console.log(`show? ${this.show}, activeLevel, ${this.activeLevel}, slevel is, ${this.slevel}`);
            console.log(`${this.currentValue}, min is, ${this.min}`)
            if (this.show && Number(this.activeLevel) == Number(this.slevel)) {
                if (this.currentValue > this.min) {
                    this.currentValue -= 1;
                }
            }
        }
    },
    watch: {
        label() {
           this.updateSubNav(); 
        },
        value: function(val) {
            this.currentValue = val;
        },
        currentValue: function(val) {
            this.$emit('input', val);
        },
        sclicked: function() {
            console.log(`down is ${this.$store.state.down}`);
            if (this.$store.state.up) {
               this.up(); 
            } else if (this.$store.state.down) {
                console.log('getdown')
               this.down(); 
            }
        }
    },
    mounted() {
        this.updateSubNav();
    }
}
</script>

<style scoped>
    .scale {
        margin: 0;
        padding: 0;
        line-height: 1;
        text-align: center;
    }

    .bar {
        height: 160px;
        border: 0.2px solid #666;
        width: 8px;
        position: relative;
        margin: 0 auto;
        background: gray;
    }

    .progress {
        width: 7px;
        margin-left: 0.5px;
        position: absolute;
        bottom: 0.5px;
    }
</style>