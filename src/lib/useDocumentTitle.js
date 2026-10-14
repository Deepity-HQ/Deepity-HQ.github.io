import { useEffect } from "react";

/** Sets the browser tab title for a page ("About · Deepity"). */
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · Deepity` : "Deepity";
    return () => {
      document.title = previous;
    };
  }, [title]);
}
