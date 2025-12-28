import { Separator } from "./ui/separator";

const footerLinks = [
    "About",
    "Download the X app",
    "Grok",
    "Help Center",
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "Accessibility",
    "Ads info",
    "Blog",
    "Careers",
    "Brand Resources",
    "Advertising",
    "Marketing",
    "X for Business",
    "Developers",
    "News",
    "Settings",
    "© 2025 X Corp."
];

export const Footer = () => {
    return (
        <footer className="p-4 mt-auto flex flex-wrap justify-center">
            {footerLinks.map((link, index) => (
                <div className="flex" key={index}>
                    <p key={index} className="text-xs text-zinc-500 mx-2 hover:underline cursor-pointer">
                        {link}
                    </p>
                    <Separator orientation="vertical" className="bg-zinc-500" />
                </div>
            ))}
        </footer>
    )
}