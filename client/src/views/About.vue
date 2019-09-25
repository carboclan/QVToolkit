<template>
  <div class="about">
    <h1>This is an about page</h1>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="title"
      label="title"
      width="180">
    </el-table-column>
    <el-table-column
      prop="speaker"
      label="speaker"
      width="180">
    </el-table-column>
    <el-table-column
      prop="period"
      label="period">
    </el-table-column>
    <el-table-column
      prop="vote"
      label="vote">
    </el-table-column>    
  </el-table>
      <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="1" :max="10">233</el-input-number>
  </div>
 

</template>

<script>
  export default {
    data() {
      return {
        num: 1,
        tableData: [{
          title: 'Defi blabla',
          speaker: 'Bowen',
          period: '45min',
        }, {
          title: 'Ethereum 2.0 Deliver time table',
          speaker: 'Vitalik',
          period: '10min'
        }]
      }
    },    
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  };
</script> 