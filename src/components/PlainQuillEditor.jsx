import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

function PlainQuillEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quill.on("text-change", () => {
        const content = quill.root.innerHTML;
        onChange(content);
      });

      quillRef.current = quill;
    }

    // Set initial content
    if (quillRef.current && value !== undefined) {
      if (quillRef.current.root.innerHTML !== value) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div>
      <div ref={editorRef} style={{ height: "300px" }}></div>
    </div>
  );
}

export default PlainQuillEditor;
