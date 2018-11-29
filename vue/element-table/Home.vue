<template>
    <div>
      <h2>Home</h2>
      <CommonTable 
        :columns="columns" 
        :dataSource="tableData" 
        :options="options"
        :fetch="fetchTableData"
        :pagination="pagination"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        />
    </div>
</template>

<script>
import axios from 'axios'
import CommonTable from '../components/Table'

export default{
  components:{
    CommonTable
  },
  data(){
    return {
      columns: [
         {
          prop: 'id',
          label: '编号',
          width: 60
        },
        {
          prop: 'title',
          label: '标题',
          // render 可以根据你想要渲染的方式渲染
          // jsx 不提供 v-model 指令，若你想要使用，，推荐使用插件 babel-plugin-jsx-v-model
          // jsx https://github.com/vuejs/babel-plugin-transform-vue-jsx
          render: (row, index) => { 
            return (
              <span style="color: blue" onClick={e => this.handleClick(e, row)}>{row.title}</span>
            )
          }
        },
        {
          prop: 'author',
          label: '作者'
        },
        {
          button: true,
          label: '按钮组',
          group: [{
            // you can props => type size icon disabled plain
            name: '编辑',
            type: 'warning',
            icon: 'el-icon-edit',
            plain: true,
            onClick: (row, index) => { // 箭头函数写法的 this 代表 Vue 实例 
              console.log(row, index)
            }
          }, {
            name: '删除',
            type: 'danger',
            icon: 'el-icon-delete',
            disabled: false,
            onClick(row) { // 这种写法的 this 代表 group 里的对象
              this.disabled = true
              console.log(this)
            }
          }]
        }
      ],
      tableData: [
        {
          id: 1,
          title: '标题1',
          author: '郭大大'
        },
        {
          id: 2,
          title: '标题2',
          author: '郭大大2'
        }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 15
      },
      options: {
        mutiSelect: true,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: true, // 是否一挂载就加载数据
      }
    }
  },
  methods: {
    handleClick(e, row){
      //transform-vue-jsx 的nativeOnClick 失效 , 所以采用 event.cancelBubble 控制点击事件的冒泡... 如果点击事件不影响你的点击行事件，可以不传
      e.cancelBubble = true // 停止冒泡，否则会触发 row-click
      console.log(row)
    },
    fetchTableData() {
       this.options.loading = true
       axios.post('https://www.easy-mock.com/mock/5b3f80edfa972016b39fefbf/example/tableData', {
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize
      }).then(res => {
        const { list, total } = res.data.data
        this.tableData = list
        this.pagination.total = total
        this.options.loading = false
      }).catch((error) => {
        console.log(error)
        this.options.loading = false
      })
    },
    handleRowClick(row, event, column){ // 点击行的事件，同理可以绑定其他事件
      console.log('click row:',row, event, column)
    },
    handleSelectionChange(selection){
      console.log(selection)
    }
  }
}
</script>
