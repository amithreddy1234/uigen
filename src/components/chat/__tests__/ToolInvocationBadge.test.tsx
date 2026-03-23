import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, any>,
  state: "call" | "partial-call" | "result" = "result"
) {
  return { toolName, args, state };
}

// str_replace_editor labels
test("shows 'Creating file' for str_replace_editor create", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/components/Card.jsx" })} />);
  expect(screen.getByText("Creating file Card.jsx")).toBeDefined();
});

test("shows 'Editing file' for str_replace_editor str_replace", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/App.jsx" })} />);
  expect(screen.getByText("Editing file App.jsx")).toBeDefined();
});

test("shows 'Editing file' for str_replace_editor insert", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/App.jsx" })} />);
  expect(screen.getByText("Editing file App.jsx")).toBeDefined();
});

test("shows 'Viewing file' for str_replace_editor view", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/App.jsx" })} />);
  expect(screen.getByText("Viewing file App.jsx")).toBeDefined();
});

test("shows 'Undoing edit in' for str_replace_editor undo_edit", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })} />);
  expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
});

// file_manager labels
test("shows 'Renaming' for file_manager rename", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/components/Card.jsx", new_path: "/components/NewCard.jsx" })} />);
  expect(screen.getByText("Renaming Card.jsx → NewCard.jsx")).toBeDefined();
});

test("shows 'Deleting file' for file_manager delete", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/components/Card.jsx" })} />);
  expect(screen.getByText("Deleting file Card.jsx")).toBeDefined();
});

// Fallback
test("shows 'Running <toolName>' for unknown tool", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("unknown_tool", {})} />);
  expect(screen.getByText("Running unknown_tool")).toBeDefined();
});

// State: done → green dot, no spinner
test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result")} />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

// State: in-progress → spinner, no green dot
test("shows spinner when state is call", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "call")} />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows spinner when state is partial-call", () => {
  const { container } = render(
    <ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "partial-call")} />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
