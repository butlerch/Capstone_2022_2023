// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import AccessoryPage from "../components/AccessoryPage";
import EditDeveloper from "../components/EditDeveloper";


// Component Description: The "Developer" page.
export default function Developer() {
    let title = "Developer Documentation";
    let subtitle = "API ENDPOINTS";

    return <>
        <AccessoryPage title={title} subtitle={subtitle}>
            <EditDeveloper/>
        </AccessoryPage>
    </>
}