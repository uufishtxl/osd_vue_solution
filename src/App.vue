<template>
  <div id="app" v-cloak>
    <div class="span3 osd-title">
      <Header osdName="Dell UltraSharp C2722DE OSD Simulator" />
    </div>
    <div class="osd-router">
      <Connectors :connectors="connectors" />
      <Help :helpS="helpS" v-on:switch-change="changeSwitch" />
    </div>
    <div class="monitor">
      <!-- <div class="desktop"></div> -->
      <div class="bg"></div>
      <Menu
        :clicked="clicked"
        v-show="activeLevel >= 1 && activeLevel <= 4"
        :clrActive="clrActive"
      />
      <Btns v-show="activeLevel >= 1" :active="false" />
    </div>
    <Btns :active="true" />
    <svg height="0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="change">
          <!-- 
            调整R，调整第一行，其他行保持0 (0-2之间调整)
            调整G，调整第二行，其他行保持0 (0-2之间调整)
            调整B，调整第三行，其他行保持0 (0-2之间调整)
            最后一行的数字会决定滤镜的效果强烈与否
           -->
          <feColorMatrix
            values="    0.5 0  0  0 0
                        0  0  0 0 0
                       0  0  0 0 0
                        0  0  0 0.15 0"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script>
import Menu from "./components/Menu";
import Btns from "./components/Btns";
import Header from "./components/layout/Header";
import Connectors from "./components/Connectors";
import Help from "./components/Help";

export default {
  name: "App",
  components: {
    Menu,
    Btns,
    Header,
    Connectors,
    Help,
  },
  data() {
    return {
      connectors: ["DP", "HDMI", "I/O"],
      helpS: true,
      // Left Active Seq
      activeNav: this.$store.state.nav_active,
      // Middle Active Seqs
      clrActive: 1,
      dspActive: 1,
      PipActive: 1,
      MenuActive: 1,
      PerActive: 1,
      OthActive: 1,
      navQty: 8,
      timer_def: 3000,
      prevLevel: 0,
      clicked: true,
      timer: setTimeout(function () {}, 10000000000),
      activeLevel: this.$store.state.active_level,
    };
  },
  methods: {
    handleOK() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.activeLevel > 1 && this.$store.state.nav_active == 1) {
        this.activeLevel = 1;
      } else if (this.activeLevel < 3) {
        this.activeLevel += 1;
      }
      this.clicked = !this.clicked;
      this.$store.commit("setActiveBtn", "o");
      this.countDown();
    },
    handleLeft() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.activeLevel <= 4 && this.activeLevel >= 0) {
        this.activeLevel -= 1;
      }
      this.$store.commit("setActiveBtn", "l");
      this.countDown();
    },
    handleRight() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.activeLevel < 4) {
        this.activeLevel += 1;
      }
      this.clicked = !this.clicked;
      this.$store.commit("setActiveBtn", "r");
      this.countDown();
    },
    handleUp() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.activeLevel == 1) {
        this.activeNav = this.navUp(this.activeNav, this.navQty);
        this.$store.commit("updateNav", this.activeNav);
      }

      this.clicked = !this.clicked;
      this.$store.commit("setActiveBtn", "u");
      this.countDown();
    },
    handleDown() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.activeLevel == 1) {
        this.activeNav = this.navDown(this.activeNav, this.navQty);
        console.log("down clicked", this.activeNav);
        this.$store.commit("updateNav", this.activeNav);
      }
      this.clicked = !this.clicked;
      this.$store.commit("setActiveBtn", "d");
      this.countDown();
    },
    changeSwitch: function (val) {
      this.helpS = val;
    },
    countDown() {
      var _this = this;
      this.timer = setTimeout(function () {
        _this.prevLevel = this.activeLevel;
        _this.activeLevel = 0;
      }, this.timer_def * 1000);
    },
    navUp: function (cur, len) {
      cur = (cur - 1 + len) % len;
      cur = cur == 0 ? len : cur;
      return cur;
    },
    navDown: function (cur, len) {
      cur = (cur + 1 + len) % len;
      cur = cur == 0 ? len : cur;
      return cur;
    },
  },
  watch: {
    activeLevel: function (val) {
      this.$store.commit("updateLevel", val);
    },
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  padding-bottom: 60px;
  display: grid;
  grid-template-columns: minmax(300px, 350px) auto 200px;
  background: #eee;
  grid-column-gap: 10px;
}

/* bg */

