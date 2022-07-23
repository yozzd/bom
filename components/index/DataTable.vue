<template>
  <div>
    <el-table
      ref="ctable"
      :data="data"
      size="mini"
      border
      class="my-4"
      :row-class-name="highlighter"
      @selection-change="selection => $emit('selection-change', selection)"
    >
      <el-table-column
        v-if="production.includes($auth.$state.user.department)
          || $auth.$state.user.section === 211
          || $auth.$state.user.section === 213
          || fromMpr"
        type="selection"
        width="40"
        align="center"
        fixed
      ></el-table-column>
      <el-table-column
        type="index"
        label="No"
        align="center"
        width="50"
        fixed
      ></el-table-column>
      <el-table-column label="CD" align="center" width="60" fixed>
        <template slot-scope="scope">
          {{ scope.row.idMaterial }}
        </template>
      </el-table-column>
      <el-table-column
        label="Description"
        width="260"
        :show-overflow-tooltip="true"
        fixed
      >
        <template
          v-if="$auth.$state.user.section === 213"
          slot="header"
        >
          <el-select
            v-model="select.desc"
            placeholder="Description"
            @change="selection => $emit('handle-select-desc', selection)"
          >
            <el-option
              v-for="item in filterDesc"
              :key="item.id"
              :label="item.bomDescription"
              :value="item.bomDescription"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope">
          <a
            v-if="$auth.$state.user.department === 210 || fromMpr"
            @click="showEditItem(scope.row)"
          >
            {{ scope.row.bomDescription }}
          </a>
          <span v-else>
            {{ scope.row.bomDescription }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="Specification"
        width="260"
        :show-overflow-tooltip="true"
        fixed
      >
        <template
          v-if="$auth.$state.user.section === 213"
          slot="header"
        >
          <el-select
            v-model="select.spec"
            placeholder="Specification"
            @change="selection => $emit('handle-select-spec', selection)"
            :disabled="!select.desc"
          >
            <el-option
              v-for="item in filterSpec"
              :key="item.id"
              :label="item.bomSpecification"
              :value="item.bomSpecification"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope">
          {{ scope.row.bomSpecification }}
        </template>
      </el-table-column>
      <el-table-column
        label="Model"
        width="140"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.bomModel }}
        </template>
      </el-table-column>
      <el-table-column
        label="Brand"
        width="140"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.bomBrand }}
        </template>
      </el-table-column>
      <el-table-column label="Qty / Unit" width="80">
        <template slot-scope="scope">
          {{ scope.row.bomQty }} {{ scope.row.bomUnit }}
        </template>
      </el-table-column>
      <el-table-column label="Qty Rqd" align="center" width="60">
        <template slot-scope="scope">
          {{ scope.row.bomQtyRqd | currency }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="60">
        <template slot="header">
          <p title="Qty Balance" class="truncate">
            Qty Balance
          </p>
        </template>
        <template slot-scope="scope">
          <span
            :class="[{ 'text-red-600': scope.row.bomQtyBalance < 0 }]"
          >{{ scope.row.bomQtyBalance }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="60">
        <template slot="header">
          <p title="Qty Stock @W/H" class="truncate">
            Qty Stock @W/H
          </p>
        </template>
        <template slot-scope="scope">
          {{ scope.row.bomQtyStock | currency }}
        </template>
      </el-table-column>
      <el-table-column
        label="ETA"
        prop="bomEta"
        align="center"
        width="90"
      ></el-table-column>
      <el-table-column label="W/H Received" align="center">
        <el-table-column label="Qty" align="center" width="60">
          <template slot-scope="scope">
            {{ scope.row.bomQtyRec | currency }}
          </template>
        </el-table-column>
        <el-table-column
          label="Date"
          prop="bomDateRec"
          align="center"
          width="90"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="Price" align="center">
        <el-table-column label="CURR / Size" align="right" width="100">
          <template slot-scope="scope">
            {{ scope.row.bomCurrSizeC }} {{ scope.row.bomCurrSizeV | currency }}
          </template>
        </el-table-column>
        <el-table-column label="CURR / Ea" align="right" width="100">
          <template slot-scope="scope">
            {{ scope.row.bomCurrEaC }} {{ scope.row.bomCurrEaV | currency }}
          </template>
        </el-table-column>
        <el-table-column label="USD / Ea" align="right" width="100">
          <template slot-scope="scope">
            USD {{ scope.row.bomUsdEa | currency }}
          </template>
        </el-table-column>
        <el-table-column label="USD / Unit" align="right" width="100">
          <template slot-scope="scope">
            USD {{ scope.row.bomUsdUnit | currency }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="right" width="100">
        <template slot="header">
          <p title="Total Price (USD)" class="truncate">
            Total Price (USD)
          </p>
        </template>
        <template slot-scope="scope">
          USD {{ scope.row.bomUsdTotal | currency }}
        </template>
      </el-table-column>
      <el-table-column align="right" width="100">
        <template slot="header">
          <p title="Materials Processed (USD)" class="truncate">
            Materials Processed (USD)
          </p>
        </template>
        <template slot-scope="scope">
          USD {{ scope.row.materialsProcessed | currency }}
        </template>
      </el-table-column>
      <el-table-column align="right" width="100">
        <template slot="header">
          <p title="Yet To Purchase (USD)" class="truncate">
            Yet To Purchase (USD)
          </p>
        </template>
        <template slot-scope="scope">
          USD {{ scope.row.yetToPurchase | currency }}
        </template>
      </el-table-column>
      <el-table-column
        label="Supplier"
        width="140"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.bomSupplier }}
        </template>
      </el-table-column>
      <el-table-column label="PO / PR" align="center">
        <el-table-column
          label="Date"
          prop="bomPoDate"
          align="center"
          width="90"
        ></el-table-column>
        <el-table-column label="No" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.bomPoNo }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Remarks" align="center" width="70">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.bomRemarks"
            placement="top"
            trigger="hover"
          >
            <template #default>
              <div class="text-xs" v-html="scope.row.bomRemarks"></div>
            </template>
            <client-only slot="reference">
              <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
            </client-only>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="Priority"
        prop="priority"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        label="ETA Status"
        prop="bomEtaStatus"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        label="WMR"
        :show-overflow-tooltip="true"
        align="center"
        width="100"
        class-name="relative group"
      >
        <template slot-scope="scope">
          <nuxt-link
            v-if="scope.row.wmr3 && $route.name!=='wmr-id'"
            :to="{
              name: 'wmr-id', params: {
                id: scope.row.wmr3.id,
              }
            }"
          >
            {{ scope.row.wmr3.no }}
          </nuxt-link>
          <div class="hidden group-hover:inline-block absolute top-1.5 right-1.5">
            <el-tooltip effect="dark" content="Open in new tab" placement="top">
              <a
                v-if="scope.row.wmr3 && $route.name!=='wmr-id'"
                :href="`/wmr/${scope.row.wmr3.id}`"
                target="_blank"
              >
                <client-only>
                  <v-icon
                    name="ri-external-link-line"
                    class="remixicons w-4 h-4"
                  />
                </client-only>
              </a>
            </el-tooltip>
          </div>
          <span v-if="scope.row.wmr3 && $route.name==='wmr-id'">
            {{ scope.row.wmr3.no }}
          </span>
        </template>
      </el-table-column>-->
      <el-table-column label="Note" align="center" width="70">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.isMpr && scope.row.module"
            placement="top"
            trigger="hover"
          >
            <template #default>
              <div class="text-xs">
                moved to module "<span class="font-bold">
                  {{ scope.row.module.hid }} {{ scope.row.module.header }}
                </span>"
              </div>
            </template>
            <client-only slot="reference">
              <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
            </client-only>
          </el-popover>
          <el-popover
            v-if="scope.row.isMpr && scope.row.mpr"
            placement="top"
            trigger="hover"
          >
            <template #default>
              <div class="text-xs">
                from mpr no. :
                <a
                  :href="`/mpr/${scope.row.mpr.id}`"
                  title="Open in new tab"
                  target="_blank"
                  class="font-bold ml-2"
                >
                  {{ scope.row.mpr.no }}
                </a>
              </div>
            </template>
            <client-only slot="reference">
              <v-icon name="ri-message-2-line" class="remixicons w-4 h-4" />
            </client-only>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="50"></el-table-column>
    </el-table>

    <BomWoItemEdit
      :data="dataEditItem"
      :wo="wo"
      :mpr="mpr"
      :show="showEditItemDialog"
      :from-mpr="fromMpr"
      @close="closeEditItemDialog"
    />
  </div>
