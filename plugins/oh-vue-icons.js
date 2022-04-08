import Vue from 'vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
} from 'oh-vue-icons/icons';

addIcons(
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
);

Vue.component('VIcon', OhVueIcon);
