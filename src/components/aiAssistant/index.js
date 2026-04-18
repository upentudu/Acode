import Ref from "html-tag-js/ref";
import "./style.scss";

export default function openAIAssistantTab() {
  const { editorManager } = window;

  const existingTab = editorManager.files.find(
    (f) => f.id === "acode-assistant-tab",
  );
  if (existingTab) {
    editorManager.switchFile(existingTab.id);
    return;
  }

  const $chatHistory = Ref();
  const $inputBox = Ref();

  const $page = (
    <div className="ai-assistant-wrapper">
      <div className="ai-chat-history" ref={$chatHistory}>
        <div className="ai-empty-state">
          <h2>Bring Your Ideas Into Reality</h2>
          <p>
            Describe what you want to build
            <br />
            and watch it come to life.
          </p>
        </div>
      </div>

      <div className="ai-input-container">
        <div className="ai-input-box">
          <textarea
            ref={$inputBox}
            placeholder="Build With Acode Assistant..."
            rows="1"
          ></textarea>
          <div className="ai-controls">
            <div className="ai-left-controls">
              <span className="icon add"></span>
              <span className="ai-dropdown">ChatGPT</span>
            </div>
            <div className="ai-right-controls">
              <span className="ai-dropdown">Plan</span>
              <span className="icon play_arrow"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const aiFile = {
    id: "acode-assistant-tab",
    filename: "Acode Assistant",
    name: "Acode Assistant",
    type: "ai-assistant", 
    isUnsaved: false,
    content: $page, 
    canRun: () => false,
    tab: (
      <div
        className="tab" // Yahan "file-tab" ki jagah "tab" kar diya taaki yellow line aaye
        data-id="acode-assistant-tab"
        onclick={() => editorManager.switchFile("acode-assistant-tab")}
      >
        {/* "AI" wala span hata diya hai taaki sirf naam dikhe */}
        <span className="text">Acode Assistant</span>
        <span
          className="icon close"
          onclick={(e) => {
            e.stopPropagation();
            closeAITab(aiFile);
          }}
        ></span>
      </div>
    ),
  };

  // NAVIGATION BUG FIX: Tab change hone par UI ko Hide/Show karna
  aiFile.onSwitch = (currentFile) => {
    if (currentFile.id === "acode-assistant-tab") {
      $page.style.display = "flex"; // AI Tab selected hai, UI dikhao
    } else {
      $page.style.display = "none"; // Dusra Tab selected hai, AI ko chupao
    }
  };
  editorManager.on("switch-file", aiFile.onSwitch);

  if (!document.body.contains($page)) {
      document.querySelector("main").appendChild($page);
  }

  editorManager.addFile(aiFile);
  editorManager.switchFile(aiFile.id);
}

function closeAITab(fileObj) {
  const { editorManager } = window;
  
  // Clean up: Event listener ko remove karna zaroori hai tab close hone par
  if (fileObj.onSwitch) {
    editorManager.off("switch-file", fileObj.onSwitch);
  }

  const index = editorManager.files.indexOf(fileObj);
  if (index > -1) {
    editorManager.files.splice(index, 1);
  }
  fileObj.tab.remove();
  if (fileObj.content) fileObj.content.remove();

  if (editorManager.activeFile?.id === fileObj.id) {
    editorManager.activeFile = null;
    if (editorManager.files.length > 0) {
      editorManager.switchFile(
        editorManager.files[editorManager.files.length - 1].id,
      );
    } else {
      document.getElementById("root").get(".editor-container").style.display =
        "none";
    }
  }
}
