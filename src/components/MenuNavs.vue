<template>
    <div class="navs">
        <div class="navs-nav" :class="styleBorder()">
            <div :key="index" v-for="(nav, index) in navs">
                <div :class="navCls(nav)">
                    <span class="icon" v-html="nav.icon"></span>
                    {{ nav.label }}
                </div>
            </div>
        </div>
        <div class="navs-content">
            <NavContent :nclicked="mclicked" icon="<i class='fas fa-sun'></i>" label="Brightness/Contrast" id="1" >
                <ScaleBar slot="subleft" label="Brightness" min="0" max="100" unit="%" icon="<i class='fas fa-sun'></i>"  slevel="2" />
                <ScaleBar label="Contrast" min="0" max="100" unit="%" icon="<i class='fas fa-adjust'></i>"  slevel="3" />
            </NavContent>
            <NavContent :nclicked="mclicked" :haspre="true" icon="<i class='fas fa-paperclip'></i>" label="Input Source" id="2"  :simpSels="inputSSels">
                <SelList :hasChild="false" :options="auto_select_o" label="Auto Select" id="3" />
                <SelList :hasChild="true" :options="rename_inputs_o" label="Rename Inputs" id="4" slevel="3">
                    <!-- Rename Inputs 的值是label -->
                    <SelListQuad :options="dp_o" label="DP" id="1" slevel="4"/>
                    <SelListQuad :options="hdmi_o" label="HDMI" id="2" slevel="4"/>
                </SelList>
            </NavContent>
            <NavContent :nclicked="mclicked" :haspre="false" icon="<i class='fas fa-palette'></i>" label="Color" id="3"  >
                <SelList :hasChild="false" :options="preset_modes_o" label="Preset Modes" id="1" />
                <SelList :hasChild="false" :options="input_color_format_o" label="Input Color Format" id="2" />
                <ScaleBar :hasChild="false"  label="Hue" min="0" max="100" unit="%"  qid="3" slevel="3" />
                <ScaleBar :hasChild="false"  label="Saturation" min="0" max="100" unit="%" qid="4" slevel="3" />
            </NavContent>
            <NavContent icon="<i class='fas fa-tv'></i>" label="Display" id="4" />
            <NavContent icon="<i class='fas fa-columns'></i>" label="PIP/PBP" id="5" />
            <NavContent icon="<i class='fas fa-bars'></i>" label="Menu" id="6" />
            <NavContent icon="<i class='fas fa-star'></i>" label="Personalize" id="7" />
            <NavContent icon="<i class='fas fa-info-circle'></i>" label="Others" id="8" />
        </div>
    </div>
</template>

<script>
import NavContent from './NavContent';
import ScaleBar from './ScaleBar';
import SelList from './SelList';
import SelListQuad from './SelListQuad'

export default {
    name: "MenuNavs",
    components: {
        NavContent,
        ScaleBar,
        SelList,
        SelListQuad
    },
    props: ['clrActive', "mclicked"],
    data() {
        return {
            activeLevel: this.active_level,
            navs: [],
            brightV: 75,
            contrastV: 75,
            inputSSels: [
                            {
                                label: 'DP',
                                id: 1,
                                hasChild: false
                            },
                            {
                                label: 'HDMI',
                                id: 2,
                                hasChild: false
                            }
                        ],
            auto_select_o: [
                {
                    label: "On",
                    isDef: true
                },
                {
                    label: "Off",
                    isDef: false
                }
            ],
            auto_select_def: "On",
            rename_inputs_o: [
                {
                    label: "DP",
                    isDef: true,
                    hasChild: true
                },
                {
                    label: "HDMI",
                    isDef: false,
                    hasChild: true
                }
            ],
            rename_inputs_def: 'DP',
            preset_modes_o: [
                {
                    label: 'Standard',
                    isDef: true
                },
                {
                    label: 'Movie',
                    isDef: false
                },
                {
                    label: 'Game',
                    isDef: false
                },
                {
                    label: 'Color Temp.',
                    isDef: false
                },
                {
                    label: 'Color Space',
                    isDef: false
                },
                {
                    label: 'Custom Color',
                    isDef: false
                }
            ],
            preset_modes_def: 'Standard',
            input_color_format_o: [
                {
                    label: 'RGB',
                    isDef: true
                },
                {
                    label: 'YCbCr',
                    isDef: false
                }
            ],
            input_color_format_def: 'RGB',
            hue_def: 50,
            saturation_def: 50,
            dp_o: [{label: 'Off', isDef: true},{label: 'PC', isDef: false},{label: 'PC 1', isDef: false},{label: 'PC 2', isDef: false},{label: 'Laptop', isDef: false},{label: 'Laptop 1', isDef: false},{label: 'Laptop 2', isDef: false}],
            dp_def: 'Off',
            hdmi_o: [{label: 'Off', isDef: true},{label: 'PC', isDef: false},{label: 'PC 1', isDef: false},{label: 'PC 2', isDef: false},{label: 'Laptop', isDef: false},{label: 'Laptop 1', isDef: false},{label: 'Laptop 2', isDef: false}],
            hdmi_def: 'Off',
        }
    },
    computed: {
        currentValue() {
            return this.$store.state.nav_active;
        },
        active_level() {
            return this.$store.state.active_level;
        }
    },
    methods: {
        styleBorder: function() {
            return {
                'hili-pane': this.activeLevel == 1
            }
        },
        navCls: function(item) {
            return {
                'item-active': Number(item.id) === Number(this.currentValue)
            }
        },
        getNavs() {
            return this.$children.filter(function(item) {
                return item.$options.name === "NavContent";
            })
        },
        updateNav() {
            this.navs = [];
            var _this = this;
            this.getNavs().forEach(function(item, index) {
                _this.navs.push({
                    icon: item.icon,
                    label: item.label,
                    id: item.id
                });
                if (!item.id) item.id = index;
                // if (index === 0) {
                //     if (!_this.currentValue) {
                //         _this.currentValue = item.id || index;
                //     }
                // }
            })
            this.updateStatus();
        },
        updateStatus() {
            var _this = this;
            this.getNavs().forEach(function(item) {
                return item.show = Number(item.id) === Number(_this.currentValue);
            })
        },
        formatTxt(txt) {
            var str = txt.replace(/\W/g, '_');
            str = str.toLowerCase();
            if (str.substr(str.length - 1, 1) == '_') {
                str = str.slice(0, str.length - 1);
            }
            return str;
        },
        findVals(arr) {
            // 获取格式化后的txt
            var _this = this;
            var arr_f = [];
            arr.forEach(function(item){
                arr_f.push({
                    opname: _this.formatTxt(item.label),
                    id: item.id,
                    val: ["DP", "HDMI"].indexOf(item.label) != -1 ? '' : _this.$store.state.cur_vals[_this.formatTxt(item.label)]
                })
            })
            console.log(arr_f);
            return arr_f;
            
        }
    },
    watch: {
        currentValue: function() {
            this.updateStatus();
        },
        active_level: function(val) {
            this.activeLevel = val;
        }
    }
}
</script>

<style scoped>

.navs {
    display: grid;
    grid-template-columns: 30% 70%;
    border-top: 1px solid gray;
    margin-top: 10px;
    /* padding-top: 10px; */
    font-size: 16px;
}

.navs-nav {
    text-align: left;
    margin: 0;
    padding-left: 10px;
    padding-top: 10px;
    line-height: 1.8;
}

</style>

