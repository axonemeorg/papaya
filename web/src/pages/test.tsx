import { MainLayout } from "@/layouts/main";
import { Paper } from "@mui/material";


const TestPage = () => {
    return (        
        <h1>Test Page</h1>
    )
}

TestPage.getLayout = (page: any) => {
    return <MainLayout>{page}</MainLayout>
}

export default TestPage;
