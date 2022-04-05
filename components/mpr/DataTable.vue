<template>
  <div>
    <el-table
      :data="data"
      size="mini"
      border
      class="mt-4 mb-8"
      :row-class-name="highlighter"
    >
      <el-table-column
        type="index"
        label="No"
        align="center"
        width="40"
        fixed
      ></el-table-column>
      <el-table-column label="CD" align="center" width="60" fixed>
        <template slot-scope="scope">
          {{ scope.row.idMaterial }}
        </template>
      </el-table-column>
      <el-table-column label="Description" width="140" fixed>
        <template slot-scope="scope">
          <p :title="scope.row.bomDescription" class="truncate">
            {{ scope.row.bomDescription }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Specification" width="140" fixed>
        <template slot-scope="scope">
          <p :title="scope.row.bomSpecification" class="truncate">
            {{ scope.row.bomSpecification }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Model" width="140">
        <template slot-scope="scope">
          <p :title="scope.row.bomModel" class="truncate">
            {{ scope.row.bomModel }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Brand" width="140">
        <template slot-scope="scope">
          <p :title="scope.row.bomBrand" class="truncate">
            {{ scope.row.bomBrand }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="Qty / Unit" width="70">
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
        <el-table-column label="Supplier" width="140">
          <template slot-scope="scope">
            <p :title="scope.row.bomSupplier" class="truncate">
              {{ scope.row.bomSupplier }}
            </p>
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
              placement="left"
              trigger="hover"
            >
              <template #default>
                <div class="text-xs" v-html="scope.row.bomRemarks"></div>
              </template>
              <outline-chat-icon
                slot="reference"
                class="heroicons w-4 h-4"
              />
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
        <el-table-column label="" min-width="50"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    highlighter({ row }) {
      return row.colorClass;
    },
  },
};
</script>
