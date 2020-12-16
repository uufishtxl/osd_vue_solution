<template>
    <div v-show="showHide">
        <div class="sel list-item" v-show="activeLevel == 3">
            <div :key="index" v-for="(item, index) in options">
                <div class="grid2" :class="{'item-active': index === focus}">
                    <div :class="tickCls(item)"><i class="fas fa-check"></i></div>
                    <div class="column2">{{ item.label }}</div>
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
    props: ["options", "label", "id", "slevel", 'sup', "hasChild"],
    data() {
        return {
            show: true,
            focus: this.cur,
            extend: this.hasChild,
            activeLevel: this.active_level
        }
    },
    computed: {
        getName: function() {
            return this.label;
        },
        showHide: function() {
            return this.show && this.activeLevel >= 3
        },
        val: function() {
            return this.$store.state.cur_vals[this.formatTxt(this.label)];
        },
        active_level() {
            return this.$store.state.active_level
        },
        // 当前focus的位置(从0开始计算)
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
        tickCls(item) {
            return [
                'tick',
                {
                    'show-it': item.label === this.val
                }
            ]
        },
        updateSubNav() {
            this.$parent.updateSubNav();
        },
        updateQuadStatus() {
            console.log(`value is ${this.val}`)
            var _this = this;
            var quads = this.$children.filter(function(item) {
                return item.$options.name === 'SelListQuad'
            })
            quads.forEach(function(item) {
              return item.show =  _this.val === item.label; 
            })
        }
    },
    watch: {
        label: function() {
            this.$parent.updateSubNav();
        },
        active_level: function(val) {
            this.activeLevel = val;
        },
        focus: function(val) {
            console.log(`watching focus, ${this.show}, ${this.$parent.show}, ${this.$store.state.active_level}`)
            if (this.show && this.$parent.show && this.$store.state.active_level == 3) {
                this.$store.commit('updatePos', {level: 3, pos: val});
                console.log('commited position change');
                this.$store.commit('updateFocus', {parent: this.label, focus: this.options[val].label});
            }
        }
    },
    mounted() {
        this.updateSubNav();
        this.focus = this.cur;
    },
    created() {
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