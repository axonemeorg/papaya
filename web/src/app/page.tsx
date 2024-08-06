import { redirect } from "next/navigation"

export default function() {

    redirect('/journal');

    return (
        <div>Hello world</div>
    )
}
