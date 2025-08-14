const changeFavicon = (path: string): void => {
    try {
        if (!path) throw new Error("Path della favicon non valida");

        const icon: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    
        if (icon) {
            icon.href = path;
        } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = path;
            document.head.appendChild(newLink);
        }
    } catch (err) {
        throw new Error(`Errore nel cambio del favicon: ${err}`)
    }
}

export {
    changeFavicon
}