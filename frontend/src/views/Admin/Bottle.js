import {useAuth0} from "@auth0/auth0-react";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getConfig} from "../../config/config";
import {Snackbar,Alert} from "@mui/material";
import axios from "axios";

const Bottle = () => {
    const {isAuthenticated} = useAuth0();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [wineryName, setWineryName] = useState('');
    const [wineName, setWineName] = useState('');
    const [filters, setFilters] = useState({});
    const [error, setError] = useState('');
    const {apiOrigin} = getConfig();
    const [messageOpen, setMessageOpen] = useState(true);

    const handleClose = () => {
        setMessageOpen(false);
    }

    const [technicalForm, setTechnicalForm] = useState({
        // "winery_name": "",
        "winery_id": "",
        "year": "",
        "wine_name": "",
        "pct_alcohol": "",
        "ta": "",
        "ph": "",
        "soils": "",
        "varietals": "",
        "clones": "",
        "clusters": "",
        "aging_process": "",
        "cases_produced": "",
    })
    

    const requiredFields = [ "winery_name", "year", "wine_name", "varietals", "clones", "clusters", "aging_process", "cases_produced"];

    /* Fetch options to populate the dropdown menu under "Advanced Search." */
    async function fetchFilters() {
        let formattedFilters = {};

        try {

            /* Fetch "Wineries" */
            let res1 = await axios(`${apiOrigin}/wineries`);
            let res2 = await axios(`${apiOrigin}/bottleNames`);
            formattedFilters.wineries = res1.data.wineries;
            formattedFilters.wineName = res2.data;
            setFilters(formattedFilters);
            console.log(formattedFilters);

        } catch (err) {
            /* Display the error. */
            setError("Error loading dropdown menu options. Please refresh.");
        }
    }

    useEffect(() => {fetchFilters()}, [])

    useEffect(() => {
        try {
            check()
        } catch (e) {
            return
        }
        setMessageOpen(false);
    }, [technicalForm])


    if (!isAuthenticated) return (<div>No access</div>)



    const check = () => {
        for(let i = 0; i < requiredFields.length; i++) {
            if (technicalForm[requiredFields[i]] === "") {
                const str = requiredFields[i];
                setError(`${str.split("_").map(str => str[0].toLocaleUpperCase() + str.slice(1)).join(" ")} is required!`);
                //setMessageOpen(true);
                throw Error()
            }
        }
    }

    async function submit_wine() {
        let formData = new FormData();
        technicalForm["winery_name"] = wineryName;
        const selectedFile = document.getElementById('upload').files[0];
        if(selectedFile === undefined) {
            setError("Please upload the tech sheet!");
            setMessageOpen(true);
            return;
        }
        formData.append("file", selectedFile);
        formData.append("technicalForm", JSON.stringify(technicalForm));
        formData.append("wine_name", JSON.stringify(wineName));
        try {
            check()
        } catch (e) {
            return;
        }

        if (type === 'add'){
            try {
                /* Perform a search; if successful, pass state & navigate to the "Search Results" page. */
                await axios.post(`${apiOrigin}/admin/add_wine`, formData, {
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
                }}
            } else {
            try {
                /* Perform a search; if successful, pass state & navigate to the "Search Results" page. */
                await axios.post(`${apiOrigin}/admin/edit_wine`, formData, {
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

    async function delete_wine() {

    }

    return <div className="winesheetPageContainer">
        <div className="winesheetPageCard">
            <div className="technicalData" style={{margin: '0 auto'}}>
                <div className="technicalDataHeader">
                    <span className="title">{type === 'add' ? 'Adding New Wine' : 'Edit Wine'}</span>
                </div>
                {type === 'edit' ?
                <div className="technicalDataGridItem" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: "space-between",
                    marginBottom: '1rem'
                }}>
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset',transform: 'translateY(10px)'}}>
                            { "wine_bottle".split('_').map(str => <span key={str}
                                                                 style={{marginRight: '.2rem'}}>{str[0].toLocaleUpperCase() + str.slice(1)}</span>)}
                        </span>
                    <div className="selectContainer" alt="Select a Winery">
                        <select className="selectDropdown technicalFormInput" name="wine" value={wineName}
                                style={{width: '34.8rem', height: '2rem', marginLeft: '8.6rem'}}
                                onChange={x => setWineName(x.target.value)}>
                            <option value="">- Select -</option>
                            {filters && filters["wineName"]?.map((value, key) => <option key={key}
                                value={value.bottle_id}>{value.year + " " + value.winery_name + " " + value.wine_name}</option>)}
                        </select>
                    </div>
                </div>
                :  <></>}
                {<div className="technicalDataGridItem" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: "space-between",
                    marginBottom: '1rem'
                }}>
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset',transform: 'translateY(10px)'}}>
                            { "winery_name".split('_').map(str => <span key={str}
                                                                 style={{marginRight: '.2rem'}}>{str[0].toLocaleUpperCase() + str.slice(1)}</span>)}
                            {requiredFields.includes("winery_name") && <span style={{color: 'red'}}>*</span>}
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
                <div style={{minWidth: 800}}>
                    {Object.keys(technicalForm).filter(i => !(i === 'winery_name' || i === 'winery_id')).map((element) => <div className="technicalDataGridItem"
                                                                      key={element} style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        marginBottom: '1rem'
                    }}>
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset'}}>
                            {element.split('_').map(str => <span key={str}
                                                                 style={{marginRight: '.2rem'}}>{str[0].toLocaleUpperCase() + str.slice(1)}</span>)}
                            {requiredFields.includes(element) && <span style={{color: 'red'}}>*</span>}
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
                         style={{
                             display: 'flex',
                             flexDirection: 'row',
                             justifyContent: "space-between",
                             marginBottom: '1rem'
                         }}>
                        <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset'}}>
                            <span>TechSheet Json</span>
                            <span style={{color: 'red'}}>*</span>
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
                                className="technicalFormInput">add from computer
                        </button>

                        <input id="upload" style={{display: 'none'}} type='file'/>
                    </div>
                </div>
                <div style={{display: "flex", textAlign: 'center', margin: '0 auto'}}>
                    <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={submit_wine}>Submit</div>
                    </div>
                    {type === 'edit' && <div className="downloadButton">
                        <div className="primaryButton darkPurple big" onClick={delete_wine}>Delete</div>
                    </div>}
                </div>
            </div>
        </div>
        <Snackbar open={messageOpen} autoHideDuration={99999999999}>
            <Alert severity="warning" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
    </div>


}

export default Bottle;
