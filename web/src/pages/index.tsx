import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
    return {
        redirect: {
            destination: '/journal',
            permanent: false, // If true, returns a 308 permanent
        },
    };
}

export default function Index() {
    return null;
}