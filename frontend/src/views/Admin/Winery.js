import {useAuth0} from "@auth0/auth0-react";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getConfig} from "../../config/config";
import axios from "axios";

const Winery = () => {
    const {isAuthenticated} = useAuth0();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [filters, setFilters] = useState({});
    const [error, setError] = useState('');
    const [wineryName, setWineryName] = useState('');

    const [technicalForm, setTechnicalForm] = useState({
        "winery_name": "",
        "winemaker": "",
        "address": "",
        "phone_number": "",
        "winery_url": "",

    })

    const {apiOrigin} = getConfig();

    /* Fetch options to populate the dropdown menu under "Advanced Search." */
    async function fetchFilters() {
        let formattedFilters = {};

        try {
            /* Fetch "Wineries" */
            let res1 = await axios(`${apiOrigin}/wineries`);
            formattedFilters.wineries = res1.data.wineries;

            setFilters(formattedFilters);
        } catch (err) {
            /* Display the error. */
            setError("Error loading dropdown menu options. Please refresh.");
        }
    }

    useEffect(() => {
        fetchFilters();
    }, [apiOrigin])

    async function submit() {
        let formData = new FormData();
        technicalForm["winery_name"] = wineryName;
        formData.append("technicalForm", JSON.stringify(technicalForm));
        if (type === 'add'){
            try {
                /* Perform a search; if successful, pass state & navigate to the "Search Results" page. */
                const results = await axios.post(`${apiOrigin}/admin/add_winery`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
            } catch (err) {
                if (err.response.status === 404) {
                    setError("Unfortunately, nothing matches those search criteria...");
                } else {
                    /* If the response status code isn't 200 or 404, store the status code and error message. */
                    setError("Status Code " + err.response.status + ": " + err.message + "!");
                }
        }} else {
            try {
                /* Perform a search; if successful, pass state & navigate to the "Search Results" page. */
                const results = await axios.post(`${apiOrigin}/admin/edit_winery`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
            } catch (err) {
                if (err.response.status === 404) {
                    setError("Unfortunately, nothing matches those search criteria...");
                } else {
                    /* If the response status code isn't 200 or 404, store the status code and error message. */
                    setError("Status Code " + err.response.status + ": " + err.message + "!");
                }
            }
        }
    }

    async function delete_winery() {
        technicalForm["winery_name"] = wineryName;
        console.log(JSON.stringify(technicalForm))
        try {
            const results = await axios.delete(`${apiOrigin}/admin/delete_winery`, {data: JSON.stringify(technicalForm), 
                headers: {
                    "Content-Type": "application/JSON",
                }
            });
        } catch (err) {
            if (err.response.status === 404) {
                setError("Unfortunately, nothing matches those search criteria...");
            } else {
                /* If the response status code isn't 200 or 404, store the status code and error message. */
                setError("Status Code " + err.response.status + ": " + err.message + "!");
            }
        }
    }

    if (!isAuthenticated) return (<div>No access</div>)

    return <div className="winesheetPageContainer">
        <div className="winesheetPageCard">
            <div className="technicalData" style={{margin: '0 auto'}}>
                <div className="technicalDataHeader">
                    <span className="title">{type === 'add' ? 'Adding New Winery' : 'Edit Winery'}</span>
                    {/*<span className="subtitle">this is an apply and we will verify it.</span>*/}
                </div>
                <div style={{minWidth: 800}}>
                    {type === 'edit' && <div className="technicalDataGridItem" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        marginBottom: '1rem'
                    }}> 
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset',transform: 'translateY(10px)'}}>
                            { "winery_name".split('_').map(str => <span key={str}
                                                                        style={{marginRight: '.2rem'}}>{str[0].toLocaleUpperCase() + str.slice(1)}</span>)}
                        </span>
                        <div className="selectContainer" alt="Select a Winery">
                            <select className="selectDropdown technicalFormInput" name="wine" value={wineryName}
                                    style={{width: '34.8rem', height: '2rem', marginLeft: '7.6rem'}}
                                    onChange={x => setWineryName(x.target.value)}>
                                <option value="">- Select -</option>
                                {filters && filters["wineries"]?.map((element) => <option key={element}
                                                                                          value={element}>{element}</option>)}
                            </select>
                        </div>
                    </div>}
                    {type === 'add' && <div className="technicalDataGridItemName" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        marginBottom: '1rem'
                    }}>
                    <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset',transform: 'translateY(10px)'}}>
                            { "winery_name".split('_').map(str => <span key={str}
                                                                        style={{marginRight: '.2rem'}}>{str[0].toLocaleUpperCase() + str.slice(1)}</span>)}
                        </span>
                        <input style={{maxWidth: 500}} className="technicalFormInput" devaultValue=''
                        onChange={x => setWineryName(x.target.value)}/>
                    </div>}
                    {Object.keys(technicalForm).filter(i => !(i === 'winery_name')).map((element) => 
                    <div className="technicalDataGridItem" key={element} style=
                    {{
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
                        onChange={e =>
                            {
                                setTechnicalForm((prev) => {
                                    return {...prev, [element]: e.target.value}
                                })
                            }
                        }
                        />
                    </div>)}
                </div>
                <div style={{display: "flex", textAlign: 'center', margin: '0 auto'}}>
                    <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={submit}>Submit</div>
                    </div>
                    {type === 'edit' && <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={delete_winery}>Delete</div>
                    </div>
                    }
                </div>
            </div>
        </div>
    </div>


}

export default Winery;