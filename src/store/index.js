import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        left: false,
        right: false,
        up: false,
        down: false,
        ok: false,
        active_level: 0,
        nav_active: 1,
        inp: 1,
        clr_active: 1,
        def_vals: {
            brightness: 75,
            contrast: 75,
            auto_select: 'On',
            rename_inputs: 'DP',
            preset_modes: 'Standard',
            input_color_format: 'RGB',
            hue: 50,
            saturation: 50,
            dp: 'Off',
            hdmi: 'Off'
        },
        cur_vals: {
            brightness: 75,
            contrast: 75,
            auto_select: 'On',
            rename_inputs: 'DP',
            preset_modes: 'Standard',
            input_color_format: 'RGB',
            hue: 50,
            saturation: 50,
            dp: 'Off',
            hdmi: 'Off'
        },
        tri: 1,
        quad: 1,
        curmenu: 'blank',
        pb_view: false
    },
    mutations: {
        updateNav(state, payload) {
            // console.log('mutate nav_active', payload, typeof(payload));
            state.nav_active = payload;
            console.log(`mutated, nav_active is ${state.nav_active}`);
        },
        updateSubNav(state, payload) {
            console.log(`mutating sub nav...payload is ${payload}; active nav is ${state.nav_active}`);
            switch (state.nav_active) {
                case 2:
                    state.inp = payload;
                    console.log(`mutated active inp is ${state.inp}`)
                    break;
                case 3:
                    state.clr_active = payload;
                    console.log(`mutated active clr is ${state.clr_active}`)
                    break;
                default:
                    break;
            }
        },
        updatePos(state,payload) {
            switch(payload.level) {
                case 3: 
                    state.tri = payload.pos;
                    console.log('3 level positionchanged', state.tri);
                    break;
                default:
                    break;
            }
        },
        updateFocus(state,payload) {
            state.curmenu = payload.focus;
        },
        updateArrows(state,payload) {
            state.pb_sel = payload;
        },
        setActiveBtn(state, payload) {
            console.log(`set active button, ${payload}`)
            state.left = false;
            state.right = false;
            state.up = false;
            state.down = false;
            state.ok = false;
            switch(payload) {
                case "l":
                    state.left = true;
                    break;
                case "r":
                    state.right = true;
                    break;
                case "u":
                    state.up = true;
                    break;
                case "d":
                    state.down = true;
                    break;
                case "o":
                    state.ok = true;
                    break;
                default: 
                    break;
            }
        },
        updateLevel(state, payload) {
            state.active_level = payload;
        },
        updateVal(state, payload) {
            state.cur_vals[payload.label] = payload.val;
        }
    },
    getters: {
        curSub(state) {
            var cur_sub;
            switch(state.nav_active) {
                case 2:
                    cur_sub = state.inp;
                    break;
                case 3:
                    cur_sub = state.clr_active;
                    break;
                default:
                    cur_sub = 1;
                    break;
            }
            return cur_sub;
        }
    }
})

export default store