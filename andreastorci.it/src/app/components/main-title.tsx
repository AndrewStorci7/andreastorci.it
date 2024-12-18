/**
 * Main component title
 * @author Andrea Storci aka dreean
 */

import Image from "next/image"

export default function MainTitle() {
    return (
        <div className="main-title">
            <div className="flex flex-row">
                <div className="w-fit">
                    <h2>
                        Full stack <br />
                        Developer
                    </h2>
                    <h3 className="pt-[20px]">
                        lorem ipsum
                    </h3>
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
        </div>
    )
}
