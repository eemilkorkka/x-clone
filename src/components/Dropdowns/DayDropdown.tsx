import formDataType from "@/types/formDataType";
import { Dispatch, SetStateAction } from "react";

interface DayDropdownProps {
    style?: string;
    setDayDropdownVisible: Dispatch<SetStateAction<boolean>>;
    setFormData: Dispatch<SetStateAction<formDataType>>;
}

const DayDropdown = ({ style, setDayDropdownVisible, setFormData }: DayDropdownProps) => {
    const days = Array.from({length: 31}, (_, i) => i + 1);

    const handleDayClick = (day: string) => {
        setDayDropdownVisible(false);
        setFormData((prevFormData) => ({
            ...prevFormData,
            birthDateDay: day
        }));
    }

    return (
        <div className={`flex flex-col absolute w-[100px] max-h-[400px] ${style} 
            items-start bg-black border border-gray z-10 rounded-lg overflow-y-auto`}>
            {days.map((day) => {
                return (
                    <button
                        key={day} 
                        type="button" 
                        className="w-full px-2 text-left hover:bg-blue-300 hover:text-gray"
                        onClick={() => handleDayClick(day.toString())}
                    >{day}
                    </button>
                )
            })}
        </div>
    );
}

export default DayDropdown;