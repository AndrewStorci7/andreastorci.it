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

export {
    smoothScroll
}