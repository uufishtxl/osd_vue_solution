<template>
  <div class="sub" v-show="show">
    <div class="sub-left" :class="getPaneStyle(2)">
      <!-- Brightness/Contrast时是Brightness的Adjustable Component，否则则是列表 -->
      <div v-if="activeNav == 1">
        <slot name="subleft"></slot>
      </div>
      <div v-else class="list-item sub-list">
        <div :key="index" v-for="(item, index) in subNavs">
          <div :class="subCls(item)">
            {{
              item.label == "DP" || item.label == "HDMI"
                ? $store.state.cur_vals[formatTxt(item.label)] == "Off"
                  ? item.label
                  : $store.state.cur_vals[formatTxt(item.label)]
                : item.label
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧面板 -->
    <div class="sub-right" :class="getPaneStyle(3)">
      <!-- 活动列表为二级时，显示Middle Pane的值 -->
      <div v-show="activeLevel <= 2 && activeNav != 1" class="list-item">
        <div
          :key="index"
          v-for="(item, index) in findVals"
          class="fix-block item-gray"
        >
          {{ item.val }}
        </div>
      </div>

      <!--  活动列表为三级时，显示的slot -->
      <div v-show="activeNav == 1 || (activeLevel >= 3 && activeNav != 1)">
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
  props: ["icon", "label", "id", "simpSels", "haspre", "nclicked"],
  data() {
    return {
      show: true,
      subNavs: [],
      currentValue: this.$store.getters.curSub, //$store.getters.fullInfo
      prearys: this.simpSels,
      activeLevel: this.active_level,
    };
  },
  computed: {
    findVals() {
      return this.$parent.findVals(this.subNavs);
    },
    activeNav() {
      return this.$store.state.nav_active;
    },
    active_level() {
      return this.$store.state.active_level;
    },
  },
  methods: {
    sortNavs: function (obja, objb) {
      var sa = Number(obja.id);
      var sb = Number(objb.id);
      if (sa < sb) {
        return -1;
      } else if (sa > sb) {
        return 1;
      } else {
        return 0;
      }
    },
    subCls: function (item) {
      return [
        {
          "item-gray":
            (Number(item.id) != Number(this.currentValue) &&
              this.activeLevel > 2) ||
            this.activeLevel == 1,
        },
        {
          "item-active":
            Number(item.id) === Number(this.currentValue) &&
            this.activeLevel >= 2,
        },
      ];
    },
    getPaneStyle: function (id) {
      return {
        "hili-pane": this.activeLevel == id,
      };
    },
    updateNav() {
      this.$parent.updateNav();
    },
    getSubNavs() {
      return this.$children.filter(function (item) {
        return item.$options.name === "SelList" || "ScaleBar";
      });
    },
    updateSubNav() {
      this.subNavs = [];
      var _this = this;
      if (this.haspre) {
        this.subNavs = this.subNavs.concat(this.simpSels);
      }
      this.getSubNavs().forEach(function (sub, index) {
        _this.subNavs.push({
          label: sub.label,
          id: sub.id || index,
          hasChild: sub.extend || false
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
        id: this.subNavs.length + 1,
        hasChild: false,
        isReset: true
      });
      this.subNavs.sort(this.sortNavs);
      this.updateSubStatus();
    },
    updateSubStatus() {
      var _this = this;
      console.log(`update sub status, ${this.currentValue}`);
      this.getSubNavs().forEach(function (sub) {
        return (sub.show = Number(sub.id) === Number(_this.currentValue));
      });
      if (this.$store.state.nav_active == 1) {
        this.getSubNavs().forEach(function (sub) {
          return (sub.show = true);
        });
      }
    },
    formatTxt: function (txt) {
      var str = txt.replace(/\W/g, "_");
      str = str.toLowerCase();
      if (str.substr(str.length - 1, 1) == "_") {
        str = str.slice(0, str.length - 1);
      }
      return str;
    },
    getValidChild() {
      var children = this.getSubNavs();
      children = children.filter(function (item) {
        return item.show;
      });
      //
      var child;
      if (this.label != "Brightness/Contrast") {
        child = children[0];
      } else {
        children = children.filter(function (item) {
          return (item.label == "Contrast");
        });
        child = children[0];
      }
      // var child =
      //   this.label == "Brightness/Contrast" ? children[1] : children[0];
      return child;
    },
    getValidGrandChild() {
      var child = this.getValidChild();
      var grandchildren = child.$children.filter(function (item) {
        return item.show;
      });
      return grandchildren[0];
    },
    up() {
      console.log("up clicked");
      console.log(
        `active level is ${this.activeLevel}, show? ${this.show} label is ,${this.label}`
      );
      if (this.show && this.activeLevel == 2) {
        if (this.$store.state.nav_active == 1) {
          var vals_b = this.$store.state.cur_vals;
          console.log(`vals are ${vals_b}`);
          var val_b = vals_b.brightness;
          ++val_b;
          this.$store.commit("updateVal", { label: "brightness", val: val_b });
        } else {
          var cur = this.currentValue;
          var len = this.subNavs.length;
          cur = (cur - 1 + len) % len;
          cur = cur == 0 ? len : cur;
          this.currentValue = cur;
          this.$store.commit("updateSubNav", this.currentValue); // OK 后做
          this.updateSubStatus();
        }
      } else if (this.show && this.activeLevel == 3) {
        console.log("entered here activelevel == 3");
        var child = this.getValidChild();
        if (child.$options.name == "ScaleBar") {
          var val = child.cur_val;
          if (val < child.max) {
            ++val;
          }
          this.$store.commit("updateVal", {
            label: this.formatTxt(child.label),
            val: val,
          });
        } else if (child.$options.name == "SelList") {
          // 获取当前的位置，更改值
          var pos = child.focus;
          var len_o = child.options.length;
          // console.log(`focus on item ${pos}, totally have ${len_o} options.`)
          pos = (pos - 1 + len_o) % len_o;
          // var newVal = child.options[pos].label;
          // console.log(`new position is ${pos}, value is ${newVal}`)
          child.focus = pos;
          // console.log(`new position is ${pos}, component value is ${child.focus}`)
          // // should be comprehended in OK block
          // _this.$store.commit('updateVal', {label: _this.formatTxt(child.label), val: newVal})
        }
      } else if (this.show && this.activeLevel == 4) {
        // var schildren = this.getSubNavs();
        // // var __this = this;
        // schildren = schildren.filter(function(item) {
        //     return item.show;
        // })
        // var schild = this.label == 'Brightness/Contrast' ? schildren[1] : schildren[0];
        // var grandchildren = schild.$children.filter(function(item){
        //     return item.show;
        // })
        var grandchild = this.getValidGrandChild();
        // console.log(`grandchild, ${grandchild.label}`)
        if (grandchild.$options.name == "SelListQuad") {
          var gpos = grandchild.focus;
          var glen_o = grandchild.options.length;
          gpos = (gpos - 1 + glen_o) % glen_o;
          grandchild.focus = gpos;
        }
      }
    },
    down() {
      console.log("down clicked");
      if (this.show && this.activeLevel == 2) {
        if (this.$store.state.nav_active == 1) {
          var vals_b = this.$store.state.cur_vals;
          console.log(`vals are ${vals_b}`);
          var val_b = vals_b.brightness;
          if (val_b > 0) {
            --val_b;
          }
          this.$store.commit("updateVal", { label: "brightness", val: val_b });
        } else {
          var cur = this.currentValue;
          var len = this.subNavs.length;
          cur = (cur + 1) % len;
          cur = cur == 0 ? len : cur;
          this.currentValue = cur;
          this.$store.commit("updateSubNav", this.currentValue);
          this.updateSubStatus();
        }
      } else if (this.show && this.activeLevel == 3) {
        var child = this.getValidChild();
        if (child.$options.name == "ScaleBar") {
          var val = child.cur_val;
          if (val > child.min) {
            --val;
          }
          this.$store.commit("updateVal", {
            label: this.formatTxt(child.label),
            val: val,
          });
        } else if (child.$options.name == "SelList") {
          // 获取当前的位置，更改值
          var pos = child.focus;
          var len_o = child.options.length;
          pos = (pos + 1) % len_o;
          child.focus = pos;
        }
      } else if (this.show && this.activeLevel == 4) {
        // var schildren = this.getSubNavs();
        // // var __this = this;
        // schildren = schildren.filter(function(item) {
        //     return item.show;
        // })
        // var schild = this.label == 'Brightness/Contrast' ? schildren[1] : schildren[0];
        // var grandchildren = schild.$children.filter(function(item){
        //     return item.show;
        // })
        var grandchild = this.getValidGrandChild();
        // console.log(`grandchild, ${grandchild.label}`)
        if (grandchild.$options.name == "SelListQuad") {
          var gpos = grandchild.focus;
          var glen_o = grandchild.options.length;
          gpos = (gpos + 1) % glen_o;
          grandchild.focus = gpos;
        }
      }
    },
    right() {
      // 2级菜单按Right后，选中当前项 (Connector / Rotation)，或者进入三级菜单(改Level)
      console.log(`clicking right on option - ${this.$store.getters.cur_sub}`);
    },
    ok() {
      console.log("ok clicked");
      this.updateSubStatus();
      /*
            -   处于3级菜单
                查看有没有children：
                    -   有：activel_level + 1
                    -   没：activeLevel - 1
                        当前为
            */
      var level = this.activeLevel;
      //   if (this.activeLevel == 2 && this.$store.state.nav_active != 1) {
      //     this.activeLevel = 3;
      //   }
      if (this.show) {
        var children = this.getSubNavs(); //获取到三级菜单项，SelList1、SelList2
        var _this = this;
        children = children.filter(function (item) {
          return item.show;
        });
        var child = children[0]; //找到显示的那个子组件
        if (level == 2 && this.$store.state.nav_active != 1) {
          var cur = this.subNavs[this.currentValue - 1];
          // 当前选中的选项的hasChild属性为true ++level
          // 当前选中的选项hasChild属性为false，对label做个别处理
          // 当前选中的选项为Reset选项
          if (cur.hasChild) {
            ++level;
            this.$store.commit("updateLevel", level);
          } else if (cur.isReset) {
            console.log('reset handling');
            /*
            找到所有children的options - > 
            */ 
            this.subNavs.forEach(function(item) {
              if (_this.$store.state.cur_vals[_this.formatTxt(item.label)]) {
                _this.$store.state.cur_vals[_this.formatTxt(item.label)] = _this.$store.state.def_vals[_this.formatTxt(item.label)];
              }
              var grandchildren = item.$children;
              if (grandchildren) {
                grandchildren.forEach(function(grandchild) {
                  if (_this.$store.state.cur_vals[_this.formatTxt(grandchild.label)]) {
                    _this.$store.state.cur_vals[_this.formatTxt(grandchild.label)] = _this.$store.state.def_vals[_this.formatTxt(grandchild.label)];

                  }
                })
              }
            })
          } else {
            console.log('special handling');
          }
        }
        if (level == 3 && this.$store.state.nav_active != 1) {
          console.log(
            `has child? ${child.extend}, ${child.label}, ${child.$options.name}`
          );
          if (child.$options.name === "SelList") {
            var newVal = child.options[child.focus].label;
            this.$store.commit("updateVal", {
              label: _this.formatTxt(child.label),
              val: newVal,
            });
          }
          if (child.options[child.focus].hasChild) {
            // 如果子组件的extend属性为true并且当前选中项的hasChild属性为true，那么++level
            // 更新level
            ++level;
            this.$store.commit("updateLevel", level);
            child.updateQuadStatus();
            // 更新当前这个child的值
          } else {
            --level;
            this.$store.commit("updateLevel", level);
          }
        } else if (level == 4) {
          var grandchild = this.getValidGrandChild();
          if (grandchild.$options.name === "SelListQuad") {
            var newValQ = grandchild.options[grandchild.focus].label;
            this.$store.commit("updateVal", {
              label: this.formatTxt(grandchild.label),
              val: newValQ,
            });
          }
          --level;
          this.$store.commit("updateLevel", level);
        }
        console.log(
          `active level is ${this.activeLevel}, show? ${this.show} label is ${this.label}`
        );
      }
    },
  },
  watch: {
    label() {
      this.updateNav();
    },
    nclicked: function () {
      if (this.$store.state.up) {
        this.up();
      } else if (this.$store.state.down) {
        this.down();
      } else if (this.$store.state.right) {
        this.right();
      } else if (this.$store.state.ok) {
        this.ok();
      }
    },
    activeLevel(val) {
      this.$store.commit("updateLevel", val);
    },
    active_level(val) {
      this.activeLevel = val;
    },
  },
  mounted() {
    this.updateNav();
    // this.subNavs = this.subNavs.concat(this.simpSels);
    this.currentValue = this.$store.getters.curSub;
  },
};
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
