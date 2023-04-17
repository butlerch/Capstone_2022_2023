import React, {useEffect, useState} from "react";
import "./WinesheetDetail.css";

export default function WinesheetDetail() {
    const [desc, setDesc] = useState({});
    useEffect(() => {
        setDesc(JSON.parse(localStorage.getItem("desc")))
    }, [])
    return (
        <div className="winesheetDetail">
            <div className="winesheetDetail_region">
                <div className="title">{desc.title}</div>
                <div className="body">
                    <div className="left">
                        <img alt='Winesheet' src={desc.thumbnail}></img>
                    </div>
                    <div className="right">
                        {desc.title}
                    </div>
                </div>
            </div>
        </div>
    );
}
