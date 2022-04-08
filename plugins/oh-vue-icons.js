import Vue from 'vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiMarkPenLine,
  RiParagraph,
  RiStrikethrough,
  RiUnderline,
} from 'oh-vue-icons/icons';

addIcons(
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiMarkPenLine,
  RiParagraph,
  RiStrikethrough,
  RiUnderline,
);

Vue.component('VIcon', OhVueIcon);
