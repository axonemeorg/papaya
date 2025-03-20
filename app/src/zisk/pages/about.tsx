export default function About() {
    return (
        <p>{process.env.NEXT_PUBLIC_COMMIT_HASH}</p>
    )
}
