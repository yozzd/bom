import Vue from 'vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiBold,
  RiExternalLinkLine,
  RiFilterLine,
  RiFormatClear,
  RiHome4Line,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiMarkPenLine,
  RiMessage2Line,
  RiParagraph,
  RiStrikethrough,
  RiTimeLine,
  RiUnderline,
} from 'oh-vue-icons/icons';

addIcons(
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiBold,
  RiExternalLinkLine,
  RiFilterLine,
  RiFormatClear,
  RiHome4Line,
  RiItalic,
  RiListOrdered,
  RiListUnordered,
  RiMarkPenLine,
  RiMessage2Line,
  RiParagraph,
  RiStrikethrough,
  RiTimeLine,
  RiUnderline,
);

Vue.component('VIcon', OhVueIcon);
