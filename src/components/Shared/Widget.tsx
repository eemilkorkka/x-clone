"use server";
interface WidgetProps {
    title: string;
    children: React.ReactNode;
}

const Widget = ({ title, children }: WidgetProps) => {
    return (
        <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden w-85">
            <span className="font-extrabold text-xl p-3">{title}</span>
            {children}
        </div>
    );
}

export default Widget;  