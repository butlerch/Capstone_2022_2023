import {useAuth0} from "@auth0/auth0-react";
import './Admin.css'
import {useNavigate} from "react-router-dom";
// import history from "../../utils/history";

const Admin = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth0();
    if(!isAuthenticated) return (<div>No access</div>)

    const navigateTo = (path) => {
        console.log(path)
        navigate(path);
    }

    return (<div className="admin" id="contentBlock">
        <div className="mainArea">
            <div className="adminButton" onClick={() => navigateTo('/admin/bottle?type=add')}>Add New Bottle</div>
            <div className="adminButton" onClick={() => navigateTo('/admin/bottle?type=edit')}>Edit Bottle</div>
            <div className="adminButton" onClick={() => navigateTo('/admin/winery?type=add')}>Add New winery</div>
            <div className="adminButton" onClick={() => navigateTo('/admin/winery?type=edit')}>Edit Winery</div>
        </div>
    </div>)
}


export default Admin;
