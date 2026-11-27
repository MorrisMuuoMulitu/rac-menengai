// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { VideoThumbnail } from "./VideoThumbnail";

afterEach(cleanup);

describe("VideoThumbnail", () => {
  it("loads the main preview immediately and marks it as high priority", () => {
    const { container } = render(
      <VideoThumbnail
        youtubeId="PFryy_dY0tg"
        title="What is Rotary?"
        priority
      />,
    );
    const image = container.querySelector("img");

    expect(image?.getAttribute("loading")).toBe("eager");
    expect(image?.getAttribute("fetchpriority")).toBe("high");
    expect(image?.getAttribute("src")).toContain("/hqdefault.jpg");
  });

  it("steps down to smaller thumbnail sizes before showing its fallback", () => {
    const { container } = render(
      <VideoThumbnail youtubeId="PFryy_dY0tg" title="What is Rotary?" />,
    );

    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "/mqdefault.jpg",
    );

    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "/default.jpg",
    );

    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("What is Rotary?");
  });
});
