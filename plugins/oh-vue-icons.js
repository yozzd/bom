import Vue from 'vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  RiBold,
  RiItalic,
} from 'oh-vue-icons/icons';

addIcons(RiBold, RiItalic);

Vue.component('VIcon', OhVueIcon);
