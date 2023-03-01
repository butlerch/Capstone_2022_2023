import React from "react";
import "./WinesheetDetail.css";
export default function WinesheetDetail() {
  return (
    <div className="winesheetDetail">
      <div className="winesheetDetail_region">
        <div className="title">Winery:Romanee-Conti</div>
        <div className="body">
          <div className="left">
            <img src="https://raw.sevencdn.com/weiyongling/xiaoweiPictures/master/202207141142698.jpg"></img>
          </div>
          <div className="right">
            Domaine de la Romanee-Conti, often abbreviated to DRC,is an estate
            in Burgundy,France that produces white and red wine.It is widely
            considered among the world's greatest wine producers, and DRC
            bottles are among the world's most expensive.It takes its name from
            the domaine's most famous vineyard, Romanee-Conti.
          </div>
        </div>
      </div>
    </div>
  );
}
