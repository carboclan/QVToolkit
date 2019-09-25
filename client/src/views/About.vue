<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="title"></el-table-column>
      <el-table-column prop="speaker" label="speaker"></el-table-column>
      <el-table-column prop="period" label="period"></el-table-column>
      <el-table-column prop="vote" label="vote">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.vote"
            @change="handleChange"
            :min="1"
            :max="10"
            label="vote"
          ></el-input-number>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      num: 1,
      tableData: []
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
      console.log(this.tableData[0].vote);
      console.log(this.tableData[1].vote);
      console.log(this.tableData[2].vote);
      console.log(this.tableData[3].vote);
    },
    async loadInfo() {
      axios
        .get(
          "https://raw.githubusercontent.com/carboclan/QVToolkit/master/data/agenda.json"
        )
        .then(response => {
          let responseData = response.data;
          responseData.forEach(element => {
            this.tableData.push(element);
          });
        })
        .catch(error => {
          this.errors.push(error);
        });
    }
  },
  created: function() {
    this.loadInfo();
  }
};
</script> 
