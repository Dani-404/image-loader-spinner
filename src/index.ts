let imageErrorSrc: string | null = null,
    firstInit = true,
    imageDefaultSize = 100;

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
    e.target.parentElement.removeChild(e.target.spinnerContainer);
    e.target.spinnerContainer = null;
    e.target.removeAttribute("loading");
    e.target.removeAttribute("spinner");

    if(e.target.displayAfterLoad) {
        const fadeIn = e.target.getAttribute("fadein");

        if(fadeIn != null && fadeIn == "true") {
            let maxOpacity = e.target.style.opacity == "" ? 1 : parseFloat(e.target.style.opacity);
            if(isNaN(maxOpacity))
                maxOpacity = 1;

            e.target.style.opacity = 0;
            e.target.style.display = "block";

            const element = e.target;
            const interval = window.setInterval(() => {
                if(parseFloat(element.style.opacity) >= maxOpacity)
                  return window.clearInterval(interval);
                
               const opacityImage = parseFloat(element.style.opacity);
               element.style.opacity = opacityImage + 0.05;

                if(parseFloat(element.style.opacity) > maxOpacity)
                    element.style.opacity = maxOpacity;
            }, 1000/20)
        }
        else
            e.target.style.display = "block";
    }
}

function imageError(e: any): void {
    if (imageErrorSrc == null || e.target.src == imageErrorSrc) {
        e.target.removeEventListener("load", imageLoaded);
        e.target.removeEventListener("error", imageError);
        e.target.parentElement.removeChild(e.target.spinnerContainer);
        e.target.spinnerContainer = null;
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
        const spinnerAttribute = image.getAttribute("spinner");
        const parentElement = image.parentElement;
        if (spinnerAttribute == null || spinnerAttribute != "true" || image.getAttribute("loading") != null || parentElement == null)
            return;

        image.setAttribute("loading", "true");

        const size = image.getAttribute("size"),
            widthSize = image.getAttribute("wsize"),
            heightSize = image.getAttribute("hsize");

        let spinner_container_size = {width: imageDefaultSize, height: imageDefaultSize};
        let defaultUnit = { width: "px", height: "px"};

        if(size != null && !isNaN(parseInt(size))) {
            spinner_container_size = {width: parseInt(size), height: parseInt(size)};
            defaultUnit = {width: getUnit(size), height: getUnit(size)}
        }

        if(widthSize != null && !isNaN(parseInt(widthSize))) {
            spinner_container_size = {width: parseInt(widthSize), height: spinner_container_size.height}
            defaultUnit = {width: getUnit(widthSize), height: defaultUnit.height}
        }

        if(heightSize != null && !isNaN(parseInt(heightSize))) {
            spinner_container_size = {width: spinner_container_size.width, height: parseInt(heightSize)}
            defaultUnit = {width: defaultUnit.width, height: getUnit(heightSize)}
        }

        const spinner_container = document.createElement("div");
        spinner_container.classList.add("spinner_container");
        spinner_container.style.width = spinner_container_size.width + defaultUnit.width;
        spinner_container.style.height = spinner_container_size.height + defaultUnit.height;

        const spinner = document.createElement("div");
        spinner.classList.add("spinner");
        spinner_container.appendChild(spinner);

        if(image.style.display == "none")
            (image as any).displayAfterLoad = false;
        else {
            image.style.display = "none";
            (image as any).displayAfterLoad = true;
        }

        (image as any).spinnerContainer = spinner_container;
        parentElement.insertBefore(spinner_container, image);

        let spinner_size = {width: spinner_container.clientWidth/2, height: spinner_container.clientHeight/2};
        if(spinner_size.width > spinner_size.height)
            spinner_size = {width: spinner_container.clientHeight/2, height: spinner_container.clientHeight/2}
        else
            spinner_size = {width: spinner_container.clientWidth/2, height: spinner_container.clientWidth/2}

        spinner.style.width = spinner_size.width + "px";
        spinner.style.height = spinner_size.height + "px"; 

        image.addEventListener("load", imageLoaded);
		image.addEventListener("error", imageError);

        if(firstInit && isLocalImage(image.src))
            image.src = image.src;
    })

    if(firstInit)
        firstInit = false;
}

function getUnit(value: string) {
    if(value.endsWith("%"))
        return "%";
    else if(value.endsWith("vh"))
        return "vh";
    else if(value.endsWith("vw"))
        return "vw";
    else
        return "px"
}

function isLocalImage(src: string): boolean {
    if(src.startsWith(`http://${window.location.hostname}/`) || src.startsWith(`https://${window.location.hostname}/`))
        return true;

    if(src.startsWith("http://") || src.startsWith("https://"))
        return false;

    return true;
}

export function ImageLoader(errorUrl: string | null = null, defaultSize: number = imageDefaultSize): void {
    imageDefaultSize = defaultSize;
    imageErrorSrc = errorUrl;

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true
    });

    checkImages();
}