import HeaderLayout from "@/components/layout/DefaultHeaderLayout";
import Index from "../pages/Index";
import BarcodeGenerator from "../pages/BarcodeGenerator";

const publicRoutes = {
    element: <HeaderLayout />,
    children: [
        { path: "/", element: <Index /> },
        { path: "/barcode-generator", element: <BarcodeGenerator /> },
    ],
};

export default publicRoutes;
