import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolInvocation: {
    toolName: string;
    args: Record<string, any>;
    state: "call" | "partial-call" | "result";
    result?: any;
  };
}

function getLabel(toolName: string, args: Record<string, any>): string {
  const filename = args.path ? args.path.split("/").filter(Boolean).pop() ?? args.path : "";

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating file ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing file ${filename}`;
      case "view":
        return `Viewing file ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": {
        const newFilename = args.new_path ? args.new_path.split("/").filter(Boolean).pop() ?? args.new_path : "";
        return `Renaming ${filename} → ${newFilename}`;
      }
      case "delete":
        return `Deleting file ${filename}`;
    }
  }

  return `Running ${toolName}`;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const { toolName, args, state } = toolInvocation;
  const label = getLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
