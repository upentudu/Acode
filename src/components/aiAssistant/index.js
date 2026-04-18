import Ref from "html-tag-js/ref";
import "./style.scss";

export default function openAIAssistantTab() {
  const { editorManager } = window;

  // Check agar tab pehle se open hai, toh uspar switch karo
  const existingTab = editorManager.files.find(
    (f) => f.id === "acode-assistant-tab",
  );
  if (existingTab) {
    editorManager.switchFile(existingTab.id);
    return;
  }

  const $chatHistory = Ref();
  const $inputBox = Ref();

  // JSX for AI Interface
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

  // Mock Editor File Object for Acode Manager
  const aiFile = {
    id: "acode-assistant-tab",
    filename: "Acode Assistant",
    name: "Acode Assistant",
    type: "ai-assistant", // This bypasses applyFileToEditor
    isUnsaved: false,
    content: $page, // Manager will display this node when active
    canRun: () => false,
    tab: (
      <div
        className="file-tab"
        data-id="acode-assistant-tab"
        onclick={() => editorManager.switchFile("acode-assistant-tab")}
      >
        <span
          className="icon"
          style={{
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "0.8em",
            marginRight: "4px",
          }}
        >
          AI
        </span>
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

  // 1. Stick The UI To The Main Container!
  if (!document.body.contains($page)) {
      document.querySelector("main").appendChild($page);
  }

	// Add file to editor and switch to it
	editorManager.addFile(aiFile);
	editorManager.switchFile(aiFile.id);
}

  
  // Add file to editor and switch to it
  editorManager.addFile(aiFile);
  editorManager.switchFile(aiFile.id);
}

function closeAITab(fileObj) {
  const { editorManager } = window;
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
      // Agar sab close ho jaye toh container hide karo
      document.getElementById("root").get(".editor-container").style.display =
        "none";
    }
  }
}
