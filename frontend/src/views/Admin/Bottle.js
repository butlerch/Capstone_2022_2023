import {useAuth0} from "@auth0/auth0-react";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";
import {getConfig} from "../../config/config";

const Bottle = () => {
    const {isAuthenticated} = useAuth0();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type')

    const [technicalForm, setTechnicalForm] = useState({
        "winery_name": "",
        "winery_id": "",
        "year": "",
        "wine_name": "",
        "pct_alcohol": "",
        "TA": "",
        "ph": "",
        "soils": "",
        "varietal": "",
        "clones": "",
        "clusters": "",
        "aging_process": "",
        "cases_produced": "",
    })

    if (!isAuthenticated) return (<div>No access</div>)


    const {apiOrigin} = getConfig();


    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await axios.get(`${apiOrigin}/techsheets/${bottle_id}`);
    //         setTechnicalForm(res.data)
    //
    //     }
    //
    //     fetchData()
    // }, [apiOrigin, bottle_id])

    const submit = () => {

    }
    return <div className="winesheetPageContainer">
        <div className="winesheetPageCard">
            <div className="technicalData" style={{margin: '0 auto'}}>
                <div className="technicalDataHeader">
                    <span className="title">{type === 'add' ? 'Adding New Wine' : 'Edit Wine'}</span>
                    {/*<span className="subtitle">this is an apply and we will verify it.</span>*/}
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
                    <div className="technicalDataGridItem"
                         style={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", marginBottom: '1rem'}}>
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset'}}>
                            TechSheet Json
                        </span>
                        <button style={{
                            maxWidth: 555,
                            height: "2rem",
                            color: '#290b5b',
                            fontWeight: 'bold',
                            fontSize: '20px'
                        }}
                                onClick={() => {
                                    document.getElementById('upload').click()
                                }}
                                className="technicalFormInput">add from computer</button>

                        <input id="upload" style={{display: 'none'}} type='file'/>
                    </div>
                </div>
                <div style={{display: "flex", textAlign: 'center', margin: '0 auto'}}>
                    <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={submit}>Submit
                        </div>
                    </div>
                    { type === 'edit' && <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={submit}>Delete</div></div>}
                </div>
            </div>
        </div>
    </div>


}

export default Bottle;
