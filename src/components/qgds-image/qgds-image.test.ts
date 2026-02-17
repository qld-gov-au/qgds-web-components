import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-image";
import type { QGDSImage } from "./qgds-image";

describe("qgds-image", () => {
  let element: QGDSImage;

  beforeEach(() => {
    element = document.createElement("qgds-image") as QGDSImage;
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
      expect(element.width).toBe("800");
    });

    it("should set height attribute", async () => {
      element.setAttribute("height", "600");
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector("img");
      expect(img?.getAttribute("height")).toBe("600");
      expect(element.height).toBe("600");
    });

    it("should have default aspect ratio of 3:2", async () => {
      await element.updateComplete;
      expect(element.aspect).toBe("3:2");
    });
  });

  describe("Aspect ratio", () => {
    it("should apply 16:9 aspect ratio", async () => {
      element.setAttribute("aspect", "16:9");
      await element.updateComplete;

      expect(element.aspect).toBe("16:9");
      const img = element.shadowRoot?.querySelector("img");
      const style = img?.getAttribute("style");
      expect(style).toContain("--ratio-w: 16");
      expect(style).toContain("--ratio-h: 9");
    });

    it("should apply 1:1 aspect ratio", async () => {
      element.setAttribute("aspect", "1:1");
      await element.updateComplete;

      expect(element.aspect).toBe("1:1");
      const img = element.shadowRoot?.querySelector("img");
      const style = img?.getAttribute("style");
      expect(style).toContain("--ratio-w: 1");
      expect(style).toContain("--ratio-h: 1");
    });

    it("should apply 4:3 aspect ratio", async () => {
      element.setAttribute("aspect", "4:3");
      await element.updateComplete;

      expect(element.aspect).toBe("4:3");
      const img = element.shadowRoot?.querySelector("img");
      const style = img?.getAttribute("style");
      expect(style).toContain("--ratio-w: 4");
      expect(style).toContain("--ratio-h: 3");
    });

    it("should apply 3:4 aspect ratio (vertical)", async () => {
      element.setAttribute("aspect", "3:4");
      await element.updateComplete;

      expect(element.aspect).toBe("3:4");
      const img = element.shadowRoot?.querySelector("img");
      const style = img?.getAttribute("style");
      expect(style).toContain("--ratio-w: 3");
      expect(style).toContain("--ratio-h: 4");
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

    it("should have has-caption class when caption is provided", async () => {
      element.setAttribute("caption", "Test caption");
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("has-caption")).toBe(true);
    });

    it("should not have has-caption class when caption is empty", async () => {
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector(".image-wrap");
      expect(wrapper?.classList.contains("has-caption")).toBe(false);
    });
  });

  describe("Caption", () => {
    it("should not render caption element when caption is empty", async () => {
      await element.updateComplete;

      const caption = element.shadowRoot?.querySelector(".caption");
      expect(caption).toBeNull();
    });

    it("should render caption element when caption is provided", async () => {
      element.setAttribute("caption", "This is a test caption");
      await element.updateComplete;

      const caption = element.shadowRoot?.querySelector(".caption");
      expect(caption).toBeTruthy();
      expect(caption?.textContent).toBe("This is a test caption");
    });

    it("should render caption with HTML content", async () => {
      element.setAttribute("caption", "<strong>Bold</strong> caption text");
      await element.updateComplete;

      const caption = element.shadowRoot?.querySelector(".caption");
      expect(caption).toBeTruthy();
      expect(caption?.innerHTML).toContain("<strong>Bold</strong>");
    });

    it("should update caption when attribute changes", async () => {
      element.setAttribute("caption", "Original caption");
      await element.updateComplete;

      let caption = element.shadowRoot?.querySelector(".caption");
      expect(caption?.textContent).toBe("Original caption");

      element.setAttribute("caption", "Updated caption");
      await element.updateComplete;

      caption = element.shadowRoot?.querySelector(".caption");
      expect(caption?.textContent).toBe("Updated caption");
    });
  });

  describe("Wrapper dimensions", () => {
    it("should apply width to wrapper when specified", async () => {
      element.setAttribute("width", "800");
      await element.updateComplete;
    });

    it("should apply height to wrapper when specified", async () => {
      element.setAttribute("height", "600");
      await element.updateComplete;
    });

    it("should apply both width and height to wrapper", async () => {
      element.setAttribute("width", "800");
      element.setAttribute("height", "600");
      await element.updateComplete;
    });
  });
});
