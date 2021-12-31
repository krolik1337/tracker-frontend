<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">Pixel tracker data</div>
    </v-app-bar>

    <v-main>
      <v-row>
        <v-col>
          <h1>Traffic</h1>
          <line-chart
            :chart-data="traffic_data"
            :options="chartOptions"
            style="max-height: 300px"
          ></line-chart>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1>Visits</h1>
          <v-data-table
            multi-sort
            :headers="visit_headers"
            :items="pages"
            :loading="show_load"
            class="elevation-2"
            style="margin: 10px"
          ></v-data-table>
        </v-col>
        <v-col>
          <h1>IPs</h1>
          <v-data-table
            :headers="ip_headers"
            :items="ips"
            :loading="show_load"
            class="elevation-2"
            style="margin: 10px"
          ></v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1>Devices</h1>
          <pie-chart
            :chart-data="device_data"
            :options="chartOptions"
          ></pie-chart>
        </v-col>
        <v-col>
          <h1>Languages</h1>
          <pie-chart
            :chart-data="language_data"
            :options="chartOptions"
          ></pie-chart>
        </v-col>
        <v-col>
          <h1>Browsers</h1>
          <pie-chart
            :chart-data="browser_data"
            :options="chartOptions"
          ></pie-chart>
        </v-col>
        <v-col>
          <h1>OS</h1>
          <pie-chart :chart-data="os_data" :options="chartOptions"></pie-chart>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1>All data</h1>
          <v-data-table
            dense
            multi-sort
            :headers="headers"
            :items="logs"
            :loading="show_load"
            :search="search"
            :footer-props="{
              'items-per-page-options': [10, 20, 50, 100],
            }"
            :items-per-page="20"
            class="elevation-2"
            style="margin: 10px; overflow-x: auto !important"
          >
            <template v-slot:top>
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                class="mx-4"
              ></v-text-field> </template
          ></v-data-table>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import PieChart from "./PieChart.js";
import LineChart from "./LineChart.js";

export default {
  name: "App",
  components: {
    PieChart,
    LineChart,
  },
  data: () => ({
    search: "",
    logs: undefined,
    pages: undefined,
    device_data: null,
    language_data: null,
    traffic_data: null,
    browser_data: null,
    os_data: null,
    devices: undefined,
    languages: undefined,
    ips: undefined,
    traffic: undefined,
    oss: undefined,
    browsers: undefined,
    show_load: true,
    colors: [
      "red",
      "green",
      "blue",
      "yellow",
      "violet",
      "grey",
      "orange",
      "pink",
    ],
    line_chart_x: undefined,
    visit_headers: [
      {
        text: "URL",
        align: "start",
        value: "name",
      },
      {
        text: "Visits",
        align: "start",
        value: "count",
      },
    ],
    ip_headers: [
      {
        text: "User's IP",
        align: "start",
        value: "name",
      },
      {
        text: "Visits",
        align: "start",
        value: "count",
      },
    ],
    headers: [
      {
        text: "UUID",
        align: "start",
        value: "uuid",
      },
      {
        text: "URL",
        align: "start",
        value: "page",
      },
      {
        text: "Browser",
        align: "start",
        value: "browser",
      },
      {
        text: "Browser Version",
        align: "start",
        value: "browserv",
      },
      {
        text: "Language",
        align: "start",
        value: "lang",
      },
      {
        text: "OS",
        align: "start",
        value: "os",
      },
      {
        text: "IP",
        align: "start",
        value: "ip",
      },
      {
        text: "Device",
        align: "start",
        value: "device",
      },
      {
        text: "Raw User Agent",
        align: "start",
        value: "ua",
      },
      {
        text: "Timestamp",
        align: "start",
        value: "created_at",
      },
    ],
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
  mounted() {
    let arr = [];
    for (var i = 0; i < 24; i++) {
      arr.push(i + ":00");
    }
    this.line_chart_x = arr;
    const header = { "Content-Type": "application/json" };
    axios
      .get("https://tracker-srvr.herokuapp.com/stats", { header })
      .then((response) => {
        this.logs = response.data.raw_data;
        this.pages = response.data.pages;
        this.languages = response.data.languages;
        this.devices = response.data.devices;
        this.ips = response.data.ips;
        this.traffic = response.data.traffic;
        this.oss = response.data.oss;
        this.browsers = response.data.browsers;
        this.show_load = false;
        this.fillData();
      })
      .catch((error) => console.log(error));
  },
  methods: {
    getArray(arr, name) {
      let result = [];
      arr.forEach((item) => result.push(item[name]));
      return result;
    },
    fillData() {
      this.device_data = {
        labels: this.getArray(this.devices, "name"),
        datasets: [
          {
            backgroundColor: this.colors,
            data: this.getArray(this.devices, "count"),
          },
        ],
      };
      this.language_data = {
        labels: this.getArray(this.languages, "name"),
        datasets: [
          {
            backgroundColor: this.colors,
            data: this.getArray(this.languages, "count"),
          },
        ],
      };
      this.os_data = {
        labels: this.getArray(this.oss, "name"),
        datasets: [
          {
            backgroundColor: this.colors,
            data: this.getArray(this.oss, "count"),
          },
        ],
      };
      this.browser_data = {
        labels: this.getArray(this.browsers, "name"),
        datasets: [
          {
            backgroundColor: this.colors,
            data: this.getArray(this.browsers, "count"),
          },
        ],
      };
      this.traffic_data = {
        labels: this.line_chart_x,
        datasets: [
          {
            label: "Overall traffic by hour",
            data: this.traffic,
            fill: true,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.4)",
            tension: 0.1,
          },
        ],
      };
    },
  },
};
</script>
<style>
h1 {
  text-align: center;
  padding: 20px;
}
</style>
