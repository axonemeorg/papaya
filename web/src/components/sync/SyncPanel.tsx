import { db, remoteDb } from "@/database/client";
import { Button } from "@mui/material";


export default function SyncPanel() {
    const handleSync = () => {
        db.sync(remoteDb).on('complete', () => {
            console.log('Sync complete');
        })
        .on('error', (error) => {
            console.error('Sync error', error);
        });
    }
    return (
        <Button variant="contained" onClick={() => handleSync()}>
            Sync Now
        </Button>
    );
}
