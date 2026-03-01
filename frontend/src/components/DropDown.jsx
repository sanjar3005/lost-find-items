import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ label, items = [] }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({});
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto positioning logic
  useEffect(() => {
    if (!open) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = buttonRect.bottom + window.scrollY;
    let left = buttonRect.left + window.scrollX;

    // Flip horizontally if overflow right
    if (left + menuRect.width > viewportWidth) {
      left = buttonRect.right - menuRect.width + window.scrollX;
    }

    // Flip vertically if overflow bottom
    if (top + menuRect.height > viewportHeight) {
      top = buttonRect.top - menuRect.height + window.scrollY;
    }

    setPosition({ top, left });
  }, [open]);

  return (
    <div className="inline-block">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 text-sm font-medium text-[#0F172A] hover:text-blue-600 transition-colors"
      >
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={3}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={position}
          className="absolute bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 w-48"
        >
          {items.map((item, index) => {
            if (item.type === "divider") {
              return (
                <div
                  key={index}
                  className="border-t border-slate-200 my-1"
                />
              );
            }

            if (item.type === "button") {
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                    item.danger ? "text-red-600" : ""
                  }`}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <a
                key={index}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-slate-100"
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}