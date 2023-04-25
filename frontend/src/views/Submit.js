// State Management & Authentication
import {useEffect, useState} from "react";

// Routing & Paths
// Style & Components
import '../components/Winesheet.css';
import '../components/AccessoryPage.css';
import '../components/TextStyles.css'
import axios from "axios";
import {getConfig} from "../config/config";


// Helper Functions

// Component Description: Displays a single winesheet.
export default function Submit() {
    const [technicalForm, setTechnicalForm] = useState({
        "aging_process": "",
        "cases_produced": "",
        "clusters": "",
        "pct_alcohol": "",
        "ph": "",
        "soils": "",
        "wine_name": '',
        "winery_name": "",
        "year": "2023"
    })

    const query = new URLSearchParams(window.location.search);
    const bottle_id = parseInt(query.get('bottle'), 10);
    const {apiOrigin} = getConfig();


    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${apiOrigin}/techsheets/${bottle_id}`);
            setTechnicalForm(res.data)

        }

        fetchData()
    }, [apiOrigin, bottle_id])

    const submit = () => {

    }
    return <div className="winesheetPageContainer">
        <div className="winesheetPageCard">
            <div className="technicalData" style={{margin: '0 auto'}}>
                <div className="technicalDataHeader">
                    <span className="title">Submit your wine data</span>
                    <span className="subtitle">this is an apply and we will verify it.</span>
                </div>
                <div style={{minWidth: 800}}>
                    {Object.keys(technicalForm).map((element) => <div className="technicalDataGridItem"
                                                                      key={element} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        marginBottom: '1rem'
                    }}>
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset'}}>
                            {element.split('_').map(str => <span key={str}
                                style={{marginRight: '.2rem'}}>{str[0].toLocaleUpperCase() + str.slice(1)}</span>)}
                        </span>
                        <input style={{maxWidth: 500}} className="technicalFormInput" value={technicalForm[element]}
                               onChange={e => {
                                   setTechnicalForm((prev) => {
                                       return {
                                           ...prev,
                                           [element]: e.target.value
                                       }
                                   })
                               }}/>
                    </div>)}
                    {/*<div className="technicalDataGridItem"*/}
                    {/*     style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", marginBottom: '1rem'}}>*/}
                    {/*    <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset'}}>*/}
                    {/*        Upload Techsheet*/}
                    {/*    </span>*/}
                    {/*    <input type='file'/>*/}
                    {/*</div>*/}
                </div>
                <div style={{display: "flex", textAlign: 'center', margin: '0 auto'}}>
                    <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={submit}>Submit
                            Data
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
