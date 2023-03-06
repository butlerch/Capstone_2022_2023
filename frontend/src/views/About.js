// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import AccessoryPage from "../components/AccessoryPage";
import EditAbout from "../components/EditAbout";


// Component Description: The "Contact" page.
export default function About() {
    let title = "Stay in Touch";
    let subtitle = "About";

    return <>
        <AccessoryPage title={title} subtitle={subtitle}>
            <EditAbout/>
        </AccessoryPage>
    </>
}