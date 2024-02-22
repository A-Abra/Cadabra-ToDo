import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        // <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <SignIn />
        </div>
    );
}