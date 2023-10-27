import Link from "next/link"

export default function Error({message}) {
    return (
        <div className="errorBox">
            <h2>Error!</h2>
            <p>
                {message}<br></br>
                Report on <Link href="https://discord.com/invite/HQSnKGf">Discord</Link> or by <Link href="mailto:crazycowmm@gmail.com">Email</Link>
            </p>
        </div>
    )
}