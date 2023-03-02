import React, { useLayoutEffect, useEffect, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { getHistoricChartData } from '../api/axios';

// This function is used to combine the data from the different devices.
// https://stackoverflow.com/questions/53224923/merge-array-of-objects-by-object-key
// https://stackoverflow.com/questions/71048528/how-to-merge-two-arrays-of-objects-in-javascript

const COMBINE = data =>
  data.reduce((acc, val) => {
    const i = acc.findIndex(o => o.date === val.date);
    if (i !== -1) {
      acc[i] = { ...acc[i], ...val };
      return acc;
    } else return acc.concat(val);
  }, []);

const ChartPage = ({ setView, selectedDevices, setSelectedDevices }) => {
  const [chartData, setChartData] = useState([]);
  const [devicesArray, setDevicesArray] = useState([]);

  // The main function to fetch the devices according to the page number.
  const getData = async devices => {
    try {
      // The data from the devices is stored in these arrays.
      let devicesMax = [];
      let devicesImei = [];

      devices.map(async device => {
        // The data is fetched from the API.
        const data = await getHistoricChartData(device.imei);
        // The data is mapped to the device imei. This is used to create the legend.
        const deviceLabel = device.imei + '_max';
        const dataNameChange = data.map(data => {
          return { date: data.date, [deviceLabel]: data.max };
        });

        devicesMax.push(...dataNameChange);
        devicesImei.push(deviceLabel);

        // The data is combined and set to the chartData state.
        setChartData(COMBINE(devicesMax));
        setDevicesArray(devicesImei);
        setSelectedDevices([]);
      });
    } catch (err) {
      console.log(err?.response);
    }
  };

 
  useEffect(() => {
    getData(selectedDevices);
  }, []);

  useLayoutEffect(() => {
    // Create root element
    let root = am5.Root.new('chartdiv');


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true
      })
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none'
      })
    );
    cursor.lineY.set('visible', false);

    // Define data

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'date',
        startLocation: 0.5,
        endLocation: 0.5,
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    xAxis.data.setAll(chartData);

    let xRenderer = xAxis.get('renderer');
    xRenderer.labels.template.setAll({
      fontSize: '0.9em',
      rotation: -45,
      centerY: am5.p50
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

    function createSeries(name, field) {
      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          stacked: true,
          valueYField: field,
          categoryXField: 'date',
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: 'horizontal',
            labelText: '[bold]{name}[/]\n{categoryX}: {valueY}'
          })
        })
      );

      series.fills.template.setAll({
        fillOpacity: 0.5,
        visible: true
      });

      series.data.setAll(chartData);
      series.appear(1000);
    }

    devicesArray.map(data => {
      createSeries(data, data);
    });

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal'
      })
    );

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    

    // Add legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        layout: root.horizontalLayout,
        centerY: am5.percent(60)
      })
    );
    legend.data.setAll(chart.series.values);


    return () => {
      root.dispose();
      
   
    };
  }, [chartData]);

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <div className="sm:flex sm:items-center  mt-10 ">
        <h1 onClick={() => setView('dashboard')} className="text-xl font-semibold text-gray-900 mr-10 cursor-pointer">
          Back{' '}
        </h1>
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Chart Page</h1>
        </div>
      </div>
      <div className="mt-10" id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default ChartPage;