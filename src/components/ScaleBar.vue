<template>
    <div class="scale" v-show="show">
        <div class="bar-title" :style="getColor">
            <h3 v-html="icon"></h3>
        </div>
        <div class="bar">
            <div class="progress" :style="getScaleStyle"></div>
        </div>
        <div class="bar-val" :style="getColor">
            <h3>{{ cur_val }} {{ unit }}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ScaleBar',
    props: ["qid","label", "min", "max", "unit", "icon", "slevel", "sclicked", "hasChild"],
    data() {
        return {
            show: true,
            id: this.qid,
            extend: this.hasChild,
            activeLevel: this.active_level
        }
    },
    computed: {
        getColor: function() {
            return {
                color: this.activeLevel == this.slevel ? '#3399ff' : 'gray'
            }
        },
        getScaleStyle: function() {
            console.log(`cur is ${this.cur_val}, max is ${this.max}, min is ${this.min}`);
            return {
                background: this.activeLevel == this.slevel ?  '#3399ff' : '#ccc',
                height: 100 * Number(this.cur_val) / (Number(this.max) - Number(this.min)) + '%'
            }
        },
        cur_val:function() {
            var vals = this.$store.state.cur_vals;
            return vals[this.formatTxt(this.label)];
        },
        active_level() {
            return this.$store.state.active_level;
        }
    },
    methods: {
        formatTxt: function(txt) {
            var str = txt.replace(/\W/g, '_');
            str = str.toLowerCase();
            if (str.substr(str.length - 1, 1) == '_') {
                str = str.slice(0, str.length - 1);
            }
            return str;
        },
        updateSubNav() {
            if (this.$store.state.nav_active != 1) {
                this.$parent.updateSubNav();
            }
        }
    },
    watch: {
        label() {
           this.updateSubNav(); 
        },
        active_level(val) {
            this.activeLevel = val;
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