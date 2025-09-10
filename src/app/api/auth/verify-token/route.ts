import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("rasmastoken")?.value; // گرفتن کوکی با نام rasatoken

    if (!token) {
        return Response.json({ verify: false });
    }

    const payload = await decrypt(token);

    if (!payload) {
        return Response.json({ verify: false });
    }

    return Response.json({ verify: true, payload });
}
