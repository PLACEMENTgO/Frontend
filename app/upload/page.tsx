"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await apiFetch(
        "http://localhost:8080/api/resumes/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      setMessage("Upload successful ✅");
      router.push(`/resume/${data.id}`);
    } catch (err: any) {
      setMessage("Upload failed ❌ " + err.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Upload Resume</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={uploadResume}>Upload Resume</button>

      <p>{message}</p>
    </div>
  );
}
