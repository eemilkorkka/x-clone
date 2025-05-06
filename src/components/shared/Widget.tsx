interface WidgetProps {
    title: string;
    children: React.ReactNode;
}

const Widget = async ({ title, children }: WidgetProps) => {
    return (
        <div className="border border-gray-200 rounded-xl pt-2 overflow-hidden">
            <span className="font-extrabold text-xl p-4">{title}</span>
            {children}
        </div>
    );
}

export default Widget;  