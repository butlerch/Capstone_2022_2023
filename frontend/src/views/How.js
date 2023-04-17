// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import AccessoryPage from "../components/AccessoryPage";
import EditHow from "../test/EditHow";


// Component Description: The "How to use this site" page.
export default function Howtousethissite() {
    let title = "How to Use This Site Documentation";
    let subtitle = "API ENDPOINTS";

    return <>
        <AccessoryPage title={title} subtitle={subtitle}>
            <EditHow />
        </AccessoryPage>
    </>
}
