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
        "winery_website": "",
        "winery_bio": ""
    })



    const {apiOrigin} = getConfig();

    /* Fetch options to populate the dropdown menu under "Advanced Search." */
    async function fetchFilters() {
        let formattedFilters = {};

        /* Build the "Years" dropdown menu. */
        let currentYear = new Date().getFullYear()
        formattedFilters.years = [];
        for (let i = 2015; i <= currentYear; i++) {
            formattedFilters.years.push(i);
        }

        try {
            /* Fetch "Wineries" */
            let res1 = await axios(`${apiOrigin}/listOfWineries`);
            formattedFilters.wineries = res1.data.wineries;
            try {
                /* Fetch varietals. */
                let res2 = await axios(`${apiOrigin}/varietalNames`);
                formattedFilters.varietals = res2.data.varietals;
                setFilters(formattedFilters);
            } catch (err) {
                /* Display the error. */
                setError("Error loading dropdown menu options. Please refresh.");
            }

        } catch (err) {
            /* Display the error. */
            setError("Error loading dropdown menu options. Please refresh.");
        }
    }

    useEffect(() => {
        fetchFilters();
    }, [])


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

    if (!isAuthenticated) return (<div>No access</div>)

    return <div className="winesheetPageContainer">
        <div className="winesheetPageCard">
            <div className="technicalData" style={{margin: '0 auto'}}>
                <div className="technicalDataHeader">
                    <span className="title">{type === 'add' ? 'Adding New Wine' : 'Edit Wine'}</span>
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
                        {element !== 'winery_bio' ?
                            <input style={{maxWidth: 500}} className="technicalFormInput" value={technicalForm[element]}
                                   onChange={e => {
                                       setTechnicalForm((prev) => {
                                           return {
                                               ...prev,
                                               [element]: e.target.value
                                           }
                                       })
                                   }}/> : <textarea style={{maxWidth: 520, height: '12rem', padding: '1rem'}}
                                                    className="technicalFormInput"
                                                    value={technicalForm[element]}
                                                    onChange={e => {
                                                        setTechnicalForm((prev) => {
                                                            return {
                                                                ...prev,
                                                                [element]: e.target.value
                                                            }
                                                        })
                                                    }}/>}
                    </div>)}
                    <div className="technicalDataGridItem"
                         style={{
                             display: 'flex',
                             flexDirection: 'row',
                             justifyContent: "space-between",
                             marginBottom: '1rem'
                         }}>
                            <span className="technicalDataGridProperty" style={{fontSize: '16px', lineHeight: 'unset'}}>
                            Winery Picture
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
                        <div className="primaryButton darkPurple big" onClick={submit}>Submit
                        </div>
                    </div>
                    {
                        type === 'edit' && <div className="downloadButton">
                            <div className="primaryButton darkPurple big" onClick={submit}>Delete
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>


}

export default Winery;