</template>

<script>
import uniqBy from 'lodash/uniqBy';
import utils from '../../mixins/utils';

export default {
  mixins: [utils],
  props: {
    data: {
      type: Array,
      required: true,
    },
    rdata: {
      type: Array,
    },
    sdata: {
      type: Array,
    },
    emptySpec: {
      type: Boolean,
      default: false,
    },
    wo: {
      type: Object,
      default: () => ({}),
    },
    mpr: {
      type: Object,
      default: () => ({}),
    },
    fromMpr: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dataEditItem: {},
      showEditItemDialog: false,
      select: {
        desc: '',
        spec: '',
      },
    };
  },
  watch: {
    emptySpec(value) {
      if (value) this.select.spec = '';
    },
  },
  computed: {
    filterDesc() {
      return uniqBy(this.rdata, 'bomDescription');
    },
    filterSpec() {
      if (this.sdata.length) return uniqBy(this.sdata, 'bomSpecification');
      return uniqBy(this.data, 'bomSpecification');
    },
  },
  methods: {
    highlighter({ row }) {
      return row.colorClass;
    },
    showEditItem(row) {
      this.dataEditItem = row;
      this.showEditItemDialog = true;
    },
    closeEditItemDialog(value) {
      this.showEditItemDialog = value;
    },
  },
};
</script>
