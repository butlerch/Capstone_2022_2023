// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import './AccessoryPage.css';
import './TextStyles.css'

export default function AccessoryPage({title, subtitle, children}) {

    return <div className="accessoryPageContainer">
        <div className="accessoryCard">
            <div className="accessoryHeader">
                <p><span className="title">{title !== undefined ? title : ""}</span><br/>
                    <span className="subtitle">{subtitle !== undefined ? subtitle : ""}</span></p>
            </div>
            <div className="text">
                {children !== undefined ? children : ""}
            </div>
        </div>
    </div>
}
