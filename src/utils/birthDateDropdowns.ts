import Dropdown from "@/types/Dropdown";

export const months: string[] = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

export const dropdownFields: Dropdown[] = [
    {
        name: "birthDateMonth",
        data: months,
        label: "Month",
        style: "flex-1 sm:flex-2"
    },
    {
        name: "birthDateDay",
        data: Array.from({length: 31}, (_, i) => i + 1).map(String),
        label: "Day",
        style: "flex-1 sm:flex-1"
    },
    {
        name: "birthDateYear",
        data: Array.from({ length: 81 }, (_, i) => new Date().getFullYear() - i).map(String),
        label: "Year",
        style: "flex-1 sm:flex-1"
    }
];