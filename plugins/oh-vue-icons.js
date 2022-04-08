import Vue from 'vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { RiBold } from 'oh-vue-icons/icons';

addIcons(RiBold);

Vue.component('VIcon', OhVueIcon);
