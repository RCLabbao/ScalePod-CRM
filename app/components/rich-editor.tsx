import { useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link, Pilcrow } from "lucide-react";
import { cn } from "~/lib/utils";

export interface RichEditorHandle {
  getHTML: () => string;
  getPlainText: () => string;
  setHTML: (html: string) => void;
  insertHTML: (html: string) => void;
  appendHTML: (html: string) => void;
}

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Bold;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={label}
    className={cn(
      "flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

/**
 * Parse an HTML string into a DocumentFragment.
 */
function htmlToFragment(html: string): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

const RichEditor = forwardRef<RichEditorHandle, RichEditorProps>(
  ({ value, onChange, placeholder, className, minHeight = 180 }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);

    const syncChange = useCallback(() => {
      if (editorRef.current) {
        isInternalChange.current = true;
        onChange(editorRef.current.innerHTML);
      }
    }, [onChange]);

    useImperativeHandle(ref, () => ({
      getHTML: () => editorRef.current?.innerHTML || "",
      getPlainText: () => editorRef.current?.textContent || editorRef.current?.innerText || "",
      setHTML: (html: string) => {
        if (editorRef.current) {
          isInternalChange.current = true;
          editorRef.current.innerHTML = html;
          onChange(html);
        }
      },
      insertHTML: (html: string) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        // Try inserting at cursor position via Range API
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const fragment = htmlToFragment(html);
          range.insertNode(fragment);
          // Move cursor after inserted content
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // Fallback: append at end
          editor.appendChild(htmlToFragment(html));
        }
        syncChange();
      },
      appendHTML: (html: string) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.appendChild(htmlToFragment(html));
        syncChange();
      },
    }));

    // Sync external value changes (e.g., template loading)
    useEffect(() => {
      if (editorRef.current && !isInternalChange.current) {
        if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value;
        }
      }
      isInternalChange.current = false;
    }, [value]);

    const handleInput = useCallback(() => {
      syncChange();
    }, [syncChange]);

    const handleLinkInsert = () => {
      const url = window.prompt("Enter URL:");
      if (url) {
        exec("createLink", url);
        handleInput();
      }
    };

    return (
      <div
        className={cn(
          "rounded-md border border-input bg-background overflow-hidden",
          "focus-within:ring-1 focus-within:ring-ring",
          className
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 border-b border-border/50 px-2 py-1 bg-muted/30">
          <ToolbarButton icon={Bold} label="Bold (Ctrl+B)" onClick={() => { exec("bold"); handleInput(); }} />
          <ToolbarButton icon={Italic} label="Italic (Ctrl+I)" onClick={() => { exec("italic"); handleInput(); }} />
          <ToolbarButton icon={Underline} label="Underline (Ctrl+U)" onClick={() => { exec("underline"); handleInput(); }} />
          <div className="mx-1 h-4 w-px bg-border" />
          <ToolbarButton icon={List} label="Bullet list" onClick={() => { exec("insertUnorderedList"); handleInput(); }} />
          <ToolbarButton icon={ListOrdered} label="Numbered list" onClick={() => { exec("insertOrderedList"); handleInput(); }} />
          <ToolbarButton icon={Pilcrow} label="Paragraph" onClick={() => { exec("formatBlock", "p"); handleInput(); }} />
          <div className="mx-1 h-4 w-px bg-border" />
          <ToolbarButton icon={Link} label="Insert link" onClick={handleLinkInsert} />
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className={cn(
            "prose prose-sm prose-invert max-w-none px-3 py-2 outline-none text-sm text-foreground",
            "min-h-[180px] max-h-[400px] overflow-y-auto",
            "[&_a]:text-blue-400 [&_a]:underline",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
          )}
          style={{ minHeight: `${minHeight}px` }}
        />
      </div>
    );
  }
);

RichEditor.displayName = "RichEditor";

export { RichEditor };
