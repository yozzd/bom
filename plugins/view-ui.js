import Vue from 'vue';
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  locale,
} from 'view-design';
import lang from 'view-design/dist/locale/en-US';

locale(lang);

Vue.component('VButton', Button);
Vue.component('VButtonGroup', ButtonGroup);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownItem', DropdownItem);
Vue.component('DropdownMenu', DropdownMenu);
