import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-image";
import type { QGDSImage } from "./qgds-image";

describe("qgds-image", () => {
  let element: QGDSImage;

  beforeEach(() => {
    element = document.createElement("qgds-image") as QGDSImage;
    element.setAttribute("alt", "Test image");
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe("Basic rendering", () => {
    it("should render the component", async () => {
      await element.updateComplete;
      expect(element).toBeTruthy();
      expect(element.shadowRoot).toBeTruthy();
    });

    it("should render an img element", async () => {
      await element.updateComplete;
      const img = element.shadowRoot?.querySelector("img");
      expect(img).toBeTruthy();
    });
  });

  describe("Image attributes", () => {
    it("should set src attribute", async () => {
      element.setAttribute("src", "test-image.jpg");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.getAttribute("src")).toBe("test-image.jpg");
      expect(element.src).toBe("test-image.jpg");
    });

    it("should set alt attribute", async () => {
      element.setAttribute("alt", "Test image description");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.getAttribute("alt")).toBe("Test image description");
      expect(element.alt).toBe("Test image description");
    });

    it("should set width attribute", async () => {
      element.setAttribute("width", "800");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.getAttribute("width")).toBe("800");
      expect(element.width).toBe(800);
    });

    it("should set height attribute", async () => {
      element.setAttribute("height", "600");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.getAttribute("height")).toBe("600");
      expect(element.height).toBe(600);
    });

    it("should have no default aspect ratio", async () => {
      await element.updateComplete;
      expect(element.aspect).toBeUndefined();
    });
  });

  describe("Aspect ratio", () => {
    it("should apply 16:9 aspect ratio", async () => {
      element.setAttribute("aspect", "16:9");
      await element.updateComplete;

      expect(element.aspect).toBe("16:9");
      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const style = img?.getAttribute("style") ?? "";
      expect(style).toContain("--ratio-w");
      expect(style).toContain("--ratio-h");
    });

    it("should apply 1:1 aspect ratio", async () => {
      element.setAttribute("aspect", "1:1");
      await element.updateComplete;

      expect(element.aspect).toBe("1:1");
      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const style = img?.getAttribute("style") ?? "";
      expect(style).toContain("--ratio-w");
      expect(style).toContain("--ratio-h");
    });

    it("should apply 4:3 aspect ratio", async () => {
      element.setAttribute("aspect", "4:3");
      await element.updateComplete;

      expect(element.aspect).toBe("4:3");
      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const style = img?.getAttribute("style") ?? "";
      expect(style).toContain("--ratio-w");
      expect(style).toContain("--ratio-h");
    });

    it("should apply 3:4 aspect ratio (vertical)", async () => {
      element.setAttribute("aspect", "3:4");
      await element.updateComplete;

      expect(element.aspect).toBe("3:4");
      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const style = img?.getAttribute("style") ?? "";
      expect(style).toContain("--ratio-w");
      expect(style).toContain("--ratio-h");
    });
  });

  describe("CSS classes", () => {
    it("should have is-horizontal class for 16:9 aspect ratio", async () => {
      element.setAttribute("aspect", "16:9");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("is-horizontal")).toBe(true);
    });

    it("should have is-horizontal class for 4:3 aspect ratio", async () => {
      element.setAttribute("aspect", "4:3");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("is-horizontal")).toBe(true);
    });

    it("should have is-vertical class for 3:4 aspect ratio", async () => {
      element.setAttribute("aspect", "3:4");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("is-vertical")).toBe(true);
    });

    it("should have is-vertical class for 2:3 aspect ratio", async () => {
      element.setAttribute("aspect", "2:3");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("is-vertical")).toBe(true);
    });
  });

  describe("Caption", () => {
    it("should not render figcaption element when caption is empty", async () => {
      await element.updateComplete;

      const caption = element.shadowRoot?.querySelector("figcaption");
      expect(caption).toBeNull();
    });

    it("should render figcaption element when caption is provided", async () => {
      element.setAttribute("caption", "This is a test caption");
      await element.updateComplete;

      const caption = element.shadowRoot?.querySelector("figcaption");
      expect(caption).toBeTruthy();
      expect(caption?.textContent).toBe("This is a test caption");
    });

    it("should render caption with HTML content", async () => {
      element.setAttribute("caption", "<strong>Bold</strong> caption text");
      await element.updateComplete;

      const caption = element.shadowRoot?.querySelector("figcaption");
      expect(caption).toBeTruthy();
      expect(caption?.innerHTML).toContain("<strong>Bold</strong>");
    });

    it("should update caption when attribute changes", async () => {
      element.setAttribute("caption", "Original caption");
      await element.updateComplete;

      let caption = element.shadowRoot?.querySelector("figcaption");
      expect(caption?.textContent).toBe("Original caption");

      element.setAttribute("caption", "Updated caption");
      await element.updateComplete;

      caption = element.shadowRoot?.querySelector("figcaption");
      expect(caption?.textContent).toBe("Updated caption");
    });
  });

  describe("Image dimensions", () => {
    it("should apply inline-size style to wrapper when width is specified", async () => {
      element.setAttribute("width", "800");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.hasAttribute("style")).toBe(true);
      const style = wrapper?.getAttribute("style") ?? "";
      expect(style).toContain("inline-size");
    });

    it("should apply height style to img when specified", async () => {
      element.setAttribute("height", "600");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const style = img?.getAttribute("style") ?? "";
      expect(style).toContain("max-block-size");
    });

    it("should apply inline-size to wrapper and max-block-size to img when both are specified", async () => {
      element.setAttribute("width", "800");
      element.setAttribute("height", "600");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.hasAttribute("style")).toBe(true);
      const wrapperStyle = wrapper?.getAttribute("style") ?? "";
      expect(wrapperStyle).toContain("inline-size");

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const imgStyle = img?.getAttribute("style") ?? "";
      expect(imgStyle).toContain("max-block-size");
    });

    it("should derive wrapper inline size from aspect ratio when height is specified", async () => {
      element.setAttribute("aspect", "2:3");
      element.setAttribute("height", "240");
      element.setAttribute("caption", "Aspect ratio: 2:3");
      await element.updateComplete;

      const figure = element.shadowRoot?.querySelector("figure.image-wrap");
      expect(figure?.hasAttribute("style")).toBe(true);

      const style = figure?.getAttribute("style") ?? "";
      expect(style).toContain("inline-size:160px");
    });

    it("should not force wrapper inline size when height is specified without aspect ratio", async () => {
      element.setAttribute("height", "240");
      element.setAttribute("caption", "Free-form image");
      await element.updateComplete;

      const figure = element.shadowRoot?.querySelector("figure.image-wrap");
      expect(figure?.hasAttribute("style")).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("should set decorative attribute and role presentation", async () => {
      element.setAttribute("decorative", "true");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.decorative).toBe(true);
      expect(img?.getAttribute("role")).toBe("presentation");
      expect(img?.getAttribute("aria-hidden")).toBe("true");
      expect(img?.getAttribute("alt")).toBe("");
    });

    it("should set aria-label attribute", async () => {
      element.setAttribute("aria-label", "Custom aria label");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.ariaLabel).toBe("Custom aria label");
      expect(img?.getAttribute("aria-label")).toBe("Custom aria label");
    });

    it("should set aria-describedby attribute", async () => {
      element.setAttribute("aria-describedby", "description-id");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.ariaDescribedby).toBe("description-id");
      expect(img?.getAttribute("aria-describedby")).toBe("description-id");
    });

    it("should generate unique caption id and link via aria-describedby", async () => {
      element.setAttribute("caption", "Test caption");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      const figcaption = element.shadowRoot?.querySelector("figcaption");
      const captionId = figcaption?.getAttribute("id");

      expect(captionId).toBeTruthy();
      expect(img?.getAttribute("aria-describedby")).toBe(captionId);
    });
  });

  describe("Performance attributes", () => {
    it("should not have loading attribute when not explicitly set", async () => {
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("loading")).toBe(false);
    });

    it("should set loading attribute when specified", async () => {
      element.setAttribute("loading", "lazy");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.loading).toBe("lazy");
      expect(img?.getAttribute("loading")).toBe("lazy");
    });

    it("should not have fetchpriority attribute when not explicitly set", async () => {
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("fetchpriority")).toBe(false);
    });

    it("should set fetchpriority attribute when specified", async () => {
      element.setAttribute("fetchpriority", "high");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.fetchpriority).toBe("high");
      expect(img?.getAttribute("fetchpriority")).toBe("high");
    });

    it("should not have decoding attribute when not explicitly set", async () => {
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("decoding")).toBe(false);
    });

    it("should set decoding attribute when specified", async () => {
      element.setAttribute("decoding", "async");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.decoding).toBe("async");
      expect(img?.getAttribute("decoding")).toBe("async");
    });

    it("should not have referrerpolicy attribute when not explicitly set", async () => {
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("referrerpolicy")).toBe(false);
    });

    it("should set referrerpolicy attribute when specified", async () => {
      element.setAttribute("referrerpolicy", "no-referrer");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.referrerpolicy).toBe("no-referrer");
      expect(img?.getAttribute("referrerpolicy")).toBe("no-referrer");
    });
  });

  describe("Alignment", () => {
    it("should not have align class when not specified", async () => {
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("align-left")).toBe(false);
      expect(wrapper?.classList.contains("align-right")).toBe(false);
    });

    it("should apply align-left class", async () => {
      element.setAttribute("align", "left");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(element.align).toBe("left");
      expect(wrapper?.classList.contains("align-left")).toBe(true);
    });

    it("should apply align-right class", async () => {
      element.setAttribute("align", "right");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(element.align).toBe("right");
      expect(wrapper?.classList.contains("align-right")).toBe(true);
    });
  });

  describe("Hotspot positioning", () => {
    it("should not have object-position style when hotspot is not set", async () => {
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      const style = img?.getAttribute("style") ?? "";
      expect(style).not.toContain("object-position");
    });

    it("should apply object-position style when hotspot is set", async () => {
      element.setAttribute("hotspot", "30, 70");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.hasAttribute("style")).toBe(true);
      const style = img?.getAttribute("style") ?? "";
      expect(element.hotspot).toBe("30, 70");
      expect(style).toContain("object-position");
    });
  });

  describe("Responsive images", () => {
    it("should set srcset attribute", async () => {
      element.setAttribute("srcset", "image-320w.jpg 320w, image-640w.jpg 640w");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.srcset).toBe("image-320w.jpg 320w, image-640w.jpg 640w");
      expect(img?.getAttribute("srcset")).toBe("image-320w.jpg 320w, image-640w.jpg 640w");
    });

    it("should set sizes attribute", async () => {
      element.setAttribute("sizes", "(max-width: 600px) 100vw, 600px");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(element.sizes).toBe("(max-width: 600px) 100vw, 600px");
      expect(img?.getAttribute("sizes")).toBe("(max-width: 600px) 100vw, 600px");
    });
  });
});
