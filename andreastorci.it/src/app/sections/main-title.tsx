/**
 * Main component title
 * @author Andrea Storci aka dreean
 */

import Image from "next/image"
import Icon from "../components/inc/icon"
import Link from "next/link"

export default function MainTitle() {
    return (
        <section className="main-title">
            <div className="flex flex-row">
                <div className="w-fit">
                    <div>
                        <h2>
                            Full stack <br />
                            Developer
                        </h2>
                        <h3 className="pt-[20px]">
                            I am a university student at the University of Parma, balancing my studies with my role as a full-stack developer. 
                            Passionate about <span>learning</span> and <span>artificial intelligence</span>, I combine academic knowledge with practical experience to grow as a developer and problem-solver, aiming to create impactful solutions.
                        </h3>
                    </div>
                    <div className="flex flex-row mt-[20px]">
                        <div className="current current-study">
                            <h5>
                                <Icon useFor="dev" height={30} width={30} />
                                Currently working at <Link className="link" href={"https://www.oppimittinetworking.com"} >Oppimittinetworking.com</Link>
                            </h5>
                        </div>
                        <div className="current current-work">
                            <h5>
                                <Icon useFor="edu" height={30} width={30} />
                                Currently studying at <br /><Link className="link" href={"https://www.unipr.it"} >University of Parma</Link>
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="grow"></div>
                <div className="w-[400px]">
                    <Image 
                        className="rounded-[6px]"
                        style={{
                            boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                        }}
                        src={'/me-prova.jpg'}
                        alt={"me prova"}
                        height={200}
                        width={300}
                        priority
                    />
                </div>
            </div>
        </section>
    )
}
