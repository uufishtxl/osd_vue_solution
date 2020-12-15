<template>
    <div v-show="showHide">
        <div class="sel list-item">
            <div :key="index" v-for="(item, index) in options" >
                <div class="grid2" :class="{'item-active': index === focus}">
                    <div :class="tickCls(item)"><i class="fas fa-check"></i></div>
                    <div class="column2">{{ item.label }}</div>
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
    props: ["options", "label", "id", "slevel"],
    data() {
        return {
            show: true,
            activeLevel: this.active_level,
            focus: this.cur
        }
    },
    computed: {
        getName: function() {
            return this.label;
        },
        showHide: function() {
            return this.show && this.activeLevel == 4
        },
        active_level() {
            return this.$store.state.active_level;
        },
        val: function() {
            return this.$store.state.cur_vals[this.formatTxt(this.label)];
        },
        cur: {
            get: function() {
                var cur_val = this.$store.state.cur_vals[this.formatTxt(this.label)];
                var cur;
                for (var i = 0; i < this.options.length; i++) {
                    if (cur_val == this.options[i].label) {
                        cur = i;
                    }
                }
                return cur;
            },
            set: function(val) {
                this.focus = val;
            }
        }
    }
    ,
    methods: {
        formatTxt: function(txt) {
            var str = txt.replace(/\W/g, '_');
            str = str.toLowerCase();
            if (str.substr(str.length - 1, 1) == '_') {
                str = str.slice(0, str.length - 1);
            }
            return str;
        },
        tickCls: function(item) {
            return [
                'tick',
                {
                    'show-it': item.label === this.val
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
        },
        active_level: function(val) {
            this.activeLevel = val;
        }
    },
    mounted() {
        this.updateQuadStatus();
        this.focus = this.cur;
        this.activeLevel = this.active_level;
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