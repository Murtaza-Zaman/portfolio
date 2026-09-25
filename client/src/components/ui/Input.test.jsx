import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "./Input";

describe("Input Component", () => {
  it("renders with a label and allows text input", async () => {
    const user = userEvent.setup();
    render(<Input label="Full Name" placeholder="Enter your name" />);

    const input = screen.getByLabelText("Full Name");
    expect(input).toBeInTheDocument();

    await user.type(input, "Murtaza");
    expect(input).toHaveValue("Murtaza");
  });

  it("renders validation error message and sets aria-invalid", () => {
    render(<Input error="This field is required" label="Email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("This field is required");
  });

  it("renders helper text when no error is present", () => {
    render(<Input helperText="We will never share your email" label="Email" />);

    expect(screen.getByText("We will never share your email")).toBeInTheDocument();
  });
});
