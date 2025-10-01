import React from "react";

export const Section = (props) => {
    return (
        <section className="flex flex-col items-center bg-white w-full py-25 px-38 rounded-xl shadow gap-y-8">
            {props.children}
        </section>
    )
}