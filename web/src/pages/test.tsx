import { MainLayout } from "@/layouts/main";
import { Paper } from "@mui/material";


const TestPage = () => {
    return (
        <Paper>
            <h1>Test Page</h1>
        </Paper>
    )
}

TestPage.getLayout = (page: any) => {
    return <MainLayout>{page}</MainLayout>
}

export default TestPage;
