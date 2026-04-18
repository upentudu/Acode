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

  // Acode ka NATIVE file structure
  const aiFile = {
    id: "acode-assistant-tab",
    filename: "Acode Assistant",
    name: "Acode Assistant",
    type: "page", // "ai-assistant" ki jagah "page" kar diya
    isUnsaved: false,
    content: $page, // Acode ab khud ise screen par set karega
    canRun: () => false,
    // Custom tab property hata di! Ab Acode native tab banayega yellow line ke sath
  };

  // Add file to editor and switch to it
  editorManager.addFile(aiFile);
  editorManager.switchFile(aiFile.id);
}