/*背景模糊*/
.bg {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("./assets/bg.jpg");
  background-size: cover;
  padding: 1px;
  box-sizing: border-box;
  z-index: 1;
}
.bg:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  filter: blur(1px) contrast(100%) brightness(100%) /*url(#change)*/
    /* hue-rotate(0deg) - input color format 可以利用这个 invert(0%) 曝光 grayscale(0%) 灰色滤镜 sepia(0%) 暖黄色调*/;
  z-index: 2;
}
.drag {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  text-align: center;

  z-index: 11;
}

.button-active {
  cursor: pointer;
}

/* checkbox styling */

/*纯CSS写法*/
.checkbox-group input {
  display: none;
  opacity: 0;
}
.checkbox-group input[type="checkbox"] + label,
.checkbox-group input[type="radio"] + label {
  line-height: 1;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  /*cursor: pointer;*/
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  margin: 2px;
}

.checkbox-group {
  align-self: center;
  margin-left: 10px;
}
.checkbox-group input[type="checkbox"] + label:before,
.checkbox-group input[type="radio"] + label:before {
  line-height: 20px;
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  content: "";
  color: #fff;
  border: 1px solid #dce4e6;
  background-color: #f3f6f8;
  border-radius: 3px;
}
.checkbox-group input[type="checkbox"]:checked + label:before,
.checkbox-group input[type="radio"]:checked + label:before {
  /*content:'\2022';圆点*/
  content: "\2713";
  color: #fff;
  background-color: skyblue;
  border-radius: 3px;
  font-size: 16px;
  text-align: center;
  border-color: skyblue;
}

/* Help */

.help {
  margin: 0;
  margin-top: 80px;
  color: skyblue;
}

.help_info {
  grid-column-end: span 2;
  margin-top: 20px;
  background: skyblue;
  width: minmax(200px, 320px);
  height: 200px;
  border-radius: 5%;
  padding: 10px 5px;
}

/* Layout */

.osd-title {
  text-align: left;
  padding-left: 20px;
  font-size: 14px;
}

/* General GRID AND SPAN CONFIGURATION */

.span3 {
  grid-column-end: span 3;
}

.tick {
  font-size: 10px;
  padding-top: 4px;
  grid-column: 1 / 2;
  display: none;
}

.show-it {
  display: block;
}

.icon {
  margin-right: 5px;
}

.item-active {
  color: #3399ff;
}

.item-gray {
  color: #999;
}

.hili-pane {
  border-top: 2px solid #ccc;
}

.list-item {
  text-align: left;
  margin: 0;
  padding-left: 10px;
  padding-top: 10px;
  line-height: 1.8;
}

/* button panel */

.btnpanel {
  opacity: 0.9;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: none;
  display: grid;
  grid-template-columns: repeat(3, 30px);
  grid-template-rows: repeat(3, 30px);
  padding: 3px;
  column-gap: 3px;
  row-gap: 3px;
}

.btnpanel-guide {
  background: #333;
  position: absolute;
  bottom: 15px;
  right: 15px;
  z-index: 11;
}

.btn-action {
  background: rgb(132, 136, 136);
  background: linear-gradient(
    170deg,
    rgba(132, 136, 136, 1) 0%,
    rgba(152, 163, 152, 1) 46%,
    rgba(242, 247, 242, 1) 100%
  );
  position: relative;
  justify-self: start;
  align-self: center;
  border: 0.5px solid #222;
}

.btn-action > div {
  cursor: pointer;
}

.btnpanel > div {
  line-height: 30px;
  text-align: center;
  font-size: 1.2rem;
  color: #eee;
  border: 0.5px solid rgb(28, 159, 211);
  border-radius: 50%;
  color: rgb(28, 159, 211);
}

.btnup {
  grid-column: 2 / 3;
}

.btnleft {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.btnok {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  font-size: 0.8rem;
}

.btnright {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.btndown {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

/* Monitor */

.monitor {
  margin-left: 150px;
  background: #000;
  width: 900px;
  height: 500px;
  position: relative;
  padding: 15px;
  margin: 0;
  margin-left: 150px;
}

.desktop {
  background: url("./assets/bg.jpg");
  background-size: cover;
  width: 900px;
  height: 500px;
  padding: 0;
  margin: 0;
  z-index: 999;
}

.menu {
  background: #333;
  height: 337.5px;
  width: 600px;
  opacity: 0.9;
  display: grid;
  grid-template-rows: 30px auto 40px;
  color: #eee;
  position: absolute;
  bottom: 130px;
  right: 15px;
  padding: 0;
  z-index: 11;
}

/* Monitor > SelList */

.grid2 {
  display: grid;
  grid-template-columns: 20px auto;
}

.column2 {
  grid-column: 2 / 3;
}
</style>
