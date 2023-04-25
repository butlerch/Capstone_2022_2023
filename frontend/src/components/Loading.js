// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import './Loading.css';
import loading from "../images/loading.svg";


// Component Description: The "Loading" page, which displays a spinning icon.
export default function Loading() {
    return <>
        <div className="loadingContainer">
            <img src={loading} className="spinner" alt="Loading"/>
        </div>
    </>
}