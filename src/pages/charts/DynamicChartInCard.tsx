import React from "react";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import { DashboardModel } from "../../types/types";



interface ChartModalProps {
  data: DashboardModel | undefined;
}

const DynamicChart: React.FC<ChartModalProps> = ({ data }) => {
  
  const extractChartData = (data: DashboardModel | undefined) => {
    if (!data || !data.rows.length) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      };
    }

    const firstRow = data.rows[0];
    const typeField = firstRow.cells.find((cell) => !cell.isNumericValue)?.name;
    const valueField = firstRow.cells.find((cell) => cell.isNumericValue)?.name;

    if (!typeField || !valueField) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      };
    }

    return {
      labels: data.rows.map(
        (row) => row.cells.find((cell) => cell.name === typeField)?.displayValue || ""
      ),
      datasets: [
        {
          data: data.rows.map(
            (row) => row.cells.find((cell) => cell.name === valueField)?.value || "0"
          ),
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
        },
      ],
    };
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value: number) => value.toString(),
        display: false, 
      },
      legend: {
        display: false, 
      },
      tooltip: {
        enabled: false, 
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false, 
      },
    },
    elements: {
      arc: {
        borderWidth: 0, 
      },
    },
  };
  

  const chartData = extractChartData(data);

  const renderChart = () => {
    if (!data) return null;
    switch (data.chartTypeId) {
      case 6:
        return <Doughnut data={chartData} options={options} />;
      case 3:
        return <Pie data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return <div className="chart-in-card">{renderChart()}</div>;
};

export default DynamicChart;
