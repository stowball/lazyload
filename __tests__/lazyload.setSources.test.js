import {setSources, setSourcesForPicture} from "../src/lazyLoad.setSources";

const lazyloadSettings = {
    data_src: "src",
    data_srcset: "srcset"
};

expect.extend({
    toHaveAttributeValue: (element, attributeName, valueToVerify) => {
        const actualValue = element.getAttribute(attributeName);
        const pass = actualValue === valueToVerify;
        return pass ? {
            message: () => `${element.tagName} has attribute "${attributeName}" set to "${valueToVerify}"`,
            pass: true
        } : {
            message: () => `expected ${element.tagName} to have attribute "${attributeName}" set to "${valueToVerify}", received "${actualValue}"`,
            pass: false
        }
    }
});

test("setSources is defined", () => {
    expect(typeof setSources).toBe("function");
});

describe("setSources for image", () => {
    let img;
    let img1 = "http://placehold.it/1x1";
    let img200 = "http://placehold.it/200x200";
    let img400 = "http://placehold.it/400x400";

    beforeEach(() => {
        // Parent is a div
        let div = document.createElement("div");
        div.appendChild(img = document.createElement("img"));
    });

    test("...with initially empty src and srcset", () => {
        img.dataset = {
            "src": img200,
            "srcset": img400
        };
        setSources(img, lazyloadSettings);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });

    test("...with initial values in src and srcset", () => {
        img.dataset = {
            "src": img200,
            "srcset": img400
        };
        img.setAttribute("src", img1);
        img.setAttribute("srcset", img1);
        setSources(img, lazyloadSettings);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });
    test("...with initial values in src and srcset and empty data-*", () => {
        img.dataset = {
            "src": "",
            "srcset": ""
        };
        img.setAttribute("src", img200);
        img.setAttribute("srcset", img400);
        setSources(img, lazyloadSettings);
        expect(img).toHaveAttributeValue("src", img200);
        expect(img).toHaveAttributeValue("srcset", img400);
    });
});

describe("setSources for iframe", () => {
    let iframe;
    let srcToLoad = "http://www.google.it";
    let preloadedSrc = srcToLoad + "/doodle";

    beforeEach(() => {
        iframe = document.createElement("iframe");
    });
    test("...with initially empty src", () => {
        iframe.dataset = {
            "src": srcToLoad
        };
        setSources(iframe, lazyloadSettings);
        expect(iframe).toHaveAttributeValue("src", srcToLoad);
    });
    test("...with initial value in src", () => {
        iframe.dataset = {
            "src": srcToLoad
        };
        iframe.setAttribute("src", preloadedSrc);
        setSources(iframe, lazyloadSettings);
        expect(iframe).toHaveAttributeValue("src", srcToLoad);
    });
    test("...with initial value in src and empty data-src", () => {
        iframe.dataset = {
            "src": ""
        };
        iframe.setAttribute("src", preloadedSrc);
        setSources(iframe, lazyloadSettings);
        expect(iframe).toHaveAttributeValue("src", preloadedSrc);
    });
});

describe("setSources for background image", () => {
    let element;
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";

    beforeEach(() => {
        element = document.createElement("div");
    });

    test("...with initially empty style attribute", () => {
        element.dataset = {
            "src": img200
        };
        setSources(element, lazyloadSettings);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(element.style.backgroundImage).toBe(`url(${img200})`);
    });
    test("...with initially present style attribute", () => {
        element.dataset = {
            "src": img100
        };
        element.style = {
            padding: "1px"
        };
        setSources(element, lazyloadSettings);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(element.style.backgroundImage).toBe(`url(${img100})`);
    });
    test("...with initially present style and background", () => {
        element.dataset = {
            "src": img200
        };
        element.style = {
            padding: "1px",
            backgroundImage: "url(" + img100 + ")"
        };
        setSources(element, lazyloadSettings);
        // Test cheating: bug in JsDOM doesn't return the url("") with quotes inside
        expect(element.style.backgroundImage).toBe(`url(${img200})`);
    });
});

describe("setSourcesForPicture", () => {
    let picture, source1, source2, img;
    let img1 = "http://placehold.it/1x1";
    let img100 = "http://placehold.it/100x100";
    let img200 = "http://placehold.it/200x200";
    let img400 = "http://placehold.it/400x400";
    
    beforeEach(() => {
        // Parent is a picture
        picture = document.createElement("picture");
        picture.appendChild(source1 = document.createElement("source"));
        picture.appendChild(source2 = document.createElement("source"));
        picture.appendChild(img = document.createElement("img"));
    });
    
    test("...with initially empty srcset", () => {
        source1.dataset = {"srcset": img200};
        source2.dataset = {"srcset": img400};
        setSourcesForPicture(img, lazyloadSettings);
        expect(source1).toHaveAttributeValue("srcset", img200);
        expect(source2).toHaveAttributeValue("srcset", img400);
    });

    test("...with initial value in srcset", () => {
        source1.dataset = {"srcset": img200};
        source2.dataset = {"srcset": img400};
        source1.setAttribute("srcset", img1);
        source2.setAttribute("srcset", img1);
        setSourcesForPicture(img, lazyloadSettings);
        expect(source1).toHaveAttributeValue("srcset", img200);
        expect(source2).toHaveAttributeValue("srcset", img400);
    });

    test("...with initial value in srcset and empty data-srcset", () => {
        source1.dataset = {"srcset": ""};
        source2.dataset = {"srcset": ""};
        source1.setAttribute("srcset", img200);
        source2.setAttribute("srcset", img400);
        setSourcesForPicture(img, lazyloadSettings);
        expect(source1).toHaveAttributeValue("srcset", img200);
        expect(source2).toHaveAttributeValue("srcset", img400);
    });
});