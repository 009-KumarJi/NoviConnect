import React from 'react';
import {Line, Doughnut} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
  ArcElement,
  Legend,
} from "chart.js";
import {graphGreen, graphPurple} from "../../constants/color.constant.js";
import {getLast7Days} from "../../lib/features.js";
import zIndex from "@mui/material/styles/zIndex.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    }
  },

  scales: {
    x: {
      grid: {
        display: false,
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      }
    }
  }
}
const LineChart = ({value=[]}) => {
  const data = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Messages',
        data: value,
        fill: true,
        backgroundColor: graphPurple(0.1),
        borderColor: graphPurple(0.6),
        pointBackgroundColor: graphPurple(),
      },
    ],
  }
  return (
    <Line data={data} options={lineChartOptions}/>
  );
};

const DoughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    }
  },
  cutout: '60%',
}
const DoughnutChart = ({value=[], labels=[]}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Chats vs Group Chats',
        data: value,
        fill: true,
        backgroundColor: [graphPurple(0.4), graphGreen(0.4)],
        borderColor: [graphPurple(), graphGreen()],
        offset: 35,
        hoverBackgroundColor: [graphPurple(0.6), graphGreen(0.6)],
      },
    ],
  }
  return (
    <Doughnut data={data} options={DoughnutChartOptions} style={{zIndex:10}}/>
  );
};

export {LineChart, DoughnutChart};