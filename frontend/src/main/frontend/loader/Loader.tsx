import React from "react";

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="
            animate-spin inline-block w-8 h-8 rounded-full border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent text-blue-500"
            role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loader;