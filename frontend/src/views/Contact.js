// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import AccessoryPage from "../components/AccessoryPage";
import Lorem from "../test/Lorem";


// Component Description: The "Contact" page.
export default function Contact() {
    let title = "Stay in Touch";
    let subtitle = "CONTACT US";

    return <>
        <AccessoryPage title={title} subtitle={subtitle}>
            <Lorem/>
        </AccessoryPage>
    </>
}