"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

const options = {
    title: "Demo Title",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Clear",
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
        background: "bg-gray-700 dark:bg-gray-800",
        todayBtn: "",
        clearBtn: "",
        icons: "",
        text: "",
        disabledText: "bg-red-500",
        input: "",
        inputIcon: "",
        selected: "",
    },
    icons: {
        // () => ReactElement | JSX.Element
        prev: () => <span>Previous</span>,
        next: () => <span>Next</span>,
    },
    datepickerClassNames: "top-12",
    defaultDate: new Date("2022-01-01"),
    language: "en",
    disabledDates: [],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
        day: "numeric",
        month: "long",
        year: "numeric"
    }
}


export const SearchForm = () => {
    const [show, setShow] = useState(false);

    const handleChange = (selectedDate) => {
        console.log(selectedDate);
    };

    const handleClose = (state) => {
        setShow(state);
    };

    return (
        <div className="flex flex-col items-center bg-gray-300 w-full h-full py-5 px-5 rounded-xl">
            <form
                onSubmit={e => e.preventDefault()}
                className="flex flex-col items-center justify-center w-full h-fit gap-y-5"
            >
                <div className="flex w-full items-center">
                    <Input
                        placeHolder="Reisemål"
                        required={true}
                        type="text"
                        name="destination"
                    />
                </div>

                <div className="flex w-full items-center gap-x-3">

                    <Input
                        placeHolder="Antall reisende"
                        required={true}
                        type="number"
                        name="travelers"
                    />
                    <Button type="submit">Søk</Button>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;
