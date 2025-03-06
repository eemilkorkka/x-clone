import formDataType from "@/types/formDataType";
import { Dispatch, SetStateAction } from "react";

interface YearDropdownProps {
    style?: string;
    setFormData: Dispatch<SetStateAction<formDataType>>;
    setYearDropdownVisible: Dispatch<SetStateAction<boolean>>;
}

const YearDropdown = ({ style, setFormData, setYearDropdownVisible }: YearDropdownProps) => {

    const years = Array.from({ length: 81 }, (_, i) => new Date().getFullYear() - i);

    const handleYearClick = (year: string) => {
        setYearDropdownVisible(false);
        setFormData((prevFormData) => ({
            ...prevFormData,
            birthDateYear: year
        }));
    }

    return (
        <div className={`flex flex-col absolute w-[100px] max-h-[400px] ${style} 
            items-start bg-black border border-gray z-10 rounded-lg overflow-y-auto`}>
            {years.map((year) => {
                return (
                    <button
                        key={year} 
                        type="button" 
                        className="w-full px-2 text-left hover:bg-blue-300 hover:text-gray"
                        onClick={() => handleYearClick(year.toString())}
                    >{year}
                    </button>
                );
            })}
        </div>
    );
}

export default YearDropdown;