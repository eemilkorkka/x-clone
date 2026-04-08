import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import React from "react";

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

const rightSideBarLinks = [
    "Terms of Service",
    "Privacy Policy",
    "Cookie Policy",
    "Ads info",
    "© 2025 X Corp."
];

export const Footer = ({ isRightSideBar, styles }: { isRightSideBar?: boolean, styles?: string }) => {

    const displayFooterItems = (link: string) => {
        return (
            <div className="flex">
                <p className="text-xs text-zinc-500 mx-2 hover:underline cursor-pointer">
                    {link}
                </p>
                <Separator orientation="vertical" className="bg-zinc-500" />
            </div>
        )
    }

    return (
        <footer className={cn("p-4 mt-auto flex flex-wrap justify-center", styles)}>
            {!isRightSideBar ? (
                footerLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        {displayFooterItems(link)}
                    </React.Fragment>
                ))
            ) : (
                rightSideBarLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        {displayFooterItems(link)}
                    </React.Fragment>
                ))
            )}
        </footer>
    )
}