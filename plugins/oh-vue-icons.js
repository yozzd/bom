import Vue from 'vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
} from 'oh-vue-icons/icons';

addIcons(
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
);

Vue.component('VIcon', OhVueIcon);
