import { 
    Card, 
    CardContent, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";

import { Button } from "./ui/button";

export const PremiumCard = () => {
    return (
        <Card className="py-4 shadow-none border-1 border-foreground/10 ring-0 gap-2">
            <CardHeader className="px-4">
                <CardTitle className="font-bold text-xl">Subscribe to Premium</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
                <p>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
            </CardContent>
            <CardFooter className="px-4">
                <Button className="rounded-full px-4 font-bold bg-sky-500 hover:bg-sky-600 hover:cursor-pointer">Subscribe</Button>
            </CardFooter>
        </Card>
    )
}