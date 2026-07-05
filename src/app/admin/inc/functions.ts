import Cookies from "js-cookie";

/**
 * Smooth Scroll
 * @param id Id of the element to scroll in
 */
const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
}

/**
 * @param cookie Name of the cookie
 */
const jsonParseCookie = (name: string | null) => {
    try {
        if (!name) throw new Error("`name` non valido");
        
        const raw = Cookies.get(name);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        throw new Error(`Errore durante il parse di un oggetto json: ${err}`)
    }
}

export {
    smoothScroll,
    // handleClick
    jsonParseCookie,
}