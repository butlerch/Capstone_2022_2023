import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import * as echarts from "echarts";
export default function Dashboard() {
  const [option, setOption] = useState({
    title: {
      text: "Daily visit breakdown(this week)",
      textStyle:{
        color:"#000"
      },
      left:"center"
      
    },
    tooltip: {},
    xAxis: {
      data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri",'Sat'],
      type:"category",
      nameTextStyle:{
        fontWeight:"bolder"
      }
    },
    yAxis: {
      type:"value",
      name:"",
      show:true
    },
    series: [
      {
        name: "number",
        type: "bar",
        data: [2200, 900, 400, 1300, 1800, 2000,2100],
        itemStyle:{
          color:"#0b7535"
        }
      },
    ],
  });
  useEffect(()=>{
    const myChart = echarts.init(document.getElementById('dataCovans'));
    myChart.setOption(option);
  },[])
  return (
    <div className="dashboard">
      <div className="dashboard_region">
        <div className="title">
          <div className="left">Dashboard</div>
          <div className="right">Perkins Harter Profile Views</div>
        </div>
        <div className="hd dashboard_com">
          <div className="left">
            <div className="oprater_active">My Wine</div>
            <div className="oprater_active">My bottles</div>
            <div className="oprater_active">My wine club</div>
          </div>
          <div className="dataList">
            <div className="item">
              <div className="item_text">3719</div>
              <div className="item_desc">weekly visitors(average)</div>
            </div>
            <div className="item">
              <div className="item_text">1517</div>
              <div className="item_desc">unique visitors(this week)</div>
            </div>
            <div className="item">
              <div className="item_text">2.43min</div>
              <div className="item_desc">time on profile(average)</div>
            </div>
          </div>
        </div>
        <div className="bd dashboard_com">
          <div className="left">
            <div className="oprater_active">Settings</div>
            <div className="oprater_active">Plan</div>
            <div className="oprater_active">Log out</div>
          </div>
          <div id="dataCovans"></div>
        </div>
      </div>
    </div>
  );
}
