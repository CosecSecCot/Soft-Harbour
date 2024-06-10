import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DownloadLinkInvalidPage() {
    return (
        <>
            <PageHeader>Download Link Invalid</PageHeader>
            <p>
                The download link has either expired or is invalid, try getting
                a new link from your orders
            </p>
            <Button asChild>
                <Link href="/orders">Get New Link</Link>
            </Button>
        </>
    );
}
