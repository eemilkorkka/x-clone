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
            <CardHeader>
                <CardTitle className="font-bold text-xl">Subscribe to Premium</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
            </CardContent>
            <CardFooter>
                <Button className="rounded-full px-4 font-bold bg-sky-500 hover:bg-sky-600 hover:cursor-pointer">Subscribe</Button>
            </CardFooter>
        </Card>
    )
}