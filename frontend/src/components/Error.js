// State Management & Authentication
// -none-

// Routing & Paths
// -none-

// Style & Components
import AccessoryPage from "./AccessoryPage";

function Error(error) {

    if (error.message === undefined) {
        return <AccessoryPage title="Error">Oops... something went wrong!</AccessoryPage>
    } else {
        return <AccessoryPage title="Error">Oops... {error.message}</AccessoryPage>
    }
}

export default Error;