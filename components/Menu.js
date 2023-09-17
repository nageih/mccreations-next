'use client'

import Link from "next/link";

export default function Menu({selectedPage}) {

    return (
        <>
            <div id='login'></div>
            <nav className="mainNav">
                <ul className="navList">
                    <li className="navItem">
                        <p className="navBrand">MCCreations</p>
                    </li>
                    <li className="navItem">
                        <Link className={(selectedPage == 'home') ? "navLink navLinkSelected" : "navLink"} href="/">Home</Link>
                    </li>
                    <li className="navItem">
                        <Link className={(selectedPage == 'maps') ? "navLink navLinkSelected" : "navLink"} href="/maps">Maps</Link>
                    </li>
    <li className="navItem">
                        <a className="navLink" href="/resourcepacks">Resourcepacks</a>
                    </li>
                </ul>
                <ul className='actionList'>
                    <li className='navItem'>
                        <Link href='/submit'>
                            <button className='navButton'>Submit</button>
                        </Link>
                    </li>
                    <li className='navItem'>
                        <Link href='/signup'>
                            <button className='navButton'>Log In</button>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}
