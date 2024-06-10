export default function DownloadPage({
    params: { downloadVerificationId },
}: {
    params: { downloadVerificationId: string };
}) {
    return (
        <div>
            <div>Download</div>
            <div>{`ID: ${downloadVerificationId}`}</div>
        </div>
    );
}
