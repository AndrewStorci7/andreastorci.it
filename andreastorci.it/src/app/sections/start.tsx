/**
 * Start section
 * @author Andrea Storci aka dreean
 */

import Image from "next/image"
import Icon from "../components/inc/icon"
import Link from "next/link"
import Header from "../components/header"

interface MainTitleProps {
    ref?: any,
}

export default function MainTitle({}) {

    return (
        <>
            <section className="main-title section background-gradient">
                <Header />
                <div className="flex flex-row mt-[100px]">
                    <div className="w-fit relative">
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
                        <div className="flex flex-row my-[20px]">
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
                        {/* <Image className="absolute top-[13px] left-[-337px] opacity-15" src={'/stripes-curved.svg'} alt="scrubble" height={800} width={800} /> */}
                    </div>
                    <div className="grow"></div>
                    <div className="w-full pl-[15%] relative">
                        <Image 
                            className="rounded-[6px] relative z-[2]"
                            // style={{
                            //     boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                            // }}
                            src={'/vectorial-me.svg'}
                            alt={"me prova"}
                            height={300}
                            width={300}
                            priority
                        />
                        {/* <Image className="absolute top-[-80px] right-[120px]" src={'/cubo.svg'} alt="scrubble" height={180} width={170} />
                        <Image className="absolute bottom-[80px] left-[135px]" src={'/cubo.svg'} alt="scrubble" height={130} width={130} />
                        <Image className="absolute top-[-140px] right-[-600px] opacity-15 z-[1]" src={'/stripe-curved-2.svg'} alt="scrubble" height={1500} width={1500} /> */}
                    </div>
                </div>
                <div className="absolute z-[-1] top-[-200px] w-full">
                    {/* <Image className="absolute top-[-67px] right-[300px]" src={'/linea.svg'} alt="scrubble" height={200} width={200} />
                    <Image className="absolute top-[90px] left-[900px]" src={'/stripes.svg'} alt="scrubble" height={150} width={150} /> 
                    <Image className="absolute top-[730px] left-[780px]" src={'/cubo.svg'} alt="scrubble" height={130} width={130} /> */}
                </div>
            </section>
        </>
    )
}
