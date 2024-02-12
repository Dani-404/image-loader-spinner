let imageErrorSrc: string | null = null,
    firstInit = true;

const MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver;

const observer = new MutationObserver((mutations: MutationRecord[]) => {
    for (let i in mutations) {
        const mutation = mutations[i];

        let countAddedImage: number = 0;
        for(let i in mutation.addedNodes) {
            const el = mutation.addedNodes[i];

            if(el instanceof Image)
                countAddedImage++
        }

        if (mutation.target != null && mutation.target instanceof Image || countAddedImage > 0) {
            if (mutation.attributeName == "src" && mutation.target instanceof Image && mutation.target.src == imageErrorSrc)
                return;

            checkImages();
        }
    }
});

function imageLoaded(e: any): void {
    e.target.removeEventListener("load", imageLoaded);
    e.target.removeEventListener("error", imageError);
    e.target.parentElement.removeChild(e.target.spinner);
    e.target.spinner = null;
    e.target.removeAttribute("loading");
    e.target.removeAttribute("spinner");

    if(e.target.displayAfterLoad)
        e.target.style.display = "block";
}

function imageError(e: any): void {
    if (imageErrorSrc == null || e.target.src == imageErrorSrc) {
        e.target.removeEventListener("load", imageLoaded);
        e.target.removeEventListener("error", imageError);
        e.target.parentElement.removeChild(e.target.spinner);
        e.target.spinner = null;
        e.target.removeAttribute("loading");
        e.target.removeAttribute("spinner");

        if(e.target.displayAfterLoad)
            e.target.style.display = "block";
        return;
    }

    e.target.src = imageErrorSrc;
    imageErrorSrc = e.target.src;
}

function checkImages(): void {
    document.body.querySelectorAll("img").forEach((image: HTMLImageElement) => {
        const spinnerSize = image.getAttribute("spinner");
        const parentElement = image.parentElement;

        if (spinnerSize == null || image.getAttribute("loading") != null || parentElement == null)
            return;

        image.style.display = "none";
        image.setAttribute("loading", "true");

        let size = 50;
        if (!isNaN(parseInt(spinnerSize)))
            size = parseInt(spinnerSize)

        const spinner_container = document.createElement("div");
        spinner_container.style.width = size + "px";
        spinner_container.style.height = size + "px";

        const spinner = document.createElement("div");
        spinner.classList.add("spinner");
        spinner.style.width = (size/2) + "px";
        spinner.style.height = (size/2) + "px";
        spinner_container.appendChild(spinner);

        if(image.style.display == "none")
            (image as any).displayAfterLoad = false;
        else
            (image as any).displayAfterLoad = true; 

        (image as any).spinner = spinner_container;
        parentElement.insertBefore(spinner_container, image);

        image.addEventListener("load", imageLoaded);
		image.addEventListener("error", imageError);

        if(firstInit && isLocalImage(image.src))
            image.src = image.src;
    })

    if(firstInit)
        firstInit = false;
}

function isLocalImage(src: string): boolean {
    if(src.startsWith(`http://${window.location.hostname}/`) || src.startsWith(`https://${window.location.hostname}/`))
        return true;

    if(src.startsWith("http://") || src.startsWith("https://"))
        return false;

    return true;
}

export function ImageLoader(errorUrl: string | null = null): void {
    imageErrorSrc = errorUrl;

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true
    });

    checkImages();
}