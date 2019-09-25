<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="title"> </el-table-column>
      <el-table-column prop="speaker" label="speaker"> </el-table-column>
      <el-table-column prop="period" label="period"> </el-table-column>
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
export default {
  data() {
    return {
      tableData: [
        {
          title: "Defi blabla",
          speaker: "Bowen",
          period: "45min",
          vote: 1
        },
        {
          title: "Defi blabla",
          speaker: "Bowen",
          period: "45min",
          vote: 1
        },
        {
          title: "Defi blabla",
          speaker: "Bowen",
          period: "45min",
          vote: 1
        },
        {
          title: "Defi blabla",
          speaker: "Bowen",
          period: "45min",
          vote: 1
        }
      ]
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
      console.log(this.tableData[0].vote);
      console.log(this.tableData[1].vote);
      console.log(this.tableData[2].vote);
      console.log(this.tableData[3].vote);
    }
  }
};
</script>
