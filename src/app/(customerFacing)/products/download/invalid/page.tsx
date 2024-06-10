import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DownloadLinkInvalidPage() {
    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
            <h1 className="text-6xl font-bold">Invalid Download Link</h1>
            <p className="text-muted-foreground">
                The download link has expired or does not exist, get a new link
                by clicking the button below
            </p>
            <div className="mt-8">
                <Button asChild>
                    <div className="flex items-center gap-2">
                        <Link href="/orders">Get New Link</Link>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </Button>
            </div>
        </div>
    );
}
