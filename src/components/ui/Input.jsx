import React from "react";

export const Input = ({ placeholder, required, type, name, value }) => {
    // If type is "datepicker", render a hidden input for form submission
    if (type === "date") {
        return (
            <input
                id="datepicker"
                type="text"
                placeholder={placeholder}
                name={name}
                required={required}
                value={value ? value.toISOString().split("T")[0] : ""}
            />
        );
    }

    // Normal input
    return (
        <input
            className="bg-white px-4 py-3 rounded-md w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            required={required}
            placeholder={placeholder}
            type={type}
            name={name}
            value={value}
            onChange={() => {}} // optional, can be controlled externally
        />
    );
};
