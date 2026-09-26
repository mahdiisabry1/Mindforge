type AppParamOptions = {
    defaultValue?: string;
    removeFromUrl?: boolean;
};

const isServer = typeof window === "undefined";

const toSnakeCase = (value: string): string =>
    value.replace(/([A-Z])/g, "_$1").toLowerCase();

const getAppParamValue = (
    paramName: string,
    { defaultValue, removeFromUrl = false }: AppParamOptions = {},
): string | null => {
    if (isServer) {
        return defaultValue ?? null;
    }

    const storageKey = `base44_${toSnakeCase(paramName)}`;
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get(paramName);

    if (removeFromUrl) {
        urlParams.delete(paramName);
        const newUrl = `${window.location.pathname}${
            urlParams.toString() ? `?${urlParams.toString()}` : ""
        }${window.location.hash}`;
        window.history.replaceState({}, document.title, newUrl);
    }

    if (searchParam) {
        window.localStorage.setItem(storageKey, searchParam);
        return searchParam;
    }

    if (defaultValue) {
        window.localStorage.setItem(storageKey, defaultValue);
        return defaultValue;
    }

    return window.localStorage.getItem(storageKey);
};

const getAppParams = () => {
    if (!isServer && getAppParamValue("clear_access_token") === "true") {
        window.localStorage.removeItem("base44_access_token");
        window.localStorage.removeItem("token");
    }

    return {
        appId: getAppParamValue("app_id", {
            defaultValue: process.env.NEXT_PUBLIC_BASE44_APP_ID,
        }),
        token: getAppParamValue("access_token", { removeFromUrl: true }),
        fromUrl: getAppParamValue("from_url", {
            defaultValue: isServer ? undefined : window.location.href,
        }),
        functionsVersion: getAppParamValue("functions_version", {
            defaultValue: process.env.NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION,
        }),
        appBaseUrl: getAppParamValue("app_base_url", {
            defaultValue: process.env.NEXT_PUBLIC_BASE44_APP_BASE_URL,
        }),
    };
};

export const appParams = getAppParams();
