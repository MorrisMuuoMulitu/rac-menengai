// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LearnerProfileSetup } from "./LearnerProfileSetup";

afterEach(cleanup);

describe("LearnerProfileSetup", () => {
  it("captures the phone and official certificate name once", () => {
    const save = vi.fn();
    render(
      <LearnerProfileSetup
        profile={{
          displayName: "Amina Wanjiru",
          phone: null,
          officialName: null,
          complete: false,
        }}
        busy={false}
        onSave={save}
      />,
    );

    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+254 700 111 222" },
    });
    fireEvent.change(screen.getByLabelText("Official name on certificate"), {
      target: { value: "Amina Wangari Mwangi" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Save learner details" }),
    );

    expect(save).toHaveBeenCalledWith(
      "+254 700 111 222",
      "Amina Wangari Mwangi",
    );
  });
});
