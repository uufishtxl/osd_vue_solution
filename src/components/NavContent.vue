<template>
    <div class="sub" v-show="show">
        <div class="sub-left" :class="getPaneStyle(2)">
            <!-- Brightness/Contrast时是Brightness的Adjustable Component，否则则是列表 -->
            <div v-if="activeNav == 1">
              <slot name="subleft" ></slot>  
            </div>
            <div v-else class="list-item sub-list">
                <div :key="index" v-for="(item,index) in subNavs">
                    <div :class="subCls(item)">{{ item.label }}</div>
                </div>
            </div> 
        </div>

        <!-- 右侧面板 -->
        <div class="sub-right" :class="getPaneStyle(3)">
            <!-- 活动列表为二级时，显示Middle Pane的值 -->
            <div v-show="activeLevel <= 2 && activeNav != 1" class="list-item">
                <div :key="index" v-for="(item,index) in findVals" class="fix-block item-gray">
                    {{ item.val }}
                </div>
            </div>

            <!--  活动列表为三级时，显示的slot -->
            <div v-show ="activeNav == 1 || (activeLevel >= 3 && activeNav !=1)">
                <slot></slot>
            </div>
            <!-- <div v-show="activeLevel == 4" class="test">
                <slot name="quarter"></slot>
            </div>   -->
            
        </div>
    </div>
</template>

<script>

export default {
    name: "NavContent",
    props: ["icon", "label", "id", "activeLevel", "simpSels", "haspre", "nclicked"],
    data() {
        return {
            show: true,
            subNavs: [],
            currentValue: this.$store.getters.curSub,   //$store.getters.fullInfo 
            prearys: this.simpSels
        }
    },
    computed: {
        findVals() {
            return this.$parent.findVals(this.subNavs);            
        },
        activeNav() {
            return this.$store.state.nav_active;
        }
    },
    methods: {
        subCls: function(item) {
            return [
                {
                    'item-gray': (Number(item.id) != Number(this.currentValue) && this.activeLevel > 2) || this.activeLevel == 1
                },
                {
                    'item-active': Number(item.id) === Number(this.currentValue) && this.activeLevel >= 2
                }
            ]
        },
        getPaneStyle: function(id) {
            return {
                'hili-pane': this.activeLevel == id
            }
        },
        updateNav() {
            this.$parent.updateNav();
        },
        getSubNavs() {
            return this.$children.filter(function(item) {
                return item.$options.name === 'SelList' || 'ScaleBar';
            })
        },
        updateSubNav() {
            this.subNavs = [];
            var _this = this;
            if (this.haspre) {
                this.subNavs = this.subNavs.concat(this.simpSels);    
            }
            this.getSubNavs().forEach(function(sub,index) {
                _this.subNavs.push({
                    label: sub.label,
                    id: sub.id || index
                });
                if (!sub.id) sub.id = index;
                // if (index === 0) {
                //     if (!_this.currentValue) {
                //         _this.currentValue = sub.id || index;
                //     }
                // }
            });

            this.subNavs.push({
                label: `Reset ${this.label}`,
                id: this.subNavs.length + 1
            })
            this.updateSubStatus();
        },
        updateSubStatus() {
            var _this = this;
            console.log(`update sub status, ${this.currentValue}`);
            this.getSubNavs().forEach(function(sub) {
                return sub.show = Number(sub.id) === _this.$store.getters.curSub;
            })
        },
        up() {
            if (this.show && this.activeLevel == 2) {
                var cur = this.currentValue;
                var len = this.subNavs.length;
                cur = (cur - 1 + len) % len;
                cur = cur == 0 ? len : cur;
                this.currentValue = cur;
                this.$store.commit('updateSubNav', this.currentValue); // OK 后做
                this.updateSubStatus();
            }
        },
        down() {
            if (this.show && this.activeLevel == 2) {
                var cur = this.currentValue;
                var len = this.subNavs.length;
                cur = (cur + 1) % len;
                cur = cur == 0 ? len : cur;
                this.currentValue = cur;
                this.$store.commit('updateSubNav', this.currentValue);
                this.updateSubStatus();
            }
        },
        right() {
            // 2级菜单按Right后，选中当前项 (Connector / Rotation)，或者进入三级菜单(改Level) 
            console.log(`clicking right on option - ${this.$store.getters.cur_sub}`);
        },
        ok() {
            console.log('ok clicked');
            // this.$store.commit('updateSubNav', this.currentValue);
        }
    },
    watch: {
        label() {
            this.updateNav();
        },
        nclicked: function() {
            if (this.$store.state.up) {
               this.up(); 
            } else if (this.$store.state.down) {
               this.down(); 
            } else if (this.$store.state.right) {
               this.right(); 
            } else if (this.$store.state.ok) {
                console.log('Triggering OK()');
               this.ok(); 
            }
        }
    },
    mounted() {
        this.updateNav();
        // this.subNavs = this.subNavs.concat(this.simpSels);        
    }
}
</script>

<style scoped>

.sub {
    display: grid;
    grid-template-columns: 50% 50%;
}

.sub-list {
    padding-left: 30px;
}

.sub-right {
    text-align: left;
}

.fix-block {
    height: 28px;
}

</style>

