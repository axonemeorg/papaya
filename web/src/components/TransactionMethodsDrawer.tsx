

export default function TransactionMethodsDrawer() {
    return (
        <Drawer anchor='right' open={methodsDrawerOpen} onClose={() => setMethodsDrawerOpen(false)}>
            <Box py={5} px={3}>
                <Typography variant='h5'>Transaction Methods</Typography>
            </Box>
            <Divider />
            <ManageTransactionMethods />
        </Drawer>
    )
}
