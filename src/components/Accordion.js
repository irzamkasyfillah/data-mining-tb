import React, { useRef, useState } from 'react'


export const Accordion = ({ title, content }) => {
  const [active, setActive] = useState(false)
  const [height, setHeight] = useState('0px')
  const [rotate, setRotate] = useState('transform duration-700 ease')

  const contentSpace = useRef(null)

  function toggleAccordion() {
    setActive(active === false ? true : false)
    // @ts-ignore
    setHeight(active ? '0px' : `${contentSpace.current.scrollHeight}px`)
    setRotate(active ? 'transform duration-700 ease' : 'transform duration-700 ease rotate-90')
  }

  return (
    <div className="rounded overflow-hidden shadow-lg">
        <div className="px-6 pt-4">
            <div className="flex flex-col">
                <button
                    className="box-border appearance-none cursor-pointer focus:outline-none flex items-center justify-between"
                    onClick={toggleAccordion}
                >
                    <p className="font-bold text-xl mb-2 inline-block">{title}</p>
                    {/* <img
                        src={`/img/icons/chevron-up.svg`}
                        alt=">"
                        className={`${rotate} inline-block`}
                    /> */}
                </button>
            </div>
        </div>
        <div className="px-6 pb-2">
            <div
                ref={contentSpace}
                style={{ maxHeight: `${height}` }}
                className="overflow-auto transition-max-height duration-700 ease-in-out"
            >
                {/* {content} */}
            </div>
        </div>
    </div>
  )
}
