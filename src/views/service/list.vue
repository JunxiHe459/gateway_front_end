<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.info"
        placeholder="服务名称/服务描述"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <router-link :to="'/service/create_http/'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
          Add new HTTP service
        </el-button>
      </router-link>
      <router-link :to="'/service/create_tcp/'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
          Add new TCP service
        </el-button>
      </router-link>
      <router-link :to="'/service/create_grpc/'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">
          Add new GRPC service
        </el-button>
      </router-link>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="50">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Service Name" min-width="110px">
        <template slot-scope="{row}">
          <span>{{ row.service_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.service_desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.load_type | loadTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP Address" min-width="165px">
        <template slot-scope="{row}">
          <span>{{ row.service_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="QPS" min-width="50px">
        <template slot-scope="{row}">
          <span>{{ row.qps }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Daily Requests" min-width="70px">
        <template slot-scope="{row}">
          <span>{{ row.qpd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Nodes" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.total_node }}</span>
        </template>
      </el-table-column>

      <!--      <el-button type="danger" icon="el-icon-delete" circle />-->
      <el-table-column label="Operations" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/service/service_stats/'+row.id">
            <el-button class="bt" type="warning" icon="el-icon-star-off" circle />
          </router-link>
          <router-link v-if="row.load_type===0" :to="'/service/update_http/'+row.id">
            <el-button class="bt" type="primary" icon="el-icon-edit" circle />
          </router-link>
          <router-link v-if="row.load_type===1" :to="'/service/update_tcp/'+row.id">
            <el-button class="bt" type="primary" icon="el-icon-edit" circle />
          </router-link>
          <router-link v-if="row.load_type===2" :to="'/service/update_grpc/'+row.id">
            <el-button class="bt" type="primary" icon="el-icon-edit" circle />
          </router-link>
          <el-button
            class="bt"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(row,$index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { serviceList, serviceDelete } from '@/api/service'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const numberTotype = [
  { key: '0', display_name: 'HTTP' },
  { key: '1', display_name: 'TCP' },
  { key: '2', display_name: 'GRPC' }
]

const typearr = numberTotype.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ServiceList',
  components: { Pagination },
  directives: { waves },
  filters: {
    loadTypeFilter(type) {
      return typearr[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page_number: 1,
        page_size: 20,
        info: ''
      },
      temp: {
        id: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      serviceList(this.listQuery).then(response => {
        this.list = response.data.service_list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page_number = 1
      this.getList()
    },
    handleDelete(row, index) {
      this.$confirm('Do you want to delete this service?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        const deleteQuery = {
          'id': row.id
        }
        serviceDelete(deleteQuery).then(response => {
          this.$notify({
            title: 'Success',
            message: 'Deleted Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Cancel',
          type: 'info',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style scoped>
  .bt {
    margin-right: 10px;
  }
</style>
