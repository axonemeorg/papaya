import { db } from "@/database/client";
import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";


export default function MigratePage() {
    const [data, setData] = useState<string | null>(null);

    const handleSubmit = () => {
        const jsonData = JSON.parse(data!);
        const records = jsonData.map((record: any) => {
            return {
                ...record,
                _id: crypto.randomUUID(),
            }
        })
        db.bulkDocs(records);

        setData("Done")
    }

    return (
        <Stack>
            <TextField
                label="Enter your JSON data"
                multiline
                rows={10}
                variant="outlined"
                fullWidth
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
            >
                Migrate
            </Button>
        </Stack>
    );
}