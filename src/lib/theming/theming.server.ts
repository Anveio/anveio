import { cookies } from "next/headers";
import { Theme, ThemeCookieKey, themeSchema } from "./shared";

export const getThemeCookieValue = (
    readonlyRequestCookies: ReturnType<typeof cookies>
): Theme => {

    const themeCookieValue = readonlyRequestCookies.get(ThemeCookieKey)?.value;

    const themeCookieValueValidation = themeSchema.safeParse(themeCookieValue);

    if (!themeCookieValueValidation.success) {
        return Theme.LIGHT;
    }

    return themeCookieValueValidation.data

};


