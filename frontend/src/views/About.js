// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import AccessoryPage from "../components/AccessoryPage";
import Lorem from "../test/Lorem";


// Component Description: The "About" page.
export default function About() {
    let title = "Our Company";
    let subtitle = "ABOUT US";

    return <>
        <AccessoryPage title={title} subtitle={subtitle}>
            <Lorem/>
        </AccessoryPage>
    </>
}