import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { FaCode } from "react-icons/fa";
import Editor from "@monaco-editor/react";
import { BiSolidCopy } from "react-icons/bi";
import { PiExportFill } from "react-icons/pi";
import { HiViewGrid } from "react-icons/hi";
import { BiRefresh } from "react-icons/bi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f1f1f",
    borderColor: state.isFocused ? "#555" : "#444",
    color: "#fff",
    boxShadow: state.isFocused ? "0 0 0 1px #666" : "none",
    "&:hover": {
      borderColor: "#666",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f1f1f",
    color: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#333" : "#1f1f1f",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#444",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#888",
  }),
};

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  function extractCode(responseText) {
    const match = responseText.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : responseText.trim();
  }

  // It’s insecure to put API key in client code — better to proxy via your backend.
  const ai = new GoogleGenAI({
  apiKey: "AIzaSyDcrSsiD5ZwDZ4NhKAJR8OPthkEIoLXhBM",  
});


  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    setOutputScreen(false);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}
Framework to use: ${framework.value}

Requirements:
- The code must be clean, well-structured, and easy to understand.
- Optimize for SEO where applicable.
- Focus on creating a modern, animated, and responsive UI design.
- Include high-quality hover effects, shadows, animations, colors, and typography.
- Return ONLY the code, formatted properly in Markdown fenced code blocks.
- Do NOT include explanations, text, comments, or anything else besides the code.
- And give the whole code in a single HTML file.
        `,
      });

      const respText = response.text || "";
      const extracted = extractCode(respText);
      setCode(extracted);
      setOutputScreen(true);
    } catch (err) {
      console.error("Error generating content:", err);
      toast.error("Failed to generate code. Try again later.");
    }

    setLoading(false);
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="flex flex-col h-[60vh] sm:h-[80vh] sm:flex-row flex-1 px-4 py-6 md:px-20 gap-6">
        {/* Left panel: prompt + controls */}
        <div className="w-full sm:w-1/2 bg-[#1a1a1a] rounded-lg p-4 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">AI Component Generator</h2>
          <p className="text-gray-400 mb-4">
            Describe your component and AI will code it for you.
          </p>
          <label className="mb-1">Select Framework / Style</label>
          <Select
            options={options}
            styles={customStyles}
            value={framework}
            onChange={(opt) => setFramework(opt)}
            className="mb-4"
          />

          <label className="mb-1">Describe Your Component</label>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="flex-1 p-2 rounded-lg bg-[#0c0c0c] resize-none"
            placeholder="E.g. a responsive hero section with gradient background and buttons"
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Click “Generate” to generate the code
            </p>
            <button
              onClick={getResponse}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:opacity-90 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                <BsStars size={20} />
              )}
              <span>{loading ? "Generating..." : "Generate"}</span>
            </button>
          </div>
        </div>

        {/* Right panel: output / preview */}
        <div className="w-full h-[40vh] sm:h-[82vh] xl:h-[85vh] sm:w-1/2 bg-[#1a1a1a] rounded-lg flex flex-col">
          {!outputScreen ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-20  w-20 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white text-3xl mb-4">
                <FaCode />
              </div>
              <p className="text-gray-400 text-center">Your component & code will appear here.</p>
            </div>
          ) : (
            <>
              <div className="flex-none flex border-b border-gray-700">
                <button
                  className={`w-1/2 py-2 ${tab === 1 ? "bg-gray-800" : ""}`}
                  onClick={() => setTab(1)}
                >
                  Code
                </button>
                <button
                  className={`w-1/2 py-2 ${tab === 2 ? "bg-gray-800" : ""}`}
                  onClick={() => setTab(2)}
                >
                  Preview
                </button>
              </div>
              <div className="flex-none flex items-center justify-end p-2 gap-2 border-b border-gray-700">
                {tab === 1 ? (
                  <>
                    <button
                      onClick={copyCode}
                      className="p-2 border border-gray-600 rounded hover:bg-gray-700"
                      title="Copy code"
                    >
                      <BiSolidCopy />
                    </button>
                    <button
                      onClick={downloadFile}
                      className="p-2 border border-gray-600 rounded hover:bg-gray-700"
                      title="Download file"
                    >
                      <PiExportFill />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsNewTabOpen(true)}
                      className="p-2 border border-gray-600 rounded hover:bg-gray-700"
                      title="Open in new tab"
                    >
                      <HiViewGrid />
                    </button>
                    <button
                      onClick={() => {
                        /* you can refresh / rerender here if needed */
                      }}
                      className="p-2 border border-gray-600 rounded hover:bg-gray-700"
                      title="Refresh preview"
                    >
                      <BiRefresh />
                    </button>
                  </>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                {tab === 1 ? (
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language="html"
                    value={code}
                    options={{
                      minimap: { enabled: false },
                      readOnly: true,
                    }}
                  />
                ) : (
                  <iframe
                    srcDoc={code}
                    title="Preview"
                    className="w-full h-full border-none bg-white"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* New tab preview overlay */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
          <div className="flex-none h-12 bg-gray-900 flex items-center justify-between px-4 text-white">
            <h3>Preview</h3>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="p-2 hover:bg-gray-800 rounded"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
          <div className="flex-1">
            <iframe
              srcDoc={code}
              title="New Tab Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
