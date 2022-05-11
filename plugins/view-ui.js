import Vue from 'vue';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  locale,
} from 'view-design';
import lang from 'view-design/dist/locale/en-US';

locale(lang);

Vue.component('Button', Button);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownItem', DropdownItem);
Vue.component('DropdownMenu', DropdownMenu);
