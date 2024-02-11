let imageErrorSrc: string | null = null;

const MutationObserver = window.MutationObserver || (window as any).WebKitMutationObserver;

const observer = new MutationObserver((mutations: MutationRecord[]) => {
    for (let i in mutations) {
        const mutation = mutations[i];
        if (mutation.target != null && mutation.target instanceof Image) {
            if (mutation.attributeName == "src" && mutation.target.src == imageErrorSrc)
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
        e.target.style.display = "block";
        return;
    }

    e.target.src = imageErrorSrc;
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

        const spinner = document.createElement("div");
        spinner.classList.add("spinner");
        spinner.style.width = size + "px";
        spinner.style.height = size + "px";
        (image as any).spinner = spinner;
        parentElement.insertBefore(spinner, image);

        image.addEventListener("load", imageLoaded);
		image.addEventListener("error", imageError);
    })
}

export function ImageLoader(errorUrl: string | null = null): void {
    imageErrorSrc = errorUrl;

    observer.observe(document, {
        subtree: true,
        attributes: true
    });

    checkImages();
}